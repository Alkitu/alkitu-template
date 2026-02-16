/// ALI-121: Email Templates & Automation - Zod Validation Schemas (Unified System)

import { z } from 'zod';

// Enums
export const templateTriggerSchema = z.enum(
  ['ON_REQUEST_CREATED', 'ON_STATUS_CHANGED', 'ON_AUTH_EVENT', 'ON_NOTIFICATION', 'ON_MANUAL'],
  {
    required_error: 'Trigger is required',
    invalid_type_error: 'Invalid trigger type',
  },
);

export const requestStatusSchema = z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED']);

export const templateCategorySchema = z.enum(['REQUEST', 'AUTH', 'NOTIFICATION', 'MARKETING']);

export const localizedEmailContentSchema = z.object({
  locale: z.string().min(2).max(5),
  subject: z.string().min(1),
  body: z.string().min(1),
});

// Create EmailTemplate Schema
export const createEmailTemplateSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(
      /^[a-z][a-z0-9_]*$/,
      'Name must start with a letter and contain only lowercase letters, numbers, and underscores'
    ),

  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be at most 200 characters'),

  body: z
    .string()
    .min(10, 'Body must be at least 10 characters')
    .max(50000, 'Body must be at most 50000 characters'),

  trigger: templateTriggerSchema,

  status: requestStatusSchema.nullable().optional(),

  active: z.boolean().default(true).optional(),
})
.refine(
  (data) => {
    // If trigger is ON_STATUS_CHANGED, status must be provided
    if (data.trigger === 'ON_STATUS_CHANGED') {
      return data.status !== null && data.status !== undefined;
    }
    // If trigger is ON_REQUEST_CREATED, status must be null or undefined
    if (data.trigger === 'ON_REQUEST_CREATED') {
      return data.status === null || data.status === undefined;
    }
    return true;
  },
  {
    message: 'Status is required when trigger is ON_STATUS_CHANGED and must be null for ON_REQUEST_CREATED',
    path: ['status'],
  }
);

// Update EmailTemplate Schema (partial of create, cannot change trigger or status)
export const updateEmailTemplateSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(
      /^[a-z][a-z0-9_]*$/,
      'Name must start with a letter and contain only lowercase letters, numbers, and underscores'
    )
    .optional(),

  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be at most 200 characters')
    .optional(),

  body: z
    .string()
    .min(10, 'Body must be at least 10 characters')
    .max(50000, 'Body must be at most 50000 characters')
    .optional(),

  active: z.boolean().optional(),

  description: z.string().max(500).optional(),
});

// Send Test Email Schema
export const sendTestEmailSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),

  recipient: z
    .string()
    .email('Invalid email address')
    .min(1, 'Recipient email is required'),

  requestId: z.string().optional(),

  testData: z.object({
    request: z.object({
      id: z.string(),
      status: z.string(),
      executionDateTime: z.union([z.string(), z.date()]),
      createdAt: z.union([z.string(), z.date()]),
      completedAt: z.union([z.string(), z.date()]).nullable().optional(),
    }).optional(),

    user: z.object({
      firstname: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      phone: z.string().nullable().optional(),
    }).optional(),

    service: z.object({
      name: z.string(),
      category: z.string(),
    }).optional(),

    location: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    }).optional(),

    employee: z.object({
      firstname: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      phone: z.string().nullable().optional(),
    }).nullable().optional(),

    templateResponses: z.record(z.any()).nullable().optional(),
  }).optional(),
});

// Filter EmailTemplates Schema
export const filterEmailTemplatesSchema = z.object({
  trigger: templateTriggerSchema.optional(),
  status: requestStatusSchema.optional(),
  active: z.boolean().optional(),
  search: z.string().optional(), // Search by name or subject
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(20).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

// --- Unified system schemas ---

/** Schema for resetting a template to its default content */
export const resetToDefaultSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
});

/** Schema for updating a localized version of a template */
export const updateLocalizationSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  locale: z.string().min(2).max(5),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  body: z.string().min(10, 'Body must be at least 10 characters').max(50000),
});

/** Schema for getting variables by category */
export const getVariablesByCategorySchema = z.object({
  category: templateCategorySchema,
});

// Type exports
export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
export type SendTestEmailInput = z.infer<typeof sendTestEmailSchema>;
export type FilterEmailTemplatesInput = z.infer<typeof filterEmailTemplatesSchema>;
export type ResetToDefaultInput = z.infer<typeof resetToDefaultSchema>;
export type UpdateLocalizationInput = z.infer<typeof updateLocalizationSchema>;
export type GetVariablesByCategoryInput = z.infer<typeof getVariablesByCategorySchema>;
