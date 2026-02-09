import { ReactNode } from 'react';

/**
 * Props for the AuthCardWrapper molecule component.
 *
 * This component wraps authentication forms in a responsive card layout with consistent styling,
 * branding, and navigation elements. Part of the Alianza Design System.
 *
 * @example
 * ```tsx
 * <AuthCardWrapper
 *   title="Welcome Back"
 *   subtitle="Sign in to continue"
 *   showLogo
 *   backButtonLabel="Back to home"
 *   backButtonHref="/"
 * >
 *   <LoginForm />
 * </AuthCardWrapper>
 * ```
 */
export interface AuthCardWrapperProps {
  /** The form or content to display inside the card */
  children: ReactNode;

  /** Main title/heading for the auth card */
  title: string;

  /** Optional subtitle or description text below the title */
  subtitle?: string;

  /** Optional icon name to display above the title (from Icon component) */
  icon?: string;

  /** Whether to show the Alianza logo at the top of the card */
  showLogo?: boolean;

  /** Custom logo alt text (defaults to "Alianza Logo") */
  logoAlt?: string;

  /** Label for the back button (e.g., "Back to login", "Back to home") */
  backButtonLabel?: string;

  /** URL to navigate to when back button is clicked */
  backButtonHref?: string;

  /** Whether to show social auth section */
  showSocial?: boolean;

  /** Text for the divider above social auth buttons */
  socialDividerText?: string;

  /** Placeholder text for social auth buttons */
  socialPlaceholderText?: string;

  /** Footer content (e.g., links like "Don't have an account? Sign up") */
  footer?: ReactNode;

  /** Whether the card is in a loading state */
  isLoading?: boolean;

  /** Custom className for the wrapper container */
  className?: string;

  /** Custom className for the card */
  cardClassName?: string;

  /** Disable responsive behavior (always show desktop layout) */
  disableResponsive?: boolean;

  /** Test ID for testing */
  'data-testid'?: string;
}
