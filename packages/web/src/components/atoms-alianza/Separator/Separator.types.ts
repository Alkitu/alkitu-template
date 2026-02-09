import type { HTMLAttributes, CSSProperties } from 'react';

/**
 * Orientation options for Separator
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Size options for Separator
 */
export type SeparatorSize = 'thin' | 'medium' | 'thick';

/**
 * Variant options for Separator
 */
export type SeparatorVariant = 'default' | 'muted' | 'primary' | 'secondary';

/**
 * Border style options for Separator
 */
export type SeparatorBorderStyle = 'solid' | 'dashed' | 'dotted';

/**
 * Props for Separator component
 */
export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the separator
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;

  /**
   * Size/thickness of the separator
   * @default 'thin'
   */
  size?: SeparatorSize;

  /**
   * Length of the separator (primarily for vertical separators)
   * Can be a CSS value like '40px', '2rem', '100%'
   */
  length?: string | number;

  /**
   * Color variant using theme CSS variables
   * @default 'default'
   */
  variant?: SeparatorVariant;

  /**
   * Border style of the separator
   * @default 'solid'
   */
  borderStyle?: SeparatorBorderStyle;

  /**
   * Whether separator has decorative elements
   * When true without label: shows three centered dots
   * When true with label: shows line-label-line layout
   * @default false
   */
  decorative?: boolean;

  /**
   * Custom label for decorative separator
   * Only applies when decorative is true
   */
  label?: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Custom inline styles
   */
  customStyle?: CSSProperties;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
