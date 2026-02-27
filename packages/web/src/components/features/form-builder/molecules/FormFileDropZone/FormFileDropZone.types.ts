/**
 * FormFileDropZone Types
 *
 * Type definitions for the FormFileDropZone molecule component.
 */

export interface FormFileDropZoneProps {
  /** Unique field identifier */
  fieldId: string;
  /** Currently selected files */
  files: File[];
  /** Callback when files are added/removed */
  onFilesChanged: (files: File[]) => void;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum size per file in MB */
  maxSizeMB?: number;
  /** Maximum total size for all files in MB */
  maxTotalMB?: number;
  /** Accepted MIME types */
  accept?: string[];
  /** Visual style */
  displayStyle?: 'dropzone' | 'button';
  /** Placeholder text */
  placeholder?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Enable automatic WebP compression for images (default: true) */
  enableWebPCompression?: boolean;
}
