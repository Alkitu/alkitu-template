/**
 * FormResponsesPreview Types
 *
 * Type definitions for the read-only form responses display.
 */

import type { FormSettings, SupportedLocale } from '../../types';

export interface FormResponsesPreviewProps {
  /** The form schema (fields, groups, i18n, etc.) */
  formSettings: FormSettings;

  /** The client's saved answers — keys are field IDs, values are answers */
  responses: Record<string, unknown>;

  /** Display locale (default: 'es') */
  locale?: SupportedLocale;

  /** Additional CSS classes */
  className?: string;
}
