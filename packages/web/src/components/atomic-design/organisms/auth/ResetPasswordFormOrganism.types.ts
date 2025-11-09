/**
 * Props for the ResetPasswordFormOrganism component.
 *
 * This organism handles the complete password reset flow including:
 * - Token-based password reset
 * - Password and confirmation inputs
 * - Password validation (matching and minimum length)
 * - API integration with /api/auth/reset-password
 * - Error/success messaging
 * - Redirect to login after successful password reset
 */
export interface ResetPasswordFormOrganismProps {
  /** Reset token from URL or email link */
  token: string;
  /** Optional className for styling customization */
  className?: string;
}
