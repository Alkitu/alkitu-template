import type { HTMLAttributes } from 'react';

/**
 * Variant options for ProgressBar
 */
export type ProgressBarVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Size options for ProgressBar
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg';

/**
 * Props for ProgressBar component
 */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value
   */
  value: number;

  /**
   * Maximum value for progress calculation
   * @default 100
   */
  max?: number;

  /**
   * Visual variant of the progress bar
   * @default 'default'
   */
  variant?: ProgressBarVariant;

  /**
   * Size of the progress bar
   * @default 'md'
   */
  size?: ProgressBarSize;

  /**
   * Show label text
   * @default false
   */
  showLabel?: boolean;

  /**
   * Show percentage value
   * @default false
   */
  showPercentage?: boolean;

  /**
   * Label text to display
   */
  label?: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Animate the progress bar with pulse effect
   * @default false
   */
  animated?: boolean;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
