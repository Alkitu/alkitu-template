import { z } from 'zod';
import { paginatedSortingSchema } from './common.schemas';

/**
 * Location tRPC Schemas
 *
 * All Zod validation schemas for work location-related tRPC endpoints.
 */

export const getAllLocationsSchema = z
  .object({
    userId: z.string().optional(),
  })
  .merge(paginatedSortingSchema)
  .optional();

export const getLocationByIdSchema = z.object({ id: z.string() });

export const getUserLocationsSchema = z.object({ userId: z.string() });
