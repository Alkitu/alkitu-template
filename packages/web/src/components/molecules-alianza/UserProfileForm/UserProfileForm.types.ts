/**
 * UserProfileForm Types
 *
 * Presentational form for editing user profile information.
 * Receives callbacks and data — does NOT make API calls.
 */

export interface ContactPersonData {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export interface UserProfileFormValues {
  firstname: string;
  lastname: string;
  phone: string;
  company: string;
  address?: string;
  contactPerson?: ContactPersonData;
}

export interface UserProfileFormProps {
  /** Default form values */
  defaultValues: UserProfileFormValues;
  /** Callback when form is submitted */
  onSubmit: (values: UserProfileFormValues) => void;
  /** Whether the form is currently submitting */
  loading?: boolean;
  /** User role — CLIENT shows address/contactPerson fields */
  role?: string;
  /** Whether all fields are disabled (view-only mode) */
  disabled?: boolean;
  /** Email to display as read-only */
  email?: string;
  /** Translation function */
  t: (key: string) => string;
}
