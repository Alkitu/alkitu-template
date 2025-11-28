import type { WorkLocation, CreateLocationInput } from '@alkitu/shared';

/**
 * LocationFormOrganism Props (ALI-117)
 */
export interface LocationFormOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Initial form data for editing (if undefined, form is in create mode) */
  initialData?: WorkLocation;

  /** Callback when location is successfully created/updated */
  onSuccess?: (location: WorkLocation) => void;

  /** Callback when operation fails */
  onError?: (error: string) => void;

  /** Callback when cancel button is clicked */
  onCancel?: () => void;

  /** Show cancel button */
  showCancel?: boolean;
}

/**
 * Location form data (ALI-117)
 * Matches CreateLocationInput from shared package
 */
export interface LocationFormData extends CreateLocationInput {
  street: string;
  building?: string;
  tower?: string;
  floor?: string;
  unit?: string;
  city: string;
  zip: string;
  state: string;
}
