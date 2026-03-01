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

  /** Optional userId to create location on behalf of another user (admin use) */
  userId?: string;

  /** Display mode: 'full' shows all fields, 'onboarding' shows only address fields */
  mode?: 'full' | 'onboarding';

  /** Whether the form inputs are disabled (parent controls loading state) */
  disabled?: boolean;
}

/**
 * Imperative handle for LocationFormOrganism (used by parent components)
 * Allows programmatic validation and submission from outside the form.
 */
export interface LocationFormImperativeHandle {
  /** Validate the form and return parsed data or null if invalid */
  validate: () => CreateLocationInput | null;
  /** Validate and submit the form via API, return created WorkLocation or null */
  submit: () => Promise<WorkLocation | null>;
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
  icon?: string;
  isDefault?: boolean;
}
