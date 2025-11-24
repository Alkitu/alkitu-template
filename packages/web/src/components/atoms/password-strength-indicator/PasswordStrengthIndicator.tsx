'use client';

import React from 'react';
import type {
  PasswordStrengthIndicatorProps,
  PasswordStrengthResult,
} from './PasswordStrengthIndicator.types';

/**
 * PasswordStrengthIndicator - Atom Component
 *
 * Displays real-time password strength feedback with visual indicators and requirement checklist.
 * Follows ALI-115 security requirements for password complexity.
 *
 * Features:
 * - Visual progress bar showing strength score
 * - Color-coded strength levels (very weak to strong)
 * - Checklist of requirements (length, uppercase, lowercase, number, special char)
 * - Customizable minimum length and special character requirement
 * - Only displays when password is not empty
 *
 * Security Requirements (ALI-115):
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - Optional: special character
 *
 * @example
 * ```tsx
 * const [password, setPassword] = useState('');
 *
 * <Input
 *   type="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 * <PasswordStrengthIndicator password={password} minLength={8} />
 * ```
 */
export const PasswordStrengthIndicator = React.forwardRef<
  HTMLDivElement,
  PasswordStrengthIndicatorProps
>(({ password, minLength = 8, requireSpecial = false, className }, ref) => {
  const calculateStrength = (): PasswordStrengthResult => {
    const checks = {
      minLength: password.length >= minLength,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: requireSpecial
        ? /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        : undefined, // Don't count special if not required
    };

    // Only count checks that are defined (not undefined)
    const relevantChecks = Object.entries(checks).filter(
      ([, value]) => value !== undefined,
    );
    const passedChecks = relevantChecks.filter(([, value]) => value).length;
    const totalChecks = relevantChecks.length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    let strength: PasswordStrengthResult['strength'] = 'very_weak';
    if (score >= 100) strength = 'strong';
    else if (score >= 75) strength = 'good';
    else if (score >= 50) strength = 'fair';
    else if (score >= 25) strength = 'weak';

    return { score, strength, checks };
  };

  const result = calculateStrength();

  const getColor = () => {
    switch (result.strength) {
      case 'strong':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const getTextColor = () => {
    switch (result.strength) {
      case 'strong':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'fair':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'weak':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getStrengthLabel = () => {
    switch (result.strength) {
      case 'very_weak':
        return 'Muy débil';
      case 'weak':
        return 'Débil';
      case 'fair':
        return 'Regular';
      case 'good':
        return 'Buena';
      case 'strong':
        return 'Fuerte';
    }
  };

  if (!password) return null;

  return (
    <div
      ref={ref}
      className={className || 'space-y-2 mt-2'}
      data-testid="password-strength-indicator"
    >
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${result.score}%` }}
          data-testid="strength-bar"
        />
      </div>

      {/* Strength label */}
      <p className={`text-sm font-medium ${getTextColor()}`}>
        Fortaleza: {getStrengthLabel()}
      </p>

      {/* Requirements checklist */}
      <ul className="text-xs space-y-1">
        <li
          className={
            result.checks.minLength
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {result.checks.minLength ? '✓' : '○'} Mínimo {minLength} caracteres
        </li>
        <li
          className={
            result.checks.hasUppercase
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {result.checks.hasUppercase ? '✓' : '○'} Al menos una mayúscula
        </li>
        <li
          className={
            result.checks.hasLowercase
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {result.checks.hasLowercase ? '✓' : '○'} Al menos una minúscula
        </li>
        <li
          className={
            result.checks.hasNumber
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {result.checks.hasNumber ? '✓' : '○'} Al menos un número
        </li>
        {requireSpecial && (
          <li
            className={
              result.checks.hasSpecial
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }
          >
            {result.checks.hasSpecial ? '✓' : '○'} Al menos un carácter especial
          </li>
        )}
      </ul>
    </div>
  );
});

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

export default PasswordStrengthIndicator;
