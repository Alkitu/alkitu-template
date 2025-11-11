import type { ReactNode } from 'react';

export type ServiceStatus = 'active' | 'inactive' | 'pending' | 'maintenance';

export interface ServiceCardProps {
  /**
   * Unique identifier for the service
   */
  id: string;

  /**
   * Service title
   */
  title: string;

  /**
   * Service description
   */
  description: string;

  /**
   * Current status of the service
   */
  status: ServiceStatus;

  /**
   * Service category
   */
  category?: string;

  /**
   * Pricing information
   */
  pricing?: string;

  /**
   * Service image/icon URL
   */
  image?: string;

  /**
   * Custom actions or buttons
   */
  actions?: ReactNode;

  /**
   * Click handler for the card
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;
}