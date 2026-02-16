/**
 * FormBuilder Types
 * Defines the structure for dynamic form templates
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'date'
  | 'time'
  | 'file';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
}

export interface TemplateField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
  order?: number;
}

export interface RequestTemplate {
  version: string;
  fields: TemplateField[];
}

export interface FormBuilderProps {
  initialTemplate?: RequestTemplate;
  onSave: (template: RequestTemplate) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export interface FieldEditorProps {
  field: TemplateField | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: TemplateField) => void;
}

export interface FieldsListProps {
  fields: TemplateField[];
  onEdit: (fieldId: string) => void;
  onDelete: (fieldId: string) => void;
  onAdd: () => void;
}

export interface TemplatePreviewProps {
  template: RequestTemplate;
}
