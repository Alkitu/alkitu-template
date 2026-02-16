import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

/**
 * TextFieldEditor Molecule Component Props
 *
 * Unified editor for text-based field types: text, email, and phone.
 * Provides different validation and input options based on field type.
 */
export interface TextFieldEditorProps {
  /**
   * Form field being edited
   * Must be one of: 'text', 'email', or 'phone'
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
 * Phone format preset masks
 */
export const PHONE_PRESET_MASKS = {
  US: { mask: '(###) ###-####', example: '(555) 123-4567' },
  ES: { mask: '### ### ###', example: '612 345 678' },
  MX: { mask: '## #### ####', example: '55 1234 5678' },
  UK: { mask: '##### ######', example: '07700 900123' },
  FR: { mask: '## ## ## ## ##', example: '06 12 34 56 78' },
} as const;

export type PhoneCountryCode = keyof typeof PHONE_PRESET_MASKS;
