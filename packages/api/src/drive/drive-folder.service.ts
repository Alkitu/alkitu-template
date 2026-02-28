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

      const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      if (!rootFolderId) {
        throw new Error(
          'GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set',
        );
      }

      // Always verify via findOrCreateFolder — handles deleted folders gracefully
      const folder = await this.driveService.findOrCreateFolder('users', rootFolderId);
      this.usersRootFolderId = folder.id;

      // Persist to DB
      await this.prisma.systemConfig.upsert({
        where: { key: 'drive_users_folder_id' },
        update: { value: folder.id },
        create: { key: 'drive_users_folder_id', value: folder.id },
      });

      return folder.id;
    });
  }

  /**
   * Ensure a user has their Drive folder structure:
   *   users/{email}/
   *   users/{email}/profile/
   *   users/{email}/requests/
   *
   * Idempotent: always verifies folders exist in Drive via findOrCreateFolder.
   * Self-healing: recreates folders deleted from Drive and updates DB.
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

      const usersRoot = await this.getUsersRootFolderId();

      // Always verify via findOrCreateFolder — handles deleted folders gracefully
      const userFolder = await this.driveService.findOrCreateFolder(user.email, usersRoot);
      const driveFolderId = userFolder.id;

      const profileFolder = await this.driveService.findOrCreateFolder('profile', driveFolderId);
      const profileFolderId = profileFolder.id;

      const requestsFolder = await this.driveService.findOrCreateFolder('requests', driveFolderId);
      const requestsFolderId = requestsFolder.id;

      // Update DB only if any ID changed
      if (
        driveFolderId !== user.driveFolderId ||
        profileFolderId !== user.driveProfileFolderId ||
        requestsFolderId !== user.driveRequestsFolderId
      ) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            driveFolderId,
            driveProfileFolderId: profileFolderId,
            driveRequestsFolderId: requestsFolderId,
          },
        });
        this.logger.log(`Updated folders for user ${user.email}`);
      }

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
   * Idempotent: always verifies folders exist in Drive. Self-healing if deleted.
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

      // Always verify via findOrCreateFolder — handles deleted folders gracefully
      const folderName = request.customId || request.id;
      const folder = await this.driveService.findOrCreateFolder(folderName, parentFolderId);

      // Update DB only if ID changed
      if (folder.id !== request.folderId) {
        await this.prisma.request.update({
          where: { id: requestId },
          data: { folderId: folder.id },
        });
        this.logger.log(`Updated folder for request ${folderName}: ${folder.id}`);
      }

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

      // Always verify via findOrCreateFolder — handles deleted folders gracefully
      const folder = await this.driveService.findOrCreateFolder(serviceCode, requestsFolderId);

      // DB read to check if update is needed
      const config = await this.prisma.systemConfig.findUnique({
        where: { key: configKey },
      });

      if (config?.value !== folder.id) {
        await this.prisma.systemConfig.upsert({
          where: { key: configKey },
          update: { value: folder.id },
          create: { key: configKey, value: folder.id },
        });
        this.logger.log(
          `Updated service subfolder ${serviceCode} for user ${userId}: ${folder.id}`,
        );
      }

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

      const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      if (!rootFolderId) {
        throw new Error(
          'GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set',
        );
      }

      // Always verify via findOrCreateFolder — handles deleted folders gracefully
      const folder = await this.driveService.findOrCreateFolder('services', rootFolderId);
      this.servicesRootFolderId = folder.id;

      // Persist to DB
      await this.prisma.systemConfig.upsert({
        where: { key: 'drive_services_folder_id' },
        update: { value: folder.id },
        create: { key: 'drive_services_folder_id', value: folder.id },
      });

      return folder.id;
    });
  }

  /**
   * Ensure a service has its Drive folder:
   *   services/{code}/
   *
   * Idempotent: always verifies folder exists in Drive. Self-healing if deleted.
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

      if (!service.code) {
        throw new Error(`Service ${serviceId} has no code — cannot create Drive folder`);
      }

      const servicesRoot = await this.getServicesRootFolderId();

      // Always verify via findOrCreateFolder — handles deleted folders gracefully
      const folder = await this.driveService.findOrCreateFolder(service.code, servicesRoot);

      // Update DB only if ID changed
      if (folder.id !== service.driveFolderId) {
        await this.prisma.service.update({
          where: { id: serviceId },
          data: { driveFolderId: folder.id },
        });
        this.logger.log(`Updated folder for service ${service.code}: ${folder.id}`);
      }

      return folder.id;
    });
  }
}
