import { z } from 'zod';
import {
  paginatedSortingSchema,
} from './common.schemas';

/**
 * Service tRPC Schemas
 *
 * All Zod validation schemas for service-related tRPC endpoints.
 */

export const getAllServicesSchema = paginatedSortingSchema
  .extend({
    statusFilter: z.enum(['all', 'active', 'inactive']).default('active'),
  })
  .optional();

export const getServiceByIdSchema = z.object({ id: z.string() });

export const getServicesByCategorySchema = z.object({
  categoryId: z.string(),
});

export const serviceCodeSchema = z
  .string()
  .min(3)
  .max(6)
  .regex(/^[A-Z0-9]+$/, 'Code must be 3-6 uppercase alphanumeric characters')
  .optional();

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string(),
  formTemplateIds: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  iconColor: z.string().optional().default('#000000'),
  isActive: z.boolean().optional().default(true),
  code: serviceCodeSchema,
});

export const updateServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').optional(),
  categoryId: z.string().optional(),
  formTemplateIds: z.array(z.string()).optional(),
  thumbnail: z.string().nullish(),
  iconColor: z.string().nullish(),
  isActive: z.boolean().optional(),
  code: serviceCodeSchema.or(z.null()),
});

export const deleteServiceSchema = z.object({ id: z.string() });

export const getServiceRequestStatsSchema = z.object({}).optional();
