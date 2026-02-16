import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

/**
 * SelectFieldEditor Molecule Component Props
 *
 * Editor for select dropdown field types with options management.
 * Supports placeholder text, default value selection, allow clear option, and i18n.
 */
export interface SelectFieldEditorProps {
  /**
   * Form field being edited
   * Must be type 'select'
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
