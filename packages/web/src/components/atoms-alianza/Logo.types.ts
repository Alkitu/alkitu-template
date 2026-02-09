/**
 * Logo Component Types
 *
 * Type definitions for the Logo atom component.
 */

/**
 * Logo component props
 */
export interface LogoProps {
  /**
   * Additional CSS classes to apply to the logo container
   * @default undefined
   */
  className?: string;

  /**
   * Alternative text for the logo images
   * Important for accessibility
   * @default "Alianza Logo"
   */
  alt?: string;
}
