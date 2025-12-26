import { z } from 'zod';

/**
 * Category Zod Schemas (ALI-118)
 */

/**
 * Create category schema
 */
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim(),
});

/**
 * Update category schema
 */
export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim()
    .optional(),
});

/**
 * Category ID param schema
 */
export const CategoryIdSchema = z.string().min(1, 'Category ID is required');

/**
 * Inferred types from schemas (types exported from types/category.ts to avoid duplicates)
 */
// export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
// export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryIdInput = z.infer<typeof CategoryIdSchema>;
