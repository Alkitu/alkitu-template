import type { CSSProperties, HTMLAttributes } from 'react';

/**
 * Size options for CustomIcon
 */
export type CustomIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variant options for CustomIcon
 */
export type CustomIconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'destructive'
  | 'warning'
  | 'success';

/**
 * Props for CustomIcon component
 */
export interface CustomIconProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * SVG string content to render
   * Must be valid SVG markup
   */
  svg: string;

  /**
   * Icon size preset
   * Maps to pixel values: xs=12, sm=16, md=20, lg=24, xl=28, 2xl=32
   * @default 'md'
   */
  size?: CustomIconSize;

  /**
   * Custom size in pixels (overrides size preset)
   * When provided, overrides the size preset
   */
  customSize?: number;

  /**
   * Color variant using theme CSS variables
   * Uses text-{variant} classes for theme integration
   * @default 'default'
   */
  variant?: CustomIconVariant;

  /**
   * Custom color (overrides variant)
   * Applies direct color value, bypassing theme variables
   * Use sparingly - prefer variant for theme consistency
   */
  customColor?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: CSSProperties;

  /**
   * Click handler
   * When provided, component becomes interactive (cursor: pointer)
   */
  onClick?: () => void;

  /**
   * Accessibility label
   * Required when onClick is provided
   */
  'aria-label'?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
