import { z } from 'zod';

/**
 * Category tRPC Schemas
 *
 * All Zod validation schemas for category-related tRPC endpoints.
 */

export const getAllCategoriesSchema = z.object({}).optional();
export const getCategoriesWithStatsSchema = z.object({}).optional();

export const getCategoryByIdSchema = z.object({ id: z.string() });

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  createdBy: z.string().optional(),
});

export const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  updatedBy: z.string().optional(),
});

export const deleteCategorySchema = z.object({ id: z.string() });
