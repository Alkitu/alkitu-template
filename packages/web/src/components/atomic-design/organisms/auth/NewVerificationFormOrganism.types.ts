/**
 * Props for the NewVerificationFormOrganism component.
 *
 * This organism handles the complete email verification flow including:
 * - Token extraction from URL parameters
 * - Automatic email verification on mount
 * - API integration with /api/auth/verify-email
 * - Error/success messaging
 * - Resend verification functionality
 * - Automatic redirect to login after successful verification
 * - Loading state with spinner
 */
export interface NewVerificationFormOrganismProps {
  /** Optional className for styling customization */
  className?: string;
}
