import type { CSSProperties, HTMLAttributes } from 'react';

/**
 * Size options for Spacer component
 */
export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Direction options for Spacer component
 */
export type SpacerDirection = 'horizontal' | 'vertical' | 'both';

/**
 * Props for Spacer component
 */
export interface SpacerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Size of the spacer based on spacing system hierarchy
   * @default 'md'
   */
  size?: SpacerSize;

  /**
   * Direction of spacing
   * @default 'vertical'
   */
  direction?: SpacerDirection;

  /**
   * Custom spacing value (overrides size)
   * Accepts any valid CSS spacing value (px, rem, em, etc.)
   * @example '32px', '2rem', '1.5em'
   */
  spacing?: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: CSSProperties;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
