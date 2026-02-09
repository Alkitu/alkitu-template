/**
 * ServiceStatsCard Types
 *
 * Type definitions for the ServiceStatsCard atom component.
 */

/**
 * Visual variant for the service stats card
 */
export type ServiceStatsCardVariant = 'default' | 'accent';

/**
 * Props for the ServiceStatsCard component
 */
export interface ServiceStatsCardProps {
  /**
   * The label text displayed above the value
   * @example "Servicios", "Categorías"
   */
  label: string;

  /**
   * The numeric value to display
   * @example 24, 150, 0
   */
  value: number;

  /**
   * Visual variant for the card
   * - 'default': Uses foreground color for value
   * - 'accent': Uses primary color for value (highlighted)
   * @default 'default'
   */
  variant?: ServiceStatsCardVariant;

  /**
   * Additional CSS classes to apply to the card container
   */
  className?: string;
}
