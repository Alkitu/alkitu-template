import { CSSProperties } from 'react';

export interface Feature {
  /**
   * Icon name from Lucide icons
   */
  icon: string;

  /**
   * Feature title
   */
  title: string;

  /**
   * Feature description
   */
  description: string;

  /**
   * Optional link for the feature
   */
  href?: string;
}

export interface FeatureGridProps {
  /**
   * Section title
   */
  title?: string;

  /**
   * Section subtitle
   */
  subtitle?: string;

  /**
   * Array of features to display
   */
  features: Feature[];

  /**
   * Number of columns in the grid (responsive)
   */
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 2 | 3 | 4;
  };

  /**
   * Gap between cards
   */
  gap?: 'sm' | 'md' | 'lg';

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
