import { z } from 'zod';

/**
 * FormTemplate tRPC Schemas
 *
 * All Zod validation schemas for form template-related tRPC endpoints.
 */

export const createFormTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  formSettings: z.record(z.string(), z.unknown()),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  serviceIds: z.array(z.string()).optional(),
});

export const updateFormTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  formSettings: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  serviceIds: z.array(z.string()).optional(),
});

export const deleteFormTemplateSchema = z.object({ id: z.string() });

export const getFormTemplateByIdSchema = z.object({ id: z.string() });

export const getAllFormTemplatesSchema = z
  .object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(20),
    search: z.string().optional(),
    category: z.string().optional(),
    isActive: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .optional();

export const linkToServiceSchema = z.object({
  templateId: z.string(),
  serviceId: z.string(),
});

export const unlinkFromServiceSchema = z.object({
  templateId: z.string(),
  serviceId: z.string(),
});

export const createVersionSchema = z.object({
  id: z.string(),
  changes: z.string().optional(),
});

export const getVersionHistorySchema = z.object({ id: z.string() });
