import React from 'react';

/**
 * Size variants for Slider component
 */
export type SliderSize = 'sm' | 'md' | 'lg';

/**
 * Color variants for Slider component
 */
export type SliderVariant = 'default' | 'primary' | 'secondary';

/**
 * Orientation for Slider component
 */
export type SliderOrientation = 'horizontal' | 'vertical';

/**
 * Label position for value display
 */
export type SliderLabelPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Slider component
 */
export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Current value (controlled mode)
   */
  value?: number;

  /**
   * Default value (uncontrolled mode)
   * @default 50
   */
  defaultValue?: number;

  /**
   * Minimum value
   * @default 0
   */
  min?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Step increment
   * @default 1
   */
  step?: number;

  /**
   * Size variant
   * @default 'md'
   */
  size?: SliderSize;

  /**
   * Color variant
   * @default 'default'
   */
  variant?: SliderVariant;

  /**
   * Whether to show value label
   * @default false
   */
  showValue?: boolean;

  /**
   * Label position
   * @default 'top'
   */
  labelPosition?: SliderLabelPosition;

  /**
   * Whether to show tick marks
   * @default false
   */
  showTicks?: boolean;

  /**
   * Tick mark positions (custom tick values)
   */
  ticks?: number[];

  /**
   * Whether slider is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: SliderOrientation;

  /**
   * Change handler - called during dragging
   */
  onChange?: (value: number) => void;

  /**
   * Commit handler - called on mouse up
   */
  onValueCommit?: (value: number) => void;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
