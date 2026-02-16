import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

/**
 * ToggleFieldEditor Molecule Component Props
 *
 * Editor for toggle/checkbox field types with:
 * - Toggle switch vs. checkbox style selector
 * - Required field validation
 * - Default checked state
 * - Custom checked/unchecked values (boolean or string)
 * - Label and description editing (i18n support)
 */
export interface ToggleFieldEditorProps {
  /**
   * Form field being edited
   * Must be of type 'toggle'
   */
  field: FormField;

  /**
   * Callback when field configuration changes
   */
  onChange: (field: FormField) => void;

  /**
   * Callback when field should be deleted
   */
  onDelete: () => void;

  /**
   * Optional callback when field should be duplicated
   */
  onDuplicate?: () => void;

  /**
   * List of supported locales for i18n
   * @default ['en', 'es']
   */
  supportedLocales?: SupportedLocale[];

  /**
   * Default locale for the form
   * @default 'en'
   */
  defaultLocale?: SupportedLocale;

  /**
   * Current editing locale
   * @default 'en'
   */
  editingLocale?: SupportedLocale;
}

/**
 * Toggle field style options
 */
export type ToggleStyleType = 'toggle' | 'checkbox';

/**
 * Value type for toggle field
 */
export type ToggleValueType = 'boolean' | 'string';
