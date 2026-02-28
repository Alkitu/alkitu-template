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
   * Additional CSS classes to apply to the logo container.
   * Uses tailwind-merge so you can override default dimensions (e.g. "w-8 h-8").
   * @default undefined
   */
  className?: string;

  /**
   * Alternative text for the logo
   * Important for accessibility
   * @default "Alkitu Logo"
   */
  alt?: string;

  /**
   * Which logo variant to render from the active theme's brand assets.
   * @default "horizontal"
   */
  variant?: 'icon' | 'horizontal' | 'vertical';
}
