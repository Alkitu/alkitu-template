import { CSSProperties } from 'react';

export interface PricingCardProps {
  /**
   * Badge text (e.g., "Popular", "Best Value")
   */
  badge?: string;

  /**
   * Plan title
   */
  title: string;

  /**
   * Current price
   */
  price: string;

  /**
   * Original price (shown crossed out)
   */
  originalPrice?: string;

  /**
   * Discount text (e.g., "Save 50%")
   */
  discount?: string;

  /**
   * Plan description
   */
  description: string;

  /**
   * Array of feature strings
   */
  features: string[];

  /**
   * CTA button text
   */
  ctaText: string;

  /**
   * CTA button link
   */
  ctaHref?: string;

  /**
   * CTA button click handler
   */
  ctaOnClick?: () => void;

  /**
   * Guarantee/footer text
   */
  guarantee?: string;

  /**
   * Display features in columns
   */
  featuresColumns?: 1 | 2;

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
