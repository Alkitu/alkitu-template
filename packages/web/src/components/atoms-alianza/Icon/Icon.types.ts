import type { LucideIcon } from 'lucide-react';

export type IconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface IconProps {
  /**
   * Icon name (without 'Icon' suffix) - supports all Lucide icons
   * Examples: 'heart', 'star', 'check', 'chevronDown', etc.
   */
  name: string;

  /**
   * Size of the icon
   * @default 'md'
   */
  size?: IconSize;

  /**
   * Visual variant of the icon
   * @default 'default'
   */
  variant?: IconVariant;

  /**
   * Custom color (overrides variant)
   */
  color?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Position when used within other components
   * @default 'left'
   */
  position?: IconPosition;

  /**
   * Accessibility label
   */
  'aria-label'?: string;

  /**
   * Accessibility - whether the icon is hidden from screen readers
   * Use true for decorative icons
   */
  'aria-hidden'?: boolean;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: React.CSSProperties;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Loading state - shows spinner icon
   * @default false
   */
  loading?: boolean;

  /**
   * Click handler for interactive icons
   */
  onClick?: () => void;

  /**
   * Additional HTML attributes
   */
  role?: string;
  tabIndex?: number;
  'data-testid'?: string;
}

/**
 * Type for Lucide icon components
 */
export type IconComponent = LucideIcon;

/**
 * Size mapping in pixels
 */
export interface IconSizeMap {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Variant to CSS class mapping
 */
export interface IconVariantMap {
  default: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
}
