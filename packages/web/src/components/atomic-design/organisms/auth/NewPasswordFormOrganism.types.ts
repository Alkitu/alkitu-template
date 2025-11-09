/**
 * Props for the NewPasswordFormOrganism component.
 *
 * This organism handles the complete new password flow including:
 * - Token extraction from URL parameters
 * - Password and confirmation inputs
 * - Password validation
 * - API integration with /api/auth/reset-password
 * - Error/success messaging
 * - Redirect to login after successful password reset
 */
export interface NewPasswordFormOrganismProps {
  /** Optional className for styling customization */
  className?: string;
}
