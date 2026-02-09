/**
 * Status component types
 *
 * Displays status indicators with icons and labels for various states
 * Used throughout the app for requests, services, users, and other entities
 */

/**
 * Status variants - different visual representations
 */
export type StatusVariant =
  | 'default'      // Star icon, muted colors
  | 'highlighted'  // Star icon with warning colors
  | 'radio'        // Radio button style (selected)
  | 'checkbox'     // Checkbox style (checked)
  | 'toggle';      // Toggle switch style (on)

/**
 * Props for the Status component
 */
export interface StatusProps {
  /**
   * Text label displayed next to the status icon
   * @default "Input text..."
   */
  label?: string;

  /**
   * Visual variant of the status indicator
   * @default 'default'
   */
  variant?: StatusVariant;

  /**
   * Additional CSS classes for custom styling
   */
  className?: string;

  /**
   * Accessibility label for screen readers
   * If not provided, uses the label prop
   */
  'aria-label'?: string;

  /**
   * Additional data attributes for testing
   */
  'data-testid'?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: React.CSSProperties;
}
