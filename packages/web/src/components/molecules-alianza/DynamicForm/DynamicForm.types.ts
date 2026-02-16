import type { UseFormRegister, FieldErrors } from 'react-hook-form';

/**
 * Field types supported by the dynamic form renderer
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

/**
 * Field option for select, radio, and checkboxGroup
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Legacy field option format (string array)
 * Supported for backward compatibility but not recommended for new code
 */
export type LegacyFieldOption = string;

/**
 * Combined field option type (supports both current and legacy formats)
 */
export type FieldOptionType = FieldOption | LegacyFieldOption;

/**
 * Validation rules for fields
 */
export interface FieldValidation {
  // Text/Textarea validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Number validation
  min?: number;
  max?: number;
  integer?: boolean;

  // File validation
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];

  // Checkbox group validation
  minSelected?: number;
  maxSelected?: number;
}

/**
 * Dynamic field definition from requestTemplate
 */
export interface DynamicField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOptionType[]; // Supports both FieldOption and string (legacy)
  validation?: FieldValidation;
}

/**
 * DynamicForm Props
 *
 * Molecule component for rendering individual dynamic form fields.
 * Supports 10 field types with validation and accessibility features.
 */
export interface DynamicFormProps {
  /** Field configuration */
  field: DynamicField;

  /** React Hook Form register function */
  register: UseFormRegister<any>;

  /** Form errors */
  errors: FieldErrors<any>;

  /** Current field value (for controlled components) */
  value?: any;

  /** onChange handler for controlled components */
  onChange?: (value: any) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;
}
