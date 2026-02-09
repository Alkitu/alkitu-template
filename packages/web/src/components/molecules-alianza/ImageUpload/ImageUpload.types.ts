export interface ImageUploadProps {
  /**
   * Current image URL to display
   */
  src?: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Callback when file is selected or uploaded
   */
  onUpload?: (file: File) => void;

  /**
   * Callback when image is removed/deleted
   */
  onRemove?: () => void;

  /**
   * Callback when upload/file operation fails
   */
  onError?: (error: Error) => void;

  /**
   * Accepted file types (MIME types)
   * @default 'image/*'
   */
  accept?: string;

  /**
   * Maximum file size in bytes
   * @default 5242880 (5MB)
   */
  maxSize?: number;

  /**
   * Whether the component is disabled
   */
  disabled?: boolean;

  /**
   * Whether the upload is in progress
   */
  loading?: boolean;

  /**
   * Custom class name for the wrapper
   */
  className?: string;

  /**
   * Text to display on upload button
   * @default 'Subir fotos'
   */
  uploadText?: string;

  /**
   * Helper text below upload button
   * @default 'Antes y después'
   */
  helperText?: string;

  /**
   * Enable drag and drop functionality
   * @default true
   */
  allowDragDrop?: boolean;

  /**
   * Show delete button on uploaded image
   * @default true
   */
  showDeleteButton?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

export interface ImageUploadState {
  isDragging: boolean;
  previewUrl: string | null;
  error: string | null;
}
