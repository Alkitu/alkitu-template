import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Logger,
  HttpCode,
  HttpStatus,
  BadRequestException,
  PayloadTooLargeException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DriveService } from './drive.service';
import { EnhancedUploadDto } from './dto/enhanced-upload.dto';
import { InitResumableDto } from './dto/init-resumable.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { RenameFileDto } from './dto/rename-file.dto';
import { MoveFileDto } from './dto/move-file.dto';
import type { Request, Response } from 'express';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB total per request

@ApiTags('drive')
@Controller('drive')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DriveController {
  private readonly logger = new Logger(DriveController.name);

  constructor(private readonly driveService: DriveService) {}

  /**
   * Enhanced upload - base64 encoded files
   */
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload files (base64 encoded)' })
  @ApiResponse({ status: 200, description: 'All files uploaded successfully' })
  @ApiResponse({ status: 207, description: 'Partial upload success' })
  @ApiResponse({ status: 400, description: 'All uploads failed' })
  @ApiResponse({ status: 413, description: 'Payload too large' })
  async enhancedUpload(@Body() dto: EnhancedUploadDto) {
    const startTime = Date.now();
    const { folderId, files } = dto;

    this.logger.log(
      `Upload request: ${files.length} files to folder ${folderId}`,
    );

    // Validate file sizes
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new PayloadTooLargeException(
          `File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum: 100MB.`,
        );
      }
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      throw new PayloadTooLargeException(
        `Total upload size too large (${(totalSize / (1024 * 1024)).toFixed(1)}MB). Maximum: 500MB.`,
      );
    }

    // Verify folder exists
    try {
      await this.driveService.getFolder(folderId);
    } catch {
      throw new NotFoundException(
        `Folder not found or inaccessible: ${folderId}`,
      );
    }

    const uploadResults: any[] = [];
    const errors: any[] = [];

    for (const [index, fileData] of files.entries()) {
      const fileStartTime = Date.now();
      try {
        this.logger.log(
          `[${index + 1}/${files.length}] Uploading: ${fileData.name} (${(fileData.size / (1024 * 1024)).toFixed(2)}MB)`,
        );

        const buffer = Buffer.from(fileData.data, 'base64');
        const uploadedFile = await this.driveService.uploadBuffer(
          buffer,
          fileData.name,
          fileData.mimeType,
          {
            parentId: folderId,
            description: `Uploaded via Drive Manager on ${new Date().toISOString()}`,
          },
        );

        const uploadTimeMs = Date.now() - fileStartTime;
        this.logger.log(
          `[${index + 1}/${files.length}] Upload successful: ${uploadedFile.id} (${uploadTimeMs}ms)`,
        );

        uploadResults.push({
          index,
          success: true,
          file: uploadedFile,
          originalName: fileData.name,
          uploadTimeMs,
        });
      } catch (error) {
        const uploadTimeMs = Date.now() - fileStartTime;
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';

        this.logger.error(
          `[${index + 1}/${files.length}] Upload failed: ${fileData.name}`,
          error instanceof Error ? error.stack : undefined,
        );

        errors.push({
          index,
          fileName: fileData.name,
          fileSize: fileData.size,
          error: errorMessage,
          uploadTimeMs,
        });
      }
    }

    const totalUploadTime = Date.now() - startTime;

    const response = {
      success: uploadResults.length > 0,
      uploadedFiles: uploadResults,
      errors,
      summary: {
        total: files.length,
        successful: uploadResults.length,
        failed: errors.length,
        totalUploadTimeMs: totalUploadTime,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      },
      timestamp: new Date().toISOString(),
    };

    // Return appropriate status code
    if (errors.length === 0) return response;
    if (uploadResults.length > 0) {
      // 207 Multi-Status for partial success
      return { ...response, _statusCode: 207 };
    }
    throw new BadRequestException(response);
  }

  /**
   * Direct upload via FormData
   */
  @Post('upload/direct')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a single file via FormData' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  async directUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderId') folderId: string,
    @Body('description') description?: string,
  ) {
    if (!file || !folderId) {
      throw new BadRequestException(
        'Missing required fields: file and folderId',
      );
    }

    this.logger.log(
      `Direct upload: ${file.originalname} (${file.size} bytes) to ${folderId}`,
    );

    const uploadedFile = await this.driveService.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      {
        parentId: folderId,
        description:
          description ||
          `Uploaded via Direct Upload on ${new Date().toISOString()}`,
      },
    );

    return {
      success: true,
      file: {
        id: uploadedFile.id,
        name: uploadedFile.name,
        webViewLink: uploadedFile.webViewLink,
        size: uploadedFile.size,
        mimeType: uploadedFile.mimeType,
      },
    };
  }

  /**
   * Initialize a resumable upload session
   */
  @Post('upload/init-resumable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initialize a resumable upload session' })
  @ApiResponse({
    status: 200,
    description: 'Resumable session initialized',
  })
  async initResumable(@Body() dto: InitResumableDto) {
    const { fileName, fileSize, mimeType, folderId, description } = dto;

    this.logger.log(
      `Init resumable: ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)}MB)`,
    );

    const accessToken = await this.driveService.getAccessToken();

    const metadata = {
      name: fileName,
      parents: [folderId],
      description:
        description ||
        `Uploaded via Resumable Upload on ${new Date().toISOString()}`,
    };

    const initResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': mimeType || 'application/octet-stream',
          'X-Upload-Content-Length': fileSize.toString(),
        },
        body: JSON.stringify(metadata),
      },
    );

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      this.logger.error(`Failed to init resumable upload: ${errorText}`);
      throw new BadRequestException(
        `Failed to initialize upload: ${errorText}`,
      );
    }

    const resumableURI = initResponse.headers.get('Location');
    if (!resumableURI) {
      throw new BadRequestException(
        'No resumable URI returned from Google Drive',
      );
    }

    this.logger.log('Resumable upload session initialized');

    return {
      success: true,
      resumableURI,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }

  /**
   * Proxy a resumable upload chunk to Google Drive
   */
  @Put('upload/resumable-chunk')
  @ApiOperation({ summary: 'Upload a chunk for resumable upload' })
  @ApiQuery({ name: 'resumableURI', required: true })
  @ApiResponse({ status: 200, description: 'Upload completed' })
  @ApiResponse({ status: 308, description: 'Chunk uploaded, more expected' })
  async resumableChunk(
    @Query('resumableURI') resumableURI: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!resumableURI) {
      throw new BadRequestException('Missing resumableURI parameter');
    }

    const contentRange = req.headers['content-range'] as string | undefined;
    const contentLength = req.headers['content-length'];
    const contentType =
      (req.headers['content-type'] as string) || 'application/octet-stream';

    this.logger.log(
      `Resumable chunk: Content-Range=${contentRange}, Content-Length=${contentLength}`,
    );

    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };
    if (contentLength) headers['Content-Length'] = contentLength;
    if (contentRange) headers['Content-Range'] = contentRange;

    // Forward the raw body to Google Drive
    const response = await fetch(resumableURI, {
      method: 'PUT',
      headers,
      body: new Uint8Array(req.body as Buffer),
    });

    const responseBody = await response.text();

    if (!response.ok && response.status !== 308) {
      this.logger.error(
        `Chunk upload failed: ${response.status} ${response.statusText}`,
      );
      return res.status(response.status).json({
        error: `Google Drive upload failed: ${response.status} ${response.statusText}`,
        body: responseBody,
      });
    }

    const result = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      body: responseBody,
    };

    return res.status(response.status).json(result);
  }

  // ─── Configuration / Status ────────────────────────────────────────

  /**
   * Get Drive configuration status
   */
  @Get('status')
  @ApiOperation({ summary: 'Get Drive integration status' })
  @ApiResponse({ status: 200, description: 'Drive configuration status' })
  async getStatus() {
    return {
      mode: this.driveService.isSharedDrive ? 'shared_drive' : 'my_drive',
      sharedDriveId: this.driveService.isSharedDrive
        ? process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID
        : undefined,
      rootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
      serviceEmail: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    };
  }

  // ─── Search ───────────────────────────────────────────────────────

  /**
   * Search files and folders by name across the entire Drive
   */
  @Get('search')
  @ApiOperation({ summary: 'Search files and folders by name' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'pageToken', required: false })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchFiles(
    @Query('q') query: string,
    @Query('pageSize') pageSize?: string,
    @Query('pageToken') pageToken?: string,
  ) {
    if (!query || query.trim().length < 2) {
      return { files: [], nextPageToken: undefined };
    }
    return this.driveService.searchFiles(
      query.trim(),
      pageSize ? parseInt(pageSize, 10) : 25,
      pageToken || undefined,
    );
  }

  // ─── Media Manager CRUD endpoints ──────────────────────────────────

  /**
   * Get folder info
   */
  @Get('folders/:folderId')
  @ApiOperation({ summary: 'Get folder information' })
  @ApiParam({ name: 'folderId', description: 'Google Drive folder ID' })
  @ApiResponse({ status: 200, description: 'Folder info retrieved' })
  async getFolder(@Param('folderId') folderId: string) {
    try {
      const folder = await this.driveService.getFolder(folderId);
      return { folder };
    } catch {
      throw new NotFoundException(`Folder not found: ${folderId}`);
    }
  }

  /**
   * Get folder contents (flat list for Media Manager browsing)
   */
  @Get('folders/:folderId/contents')
  @ApiOperation({ summary: 'List folder contents' })
  @ApiParam({ name: 'folderId', description: 'Google Drive folder ID' })
  @ApiResponse({ status: 200, description: 'Folder contents listed' })
  async getFolderContents(@Param('folderId') folderId: string) {
    let folder;
    try {
      folder = await this.driveService.getFolder(folderId);
    } catch {
      throw new NotFoundException(`Folder not found: ${folderId}`);
    }

    const contents = await this.driveService.getFolderContents(folderId);

    const FOLDER_MIME = 'application/vnd.google-apps.folder';
    const folders = contents.filter((item) => item.mimeType === FOLDER_MIME);
    const files = contents.filter((item) => item.mimeType !== FOLDER_MIME);

    return {
      folder: { id: folder.id, name: folder.name },
      items: [...folders, ...files],
      totalCount: contents.length,
      folderCount: folders.length,
      fileCount: files.length,
    };
  }

  /**
   * Create a new folder
   */
  @Post('folders')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new folder in Google Drive' })
  @ApiResponse({ status: 201, description: 'Folder created successfully' })
  async createFolder(@Body() dto: CreateFolderDto) {
    // Verify parent exists
    try {
      await this.driveService.getFolder(dto.parentId);
    } catch {
      throw new NotFoundException(
        `Parent folder not found: ${dto.parentId}`,
      );
    }

    const folder = await this.driveService.createFolder(
      dto.name,
      dto.parentId,
    );

    return {
      success: true,
      folder,
      message: 'Folder created successfully',
    };
  }

  /**
   * Get file metadata
   */
  @Get('files/:fileId')
  @ApiOperation({ summary: 'Get file metadata' })
  @ApiParam({ name: 'fileId', description: 'Google Drive file ID' })
  @ApiResponse({ status: 200, description: 'File metadata retrieved' })
  async getFile(@Param('fileId') fileId: string) {
    try {
      const file = await this.driveService.getFile(fileId);
      return { file };
    } catch {
      throw new NotFoundException(`File not found: ${fileId}`);
    }
  }

  /**
   * Get a file's thumbnail image (proxied via service account)
   */
  @Get('files/:fileId/thumbnail')
  @ApiOperation({ summary: 'Get file thumbnail image' })
  @ApiParam({ name: 'fileId', description: 'Google Drive file ID' })
  @ApiResponse({ status: 200, description: 'Thumbnail image' })
  @ApiResponse({ status: 404, description: 'No thumbnail available' })
  async getFileThumbnail(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const result = await this.driveService.getThumbnail(fileId);

    if (!result) {
      throw new NotFoundException('No thumbnail available for this file');
    }

    res.set({
      'Content-Type': result.contentType,
      'Cache-Control': 'public, max-age=3600',
    });
    res.send(result.buffer);
  }

  /**
   * Delete (trash) a file or folder
   */
  @Delete('files/:fileId')
  @ApiOperation({ summary: 'Move a file or folder to trash' })
  @ApiParam({ name: 'fileId', description: 'Google Drive file/folder ID' })
  @ApiResponse({ status: 200, description: 'File moved to trash' })
  async deleteFile(@Param('fileId') fileId: string) {
    const result = await this.driveService.deleteFile(fileId);

    if (!result.success && !result.alreadyDeleted) {
      throw new NotFoundException(result.message);
    }

    return result;
  }

  /**
   * Rename a file or folder
   */
  @Patch('files/:fileId/rename')
  @ApiOperation({ summary: 'Rename a file or folder' })
  @ApiParam({ name: 'fileId', description: 'Google Drive file/folder ID' })
  @ApiResponse({ status: 200, description: 'File renamed successfully' })
  async renameFile(
    @Param('fileId') fileId: string,
    @Body() dto: RenameFileDto,
  ) {
    // Verify file exists
    const exists = await this.driveService.fileExists(fileId);
    if (!exists.exists) {
      throw new NotFoundException(`File not found: ${fileId}`);
    }

    const file = await this.driveService.renameFile(fileId, dto.newName);

    return {
      success: true,
      file,
      message: 'File renamed successfully',
    };
  }

  /**
   * Move a file or folder to a different parent folder
   */
  @Patch('files/:fileId/move')
  @ApiOperation({ summary: 'Move a file or folder to another folder' })
  @ApiParam({ name: 'fileId', description: 'Google Drive file/folder ID' })
  @ApiResponse({ status: 200, description: 'File moved successfully' })
  async moveFile(
    @Param('fileId') fileId: string,
    @Body() dto: MoveFileDto,
  ) {
    // Verify file exists
    const exists = await this.driveService.fileExists(fileId);
    if (!exists.exists) {
      throw new NotFoundException(`File not found: ${fileId}`);
    }

    // Verify destination folder exists
    try {
      await this.driveService.getFolder(dto.newParentId);
    } catch {
      throw new NotFoundException(
        `Destination folder not found: ${dto.newParentId}`,
      );
    }

    const file = await this.driveService.moveFile(fileId, dto.newParentId);

    return {
      success: true,
      file,
      message: 'File moved successfully',
    };
  }
}
