import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

/**
 * RadioFieldEditor Molecule Component Props
 *
 * Editor for radio button field types with options management.
 * Supports vertical/horizontal layouts, default value selection, and i18n.
 */
export interface RadioFieldEditorProps {
  /**
   * Form field being edited
   * Must be type 'radio'
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
 * Radio layout options
 */
export type RadioLayout = 'vertical' | 'horizontal';
