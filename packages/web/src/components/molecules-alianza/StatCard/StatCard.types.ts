import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BadgeVariant } from '@/components/atoms-alianza/Badge/Badge.types';

/**
 * Trend direction for statistical data
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Variant options for StatCard styling
 */
export type StatCardVariant = 'default' | 'success' | 'warning' | 'error' | 'neutral';

/**
 * Props for StatCard component
 *
 * A statistical information card for displaying key metrics and statistics
 * with trend indicators, icons, and comparison data.
 *
 * Atomic Design: Molecule
 */
export interface StatCardProps {
  /**
   * Label/title for the statistic
   * @example "Total Users"
   */
  label: string;

  /**
   * Primary value to display (large number/text)
   * Supports numbers and strings for formatted values
   * @example 1234 or "$1,234.56" or "1.2K"
   */
  value: number | string;

  /**
   * Icon to display (from lucide-react)
   * @example Users, DollarSign, TrendingUp
   */
  icon: LucideIcon;

  /**
   * Custom color class for the icon
   * @default 'text-primary'
   * @example 'text-blue-500' or 'text-success'
   */
  iconColor?: string;

  /**
   * Subtitle/description text
   * @example "Registered this month"
   */
  subtitle?: string;

  /**
   * Trend indicator text
   * @example "+12% from last month" or "↑ 20%"
   */
  trend?: string;

  /**
   * Trend direction for visual indicator
   * Automatically shows up/down arrows
   */
  trendDirection?: TrendDirection;

  /**
   * Comparison text for context
   * @example "vs last month" or "compared to Q1"
   */
  comparison?: string;

  /**
   * Loading state - shows skeleton
   * @default false
   */
  isLoading?: boolean;

  /**
   * Visual variant for the card
   * @default 'default'
   */
  variant?: StatCardVariant;

  /**
   * Badge to display with the stat
   * Can be a string or a badge variant
   */
  badge?: string;

  /**
   * Badge variant when badge prop is provided
   * @default 'default'
   */
  badgeVariant?: BadgeVariant;

  /**
   * Auto-format large numbers (1000 → 1K, 1000000 → 1M)
   * @default false
   */
  formatNumber?: boolean;

  /**
   * Number of decimal places for formatted numbers
   * @default 1
   */
  decimals?: number;

  /**
   * Click handler for making the card interactive
   */
  onClick?: () => void;

  /**
   * Makes the card focusable and shows hover state
   * Automatically enabled when onClick is provided
   */
  clickable?: boolean;

  /**
   * Mini chart or sparkline element
   * Pass a chart component to display
   */
  chart?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
