/**
 * Request Template Types
 * Defines the structure for dynamic service request forms (ALI-118)
 */

/**
 * Valid field types for request templates
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
 * Option for select, radio, and checkboxGroup fields
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Validation rules for different field types
 */
export interface FieldValidation {
  // Text/Textarea validation
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern

  // Number validation
  min?: number;
  max?: number;
  integer?: boolean;

  // CheckboxGroup validation
  minSelected?: number;
  maxSelected?: number;

  // Date validation
  minDate?: string; // "today", "+7d", "2025-01-01"
  maxDate?: string;

  // File validation
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[]; // MIME types
}

/**
 * A single field in a request template
 */
export interface RequestTemplateField {
  id: string; // Unique field identifier (lowercase, numbers, underscores)
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: FieldOption[]; // For select, radio, checkboxGroup
  defaultValue?: any;
}

/**
 * Complete request template structure
 */
export interface RequestTemplate {
  version: string;
  fields: RequestTemplateField[];
}

/**
 * Response data collected from a request template
 * Keys are field IDs, values are the user's responses
 */
export type TemplateResponses = Record<string, any>;

/**
 * Extended field interface with metadata (for admin UI)
 */
export interface RequestTemplateFieldExtended extends RequestTemplateField {
  description?: string; // Admin-facing description
  internalNotes?: string; // Internal notes for admins
}

/**
 * Template with extended metadata (for admin UI)
 */
export interface RequestTemplateExtended {
  version: string;
  fields: RequestTemplateFieldExtended[];
  metadata?: {
    lastModified?: string;
    modifiedBy?: string;
    notes?: string;
  };
}
