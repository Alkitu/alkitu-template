'use client';

import React, { useState } from 'react';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { Button } from '@/components/molecules-alianza/Button';
import { Label } from '@/components/primitives/ui/label';
import { Eye, EyeOff, Key } from 'lucide-react';
import type {
  ChangePasswordFormProps,
  ChangePasswordFormValues,
  PasswordValidation,
} from './ChangePasswordForm.types';

const validatePassword = (password: string): PasswordValidation => ({
  minLength: password.length >= 8,
  maxLength: password.length <= 50,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

const isPasswordValid = (v: PasswordValidation): boolean =>
  Object.values(v).every(Boolean);

/**
 * ChangePasswordForm — Alianza Molecule
 *
 * Presentational form for changing user password with visual validation checklist.
 */
export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  loading = false,
  t,
}) => {
  const [values, setValues] = useState<ChangePasswordFormValues>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validation = validatePassword(values.newPassword);
  const passwordsMatch =
    values.newPassword === values.confirmPassword &&
    values.confirmPassword.length > 0;
  const canSubmit =
    isPasswordValid(validation) &&
    passwordsMatch &&
    values.currentPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(values);
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const eyeButton = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  const requirements = [
    { valid: validation.minLength, text: t('password.requirements.minLength') },
    { valid: validation.maxLength, text: t('password.requirements.maxLength') },
    {
      valid: validation.hasUppercase,
      text: t('password.requirements.uppercase'),
    },
    {
      valid: validation.hasLowercase,
      text: t('password.requirements.lowercase'),
    },
    { valid: validation.hasNumber, text: t('password.requirements.number') },
    {
      valid: validation.hasSpecialChar,
      text: t('password.requirements.specialChar'),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label={t('password.current')}
        type={showCurrent ? 'text' : 'password'}
        value={values.currentPassword}
        onChange={(e) =>
          setValues((v) => ({ ...v, currentPassword: e.target.value }))
        }
        placeholder={t('password.currentPlaceholder')}
        icon={<Key className="h-4 w-4" />}
        iconRight={eyeButton(showCurrent, () => setShowCurrent(!showCurrent))}
      />

      <FormInput
        label={t('password.new')}
        type={showNew ? 'text' : 'password'}
        value={values.newPassword}
        onChange={(e) =>
          setValues((v) => ({ ...v, newPassword: e.target.value }))
        }
        placeholder={t('password.newPlaceholder')}
        icon={<Key className="h-4 w-4" />}
        iconRight={eyeButton(showNew, () => setShowNew(!showNew))}
      />

      {/* Password Requirements Checklist */}
      {values.newPassword.length > 0 && (
        <div className="space-y-2">
          <Label>{t('password.requirementsTitle')}</Label>
          <div className="space-y-1 text-sm">
            {requirements.map((req, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 ${req.valid ? 'text-green-600' : 'text-muted-foreground'}`}
              >
                {req.valid ? '\u2713' : '\u25CB'} {req.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <FormInput
        label={t('password.confirm')}
        type={showConfirm ? 'text' : 'password'}
        value={values.confirmPassword}
        onChange={(e) =>
          setValues((v) => ({ ...v, confirmPassword: e.target.value }))
        }
        placeholder={t('password.confirmPlaceholder')}
        icon={<Key className="h-4 w-4" />}
        iconRight={eyeButton(showConfirm, () => setShowConfirm(!showConfirm))}
        error={
          values.confirmPassword.length > 0 && !passwordsMatch
            ? t('password.mismatch')
            : undefined
        }
      />

      <Button type="submit" disabled={!canSubmit || loading}>
        {loading ? t('password.changing') : t('password.change')}
      </Button>
    </form>
  );
};

ChangePasswordForm.displayName = 'ChangePasswordForm';
