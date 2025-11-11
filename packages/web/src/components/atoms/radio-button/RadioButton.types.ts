import type { HTMLAttributes } from 'react';

/**
 * Variant options for RadioButton
 */
export type RadioButtonVariant = 'default' | 'error' | 'success' | 'warning';

/**
 * Size options for RadioButton
 */
export type RadioButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for RadioButton component
 */
export interface RadioButtonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Unique identifier for the radio button
   */
  id?: string;

  /**
   * Name attribute for grouping radio buttons
   * Required for radio button groups to work correctly
   */
  name: string;

  /**
   * Value of the radio button
   * Required to identify which option was selected
   */
  value: string;

  /**
   * Checked state
   * @default false
   */
  checked?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Visual variant of the radio button
   * @default 'default'
   */
  variant?: RadioButtonVariant;

  /**
   * Size of the radio button
   * @default 'md'
   */
  size?: RadioButtonSize;

  /**
   * Label text displayed next to the radio button
   */
  label?: string;

  /**
   * Description text displayed below the label
   */
  description?: string;

  /**
   * Callback fired when the radio button selection changes
   * Returns the value of the selected radio button
   */
  onChange?: (value: string) => void;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
