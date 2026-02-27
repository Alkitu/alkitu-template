/**
 * Google Drive File Type Constants
 *
 * Centralizes all MIME types supported by Google Drive as presets.
 * Used by FileUploadFieldEditor for admin configuration and
 * FormFileDropZone for client-side validation.
 */

/** Google Drive supported file type categories */
export const GOOGLE_DRIVE_FILE_TYPES: Record<string, string[]> = {
  images: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  spreadsheets: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  presentations: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  text: ['text/plain', 'text/csv'],
  archives: ['application/zip', 'application/x-rar-compressed'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

/** All supported MIME types flattened */
export const GOOGLE_DRIVE_ALL_TYPES = Object.values(GOOGLE_DRIVE_FILE_TYPES).flat();

/** Maximum total upload size in MB for form file uploads */
export const FORM_UPLOAD_MAX_TOTAL_MB = 100;

/** Human-readable labels for each category (en) */
export const FILE_TYPE_CATEGORY_LABELS: Record<string, string> = {
  images: 'Images',
  documents: 'Documents',
  spreadsheets: 'Spreadsheets',
  presentations: 'Presentations',
  text: 'Text Files',
  archives: 'Archives',
  video: 'Video',
  audio: 'Audio',
};
