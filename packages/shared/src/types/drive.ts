/**
 * Drive Types - Shared between api and web packages
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  createdTime?: string;
  modifiedTime?: string;
  parents?: string[];
  driveId?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  hasThumbnail?: boolean;
  size?: number;
  md5Checksum?: string;
  trashed?: boolean;
  shared?: boolean;
  owners?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }[];
  capabilities?: {
    canEdit: boolean;
    canDownload: boolean;
    canShare: boolean;
    canCopy: boolean;
    canTrash?: boolean;
  };
}

export interface UploadFileResult {
  index: number;
  success: boolean;
  file?: DriveFile;
  originalName: string;
  uploadTimeMs: number;
  error?: string;
}

export interface UploadSummary {
  total: number;
  successful: number;
  failed: number;
  totalUploadTimeMs: number;
  totalSizeMB: string;
}

export interface ResumableInitResponse {
  success: boolean;
  resumableURI: string;
  expiresAt: number;
}
