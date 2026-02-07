export type RequestFilterType = 'all' | 'pending' | 'ongoing' | 'completed' | 'cancelled';

export interface RequestFilterButtonsProps {
  /**
   * Currently active filter
   */
  activeFilter: RequestFilterType;

  /**
   * Callback when filter changes
   */
  onFilterChange: (filter: RequestFilterType) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
