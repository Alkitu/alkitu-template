import type { HTMLAttributes } from 'react';

/**
 * Variant options for Checkbox
 */
export type CheckboxVariant = 'default' | 'error' | 'success' | 'warning';

/**
 * Size options for Checkbox
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Props for Checkbox component
 */
export interface CheckboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Unique identifier for the checkbox
   */
  id?: string;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * Checked state of the checkbox
   * @default false
   */
  checked?: boolean;

  /**
   * Indeterminate state (partially checked)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Visual variant of the checkbox
   * @default 'default'
   */
  variant?: CheckboxVariant;

  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Label text displayed next to checkbox
   */
  label?: string;

  /**
   * Description text displayed below label
   */
  description?: string;

  /**
   * Callback fired when checkbox state changes
   * @param checked - New checked state
   */
  onChange?: (checked: boolean) => void;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * ARIA label for accessibility (overrides default)
   */
  'aria-label'?: string;

  /**
   * ARIA described-by for accessibility
   */
  'aria-describedby'?: string;

  /**
   * ARIA required for form validation
   * @default false
   */
  'aria-required'?: boolean;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
