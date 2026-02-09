/**
 * Pagination Molecule
 *
 * Advanced pagination control for tables and data lists with multiple variants.
 *
 * @example
 * ```tsx
 * import { Pagination, PaginationPresets } from '@/components/molecules-alianza/Pagination';
 *
 * // Basic usage
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={handlePageChange}
 * />
 *
 * // With preset
 * <Pagination
 *   {...PaginationPresets.detailed}
 *   currentPage={5}
 *   totalPages={20}
 *   totalItems={200}
 *   pageSize={10}
 *   onPageChange={handlePageChange}
 *   onPageSizeChange={handlePageSizeChange}
 * />
 * ```
 */

export { Pagination, PaginationPresets } from './Pagination';
export type { PaginationProps, PaginationVariant, PaginationPresetConfig } from './Pagination.types';
export { default } from './Pagination';
