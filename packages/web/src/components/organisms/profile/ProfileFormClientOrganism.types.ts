import type { ContactPersonInput, UpdateProfileInput } from '@alkitu/shared';

/**
 * ProfileFormClientOrganism Props (ALI-116)
 */
export interface ProfileFormClientOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Initial form data (current user profile) */
  initialData?: UpdateProfileInput;

  /** Callback when profile is successfully updated */
  onSuccess?: (updatedData: UpdateProfileInput) => void;

  /** Callback when update fails */
  onError?: (error: string) => void;
}

/**
 * Profile form data for CLIENT role (ALI-116)
 * Includes all editable fields for CLIENT users
 */
export interface ProfileFormClientData {
  firstname: string;
  lastname: string;
  phone?: string;
  company?: string;
  address?: string;
  contactPerson?: ContactPersonInput;
}
