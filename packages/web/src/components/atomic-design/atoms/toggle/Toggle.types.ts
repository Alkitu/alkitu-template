import type { HTMLAttributes } from 'react';

/**
 * Variant options for Toggle
 */
export type ToggleVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Size options for Toggle
 */
export type ToggleSize = 'sm' | 'md' | 'lg';

/**
 * Props for Toggle component
 */
export interface ToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Unique identifier for the toggle
   */
  id?: string;

  /**
   * Name attribute for form integration
   */
  name?: string;

  /**
   * Controlled checked state
   * @default false
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled mode
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Visual variant of the toggle
   * @default 'default'
   */
  variant?: ToggleVariant;

  /**
   * Size of the toggle switch
   * @default 'md'
   */
  size?: ToggleSize;

  /**
   * Label text for the toggle
   */
  label?: string;

  /**
   * Description text shown below the label
   */
  description?: string;

  /**
   * Callback when toggle state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
