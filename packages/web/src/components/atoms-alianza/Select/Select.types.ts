import type { CSSProperties } from 'react';

/**
 * Option for Select component
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * Grouped options for Select component
 */
export interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

/**
 * Variant options for Select
 */
export type SelectVariant = 'default' | 'ghost' | 'filled';

/**
 * Size options for Select
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Props for Select component
 */
export interface SelectProps {
  /**
   * Available options for selection (flat or grouped)
   */
  options: SelectOption[] | SelectGroupOption[];

  /**
   * Controlled value
   */
  value?: string;

  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: string;

  /**
   * Placeholder text when no value is selected
   * @default 'Select an option...'
   */
  placeholder?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Visual variant of the select
   * @default 'default'
   */
  variant?: SelectVariant;

  /**
   * Size of the select
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Invalid state (error)
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Valid state (success)
   * @default false
   */
  isValid?: boolean;

  /**
   * Warning state
   * @default false
   */
  isWarning?: boolean;

  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * ARIA described by for accessibility
   */
  'aria-describedby'?: string;

  /**
   * ARIA invalid for accessibility
   */
  'aria-invalid'?: boolean;

  /**
   * ARIA required for accessibility
   */
  'aria-required'?: boolean;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;

  /**
   * Name attribute for forms
   */
  name?: string;

  /**
   * ID attribute
   */
  id?: string;
}
