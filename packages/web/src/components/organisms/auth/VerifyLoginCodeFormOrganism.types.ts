/**
 * Props for the VerifyLoginCodeFormOrganism component.
 *
 * This organism handles the complete login code verification flow including:
 * - 6-digit code input with auto-focus
 * - Code resend functionality with countdown timer
 * - API integration with /api/auth/verify-login-code
 * - Error/success messaging
 * - Automatic redirect after successful verification
 * - Links to email-login and login pages
 */
export interface VerifyLoginCodeFormOrganismProps {
  /** Email address to verify code for */
  email: string;
  /** Optional className for styling customization */
  className?: string;
}
