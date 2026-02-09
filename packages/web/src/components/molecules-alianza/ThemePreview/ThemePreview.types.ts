import type { ThemeData } from '@/components/features/theme-editor-3.0/core/types/theme.types';

/**
 * ThemePreview Component Types
 *
 * Props for the ThemePreview molecule component.
 */

export type ThemePreviewSize = 'sm' | 'md' | 'lg';
export type ThemePreviewMode = 'compact' | 'expanded';

export interface ThemePreviewProps {
  /**
   * Theme to preview
   */
  theme?: Partial<ThemeData>;

  /**
   * Size of the preview
   * @default 'md'
   */
  size?: ThemePreviewSize;

  /**
   * Display mode
   * - compact: Only color swatches
   * - expanded: Color swatches + color values
   * @default 'compact'
   */
  mode?: ThemePreviewMode;

  /**
   * Show theme name
   * @default true
   */
  showName?: boolean;

  /**
   * Show theme description
   * @default false
   */
  showDescription?: boolean;

  /**
   * Show interactive elements preview (buttons, badges)
   * @default true
   */
  showInteractivePreview?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Callback when preview is clicked
   */
  onClick?: () => void;

  /**
   * Whether this theme is currently active
   * @default false
   */
  isActive?: boolean;

  /**
   * Enable copy color value to clipboard
   * @default true
   */
  enableCopy?: boolean;

  /**
   * Color format to display
   * @default 'hex'
   */
  colorFormat?: 'hex' | 'rgb' | 'hsl' | 'oklch';

  /**
   * Theme mode to display
   * @default 'light'
   */
  themeMode?: 'light' | 'dark';

  /**
   * Show default badge if theme is default
   * @default true
   */
  showDefaultBadge?: boolean;

  /**
   * Custom style overrides
   */
  style?: React.CSSProperties;
}

export interface ColorSwatchProps {
  /**
   * Color name/label
   */
  name: string;

  /**
   * Color value (CSS color string)
   */
  value: string;

  /**
   * Additional color values for expanded mode
   */
  hexValue?: string;
  rgbValue?: string;
  hslValue?: string;
  oklchValue?: string;

  /**
   * Enable copy functionality
   */
  enableCopy?: boolean;

  /**
   * Display format
   */
  format?: 'hex' | 'rgb' | 'hsl' | 'oklch';

  /**
   * Size of the swatch
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;
}
