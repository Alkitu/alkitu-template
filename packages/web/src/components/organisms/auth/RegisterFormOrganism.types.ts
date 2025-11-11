/**
 * Props for the RegisterFormOrganism component.
 *
 * This organism handles the complete user registration flow including:
 * - Multi-field form (name, lastName, email, phone, password)
 * - Password confirmation validation
 * - Terms and conditions acceptance
 * - tRPC API integration
 * - Error/success messaging
 * - Redirect to login after successful registration
 */
export interface RegisterFormOrganismProps {
  /** Optional className for styling customization */
  className?: string;
}
