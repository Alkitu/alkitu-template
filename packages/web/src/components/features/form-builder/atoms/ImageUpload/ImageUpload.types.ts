/**
 * ImageUpload Component Types
 *
 * Complex image upload component with:
 * - Drag & drop support
 * - Click to upload
 * - URL input option
 * - Image preview
 * - File validation
 * - Upload progress tracking
 * - Error handling
 */

import { ImageData } from '@alkitu/shared';

/**
 * Upload state machine states
 */
export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

/**
 * Size variants for image preview
 */
export type ImageUploadSize = 'small' | 'medium' | 'large';

/**
 * Upload result with image variants and metadata
 */
export interface ImageUploadResult {
  url: string;
  variants?: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  metadata?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * ImageUpload component props
 */
export interface ImageUploadProps {
  /**
   * Current image URL or ImageData
   */
  value?: string | ImageData;

  /**
   * Callback when image changes
   * Receives either a URL string or full ImageUploadResult
   */
  onChange: (data: string | ImageUploadResult) => void;

  /**
   * Placeholder text for URL input
   * @default 'Enter image URL'
   */
  placeholder?: string;

  /**
   * Size of the image preview
   * @default 'medium'
   */
  size?: ImageUploadSize;

  /**
   * Maximum file size in MB
   * @default 5
   */
  maxSizeMB?: number;

  /**
   * Accepted file types (MIME types)
   * @default ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
   */
  acceptedTypes?: string[];

  /**
   * Whether the field is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Custom upload endpoint URL
   * @default '/api/upload'
   */
  uploadEndpoint?: string;

  /**
   * Callback when upload starts
   */
  onUploadStart?: () => void;

  /**
   * Callback when upload completes successfully
   */
  onUploadSuccess?: (result: ImageUploadResult) => void;

  /**
   * Callback when upload fails
   */
  onUploadError?: (error: Error) => void;

  /**
   * Callback when upload progress changes
   */
  onUploadProgress?: (progress: number) => void;
}

/**
 * Internal component state
 */
export interface ImageUploadState {
  uploadState: UploadState;
  uploadProgress: number;
  errorMessage: string | null;
  isDragging: boolean;
  imageError: boolean;
  urlInput: string;
}
