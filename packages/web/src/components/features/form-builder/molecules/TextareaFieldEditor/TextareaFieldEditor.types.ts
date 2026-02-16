import type { FormField, SupportedLocale } from '@alkitu/shared';

/**
 * Props for the TextareaFieldEditor molecule component
 *
 * Provides an editor interface for configuring textarea form fields including:
 * - Label, placeholder, description (with i18n support)
 * - Required validation toggle
 * - Textarea-specific options (rows, resize, character count, auto-grow)
 * - Validation rules (minLength, maxLength, pattern)
 */
export interface TextareaFieldEditorProps {
  /**
   * The form field being edited (must be type 'textarea')
   */
  field: FormField;

  /**
   * Callback when field configuration changes
   */
  onChange: (field: FormField) => void;

  /**
   * Callback to delete this field
   */
  onDelete: () => void;

  /**
   * Optional callback to duplicate this field
   */
  onDuplicate?: () => void;

  /**
   * List of supported locales for i18n editing
   * @default ['en', 'es']
   */
  supportedLocales?: SupportedLocale[];

  /**
   * Default locale for the form (determines which locale is editable)
   * @default 'en'
   */
  defaultLocale?: SupportedLocale;

  /**
   * Current locale being edited
   * @default 'en'
   */
  editingLocale?: SupportedLocale;
}
