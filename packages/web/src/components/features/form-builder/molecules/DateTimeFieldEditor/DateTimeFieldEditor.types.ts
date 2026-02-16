/**
 * DateTimeFieldEditor Types
 *
 * Type definitions for the DateTimeFieldEditor molecule component
 */

import type { FormField, SupportedLocale } from '../../types';

/**
 * Props for the DateTimeFieldEditor component
 */
export interface DateTimeFieldEditorProps {
  /**
   * The form field being edited
   */
  field: FormField;

  /**
   * Callback when field configuration changes
   */
  onChange: (field: FormField) => void;

  /**
   * The locale being edited (for i18n)
   * @default 'en'
   */
  editingLocale?: SupportedLocale;

  /**
   * The default/primary locale of the form
   * @default 'en'
   */
  defaultLocale?: SupportedLocale;

  /**
   * Whether the editor is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Date/time picker mode
 */
export type DateTimeMode = 'date' | 'time' | 'datetime';

/**
 * Hour format (12h or 24h)
 */
export type HourCycle = 12 | 24;
