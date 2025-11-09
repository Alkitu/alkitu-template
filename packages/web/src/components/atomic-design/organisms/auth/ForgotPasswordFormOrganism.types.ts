/**
 * Props for the ForgotPasswordFormOrganism component.
 *
 * This organism handles the complete forgot password flow including:
 * - Email input for password reset request
 * - API integration with /api/auth/forgot-password
 * - Error/success messaging
 * - Link back to login page
 */
export interface ForgotPasswordFormOrganismProps {
  /** Optional className for styling customization */
  className?: string;
}
