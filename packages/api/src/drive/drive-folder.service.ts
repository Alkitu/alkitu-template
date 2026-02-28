import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DriveService } from './drive.service';

@Injectable()
export class DriveFolderService {
  private readonly logger = new Logger(DriveFolderService.name);
  private usersRootFolderId: string | null = null;
  private servicesRootFolderId: string | null = null;
  private readonly locks = new Map<string, Promise<any>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly driveService: DriveService,
  ) {}

  /**
   * Serializes concurrent async operations by key.
   * If a lock already exists for the key, waits for it to finish before running fn.
   * Prevents race conditions where two concurrent calls both create the same folder.
   */
  private async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Wait for any existing operation on this key
    while (this.locks.has(key)) {
      try {
        await this.locks.get(key);
      } catch {
        // Previous operation failed — we still proceed
      }
    }

    const promise = fn();
    this.locks.set(key, promise);

    try {
      return await promise;
    } finally {
      this.locks.delete(key);
    }
  }

  /**
   * Get or create the root "users/" folder inside GOOGLE_DRIVE_ROOT_FOLDER_ID.
   * Caches the result in memory and persists to SystemConfig.
   */
  async getUsersRootFolderId(): Promise<string> {
    // Fast path: in-memory cache (no lock needed)
    if (this.usersRootFolderId) return this.usersRootFolderId;

    return this.withLock('root:users', async () => {
      // Re-check cache inside lock (another call may have resolved it)
      if (this.usersRootFolderId) return this.usersRootFolderId;

      // Check SystemConfig DB
      const config = await this.prisma.systemConfig.findUnique({
        where: { key: 'drive_users_folder_id' },
      });
      if (config) {
        this.usersRootFolderId = config.value;
        return config.value;
      }

      // Create "users" folder in Drive (find-or-create to prevent duplicates)
      const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      if (!rootFolderId) {
        throw new Error(
          'GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set',
        );
      }

      const folder = await this.driveService.findOrCreateFolder('users', rootFolderId);
      this.usersRootFolderId = folder.id;

      // Persist to DB
      await this.prisma.systemConfig.upsert({
        where: { key: 'drive_users_folder_id' },
        update: { value: folder.id },
        create: { key: 'drive_users_folder_id', value: folder.id },
      });

      this.logger.log(`Created users root folder: ${folder.id}`);
      return folder.id;
    });
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
    return this.withLock(`user:${userId}`, async () => {
      // DB read inside lock so the second concurrent call sees what the first persisted
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

      // Find or create user folder
      let driveFolderId = user.driveFolderId;
      if (!driveFolderId) {
        const userFolder = await this.driveService.findOrCreateFolder(user.email, usersRoot);
        driveFolderId = userFolder.id;
      }

      // Find or create profile folder
      let profileFolderId = user.driveProfileFolderId;
      if (!profileFolderId) {
        const profileFolder = await this.driveService.findOrCreateFolder('profile', driveFolderId);
        profileFolderId = profileFolder.id;
      }

      // Find or create requests folder
      let requestsFolderId = user.driveRequestsFolderId;
      if (!requestsFolderId) {
        const requestsFolder = await this.driveService.findOrCreateFolder('requests', driveFolderId);
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
    });
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
    return this.withLock(`request:${requestId}`, async () => {
      // DB read inside lock so the second concurrent call sees what the first persisted
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
      const folder = await this.driveService.findOrCreateFolder(folderName, parentFolderId);

      // Update request with folder ID
      await this.prisma.request.update({
        where: { id: requestId },
        data: { folderId: folder.id },
      });

      this.logger.log(`Created folder for request ${folderName}: ${folder.id}`);
      return folder.id;
    });
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
    return this.withLock(`svccode:${userId}:${serviceCode}`, async () => {
      const configKey = `drive_user_svc_${userId}_${serviceCode}`;

      // DB read inside lock so the second concurrent call sees what the first persisted
      const config = await this.prisma.systemConfig.findUnique({
        where: { key: configKey },
      });
      if (config) {
        return config.value;
      }

      // Find or create the service-code subfolder
      const folder = await this.driveService.findOrCreateFolder(serviceCode, requestsFolderId);

      // Persist to DB
      await this.prisma.systemConfig.upsert({
        where: { key: configKey },
        update: { value: folder.id },
        create: { key: configKey, value: folder.id },
      });

      this.logger.log(
        `Created service subfolder ${serviceCode} for user ${userId}: ${folder.id}`,
      );
      return folder.id;
    });
  }

  /**
   * Get or create the root "services/" folder inside GOOGLE_DRIVE_ROOT_FOLDER_ID.
   * Caches the result in memory and persists to SystemConfig.
   */
  async getServicesRootFolderId(): Promise<string> {
    // Fast path: in-memory cache (no lock needed)
    if (this.servicesRootFolderId) return this.servicesRootFolderId;

    return this.withLock('root:services', async () => {
      // Re-check cache inside lock
      if (this.servicesRootFolderId) return this.servicesRootFolderId;

      // Check SystemConfig DB
      const config = await this.prisma.systemConfig.findUnique({
        where: { key: 'drive_services_folder_id' },
      });
      if (config) {
        this.servicesRootFolderId = config.value;
        return config.value;
      }

      // Create "services" folder in Drive (find-or-create to prevent duplicates)
      const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      if (!rootFolderId) {
        throw new Error(
          'GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set',
        );
      }

      const folder = await this.driveService.findOrCreateFolder('services', rootFolderId);
      this.servicesRootFolderId = folder.id;

      // Persist to DB
      await this.prisma.systemConfig.upsert({
        where: { key: 'drive_services_folder_id' },
        update: { value: folder.id },
        create: { key: 'drive_services_folder_id', value: folder.id },
      });

      this.logger.log(`Created services root folder: ${folder.id}`);
      return folder.id;
    });
  }

  /**
   * Ensure a service has its Drive folder:
   *   services/{code}/
   *
   * Idempotent: if driveFolderId already exists on the service, returns without creating.
   */
  async ensureServiceFolder(serviceId: string): Promise<string> {
    return this.withLock(`service:${serviceId}`, async () => {
      // DB read inside lock so the second concurrent call sees what the first persisted
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
      const folder = await this.driveService.findOrCreateFolder(service.code, servicesRoot);

      // Update service with folder ID
      await this.prisma.service.update({
        where: { id: serviceId },
        data: { driveFolderId: folder.id },
      });

      this.logger.log(`Created folder for service ${service.code}: ${folder.id}`);
      return folder.id;
    });
  }
}
