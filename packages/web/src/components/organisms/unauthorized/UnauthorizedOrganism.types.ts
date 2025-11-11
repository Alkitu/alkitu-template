import type { CSSProperties } from 'react';

/**
 * Props for the UnauthorizedOrganism component
 *
 * This organism displays an unauthorized access page with
 * clear messaging and navigation options
 */
export interface UnauthorizedOrganismProps {
  /**
   * Page title (e.g., "Access Denied")
   */
  title: string;

  /**
   * Description message
   */
  description: string;

  /**
   * Additional message or instructions
   */
  message: string;

  /**
   * Text for the primary action button (go to dashboard)
   */
  dashboardButtonText: string;

  /**
   * URL for the dashboard button
   * @default "/dashboard"
   */
  dashboardButtonHref?: string;

  /**
   * Text for the secondary action button (go to login)
   */
  loginButtonText: string;

  /**
   * URL for the login button
   * @default "/auth/login"
   */
  loginButtonHref?: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;
}
