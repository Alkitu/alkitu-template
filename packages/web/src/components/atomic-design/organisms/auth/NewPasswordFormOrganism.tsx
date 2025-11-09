'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import type { NewPasswordFormOrganismProps } from './NewPasswordFormOrganism.types';

/**
 * NewPasswordFormOrganism - Organism Component
 *
 * A complete new password form organism that handles password reset with token verification.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Token extraction from URL parameters
 * - Password and confirmation inputs
 * - Password matching validation
 * - API integration with /api/auth/reset-password
 * - Loading states
 * - Error and success messages
 * - Automatic redirect to login after successful reset
 * - Locale-aware navigation
 *
 * @example
 * ```tsx
 * <AuthPageOrganism
 *   headerLabel={t('auth.newPassword.title')}
 *   backButtonLabel={t('auth.backToLogin')}
 *   backButtonHref="/auth/login"
 * >
 *   <NewPasswordFormOrganism />
 * </AuthPageOrganism>
 * ```
 */
export const NewPasswordFormOrganism = React.forwardRef<
  HTMLFormElement,
  NewPasswordFormOrganismProps
>(({ className }, ref) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams?.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(t('auth.newPassword.invalidToken'));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('auth.newPassword.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError(t('auth.newPassword.invalidToken'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(t('auth.newPassword.success'));

      // Redirect to login with proper locale
      setTimeout(() => {
        const localizedLoginRoute = getCurrentLocalizedRoute(
          '/auth/login',
          pathname,
        );
        window.location.href = localizedLoginRoute;
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('auth.newPassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={className || 'space-y-4'}
    >
      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.login.newPassword')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.login.newPassword')}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {t('auth.register.confirmPassword')}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('auth.register.confirmPassword')}
          required
          disabled={isLoading}
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full" disabled={isLoading || !token}>
        {isLoading ? t('Common.general.loading') : t('auth.newPassword.submit')}
      </Button>
    </form>
  );
});

NewPasswordFormOrganism.displayName = 'NewPasswordFormOrganism';

export default NewPasswordFormOrganism;
