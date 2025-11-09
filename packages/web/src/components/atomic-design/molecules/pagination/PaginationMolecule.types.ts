/**
 * Variant options for PaginationMolecule
 */
export type PaginationVariant = 'default' | 'compact' | 'detailed' | 'simple';

/**
 * Props for PaginationMolecule
 */
export interface PaginationMoleculeProps {
  /**
   * Current active page number
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Visual variant of the pagination
   * @default 'default'
   */
  variant?: PaginationVariant;

  /**
   * Show first/last page navigation buttons
   * @default true
   */
  showFirstLast?: boolean;

  /**
   * Show page size selector
   * @default false
   */
  showPageSize?: boolean;

  /**
   * Current page size
   * @default 10
   */
  pageSize?: number;

  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Available page size options
   * @default [5, 10, 20, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Show total items count
   * @default false
   */
  showTotal?: boolean;

  /**
   * Total number of items (required if showTotal is true)
   */
  totalItems?: number;

  /**
   * Number of page buttons to show on each side of current page
   * @default 1
   */
  siblingCount?: number;

  /**
   * Number of page buttons to show at start and end
   * @default 1
   */
  boundaryCount?: number;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Previous button text (for simple variant)
   * @default 'Previous'
   */
  previousText?: string;

  /**
   * Next button text (for simple variant)
   * @default 'Next'
   */
  nextText?: string;

  /**
   * Page label text (for simple variant)
   * @default 'Page'
   */
  pageLabel?: string;

  /**
   * Of label text (for simple variant)
   * @default 'of'
   */
  ofLabel?: string;

  /**
   * Showing label text (for detailed variant)
   * @default 'Showing'
   */
  showingLabel?: string;

  /**
   * To label text (for detailed variant)
   * @default 'to'
   */
  toLabel?: string;

  /**
   * Results label text (for detailed variant)
   * @default 'results'
   */
  resultsLabel?: string;

  /**
   * Per page label text (for detailed variant)
   * @default 'per page'
   */
  perPageLabel?: string;

  /**
   * Total label text (for detailed variant)
   * @default 'Total:'
   */
  totalLabel?: string;

  /**
   * Pages label text (for detailed variant)
   * @default 'Pages:'
   */
  pagesLabel?: string;
}

/**
 * Preset configuration type
 */
export interface PaginationPresetConfig {
  variant: PaginationVariant;
  showFirstLast: boolean;
  showPageSize: boolean;
  showTotal: boolean;
  siblingCount?: number;
  boundaryCount?: number;
}
