export type IconVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface IconProps {
  /**
   * Icon name (without 'Icon' suffix)
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
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}