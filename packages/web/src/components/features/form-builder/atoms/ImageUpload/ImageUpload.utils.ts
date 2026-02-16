/**
 * ImageUpload Utility Functions
 *
 * Handles file validation and upload logic.
 * Phase 3 TODO: Implement actual tRPC upload endpoint integration.
 */

import { FileValidationResult, ImageUploadResult } from './ImageUpload.types';

/**
 * Default accepted image types
 */
export const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/**
 * Default max file size (5MB)
 */
export const DEFAULT_MAX_SIZE_MB = 5;

/**
 * Validates an image file against size and type constraints
 *
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @param acceptedTypes - Array of accepted MIME types
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = DEFAULT_MAX_SIZE_MB,
  acceptedTypes: string[] = DEFAULT_ACCEPTED_TYPES
): FileValidationResult {
  // Validate file type
  if (!acceptedTypes.includes(file.type)) {
    const acceptedExtensions = acceptedTypes
      .map((type) => type.split('/')[1].toUpperCase())
      .join(', ');
    return {
      valid: false,
      error: `Invalid file type. Accepted: ${acceptedExtensions}`,
    };
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Formats file size for display
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Creates a data URL from a File object for preview
 *
 * @param file - File to convert
 * @returns Promise resolving to data URL
 */
export function createPreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to the server
 * TODO (Phase 3): Replace with actual tRPC upload endpoint
 *
 * @param file - File to upload
 * @param endpoint - Upload endpoint URL
 * @param onProgress - Progress callback (0-100)
 * @returns Promise resolving to upload result with variants and metadata
 */
export async function uploadImage(
  file: File,
  endpoint: string = '/api/upload',
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult> {
  // TODO: Implement actual upload to backend with Sharp processing
  // For now, return a preview data URL
  // This will be replaced with tRPC mutation in Phase 3

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Simulate progress if callback provided
    if (onProgress) {
      const progressInterval = setInterval(() => {
        onProgress(Math.min(Math.random() * 30 + 60, 90));
      }, 100);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearInterval(progressInterval);
      onProgress(100);
    }

    // For now, create a data URL for preview
    const previewUrl = await createPreviewUrl(file);

    // Create mock response structure (will match backend response in Phase 3)
    const result: ImageUploadResult = {
      url: previewUrl,
      // TODO: Backend will generate these variants with Sharp
      variants: {
        thumbnail: previewUrl,
        medium: previewUrl,
        large: previewUrl,
      },
      // TODO: Backend will extract actual image metadata
      metadata: {
        width: 0,
        height: 0,
        aspectRatio: 1,
      },
    };

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Upload failed'
    );
  }
}

/**
 * Checks if a string is a valid URL
 *
 * @param string - String to validate
 * @returns True if valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts image URL from ImageData or string
 *
 * @param value - ImageData object or URL string
 * @returns URL string or empty string
 */
export function extractImageUrl(value?: string | { url: string }): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value.url;
}
