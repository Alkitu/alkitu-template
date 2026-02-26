import { z } from 'zod';
import {
  templateTriggerSchema,
  requestStatusSchema,
  updateEmailTemplateSchema,
} from '@alkitu/shared';

/**
 * Email Template tRPC Schemas
 *
 * Schemas specific to tRPC endpoint inputs.
 * Core schemas (create, update, trigger, etc.) are imported from @alkitu/shared.
 */

export const getAllEmailTemplatesSchema = z.object({
  trigger: templateTriggerSchema.optional(),
  status: requestStatusSchema.optional(),
  active: z.boolean().optional(),
  search: z.string().optional(),
});

export const getEmailTemplateByIdSchema = z.object({ id: z.string() });

export const getByTriggerSchema = z.object({
  trigger: templateTriggerSchema,
  status: requestStatusSchema.optional(),
});

export const updateEmailTemplateInputSchema = z.object({
  id: z.string(),
  data: updateEmailTemplateSchema,
});

export const deleteEmailTemplateSchema = z.object({ id: z.string() });

export const previewTemplateSchema = z.object({
  templateId: z.string(),
  data: z.object({
    request: z.object({
      id: z.string(),
      status: z.string(),
      executionDateTime: z.union([z.string(), z.date()]),
      createdAt: z.union([z.string(), z.date()]),
      completedAt: z.union([z.string(), z.date()]).nullable().optional(),
    }),
    user: z.object({
      firstname: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      phone: z.string().nullable().optional(),
    }),
    service: z.object({
      name: z.string(),
      category: z.string(),
    }),
    location: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }),
    employee: z
      .object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string().email(),
        phone: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    templateResponses: z.record(z.unknown()).nullable().optional(),
  }),
});

export const sendAllTestEmailsSchema = z.object({
  recipient: z.string().email(),
});
