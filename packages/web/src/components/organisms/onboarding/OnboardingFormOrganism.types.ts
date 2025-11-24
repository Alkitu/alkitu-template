/**
 * OnboardingFormOrganism - Organism Component Types (ALI-115)
 *
 * Type definitions for the user onboarding form component.
 * This organism collects additional profile information after registration.
 */

export interface ContactPersonData {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export interface OnboardingFormData {
  phone?: string;
  company?: string;
  address?: string;
  contactPerson?: ContactPersonData;
}

export interface OnboardingFormOrganismProps {
  /** Optional className for styling */
  className?: string;
  /** Callback when onboarding is completed */
  onComplete?: () => void;
  /** Callback when user skips onboarding */
  onSkip?: () => void;
}

