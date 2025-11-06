import { CSSProperties, ReactNode } from 'react';

export interface FeatureItem {
  icon?: string;
  text: string;
}

export interface HeroCTA {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

export interface HeroProps {
  /**
   * Badge text displayed above the title
   */
  badge?: string;

  /**
   * Main heading text
   */
  title: string;

  /**
   * Highlighted portion of the title (usually in primary color)
   */
  titleHighlight?: string;

  /**
   * Subtitle/description text
   */
  subtitle: string;

  /**
   * Primary call-to-action button
   */
  primaryCTA?: HeroCTA;

  /**
   * Secondary call-to-action button
   */
  secondaryCTA?: HeroCTA;

  /**
   * List of features/benefits to display
   */
  features?: FeatureItem[];

  /**
   * Image source URL or custom content for the right side
   */
  image?: string | ReactNode;

  /**
   * Alternative text for the image
   */
  imageAlt?: string;

  /**
   * Placeholder content when no image is provided
   */
  imagePlaceholder?: ReactNode;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;

  /**
   * Use system color variables (default: true)
   */
  useSystemColors?: boolean;
}
