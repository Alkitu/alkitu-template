import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

/**
 * FieldEditor Organism Component Props
 *
 * Top-level integration component that routes to appropriate field editor
 * based on field type. Handles locale management and common field operations.
 */
export interface FieldEditorProps {
  /**
   * Form field being edited
   * Routes to appropriate molecule editor based on field.type
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
   * If provided, component is in controlled mode.
   * If not provided, manages its own locale state.
   */
  editingLocale?: SupportedLocale;

  /**
   * Callback when locale changes
   * Required when editingLocale is controlled externally
   */
  onLocaleChange?: (locale: SupportedLocale) => void;

  /**
   * Show field type selector to allow changing field type
   * @default false
   */
  showTypeSelector?: boolean;

  /**
   * Callback when field type changes
   */
  onTypeChange?: (newType: FormField['type']) => void;

  /**
   * Google Drive folder ID for uploading service images
   */
  driveFolderId?: string;
}

/**
 * Field type metadata for type selector
 */
export interface FieldTypeMetadata {
  type: FormField['type'];
  label: string;
  description: string;
  icon?: string;
  category: 'basic' | 'advanced' | 'special';
}

/**
 * Field type categories for organized selection
 */
export const FIELD_TYPE_CATEGORIES: Record<
  'basic' | 'advanced' | 'special',
  FieldTypeMetadata[]
> = {
  basic: [
    {
      type: 'text',
      label: 'Text',
      description: 'Single-line text input',
      category: 'basic',
    },
    {
      type: 'textarea',
      label: 'Textarea',
      description: 'Multi-line text input',
      category: 'basic',
    },
    {
      type: 'number',
      label: 'Number',
      description: 'Numeric input with validation',
      category: 'basic',
    },
    {
      type: 'email',
      label: 'Email',
      description: 'Email address with validation',
      category: 'basic',
    },
    {
      type: 'phone',
      label: 'Phone',
      description: 'Phone number with formatting',
      category: 'basic',
    },
  ],
  advanced: [
    {
      type: 'select',
      label: 'Select',
      description: 'Dropdown selection',
      category: 'advanced',
    },
    {
      type: 'radio',
      label: 'Radio',
      description: 'Radio button group',
      category: 'advanced',
    },
    {
      type: 'toggle',
      label: 'Toggle',
      description: 'Toggle switch or checkbox',
      category: 'advanced',
    },
    {
      type: 'date',
      label: 'Date',
      description: 'Date picker',
      category: 'advanced',
    },
    {
      type: 'time',
      label: 'Time',
      description: 'Time picker',
      category: 'advanced',
    },
    {
      type: 'datetime',
      label: 'Date & Time',
      description: 'Date and time picker',
      category: 'advanced',
    },
  ],
  special: [
    {
      type: 'range',
      label: 'Range',
      description: 'Slider for numeric range',
      category: 'special',
    },
    {
      type: 'multiselect',
      label: 'Multi-Select',
      description: 'Multiple option selection',
      category: 'special',
    },
    {
      type: 'imageSelect',
      label: 'Image Select',
      description: 'Single image selection',
      category: 'special',
    },
    {
      type: 'imageSelectMulti',
      label: 'Image Multi-Select',
      description: 'Multiple image selection',
      category: 'special',
    },
    {
      type: 'map',
      label: 'Map',
      description: 'Location picker with map',
      category: 'special',
    },
    {
      type: 'group',
      label: 'Group',
      description: 'Group of nested fields',
      category: 'special',
    },
  ],
};
