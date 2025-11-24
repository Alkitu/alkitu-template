import type { UpdateProfileInput } from '@alkitu/shared';

/**
 * ProfileFormEmployeeOrganism Props (ALI-116)
 */
export interface ProfileFormEmployeeOrganismProps {
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
 * Profile form data for EMPLOYEE/ADMIN roles (ALI-116)
 * Simplified version without address and contactPerson
 */
export interface ProfileFormEmployeeData {
  firstname: string;
  lastname: string;
  phone?: string;
  company?: string;
}
