import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';
import type { DriveFile } from '@alkitu/shared';

@Injectable()
export class DriveService implements OnModuleInit {
  private readonly logger = new Logger(DriveService.name);
  private drive!: ReturnType<typeof google.drive>;
  private auth!: InstanceType<typeof google.auth.GoogleAuth>;
  private sharedDriveId?: string;

  get isSharedDrive(): boolean {
    return !!this.sharedDriveId;
  }

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || undefined;

      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(
            /\\n/g,
            '\n',
          ),
          project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
        },
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      this.drive = google.drive({ version: 'v3', auth: this.auth });

      // Test connection
      if (this.sharedDriveId) {
        await this.drive.drives.get({ driveId: this.sharedDriveId });
        this.logger.log(
          `DriveService initialized (Shared Drive: ${this.sharedDriveId})`,
        );
      } else {
        await this.drive.files.list({
          pageSize: 1,
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
        });
        this.logger.log('DriveService initialized (My Drive mode)');
      }
    } catch (error) {
      this.logger.error('Failed to initialize DriveService', error);
      throw error;
    }
  }

  /**
   * Returns shared drive list params when in Shared Drive mode.
   * Spread into files.list calls to scope queries correctly.
   */
  private getSharedDriveListParams(): Record<string, unknown> {
    if (!this.sharedDriveId) return {};
    return {
      corpora: 'drive',
      driveId: this.sharedDriveId,
    };
  }

  /**
   * Get an OAuth2 access token for resumable uploads
   */
  async getAccessToken(): Promise<string> {
    const authClient = await this.auth.getClient();
    const tokenResponse = await authClient.getAccessToken();
    if (!tokenResponse.token) {
      throw new Error('Failed to obtain access token');
    }
    return tokenResponse.token;
  }

  private convertToFile(file: any): DriveFile {
    return {
      id: file.id || '',
      name: file.name || '',
      mimeType: file.mimeType || '',
      description: file.description,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      parents: file.parents,
      driveId: file.driveId || this.sharedDriveId,
      webViewLink: file.webViewLink,
      iconLink: file.iconLink,
      thumbnailLink: file.thumbnailLink,
      hasThumbnail: file.hasThumbnail,
      size: file.size ? parseInt(file.size) : undefined,
      md5Checksum: file.md5Checksum,
      trashed: file.trashed,
      shared: file.shared,
      owners: file.owners,
      capabilities: file.capabilities,
    };
  }

  async uploadFile(
    file: File,
    options: { parentId?: string; description?: string },
  ): Promise<DriveFile> {
    this.logger.log(`Uploading file: ${file.name} (${file.size} bytes)`);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const stream = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      });

      const response = await this.drive.files.create({
        requestBody: {
          name: file.name,
          parents: options.parentId ? [options.parentId] : undefined,
          description: options.description,
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
        fields:
          'id, name, mimeType, size, parents, createdTime, modifiedTime, webViewLink',
        supportsAllDrives: true,
      });

      return this.convertToFile(response.data);
    } catch (error) {
      this.logger.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  }

  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    options: { parentId?: string; description?: string },
  ): Promise<DriveFile> {
    this.logger.log(`Uploading buffer: ${fileName} (${buffer.length} bytes)`);

    try {
      const stream = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      });

      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: options.parentId ? [options.parentId] : undefined,
          description: options.description,
        },
        media: {
          mimeType,
          body: stream,
        },
        fields:
          'id, name, mimeType, size, parents, createdTime, modifiedTime, webViewLink',
        supportsAllDrives: true,
      });

      return this.convertToFile(response.data);
    } catch (error) {
      this.logger.error(`Error uploading buffer ${fileName}:`, error);
      throw error;
    }
  }

  async getFile(fileId: string): Promise<DriveFile> {
    return this.getFolder(fileId);
  }

  async getFolder(folderId: string): Promise<DriveFile> {
    this.logger.log(`Getting folder: ${folderId}`);

    const response = await this.drive.files.get({
      fileId: folderId,
      fields:
        'id, name, mimeType, modifiedTime, parents, driveId, webViewLink, iconLink, thumbnailLink, hasThumbnail, size, md5Checksum, trashed, shared, owners, capabilities',
      supportsAllDrives: true,
    });

    return this.convertToFile(response.data);
  }

  async getFolderContents(folderId: string): Promise<DriveFile[]> {
    this.logger.log(`Getting folder contents: ${folderId}`);

    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: 1000,
      fields:
        'files(id, name, mimeType, description, modifiedTime, size, parents, driveId, webViewLink, iconLink, thumbnailLink, hasThumbnail)',
      orderBy: 'name',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      ...this.getSharedDriveListParams(),
    });

    return (response.data.files || []).map((file) => this.convertToFile(file));
  }

  async listFiles(
    folderId: string,
    pageSize = 100,
    pageToken?: string,
  ): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
    this.logger.log(`Listing files in: ${folderId}`);

    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      pageSize,
      pageToken,
      orderBy: 'name',
      fields:
        'files(id, name, mimeType, modifiedTime, parents, driveId, webViewLink, iconLink, thumbnailLink, hasThumbnail, size, md5Checksum, trashed, shared, owners, capabilities)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      ...this.getSharedDriveListParams(),
    });

    return {
      files: (response.data.files || []).map((file) =>
        this.convertToFile(file),
      ),
      nextPageToken: response.data.nextPageToken || undefined,
    };
  }

  async createFolder(name: string, parentId: string): Promise<DriveFile> {
    this.logger.log(`Creating folder: ${name} in ${parentId}`);

    try {
      const response = await this.drive.files.create({
        requestBody: {
          name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        },
        fields: 'id, name, mimeType, parents, createdTime, modifiedTime',
        supportsAllDrives: true,
      });

      return this.convertToFile(response.data);
    } catch (error) {
      this.logger.error(`Error creating folder ${name}:`, error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<{
    success: boolean;
    alreadyDeleted?: boolean;
    message: string;
  }> {
    this.logger.log(`Trashing file: ${fileId}`);

    try {
      const fileResponse = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, trashed, capabilities',
        supportsAllDrives: true,
      });

      if (fileResponse.data.trashed) {
        return {
          success: true,
          alreadyDeleted: true,
          message: 'File is already in trash',
        };
      }

      // In Shared Drives, only fileOrganizer+ can trash files
      if (
        this.sharedDriveId &&
        fileResponse.data.capabilities &&
        !(fileResponse.data.capabilities as any).canTrash
      ) {
        return {
          success: false,
          message:
            'Insufficient permissions to trash this file in the Shared Drive',
        };
      }

      await this.drive.files.update({
        fileId,
        requestBody: { trashed: true },
        supportsAllDrives: true,
      });

      return { success: true, message: 'File moved to trash successfully' };
    } catch (error: any) {
      if (error?.status === 404 || error?.code === 404) {
        return {
          success: false,
          alreadyDeleted: true,
          message: 'File not found',
        };
      }
      if (error?.status === 403 || error?.code === 403) {
        return {
          success: false,
          message:
            'Insufficient permissions. In Shared Drives, the service account needs fileOrganizer role or higher.',
        };
      }
      throw error;
    }
  }

  async renameFile(fileId: string, newName: string): Promise<DriveFile> {
    this.logger.log(`Renaming file: ${fileId} -> ${newName}`);

    try {
      const response = await this.drive.files.update({
        fileId,
        requestBody: { name: newName },
        fields:
          'id, name, mimeType, description, modifiedTime, parents, webViewLink, iconLink, thumbnailLink, size',
        supportsAllDrives: true,
      });

      return this.convertToFile(response.data);
    } catch (error) {
      this.logger.error(`Error renaming file ${fileId}:`, error);
      throw error;
    }
  }

  async moveFile(fileId: string, newParentId: string): Promise<DriveFile> {
    this.logger.log(`Moving file: ${fileId} -> parent ${newParentId}`);

    try {
      const currentFile = await this.drive.files.get({
        fileId,
        fields: 'id, parents',
        supportsAllDrives: true,
      });
      const previousParents = (currentFile.data.parents || []).join(',');

      const response = await this.drive.files.update({
        fileId,
        addParents: newParentId,
        removeParents: previousParents,
        fields:
          'id, name, mimeType, description, modifiedTime, parents, driveId, webViewLink, iconLink, thumbnailLink, hasThumbnail, size, md5Checksum, trashed, shared, owners, capabilities',
        supportsAllDrives: true,
      });

      return this.convertToFile(response.data);
    } catch (error) {
      this.logger.error(`Error moving file ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches a file's thumbnail via the Google Drive API using the service account.
   * Returns the image bytes and content-type, or null if no thumbnail is available.
   */
  async getThumbnail(
    fileId: string,
  ): Promise<{ buffer: Buffer; contentType: string } | null> {
    try {
      // First, get the thumbnailLink from file metadata
      const meta = await this.drive.files.get({
        fileId,
        fields: 'thumbnailLink, hasThumbnail',
        supportsAllDrives: true,
      });

      const thumbnailLink = meta.data.thumbnailLink;
      if (!thumbnailLink) return null;

      // Fetch the thumbnail using the service account's auth
      const authClient = await this.auth.getClient();
      const token = await authClient.getAccessToken();

      const response = await fetch(thumbnailLink, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
        redirect: 'follow',
      });

      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        contentType: response.headers.get('content-type') || 'image/png',
      };
    } catch (error) {
      this.logger.warn(`Could not fetch thumbnail for ${fileId}:`, error);
      return null;
    }
  }

  async searchFiles(
    query: string,
    pageSize = 25,
    pageToken?: string,
  ): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
    this.logger.log(`Searching files: "${query}"`);

    const escaped = query.replace(/'/g, "\\'");
    const q = `name contains '${escaped}' and trashed = false`;

    const response = await this.drive.files.list({
      q,
      pageSize,
      pageToken,
      fields:
        'files(id, name, mimeType, modifiedTime, parents, driveId, webViewLink, iconLink, thumbnailLink, hasThumbnail, size), nextPageToken',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      ...this.getSharedDriveListParams(),
    });

    return {
      files: (response.data.files || []).map((f) => this.convertToFile(f)),
      nextPageToken: response.data.nextPageToken || undefined,
    };
  }

  async fileExists(
    fileId: string,
  ): Promise<{ exists: boolean; error?: string }> {
    try {
      await this.drive.files.get({
        fileId,
        fields: 'id',
        supportsAllDrives: true,
      });
      return { exists: true };
    } catch (error: any) {
      if (error?.status === 404 || error?.code === 404) {
        return { exists: false, error: 'File not found' };
      }
      return { exists: false, error: error?.message || 'Unknown error' };
    }
  }
}
