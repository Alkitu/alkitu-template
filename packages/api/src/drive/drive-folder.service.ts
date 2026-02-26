import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DriveService } from './drive.service';

@Injectable()
export class DriveFolderService {
  private readonly logger = new Logger(DriveFolderService.name);
  private usersRootFolderId: string | null = null;

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

    // Persist to DB
    await this.prisma.systemConfig.create({
      data: { key: 'drive_users_folder_id', value: folder.id },
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

    // Use customId as folder name, or fallback to request ID
    const folderName = request.customId || request.id;
    const folder = await this.driveService.createFolder(folderName, requestsFolderId);

    // Update request with folder ID
    await this.prisma.request.update({
      where: { id: requestId },
      data: { folderId: folder.id },
    });

    this.logger.log(`Created folder for request ${folderName}: ${folder.id}`);
    return folder.id;
  }
}
