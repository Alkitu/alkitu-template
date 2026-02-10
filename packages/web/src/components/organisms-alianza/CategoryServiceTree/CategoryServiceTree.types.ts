/**
 * CategoryServiceTree Component Types
 *
 * Organism component that displays hierarchical tree view of Category → Service → Request
 */

export interface CategoryWithServices {
  id: string;
  name: string;
  totalServices: number;
  totalRequests: number;
  services: ServiceWithStats[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ServiceWithStats {
  id: string;
  name: string;
  categoryId: string;
  thumbnail?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  requestStats: {
    total: number;
    byStatus: {
      PENDING: number;
      ONGOING: number;
      COMPLETED: number;
      CANCELLED: number;
    };
  };
}

export interface CategoryServiceTreeProps {
  /**
   * Categories with nested services and request stats
   */
  data: CategoryWithServices[];

  /**
   * Callback when a service is clicked
   */
  onServiceClick?: (serviceId: string) => void;

  /**
   * Callback when a category is clicked
   */
  onCategoryClick?: (categoryId: string) => void;

  /**
   * Initially expanded category IDs
   */
  expandedCategories?: string[];

  /**
   * Whether to show request stats badges
   * @default true
   */
  showStats?: boolean;

  /**
   * Whether data is loading
   * @default false
   */
  isLoading?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;
}
