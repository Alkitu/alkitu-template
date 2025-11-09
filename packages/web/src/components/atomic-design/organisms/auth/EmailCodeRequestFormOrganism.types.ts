/**
 * Props for the EmailCodeRequestFormOrganism component.
 *
 * This organism handles the complete email code request flow including:
 * - Email input for login code request
 * - API integration with /api/auth/send-login-code
 * - Error/success messaging
 * - Automatic redirect to code verification page
 * - Links to login and registration pages
 */
export interface EmailCodeRequestFormOrganismProps {
  /** Optional className for styling customization */
  className?: string;
}
