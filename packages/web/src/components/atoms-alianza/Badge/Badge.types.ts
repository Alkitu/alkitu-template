import type {
  ReactNode,
  ReactElement,
  CSSProperties,
  HTMLAttributes,
} from 'react';

/**
 * Badge variant options
 * Consolidated from all implementations:
 * - default, primary, secondary (all versions)
 * - success, warning, error (Theme Editor + Atomic)
 * - destructive (UI badge - alias for error)
 * - outline, ghost (UI badge + Theme Editor)
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'destructive'
  | 'outline'
  | 'ghost';

/**
 * Badge size options
 * Consolidated from Atomic + Theme Editor implementations
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Props for Badge component (PHASE 2 CONSOLIDATION)
 *
 * Merges features from:
 * - ui/badge.tsx (asChild, CVA, data-slot)
 * - atoms/badges/Badge.tsx (sizes, theme override)
 * - theme-editor-3.0/atoms/Badge.tsx (icon, removable, accessibility)
 */
export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'role'> {
  /**
   * Visual variant of the badge
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Size of the badge
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Icon to display on the left side of the badge
   * Accepts any React element (typically from lucide-react)
   * @example <Star /> or <CheckCircle />
   */
  icon?: ReactElement;

  /**
   * Makes the badge removable with an X button
   * @default false
   */
  removable?: boolean;

  /**
   * Callback fired when the remove button is clicked
   * Only used when removable=true
   */
  onRemove?: () => void;

  /**
   * Render badge as a different component (polymorphic)
   * Uses Radix UI Slot for composition
   * @default false
   * @example
   * ```tsx
   * <Badge asChild>
   *   <a href="/profile">Profile</a>
   * </Badge>
   * ```
   */
  asChild?: boolean;

  /**
   * Badge content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   * Allows dynamic theming without CSS classes
   * @example
   * ```tsx
   * <Badge themeOverride={{ '--badge-bg': 'purple' }}>Custom</Badge>
   * ```
   */
  themeOverride?: CSSProperties;

  /**
   * Whether to use system color variables from theme
   * Set to false for custom styling
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * ARIA label for screen readers
   * Auto-generated from children if not provided
   */
  'aria-label'?: string;

  /**
   * ID of element describing the badge
   */
  'aria-describedby'?: string;

  /**
   * ARIA role for the badge
   * @default 'status'
   */
  role?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
