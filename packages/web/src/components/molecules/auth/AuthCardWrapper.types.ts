import { ReactNode } from 'react';

/**
 * Props for the AuthCardWrapper molecule component.
 *
 * This component wraps authentication forms in a card layout with consistent styling.
 */
export interface AuthCardWrapperProps {
  /** The form or content to display inside the card */
  children: ReactNode;

  /** Header label/title for the auth card */
  headerLabel: string;

  /** Optional icon name to display above the title */
  headerIcon?: string;

  /** Optional subtitle text to display below the title */
  headerSubtitle?: string;

  /** Label for the back button (e.g., "Back to login") */
  backButtonLabel?: string;

  /** URL to navigate to when back button is clicked */
  backButtonHref?: string;

  /** Whether to show social auth section */
  showSocial?: boolean;

  /** Text for the divider above social auth buttons */
  socialDividerText?: string;

  /** Placeholder text for social auth buttons */
  socialPlaceholderText?: string;
}
