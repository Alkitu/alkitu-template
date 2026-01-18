import type { ReactNode, CSSProperties } from 'react';

/**
 * Props for the AuthPageOrganism component
 *
 * This organism wraps authentication pages with a consistent layout,
 * providing translations and configuration via props
 */
export interface AuthPageOrganismProps {
  /**
   * The main form or content to display inside the auth card
   */
  children: ReactNode;

  /**
   * Header label/title displayed at the top of the card
   */
  headerLabel: string;

  /**
   * Optional icon name to display above the title
   */
  headerIcon?: string;

  /**
   * Optional subtitle text to display below the title
   */
  headerSubtitle?: string;

  /**
   * Label for the back button (e.g., "Back to Login")
   */
  backButtonLabel?: string;

  /**
   * URL to navigate when back button is clicked
   */
  backButtonHref?: string;

  /**
   * Whether to show social auth providers section
   * @default false
   */
  showSocial?: boolean;

  /**
   * Text for the social auth divider
   * @default "Or continue with"
   */
  socialDividerText?: string;

  /**
   * Placeholder text for OAuth providers button
   * @default "OAuth providers will be configured with backend"
   */
  socialPlaceholderText?: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;
}
