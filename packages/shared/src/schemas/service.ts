import { z } from 'zod';
import { RequestTemplateSchema } from './request-template';

/**
 * Service Zod Schemas (ALI-118)
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
  requestTemplate: RequestTemplateSchema,
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
  requestTemplate: RequestTemplateSchema.optional(),
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
 * Inferred types from schemas
 */
export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
export type ServiceIdInput = z.infer<typeof ServiceIdSchema>;
export type ServiceQueryInput = z.infer<typeof ServiceQuerySchema>;
