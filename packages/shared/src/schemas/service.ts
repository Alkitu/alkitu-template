import { z } from 'zod';

/**
 * Service Zod Schemas (ALI-118 + Form Template Migration)
 */

/**
 * Create service schema
 */
export const CreateServiceSchema = z.object({
  name: z
    .string()
    .min(2, 'Service name must be at least 2 characters long')
    .max(200, 'Service name cannot exceed 200 characters')
    .trim(),
  categoryId: z.string().min(1, 'Category ID is required'),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional(),
  iconColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').default('#000000').optional(),
  formTemplateIds: z.array(z.string()).default([]),
});

/**
 * Update service schema
 */
export const UpdateServiceSchema = z.object({
  name: z
    .string()
    .min(2, 'Service name must be at least 2 characters long')
    .max(200, 'Service name cannot exceed 200 characters')
    .trim()
    .optional(),
  categoryId: z.string().min(1, 'Category ID is required').optional(),
  thumbnail: z
    .string()
    .url('Thumbnail must be a valid URL')
    .nullable()
    .optional(),
  iconColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').optional(),
  formTemplateIds: z.array(z.string()).optional(),
});

/**
 * Service ID param schema
 */
export const ServiceIdSchema = z.string().min(1, 'Service ID is required');

/**
 * Service query filters schema
 */
export const ServiceQuerySchema = z.object({
  categoryId: z.string().optional(),
});

/**
 * Inferred types from schemas (types exported from types/service.ts to avoid duplicates)
 */
// export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
// export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
export type ServiceIdInput = z.infer<typeof ServiceIdSchema>;
export type ServiceQueryInput = z.infer<typeof ServiceQuerySchema>;
