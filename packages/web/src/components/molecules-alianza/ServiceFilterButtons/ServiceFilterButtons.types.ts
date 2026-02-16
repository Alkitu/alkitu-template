/**
 * ServiceFilterButtons Types
 *
 * Type definitions for the ServiceFilterButtons molecule component.
 */

/**
 * Available filter types for services
 */
export type ServiceFilterType = 'all' | 'active' | 'inactive';

/**
 * Filter option definition
 */
export interface ServiceFilterOption {
  id: ServiceFilterType;
  label: string;
  count?: number;
  disabled?: boolean;
}

/**
 * Props for the ServiceFilterButtons component
 */
/**
 * Translated labels for service filter
 */
export interface ServiceFilterLabels {
  all: string;
  active: string;
  inactive: string;
  placeholder?: string;
}

export interface ServiceFilterButtonsProps {
  /**
   * Currently active filter
   */
  activeFilter: ServiceFilterType;

  /**
   * Callback when filter changes
   */
  onFilterChange: (filter: ServiceFilterType) => void;

  /**
   * Custom filter options (overrides default)
   */
  filterOptions?: ServiceFilterOption[];

  /**
   * Translated labels (optional, defaults to Spanish)
   */
  labels?: Partial<ServiceFilterLabels>;

  /**
   * Show count badges on filters
   */
  showCounts?: boolean;

  /**
   * Custom counts for each filter
   */
  counts?: Record<ServiceFilterType, number>;

  /**
   * Disable specific filters
   */
  disabledFilters?: ServiceFilterType[];

  /**
   * Allow multiple selection
   * @default false
   */
  multiSelect?: boolean;

  /**
   * Selected filters (for multi-select mode)
   */
  selectedFilters?: ServiceFilterType[];

  /**
   * Show "Clear All" button
   */
  showClearAll?: boolean;

  /**
   * Callback for clear all action
   */
  onClearAll?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Button variant
   */
  variant?: 'default' | 'compact' | 'pill';

  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Responsive behavior
   */
  responsive?: 'wrap' | 'scroll';

  /**
   * ARIA label for the filter group
   */
  'aria-label'?: string;

  /**
   * Disable all filters
   */
  disabled?: boolean;
}
