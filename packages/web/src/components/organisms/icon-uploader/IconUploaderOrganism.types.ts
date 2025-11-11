/**
 * Props for IconUploaderOrganism component
 *
 * This organism manages the complete icon upload workflow including:
 * - File selection and validation
 * - SVG preview with multiple sizes and variants
 * - Icon naming with auto-generation
 * - Error handling and loading states
 */
export interface IconUploaderOrganismProps {
  /**
   * Controls the visibility of the upload modal
   */
  isOpen: boolean;

  /**
   * Callback when the modal should close
   */
  onClose: () => void;

  /**
   * Async callback when icon upload is submitted
   * @param file - The selected SVG file
   * @param name - The icon name (sanitized)
   * @returns Promise that resolves when upload is complete
   */
  onUpload: (file: File, name: string) => Promise<void>;

  /**
   * Optional title for the upload dialog (pre-translated)
   * @default "Upload Custom Icon"
   */
  title?: string;

  /**
   * Optional description text (pre-translated)
   * @default "Upload an SVG icon to add to your icon library."
   */
  description?: string;

  /**
   * Optional helper text (pre-translated)
   * @default "SVG files will be processed and optimized for the theme system."
   */
  helperText?: string;

  /**
   * Button text for file selection (pre-translated)
   * @default "Choose SVG File"
   */
  chooseFileText?: string;

  /**
   * Label for icon name input (pre-translated)
   * @default "Icon Name"
   */
  iconNameLabel?: string;

  /**
   * Placeholder for icon name input (pre-translated)
   * @default "Enter icon name"
   */
  iconNamePlaceholder?: string;

  /**
   * Helper text for icon name input (pre-translated)
   * @default "Only letters, numbers, dashes and underscores allowed"
   */
  iconNameHelper?: string;

  /**
   * Preview section label (pre-translated)
   * @default "Preview"
   */
  previewLabel?: string;

  /**
   * Cancel button text (pre-translated)
   * @default "Cancel"
   */
  cancelText?: string;

  /**
   * Submit button text (pre-translated)
   * @default "Add Icon"
   */
  submitText?: string;

  /**
   * Loading text when uploading (pre-translated)
   * @default "Uploading..."
   */
  uploadingText?: string;

  /**
   * Error message for invalid SVG (pre-translated)
   * @default "Invalid SVG file"
   */
  invalidSvgError?: string;

  /**
   * Error message for file read failure (pre-translated)
   * @default "Failed to read file"
   */
  readFileError?: string;
}
