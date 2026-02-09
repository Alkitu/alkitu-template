/**
 * UserPagination Types
 *
 * Type definitions for the UserPagination molecule component.
 */

export interface UserPaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;

  /** Total number of pages available */
  totalPages: number;

  /** Total number of items in the dataset */
  totalItems: number;

  /** Number of items displayed per page */
  pageSize: number;

  /** Callback fired when page changes */
  onPageChange: (page: number) => void;

  /** Callback fired when page size changes */
  onPageSizeChange: (size: number) => void;

  /** Optional CSS class name */
  className?: string;

  /** Available page size options for the select dropdown */
  pageSizeOptions?: number[];
}
