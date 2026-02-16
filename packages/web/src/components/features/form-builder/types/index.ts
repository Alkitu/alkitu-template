/**
 * Form Builder Types
 *
 * Re-exports types from @alkitu/shared with feature-specific additions
 */

// Re-export all form template types from shared package
export * from '@alkitu/shared';

// Feature-specific UI types (not in shared package)
export interface FormBuilderProps {
  initialSettings?: FormSettings;
  onSave: (settings: FormSettings) => void | Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export interface FormPreviewProps {
  settings: FormSettings;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
  showDeviceSwitcher?: boolean;
}

export interface FieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  supportedLocales?: SupportedLocale[];
  defaultLocale?: SupportedLocale;
}

export interface ValidationRuleBuilderProps {
  field: FormField;
  onChange: (field: FormField) => void;
}

export interface FormMetadataEditorProps {
  settings: FormSettings;
  onChange: (settings: FormSettings) => void;
}

export interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (images: ImageData[]) => void;
  maxSelection?: number;
  selectedImages?: ImageData[];
}

// Import types from shared for convenience
import type {
  FormSettings,
  FormField,
  SupportedLocale,
  ImageData,
} from '@alkitu/shared';
