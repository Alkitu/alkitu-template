import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DriveService } from './drive.service';

@Injectable()
export class DriveFolderService {
  private readonly logger = new Logger(DriveFolderService.name);
  private usersRootFolderId: string | null = null;
  private servicesRootFolderId: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly driveService: DriveService,
  ) {}

  /**
   * Get or create the root "users/" folder inside GOOGLE_DRIVE_ROOT_FOLDER_ID.
   * Caches the result in memory and persists to SystemConfig.
   */
  async getUsersRootFolderId(): Promise<string> {
    // 1. In-memory cache
    if (this.usersRootFolderId) return this.usersRootFolderId;

    // 2. Check SystemConfig DB
    const config = await this.prisma.systemConfig.findUnique({
      where: { key: 'drive_users_folder_id' },
    });
    if (config) {
      this.usersRootFolderId = config.value;
      return config.value;
    }

    // 3. Create "users" folder in Drive
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!rootFolderId) {
      throw new Error(
        'GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set',
      );
    }

    const folder = await this.driveService.createFolder('users', rootFolderId);
    this.usersRootFolderId = folder.id;

    // Persist to DB (upsert to handle race conditions)
    await this.prisma.systemConfig.upsert({
      where: { key: 'drive_users_folder_id' },
      update: { value: folder.id },
      create: { key: 'drive_users_folder_id', value: folder.id },
    });

    this.logger.log(`Created users root folder: ${folder.id}`);
    return folder.id;
  }

  /**
   * Ensure a user has their Drive folder structure:
   *   users/{email}/
   *   users/{email}/profile/
   *   users/{email}/requests/
   *
   * Idempotent: if folder IDs already exist in the DB, returns without creating.
   */
  async ensureUserFolders(
    userId: string,
  ): Promise<{ driveFolderId: string; profileFolderId: string; requestsFolderId: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        driveFolderId: true,
        driveProfileFolderId: true,
        driveRequestsFolderId: true,
      },
    });

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Already fully set up
    if (user.driveFolderId && user.driveProfileFolderId && user.driveRequestsFolderId) {
      return {
        driveFolderId: user.driveFolderId,
        profileFolderId: user.driveProfileFolderId,
        requestsFolderId: user.driveRequestsFolderId,
      };
    }

    const usersRoot = await this.getUsersRootFolderId();

    // Create user folder if needed
    let driveFolderId = user.driveFolderId;
    if (!driveFolderId) {
      const userFolder = await this.driveService.createFolder(user.email, usersRoot);
      driveFolderId = userFolder.id;
    }

    // Create profile folder if needed
    let profileFolderId = user.driveProfileFolderId;
    if (!profileFolderId) {
      const profileFolder = await this.driveService.createFolder('profile', driveFolderId);
      profileFolderId = profileFolder.id;
    }

    // Create requests folder if needed
    let requestsFolderId = user.driveRequestsFolderId;
    if (!requestsFolderId) {
      const requestsFolder = await this.driveService.createFolder('requests', driveFolderId);
      requestsFolderId = requestsFolder.id;
    }

    // Update user record
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        driveFolderId,
        driveProfileFolderId: profileFolderId,
        driveRequestsFolderId: requestsFolderId,
      },
    });

    this.logger.log(`Ensured folders for user ${user.email}`);
    return { driveFolderId, profileFolderId, requestsFolderId };
  }

  /**
   * Ensure a request has its Drive folder:
   *   users/{email}/requests/{serviceCode}/{customId}/
   *
   * If the service has no code, falls back to:
   *   users/{email}/requests/{customId}/
   *
   * Idempotent: if folderId already exists on the request, returns without creating.
   */
  async ensureRequestFolder(requestId: string): Promise<string> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        customId: true,
        folderId: true,
        userId: true,
        service: { select: { code: true } },
      },
    });

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    // Already has a folder
    if (request.folderId) {
      return request.folderId;
    }

    // Ensure user folders exist first
    const { requestsFolderId } = await this.ensureUserFolders(request.userId);

    // Determine the parent folder: if service has a code, create/get a service subfolder
    let parentFolderId = requestsFolderId;
    const serviceCode = request.service?.code;

    if (serviceCode) {
      parentFolderId = await this.ensureServiceCodeFolder(
        request.userId,
        serviceCode,
        requestsFolderId,
      );
    }

    // Use customId as folder name, or fallback to request ID
    const folderName = request.customId || request.id;
    const folder = await this.driveService.createFolder(folderName, parentFolderId);

    // Update request with folder ID
    await this.prisma.request.update({
      where: { id: requestId },
      data: { folderId: folder.id },
    });

    this.logger.log(`Created folder for request ${folderName}: ${folder.id}`);
    return folder.id;
  }

  /**
   * Get or create a service-code subfolder inside a user's requests/ folder:
   *   users/{email}/requests/{serviceCode}/
   *
   * Persists the folder ID in SystemConfig for idempotency.
   */
  private async ensureServiceCodeFolder(
    userId: string,
    serviceCode: string,
    requestsFolderId: string,
  ): Promise<string> {
    const configKey = `drive_user_svc_${userId}_${serviceCode}`;

    // Check SystemConfig DB
    const config = await this.prisma.systemConfig.findUnique({
      where: { key: configKey },
    });
    if (config) {
      return config.value;
    }

    // Create the service-code subfolder
    const folder = await this.driveService.createFolder(serviceCode, requestsFolderId);

    // Persist to DB (upsert to handle race conditions)
    await this.prisma.systemConfig.upsert({
      where: { key: configKey },
      update: { value: folder.id },
      create: { key: configKey, value: folder.id },
    });

    this.logger.log(
      `Created service subfolder ${serviceCode} for user ${userId}: ${folder.id}`,
    );
    return folder.id;
  }

  /**
   * Get or create the root "services/" folder inside GOOGLE_DRIVE_ROOT_FOLDER_ID.
   * Caches the result in memory and persists to SystemConfig.
   */
  async getServicesRootFolderId(): Promise<string> {
    // 1. In-memory cache
    if (this.servicesRootFolderId) return this.servicesRootFolderId;

    // 2. Check SystemConfig DB
    const config = await this.prisma.systemConfig.findUnique({
      where: { key: 'drive_services_folder_id' },
    });
    if (config) {
      this.servicesRootFolderId = config.value;
      return config.value;
    }

    // 3. Create "services" folder in Drive
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!rootFolderId) {
      throw new Error(
        'GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set',
      );
    }

    const folder = await this.driveService.createFolder('services', rootFolderId);
    this.servicesRootFolderId = folder.id;

    // Persist to DB (upsert to handle race conditions)
    await this.prisma.systemConfig.upsert({
      where: { key: 'drive_services_folder_id' },
      update: { value: folder.id },
      create: { key: 'drive_services_folder_id', value: folder.id },
    });

    this.logger.log(`Created services root folder: ${folder.id}`);
    return folder.id;
  }

  /**
   * Ensure a service has its Drive folder:
   *   services/{code}/
   *
   * Idempotent: if driveFolderId already exists on the service, returns without creating.
   */
  async ensureServiceFolder(serviceId: string): Promise<string> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        code: true,
        driveFolderId: true,
      },
    });

    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    // Already has a folder
    if (service.driveFolderId) {
      return service.driveFolderId;
    }

    // Need a code to name the folder
    if (!service.code) {
      throw new Error(`Service ${serviceId} has no code — cannot create Drive folder`);
    }

    const servicesRoot = await this.getServicesRootFolderId();
    const folder = await this.driveService.createFolder(service.code, servicesRoot);

    // Update service with folder ID
    await this.prisma.service.update({
      where: { id: serviceId },
      data: { driveFolderId: folder.id },
    });

    this.logger.log(`Created folder for service ${service.code}: ${folder.id}`);
    return folder.id;
  }
}
