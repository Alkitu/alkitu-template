/**
 * FormBuilder Types
 *
 * Type definitions for the main FormBuilder organism component
 */

import type { FormSettings, FormField, SupportedLocale } from '../../types';

/**
 * Props for the FormBuilder component
 */
export interface FormBuilderProps {
  /**
   * Current form settings including fields, metadata, and configuration
   */
  formSettings: FormSettings;

  /**
   * Callback fired when form settings change
   * @param formSettings - Updated form settings
   */
  onChange: (formSettings: FormSettings) => void;

  /**
   * List of supported locales for the form (default: ['en'])
   */
  supportedLocales?: SupportedLocale[];

  /**
   * Default locale for the form (default: 'en')
   */
  defaultLocale?: SupportedLocale;

  /**
   * Google Drive folder ID for uploading service images.
   * When provided, ImagePickerModal uploads to this folder instead of the root.
   */
  driveFolderId?: string;
}

/**
 * Props for the FieldItem component (internal)
 */
export interface FieldItemProps {
  field: FormField;
  index: number;
  isCollapsed: boolean;
  isDragging: boolean;
  dropTarget: DropTarget | null;
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
  editingLocale: SupportedLocale;
  onToggleCollapse: (fieldId: string) => void;
  onFieldChange: (field: FormField, index: number) => void;
  onDuplicateField: (index: number) => void;
  onRemoveField: (index: number) => void;
  onLocaleChange: (locale: SupportedLocale) => void;
  onDragStart: (e: React.DragEvent, field: FormField, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

/**
 * Drop target information for drag & drop
 */
export interface DropTarget {
  index: number;
  position: 'top' | 'bottom';
}

/**
 * Props for GlobalConfigEditor sub-component (internal)
 */
export interface GlobalConfigEditorProps {
  value: FormSettings;
  onChange: (value: Partial<FormSettings>) => void;
  editingLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
}

/**
 * Props for FinalActionsEditor sub-component (internal)
 */
export interface FinalActionsEditorProps {
  value: FormSettings;
  onChange: (value: Partial<FormSettings>) => void;
  editingLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
}

/**
 * Props for FieldTypeSelector modal (internal)
 */
export interface FieldTypeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (fieldType: string) => void;
  hasGroups: boolean;
}

/**
 * Props for LocaleSettings tab (internal)
 */
export interface LocaleSettingsProps {
  value: FormSettings;
  onChange: (value: Partial<FormSettings>) => void;
}

/**
 * Field type categories for field type selector
 */
export type FieldTypeCategory =
  | 'basic'
  | 'choice'
  | 'date-time'
  | 'advanced'
  | 'layout';

/**
 * Field type definition for picker UI
 */
export interface FieldTypeDefinition {
  id: string;
  label: string;
  description: string;
  category: FieldTypeCategory;
  icon?: string;
}
