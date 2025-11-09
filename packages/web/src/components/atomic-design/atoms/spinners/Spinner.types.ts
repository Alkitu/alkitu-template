import type { HTMLAttributes } from 'react';

/**
 * Size variants for Spinner
 * Consolidated from all implementations
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variants for Spinner
 * Supports full theme color palette
 */
export type SpinnerVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'destructive'
  | 'warning'
  | 'success';

/**
 * Animation speed variants
 */
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

/**
 * Spinner type/style variants
 */
export type SpinnerType = 'circular' | 'dots' | 'pulse';

/**
 * Props for Spinner component
 *
 * PHASE 2 CONSOLIDATION - Merged features:
 * - Size presets + custom size (from theme-editor)
 * - Color variants + custom color (from theme-editor)
 * - Animation speeds (from theme-editor)
 * - Spinner types (from theme-editor)
 * - Label support (from loading-indicator)
 * - ForwardRef support (from ui/spinner)
 * - Theme override (from atomic-design)
 * - Full accessibility (from theme-editor)
 */
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Size preset of the spinner
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Custom size in pixels (overrides size preset)
   * @example 32
   */
  customSize?: number;

  /**
   * Color variant of the spinner
   * Uses theme CSS variables when useSystemColors is true
   * @default 'primary'
   */
  variant?: SpinnerVariant;

  /**
   * Custom color value (overrides variant)
   * Accepts any valid CSS color value
   * @example "oklch(0.7 0.2 200)"
   * @example "#3b82f6"
   */
  customColor?: string;

  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: SpinnerSpeed;

  /**
   * Spinner style type
   * - circular: SVG-based spinning circle (default)
   * - dots: Three animated dots
   * - pulse: Pulsating circle
   * @default 'circular'
   */
  type?: SpinnerType;

  /**
   * Optional label text to display next to spinner
   * Useful for accessibility and user feedback
   * @example "Loading..."
   */
  label?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   * Allows dynamic theming without CSS classes
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors from theme
   * When false, uses currentColor
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Accessibility label
   * Falls back to label prop or "Loading..."
   */
  'aria-label'?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
