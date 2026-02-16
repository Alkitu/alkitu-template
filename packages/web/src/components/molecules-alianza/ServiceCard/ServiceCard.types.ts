import type { HTMLAttributes } from 'react';

/**
 * Service data structure
 */
export interface Service {
  /** Unique service identifier */
  id: string;

  /** Service name/title */
  name: string;

  /** Service description */
  description?: string;

  /** Service category ID */
  categoryId: string;

  /** Service category details */
  category: {
    id: string;
    name: string;
  };

  /** Service thumbnail/image URL */
  thumbnail?: string | null;
  
  /** Service icon color (hex) */
  iconColor?: string | null;

  /** Service price */
  price?: number | null;

  /** Service status */
  status?: 'active' | 'inactive' | 'pending';

  /** Service rating (0-5) */
  rating?: number;

  /** Number of reviews */
  reviewCount?: number;

  /** Request template with form fields */
  requestTemplate?: {
    fields?: Array<{ name: string; type: string }>;
  } | null;

  /** Creation timestamp */
  createdAt: string;

  /** Update timestamp */
  updatedAt: string;
}

/**
 * Visual variants for ServiceCard
 */
export type ServiceCardVariant = 'default' | 'compact' | 'detailed';

/**
 * Props for ServiceCard component
 */
export interface ServiceCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Service data to display
   */
  service: Service;

  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: ServiceCardVariant;

  /**
   * Show edit button
   * @default false
   */
  showEdit?: boolean;

  /**
   * Show delete button
   * @default false
   */
  showDelete?: boolean;

  /**
   * Show view details button
   * @default false
   */
  showViewDetails?: boolean;

  /**
   * Show service image/thumbnail
   * @default true
   */
  showImage?: boolean;

  /**
   * Show service description
   * @default true
   */
  showDescription?: boolean;

  /**
   * Show service price
   * @default true
   */
  showPrice?: boolean;

  /**
   * Show service category
   * @default true
   */
  showCategory?: boolean;

  /**
   * Show service status
   * @default true
   */
  showStatus?: boolean;

  /**
   * Show service rating
   * @default true
   */
  showRating?: boolean;

  /**
   * Show creation date
   * @default false
   */
  showCreatedAt?: boolean;

  /**
   * Show field count from request template
   * @default false
   */
  showFieldCount?: boolean;

  /**
   * Truncate description to N characters
   * @default 100
   */
  descriptionLimit?: number;

  /**
   * Loading state for delete operation
   * @default false
   */
  isDeleting?: boolean;

  /**
   * Loading skeleton state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Callback when edit button is clicked
   */
  onEdit?: (service: Service) => void;

  /**
   * Callback when delete button is clicked
   */
  onDelete?: (service: Service) => void;

  /**
   * Callback when view details button is clicked
   */
  onViewDetails?: (service: Service) => void;

  /**
   * Callback when card is clicked (not on buttons)
   */
  onClick?: (service: Service) => void;

  /**
   * Currency symbol for price display
   * @default '$'
   */
  currencySymbol?: string;

  /**
   * Custom className for the card
   */
  className?: string;
}
