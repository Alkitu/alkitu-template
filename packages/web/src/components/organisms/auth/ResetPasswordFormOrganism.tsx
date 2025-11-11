'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/ui/button';
import { PasswordInput } from '@/components/primitives/ui/password-input';
import { Label } from '@/components/primitives/ui/label';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import type { ResetPasswordFormOrganismProps } from './ResetPasswordFormOrganism.types';

/**
 * ResetPasswordFormOrganism - Organism Component
 *
 * A complete password reset form organism that handles password reset with token validation.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Token-based password reset
 * - Password and confirmation inputs with visibility toggle
 * - Password matching validation
 * - Minimum length validation (6 characters)
 * - API integration with /api/auth/reset-password
 * - Loading states
 * - Error and success messages
 * - Automatic redirect to login after successful reset
 * - Link back to login page
 *
 * @example
 * ```tsx
 * <ResetPasswordFormOrganism token={token} />
 * ```
 */
export const ResetPasswordFormOrganism = React.forwardRef<
  HTMLDivElement,
  ResetPasswordFormOrganismProps
>(({ token, className }, ref) => {
  const t = useTranslations();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(
        t('auth.resetPassword.passwordMismatch') ||
          'Las contraseñas no coinciden',
      );
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError(
        t('auth.resetPassword.passwordTooShort') ||
          'La contraseña debe tener al menos 6 caracteres',
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error resetting password');
      }

      setSuccess(
        data.message ||
          'Contraseña actualizada exitosamente. Redirigiendo al login...',
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.resetPassword.error') ||
          'Error actualizando la contraseña',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className={className || 'space-y-6'}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t('auth.resetPassword.title') || 'Restablecer contraseña'}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.resetPassword.description') || 'Ingresa tu nueva contraseña'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        suppressHydrationWarning
      >
        <div className="space-y-2" suppressHydrationWarning>
          <Label htmlFor="password">
            {t('auth.resetPassword.newPassword') || 'Nueva contraseña'}
          </Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              t('auth.resetPassword.passwordPlaceholder') ||
              'Mínimo 6 caracteres'
            }
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="space-y-2" suppressHydrationWarning>
          <Label htmlFor="confirmPassword">
            {t('auth.resetPassword.confirmPassword') || 'Confirmar contraseña'}
          </Label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={
              t('auth.resetPassword.confirmPasswordPlaceholder') ||
              'Repite tu nueva contraseña'
            }
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? t('Common.general.loading') || 'Actualizando...'
            : t('auth.resetPassword.submit') || 'Actualizar contraseña'}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          {t('auth.resetPassword.backToLogin') || 'Volver al inicio de sesión'}
        </Link>
      </div>
    </div>
  );
});

ResetPasswordFormOrganism.displayName = 'ResetPasswordFormOrganism';

export default ResetPasswordFormOrganism;
