import type { ReactNode, ReactElement, CSSProperties, HTMLAttributes } from 'react';

/**
 * Placement options for Tooltip
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Trigger type for showing tooltip
 */
export type TooltipTrigger = 'hover' | 'click' | 'focus';

/**
 * Props for Tooltip component
 */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * Tooltip content to display
   */
  content: ReactNode;

  /**
   * Children element that triggers the tooltip
   * Must be a single React element
   */
  children: ReactElement;

  /**
   * Tooltip placement relative to trigger
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Trigger type for showing the tooltip
   * @default 'hover'
   */
  trigger?: TooltipTrigger;

  /**
   * Delay before showing tooltip (milliseconds)
   * @default 300
   */
  delay?: number;

  /**
   * Whether tooltip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show arrow indicator
   * @default true
   */
  showArrow?: boolean;

  /**
   * Offset distance from trigger element (pixels)
   * @default 8
   */
  offset?: number;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   * Allows dynamic theming without CSS classes
   */
  themeOverride?: CSSProperties;

  /**
   * Custom inline styles
   */
  style?: CSSProperties;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
