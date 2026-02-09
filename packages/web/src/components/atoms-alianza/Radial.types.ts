/**
 * Props for the Radial component (circular radio button alternative)
 *
 * @interface RadialProps
 */
export interface RadialProps {
  /**
   * Whether the radial button is in checked state
   * @default false
   */
  checked?: boolean;

  /**
   * Callback fired when the checked state changes
   * @param checked - The new checked state
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Additional CSS classes to apply to the button
   */
  className?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * Whether the radial button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * ARIA described by for accessibility
   */
  'aria-describedby'?: string;
}
