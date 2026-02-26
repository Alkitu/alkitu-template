/**
 * ChangePasswordForm Types
 *
 * Presentational form for changing user password.
 * Includes password validation checklist.
 */

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordFormProps {
  /** Callback when form is submitted with validated values */
  onSubmit: (values: ChangePasswordFormValues) => void;
  /** Whether the form is currently submitting */
  loading?: boolean;
  /** Translation function */
  t: (key: string) => string;
}

export interface PasswordValidation {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
