/**
 * QuickActionCard - Type definitions
 * Atomic Design: Molecule
 *
 * PHASE 2 CONSOLIDATION - Enhanced from Standard implementation
 * Adds: loading states, disabled states, badges, keyboard navigation, onClick handlers
 */

import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Icon color variants for QuickActionCard
 */
export type QuickActionIconColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * Card variant styles
 */
export type QuickActionVariant = 'default' | 'primary';

/**
 * Props for QuickActionCard component
 */
export interface QuickActionCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Lucide icon component to display
   * @required
   */
  icon: LucideIcon;

  /**
   * Main action label/title
   * @required
   */
  label: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional subtitle (above label)
   * @deprecated Use description instead for better semantics
   */
  subtitle?: string;

  /**
   * Navigation link (when used as link)
   * If provided, renders as Next.js Link
   */
  href?: string;

  /**
   * Click handler (when used as button)
   * Cannot be used together with href
   */
  onClick?: () => void;

  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: QuickActionVariant;

  /**
   * Icon color variant
   * @default 'primary'
   */
  iconColor?: QuickActionIconColor;

  /**
   * Custom icon color class (overrides iconColor)
   * @example "text-blue-600 dark:text-blue-400"
   */
  customIconColor?: string;

  /**
   * Optional badge to display (count or status)
   * Can be a number, string, or React element
   */
  badge?: ReactNode;

  /**
   * Badge position
   * @default 'top-right'
   */
  badgePosition?: 'top-right' | 'top-left';

  /**
   * Loading state
   * Shows spinner instead of icon
   * @default false
   */
  loading?: boolean;

  /**
   * Disabled state
   * Prevents interaction and reduces opacity
   * @default false
   */
  disabled?: boolean;

  /**
   * Render as child component (polymorphic)
   * Uses Radix UI Slot for composition
   * @default false
   */
  asChild?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;

  /**
   * Accessibility label
   * Auto-generated from label if not provided
   */
  'aria-label'?: string;

  /**
   * Whether the action is disabled for accessibility
   */
  'aria-disabled'?: boolean;
}
