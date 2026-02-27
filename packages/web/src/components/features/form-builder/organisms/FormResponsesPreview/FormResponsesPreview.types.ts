/**
 * FormResponsesPreview Types
 *
 * Type definitions for the read-only form responses display.
 */

import type { FormSettings, SupportedLocale } from '../../types';

/** A file stored in Google Drive, attached to a request */
export interface DriveAttachment {
  fileId: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  size?: number;
}

export interface FormResponsesPreviewProps {
  /** The form schema (fields, groups, i18n, etc.) */
  formSettings: FormSettings;

  /** The client's saved answers — keys are field IDs, values are answers */
  responses: Record<string, unknown>;

  /** Drive attachments from the request — matched to fileUpload fields by name */
  attachments?: DriveAttachment[];

  /** Display locale (default: 'es') */
  locale?: SupportedLocale;

  /** Additional CSS classes */
  className?: string;
}
