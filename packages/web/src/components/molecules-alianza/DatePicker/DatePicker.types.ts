/**
 * DatePicker variant options
 */
export type DatePickerVariant = 'default' | 'inline' | 'range' | 'datetime';

/**
 * DatePicker size options
 */
export type DatePickerSize = 'sm' | 'md' | 'lg';

/**
 * Date range value type
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * Date value type - can be single date or date range
 */
export type DateValue = Date | DateRange | undefined;

/**
 * Props for DatePicker molecule
 */
export interface DatePickerProps {
  /**
   * Current date value - single date for default/datetime, range for range variant
   */
  value?: DateValue;

  /**
   * Callback when date changes
   */
  onChange?: (date: DateValue) => void;

  /**
   * Placeholder text for the input
   * @default 'Select date'
   */
  placeholder?: string;

  /**
   * Date format for display
   * @default 'PPP'
   */
  format?: string;

  /**
   * Variant of the date picker
   * @default 'default'
   */
  variant?: DatePickerVariant;

  /**
   * Size of the date picker
   * @default 'md'
   */
  size?: DatePickerSize;

  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show a clear button
   * @default true
   */
  clearable?: boolean;

  /**
   * Whether to show a "Today" button
   * @default true
   */
  showToday?: boolean;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Label text for the field
   */
  label?: string;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Custom ID for the input element
   */
  id?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;
}
