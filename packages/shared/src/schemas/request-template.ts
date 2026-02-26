import { z } from 'zod';

/**
 * Request Template Zod Schemas (ALI-118)
 */

/**
 * Valid field types
 */
export const FIELD_TYPES = [
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

/**
 * Field option schema
 */
export const FieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

/**
 * Field validation schema
 */
export const FieldValidationSchema = z.object({
  // Text/Textarea
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),
  pattern: z.string().optional(),

  // Number
  min: z.number().optional(),
  max: z.number().optional(),
  integer: z.boolean().optional(),

  // CheckboxGroup
  minSelected: z.number().int().positive().optional(),
  maxSelected: z.number().int().positive().optional(),

  // Date
  minDate: z.string().optional(),
  maxDate: z.string().optional(),

  // File
  maxFiles: z.number().int().positive().optional(),
  maxSizeMB: z.number().positive().optional(),
  acceptedTypes: z.array(z.string()).optional(),
}).optional();

/**
 * Request template field schema
 */
export const RequestTemplateFieldSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9_]+$/, 'Field ID can only contain lowercase letters, numbers, and underscores'),
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean(),
  validation: FieldValidationSchema,
  options: z.array(FieldOptionSchema).optional(),
  defaultValue: z.unknown().optional(),
});

/**
 * Request template schema
 */
export const RequestTemplateSchema = z.object({
  version: z.string().min(1),
  fields: z
    .array(RequestTemplateFieldSchema)
    .min(1, 'Template must have at least one field')
    .max(50, 'Template cannot have more than 50 fields'),
});

/**
 * Inferred types from schemas
 */
export type FieldOptionInput = z.infer<typeof FieldOptionSchema>;
export type FieldValidationInput = z.infer<typeof FieldValidationSchema>;
export type RequestTemplateFieldInput = z.infer<typeof RequestTemplateFieldSchema>;
export type RequestTemplateInput = z.infer<typeof RequestTemplateSchema>;
// TemplateResponsesInput inferred from request.ts TemplateResponsesSchema
