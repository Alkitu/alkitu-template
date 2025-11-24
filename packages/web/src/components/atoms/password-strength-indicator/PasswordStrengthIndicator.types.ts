/**
 * PasswordStrengthIndicator - Atom Component Types
 *
 * Type definitions for the password strength indicator component.
 * This atom provides visual feedback about password strength based on security requirements.
 *
 * @module atoms/password-strength-indicator
 */

export interface PasswordStrengthResult {
  /** Strength score from 0-100 */
  score: number;
  /** Categorical strength level */
  strength: 'very_weak' | 'weak' | 'fair' | 'good' | 'strong';
  /** Individual security requirement checks */
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial?: boolean;
  };
}

export interface PasswordStrengthIndicatorProps {
  /** Password string to evaluate */
  password: string;
  /** Minimum required length (default: 8) */
  minLength?: number;
  /** Whether special characters are required (default: false) */
  requireSpecial?: boolean;
  /** Optional className for styling */
  className?: string;
}
