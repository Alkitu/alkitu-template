import type { SelectOption, SelectGroupOption, SelectVariant, SelectSize } from '@/components/atoms-alianza/Select';

/**
 * Props for FormSelect component
 */
export interface FormSelectProps {
  /**
   * Label text displayed above the select
   */
  label: string;

  /**
   * Available options for selection (flat or grouped)
   */
  options: SelectOption[] | SelectGroupOption[];

  /**
   * Controlled value
   */
  value: string;

  /**
   * Callback when value changes
   */
  onValueChange: (value: string) => void;

  /**
   * Placeholder text when no value is selected
   * @default 'Select an option...'
   */
  placeholder?: string;

  /**
   * Icon displayed on the left side of the trigger
   */
  icon?: React.ReactNode;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below the select
   */
  helperText?: string;

  /**
   * Custom className for the wrapper
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
   * Required field indicator
   * @default false
   */
  required?: boolean;

  /**
   * Name attribute for forms
   */
  name?: string;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Show optional indicator
   * @default false
   */
  showOptional?: boolean;
}
