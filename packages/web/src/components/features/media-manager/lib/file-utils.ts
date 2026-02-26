import {
  Folder,
  FileText,
  Image,
  Film,
  Music,
  FileSpreadsheet,
  Presentation,
  File,
  type LucideIcon,
} from 'lucide-react';

export const FOLDER_MIME = 'application/vnd.google-apps.folder';

/**
 * Returns the appropriate Lucide icon component for a given MIME type
 */
export function getFileIcon(mimeType: string): LucideIcon {
  if (mimeType === FOLDER_MIME) return Folder;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Film;
  if (mimeType.startsWith('audio/')) return Music;
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType === 'text/csv'
  )
    return FileSpreadsheet;
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return Presentation;
  if (
    mimeType.includes('document') ||
    mimeType.includes('word') ||
    mimeType === 'application/pdf' ||
    mimeType.startsWith('text/')
  )
    return FileText;
  return File;
}

/**
 * Returns a Tailwind color class based on the file MIME type
 */
export function getFileIconColor(mimeType: string): string {
  if (mimeType === FOLDER_MIME) return 'text-blue-500';
  if (mimeType.startsWith('image/')) return 'text-green-500';
  if (mimeType.startsWith('video/')) return 'text-purple-500';
  if (mimeType.startsWith('audio/')) return 'text-pink-500';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
    return 'text-emerald-600';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return 'text-orange-500';
  if (mimeType === 'application/pdf') return 'text-red-500';
  return 'text-muted-foreground';
}

/**
 * Formats a byte count into a human-readable string (B, KB, MB, GB)
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Formats a date string into a localized short date (es-ES)
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Preview utilities ──────────────────────────────────────────────

export type PreviewType = 'image' | 'iframe' | 'none';

/**
 * Determines the preview strategy for a given MIME type
 */
export function getPreviewType(mimeType: string): PreviewType {
  if (mimeType.startsWith('image/')) return 'image';
  if (
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType === 'application/pdf' ||
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'application/vnd.google-apps.spreadsheet' ||
    mimeType === 'application/vnd.google-apps.presentation'
  )
    return 'iframe';
  return 'none';
}

/**
 * Returns the Google Drive embed URL for previewing a file
 */
export function getGoogleDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Replaces the default thumbnail size (=s220) with a larger one for high-res display
 */
export function getLargeThumbnailUrl(
  thumbnailLink?: string,
): string | undefined {
  if (!thumbnailLink) return undefined;
  return thumbnailLink.replace(/=s\d+$/, '=s1600');
}

/**
 * Returns a thumbnail URL for a Drive file.
 * Uses our BFF proxy endpoint which fetches thumbnails server-side
 * via the service account, avoiding cross-origin/auth issues.
 */
export function getThumbnailUrl(fileId: string): string {
  return `/api/drive/files/${fileId}/thumbnail`;
}

// ─── Sort & Filter utilities ────────────────────────────────────────

import type { DriveFile } from '@alkitu/shared';
import type { SortConfig, FileTypeFilter } from '../types';

// Total number of FileTypeFilter values (used for early-exit optimisation)
const TOTAL_FILTER_COUNT = 10;

/**
 * Classifies a single mimeType into its FileTypeFilter category.
 * Returns 'all' for unknown types (i.e. no specific category).
 */
function classifyMime(mime: string): FileTypeFilter {
  if (mime === FOLDER_MIME) return 'folders';
  if (mime.startsWith('image/')) return 'images';
  if (mime.startsWith('video/')) return 'videos';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime === 'application/pdf') return 'pdf';
  if (
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime === 'text/csv'
  )
    return 'spreadsheets';
  if (mime.includes('presentation') || mime.includes('powerpoint'))
    return 'presentations';
  if (
    mime.includes('document') ||
    mime.includes('word') ||
    mime.startsWith('text/')
  )
    return 'documents';
  if (
    mime === 'application/zip' ||
    mime === 'application/x-rar-compressed' ||
    mime === 'application/gzip' ||
    mime === 'application/x-7z-compressed' ||
    mime === 'application/x-tar'
  )
    return 'archives';
  return 'all'; // uncategorised — will always pass
}

/**
 * Filters files by type category based on mimeType
 */
export function filterFiles(
  files: DriveFile[],
  filter: FileTypeFilter,
): DriveFile[] {
  if (filter === 'all') return files;
  return files.filter((file) => classifyMime(file.mimeType) === filter);
}

/**
 * Returns a Set of FileTypeFilter values that have at least one matching file.
 * 'all' is always included.
 */
export function getAvailableFilters(files: DriveFile[]): Set<FileTypeFilter> {
  const available = new Set<FileTypeFilter>(['all']);
  for (const file of files) {
    const category = classifyMime(file.mimeType);
    if (category !== 'all') available.add(category);
    // Early exit when every possible filter is represented
    if (available.size === TOTAL_FILTER_COUNT) break;
  }
  return available;
}

export function sortFiles(files: DriveFile[], config: SortConfig): DriveFile[] {
  const foldersOnTop = config.foldersOnTop ?? true;

  return [...files].sort((a, b) => {
    const aIsFolder = a.mimeType === FOLDER_MIME;
    const bIsFolder = b.mimeType === FOLDER_MIME;

    // Folders on top logic (if enabled)
    if (foldersOnTop) {
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
    }

    let comparison = 0;

    switch (config.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'es');
        break;
      case 'modifiedTime':
        comparison = (a.modifiedTime || '').localeCompare(b.modifiedTime || '');
        break;
      case 'size':
        comparison = (a.size || 0) - (b.size || 0);
        break;
      case 'type':
        comparison = a.mimeType.localeCompare(b.mimeType);
        break;
    }

    return config.direction === 'asc' ? comparison : -comparison;
  });
}
