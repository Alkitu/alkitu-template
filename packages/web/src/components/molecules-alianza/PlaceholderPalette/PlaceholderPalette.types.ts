import type { HTMLAttributes } from 'react';

/**
 * Predefined color palette names
 */
export type PaletteName = 'material' | 'tailwind' | 'grayscale' | 'rainbow' | 'custom';

/**
 * Size variants for color swatches
 */
export type PaletteSize = 'sm' | 'md' | 'lg';

/**
 * Color swatch shape
 */
export type SwatchShape = 'square' | 'circle';

/**
 * Individual color data
 */
export interface ColorData {
  /**
   * Color value (hex, rgb, hsl, etc.)
   */
  value: string;

  /**
   * Optional color name/label
   */
  name?: string;

  /**
   * Optional unique identifier
   */
  id?: string;
}

/**
 * Predefined palette configuration
 */
export interface PaletteConfig {
  /**
   * Palette name
   */
  name: string;

  /**
   * Array of colors in the palette
   */
  colors: ColorData[];
}

/**
 * Props for PlaceholderPalette component
 */
export interface PlaceholderPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Predefined palette to use
   * @default 'material'
   */
  palette?: PaletteName;

  /**
   * Custom color array (overrides palette prop)
   */
  colors?: ColorData[];

  /**
   * Currently selected color value
   */
  selectedColor?: string;

  /**
   * Callback when a color is selected
   */
  onSelect?: (color: ColorData) => void;

  /**
   * Size of color swatches
   * @default 'md'
   */
  size?: PaletteSize;

  /**
   * Shape of color swatches
   * @default 'square'
   */
  shape?: SwatchShape;

  /**
   * Whether to show color names
   * @default false
   */
  showColorNames?: boolean;

  /**
   * Whether to show color values (hex, rgb)
   * @default false
   */
  showColorValues?: boolean;

  /**
   * Value format to display
   * @default 'hex'
   */
  valueFormat?: 'hex' | 'rgb' | 'hsl';

  /**
   * Number of columns in grid
   * @default 8
   */
  columns?: number;

  /**
   * Enable copy to clipboard on click
   * @default false
   */
  enableCopy?: boolean;

  /**
   * Whether the palette is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
