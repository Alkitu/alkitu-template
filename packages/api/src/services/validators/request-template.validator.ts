/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException } from '@nestjs/common';

/**
 * Valid field types for request templates
 * Note: This validator intentionally uses 'any' type for template parameter
 * since it validates unknown JSON input at runtime.
 */
export const VALID_FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'select',
  'radio',
  'checkbox',
  'checkboxGroup',
  'date',
  'time',
  'file',
] as const;

export type FieldType = (typeof VALID_FIELD_TYPES)[number];

/**
 * Request template field interface
 */
export interface RequestTemplateField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation?: Record<string, any>;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

/**
 * Request template structure
 */
export interface RequestTemplate {
  version: string;
  fields: RequestTemplateField[];
}

/**
 * Validates a request template JSON structure
 * @param template - The template object to validate
 * @throws {BadRequestException} If template is invalid
 */
export function validateRequestTemplate(template: any): void {
  // Check if template is an object
  if (!template || typeof template !== 'object') {
    throw new BadRequestException(
      'Request template must be a valid JSON object',
    );
  }

  // Validate version
  if (!template.version || typeof template.version !== 'string') {
    throw new BadRequestException(
      'Request template must have a "version" string field',
    );
  }

  // Validate fields array
  if (!Array.isArray(template.fields)) {
    throw new BadRequestException(
      'Request template must have a "fields" array',
    );
  }

  if (template.fields.length === 0) {
    throw new BadRequestException(
      'Request template must have at least one field',
    );
  }

  if (template.fields.length > 50) {
    throw new BadRequestException(
      'Request template cannot have more than 50 fields',
    );
  }

  // Validate each field
  const fieldIds = new Set<string>();
  template.fields.forEach((field: any, index: number) => {
    validateField(field, index, fieldIds);
  });
}

/**
 * Validates a single field in the template
 * @param field - The field to validate
 * @param index - Field index (for error messages)
 * @param fieldIds - Set of existing field IDs (to check uniqueness)
 * @throws {BadRequestException} If field is invalid
 */
function validateField(field: any, index: number, fieldIds: Set<string>): void {
  const fieldName = `Field ${index + 1}`;

  // Validate ID
  if (!field.id || typeof field.id !== 'string') {
    throw new BadRequestException(
      `${fieldName}: "id" must be a non-empty string`,
    );
  }

  if (!/^[a-z0-9_]+$/.test(field.id)) {
    throw new BadRequestException(
      `${fieldName} (${field.id}): "id" can only contain lowercase letters, numbers, and underscores`,
    );
  }

  if (fieldIds.has(field.id)) {
    throw new BadRequestException(
      `${fieldName} (${field.id}): Duplicate field ID found`,
    );
  }
  fieldIds.add(field.id);

  // Validate type
  if (!VALID_FIELD_TYPES.includes(field.type)) {
    throw new BadRequestException(
      `${fieldName} (${field.id}): Invalid field type "${field.type}". Must be one of: ${VALID_FIELD_TYPES.join(', ')}`,
    );
  }

  // Validate label
  if (!field.label || typeof field.label !== 'string') {
    throw new BadRequestException(
      `${fieldName} (${field.id}): "label" must be a non-empty string`,
    );
  }

  // Validate required
  if (typeof field.required !== 'boolean') {
    throw new BadRequestException(
      `${fieldName} (${field.id}): "required" must be a boolean`,
    );
  }

  // Validate optional fields
  if (field.placeholder && typeof field.placeholder !== 'string') {
    throw new BadRequestException(
      `${fieldName} (${field.id}): "placeholder" must be a string`,
    );
  }

  if (field.helpText && typeof field.helpText !== 'string') {
    throw new BadRequestException(
      `${fieldName} (${field.id}): "helpText" must be a string`,
    );
  }

  // Validate options for select/radio/checkboxGroup
  if (['select', 'radio', 'checkboxGroup'].includes(field.type)) {
    if (!Array.isArray(field.options) || field.options.length === 0) {
      throw new BadRequestException(
        `${fieldName} (${field.id}): "${field.type}" type requires a non-empty "options" array`,
      );
    }

    field.options.forEach((option: any, optIndex: number) => {
      if (
        !option ||
        typeof option !== 'object' ||
        !option.value ||
        !option.label
      ) {
        throw new BadRequestException(
          `${fieldName} (${field.id}), Option ${optIndex + 1}: Each option must have "value" and "label" properties`,
        );
      }
    });
  }

  // Validate validation rules if present
  if (field.validation) {
    if (typeof field.validation !== 'object') {
      throw new BadRequestException(
        `${fieldName} (${field.id}): "validation" must be an object`,
      );
    }

    validateFieldValidation(field, fieldName);
  }
}

/**
 * Validates validation rules for a field
 * @param field - The field with validation rules
 * @param fieldName - Field name (for error messages)
 * @throws {BadRequestException} If validation rules are invalid
 */
function validateFieldValidation(field: any, fieldName: string): void {
  const { validation, type, id } = field;

  // Text/Textarea validation
  if (['text', 'textarea'].includes(type)) {
    if (
      validation.minLength !== undefined &&
      typeof validation.minLength !== 'number'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.minLength must be a number`,
      );
    }
    if (
      validation.maxLength !== undefined &&
      typeof validation.maxLength !== 'number'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.maxLength must be a number`,
      );
    }
    if (
      validation.pattern !== undefined &&
      typeof validation.pattern !== 'string'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.pattern must be a string (regex)`,
      );
    }
  }

  // Number validation
  if (type === 'number') {
    if (validation.min !== undefined && typeof validation.min !== 'number') {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.min must be a number`,
      );
    }
    if (validation.max !== undefined && typeof validation.max !== 'number') {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.max must be a number`,
      );
    }
    if (
      validation.integer !== undefined &&
      typeof validation.integer !== 'boolean'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.integer must be a boolean`,
      );
    }
  }

  // File validation
  if (type === 'file') {
    if (
      validation.maxFiles !== undefined &&
      typeof validation.maxFiles !== 'number'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.maxFiles must be a number`,
      );
    }
    if (
      validation.maxSizeMB !== undefined &&
      typeof validation.maxSizeMB !== 'number'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.maxSizeMB must be a number`,
      );
    }
    if (
      validation.acceptedTypes !== undefined &&
      !Array.isArray(validation.acceptedTypes)
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.acceptedTypes must be an array`,
      );
    }
  }

  // CheckboxGroup validation
  if (type === 'checkboxGroup') {
    if (
      validation.minSelected !== undefined &&
      typeof validation.minSelected !== 'number'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.minSelected must be a number`,
      );
    }
    if (
      validation.maxSelected !== undefined &&
      typeof validation.maxSelected !== 'number'
    ) {
      throw new BadRequestException(
        `${fieldName} (${id}): validation.maxSelected must be a number`,
      );
    }
  }
}
