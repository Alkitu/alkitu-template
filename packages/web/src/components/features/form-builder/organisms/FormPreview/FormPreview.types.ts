/**
 * FormPreview Types
 *
 * Type definitions for the FormPreview organism component
 */

import type { FormSettings, SupportedLocale } from '../../types';

/**
 * Props for the FormPreview component
 */
export interface FormPreviewProps {
  /**
   * Current form settings to preview
   */
  formSettings: FormSettings;

  /**
   * List of supported locales for the form (default: ['en'])
   */
  supportedLocales?: SupportedLocale[];

  /**
   * Default locale for the form (default: 'en')
   */
  defaultLocale?: SupportedLocale;

  /**
   * When provided, enables interactive mode with real form submission.
   * Without this, the component behaves as a preview-only form.
   */
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;

  /**
   * Shows a back/cancel button. Only used in interactive mode.
   */
  onCancel?: () => void;

  /**
   * Override the form's submit button text (from formSettings.submitButtonText)
   */
  submitButtonText?: string;

  /**
   * Hide the Card header (title, locale switcher, refresh button).
   * Useful when embedding inside another Card.
   */
  hideHeader?: boolean;

  /**
   * Callback when files are selected/removed for file upload fields.
   * Receives a map of fieldId → File[] with all pending files.
   */
  onFilesChanged?: (filesByField: Record<string, File[]>) => void;
}
