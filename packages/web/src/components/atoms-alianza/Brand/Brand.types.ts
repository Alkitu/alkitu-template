export type BrandVariant = 'horizontal' | 'vertical' | 'icon-only' | 'text-only' | 'stacked' | 'compact';
export type BrandSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type MonochromeMode = 'white' | 'black' | 'none';

export interface BrandProps {
  /**
   * Visual variant of the brand
   * @default 'horizontal'
   */
  variant?: BrandVariant;

  /**
   * Size of the brand
   * @default 'md'
   */
  size?: BrandSize;

  /**
   * Custom brand name (overrides default)
   */
  brandName?: string;

  /**
   * Custom logo URL
   */
  logoUrl?: string;

  /**
   * Whether to show the tagline
   * @default false
   */
  showTagline?: boolean;

  /**
   * Custom tagline text
   */
  tagline?: string;

  /**
   * Click handler for the brand
   */
  onClick?: () => void;

  /**
   * Whether the brand is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Custom SVG content for the logo (inner HTML)
   */
  customSvg?: string;

  /**
   * Custom primary text color (overrides system color)
   */
  primaryTextColor?: string;

  /**
   * Custom secondary text color (overrides system color)
   */
  secondaryTextColor?: string;

  /**
   * Monochrome mode for SVG icons
   * @default 'none'
   */
  monochromeMode?: MonochromeMode;

  /**
   * Custom icon background color (overrides system primary)
   */
  iconBackgroundColor?: string;

  /**
   * Custom icon color (overrides system primary-foreground)
   */
  iconColor?: string;

  /**
   * Gap between icon and text container
   */
  gap?: string | number;
  
  /**
   * Gap between primary and secondary text (margin-top on secondary)
   */
  textGap?: string | number;

  /**
   * Custom icon size scale (percentage, e.g., 150 for 150% of default size)
   */
  iconSizeScale?: number;

  /**
   * Animation configuration
   */
  animationConfig?: {
    enabled: boolean;
    duration: number;
    timingFunction: string;
    animationType: string; // animate.css class name
  };
}