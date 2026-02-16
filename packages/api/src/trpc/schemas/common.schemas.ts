import { z } from 'zod';

/**
 * Shared Pagination Schema
 *
 * Reusable pagination input schema for all tRPC endpoints that need pagination.
 * Enforces consistent pagination behavior across the API.
 *
 * Defaults:
 * - page: 1 (first page)
 * - limit: 20 (20 items per page)
 *
 * Constraints:
 * - page: minimum 1
 * - limit: minimum 1, maximum 100 (prevents performance issues)
 *
 * @example
 * ```typescript
 * const myEndpoint = protectedProcedure
 *   .input(paginationSchema.merge(z.object({ search: z.string().optional() })))
 *   .query(async ({ input }) => {
 *     const skip = (input.page - 1) * input.limit;
 *     // ... use skip and input.limit in query
 *   });
 * ```
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

/**
 * Shared Sorting Schema
 *
 * Reusable sorting input schema for all tRPC endpoints that need sorting.
 * Enforces consistent sorting behavior across the API.
 *
 * Defaults:
 * - sortBy: 'createdAt' (most recent first by default when combined with sortOrder)
 * - sortOrder: 'desc' (descending order)
 *
 * @example
 * ```typescript
 * const myEndpoint = protectedProcedure
 *   .input(sortingSchema)
 *   .query(async ({ input }) => {
 *     return prisma.model.findMany({
 *       orderBy: { [input.sortBy]: input.sortOrder }
 *     });
 *   });
 * ```
 */
export const sortingSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Combined Pagination + Sorting Schema
 *
 * Most common use case: endpoints that need both pagination and sorting.
 * This is the merged version of paginationSchema and sortingSchema.
 *
 * @example
 * ```typescript
 * const getAllItems = protectedProcedure
 *   .input(paginatedSortingSchema)
 *   .query(async ({ input }) => {
 *     const { page, limit, sortBy, sortOrder } = input;
 *     const skip = (page - 1) * limit;
 *
 *     const [items, total] = await Promise.all([
 *       prisma.item.findMany({
 *         skip,
 *         take: limit,
 *         orderBy: { [sortBy]: sortOrder },
 *       }),
 *       prisma.item.count(),
 *     ]);
 *
 *     return createPaginatedResponse(items, { page, limit, total });
 *   });
 * ```
 */
export const paginatedSortingSchema = paginationSchema.merge(sortingSchema);

/**
 * Type Inference Helpers
 * Use these for type-safe pagination/sorting input handling
 */
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortingInput = z.infer<typeof sortingSchema>;
export type PaginatedSortingInput = z.infer<typeof paginatedSortingSchema>;

/**
 * Pagination Response Metadata
 *
 * Standard pagination metadata that should be returned by all paginated endpoints.
 * Provides clients with all information needed to build pagination UI.
 */
export interface PaginationMeta {
  page: number; // Current page number (1-indexed)
  limit: number; // Items per page
  total: number; // Total number of items across all pages
  totalPages: number; // Total number of pages
  hasNext: boolean; // Whether there's a next page
  hasPrev: boolean; // Whether there's a previous page
}

/**
 * Generic Paginated Response
 *
 * Standard structure for all paginated API responses.
 * Ensures consistency across all endpoints.
 *
 * @template T - The type of items being paginated
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Helper function to create paginated response
 *
 * Automatically calculates all pagination metadata from input parameters.
 * Use this to ensure consistent pagination response format.
 *
 * @param items - The array of items for the current page
 * @param params - Pagination parameters (page, limit, total)
 * @returns Formatted paginated response with metadata
 *
 * @example
 * ```typescript
 * const items = await prisma.user.findMany({ skip, take: limit });
 * const total = await prisma.user.count();
 *
 * return createPaginatedResponse(items, {
 *   page: input.page,
 *   limit: input.limit,
 *   total
 * });
 * ```
 */
export function createPaginatedResponse<T>(
  items: T[],
  params: Pick<PaginationMeta, 'page' | 'limit' | 'total'>,
): PaginatedResponse<T> {
  const { page, limit, total } = params;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Calculate skip/take for Prisma queries
 *
 * Converts page-based pagination to offset-based (skip/take) for Prisma.
 *
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Object with skip and take values for Prisma query
 *
 * @example
 * ```typescript
 * const { skip, take } = calculatePagination(input.page, input.limit);
 *
 * const items = await prisma.user.findMany({
 *   skip,
 *   take,
 *   // ... other query options
 * });
 * ```
 */
export function calculatePagination(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
