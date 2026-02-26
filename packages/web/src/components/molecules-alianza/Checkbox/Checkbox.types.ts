/**
 * Checkbox Component Types
 *
 * Props for the Checkbox molecule component following Atomic Design principles.
 */

export interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   * @default false
   */
  checked?: boolean;

  /**
   * Callback fired when the checked state changes
   * @param checked - The new checked state
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes to apply to the checkbox button
   */
  className?: string;
}
