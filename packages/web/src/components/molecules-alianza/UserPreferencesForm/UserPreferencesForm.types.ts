/**
 * UserPreferencesForm Types
 *
 * Presentational form for user display preferences (theme, language).
 */

export interface UserPreferencesFormValues {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
}

export interface UserPreferencesFormProps {
  /** Default form values */
  defaultValues: UserPreferencesFormValues;
  /** Callback when form is submitted */
  onSubmit: (values: UserPreferencesFormValues) => void;
  /** Whether the form is currently submitting */
  loading?: boolean;
  /** Translation function */
  t: (key: string) => string;
}
