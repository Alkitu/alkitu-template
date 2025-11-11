'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import { PasswordInput } from '@/components/primitives/ui/password-input';
import { Label } from '@/components/primitives/ui/label';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import type { LoginFormOrganismProps } from './LoginFormOrganism.types';

/**
 * LoginFormOrganism - Organism Component
 *
 * A complete login form organism that handles the entire authentication flow.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Email and password inputs with validation
 * - API integration with /api/auth/login
 * - Loading states
 * - Error and success messages
 * - Automatic redirect after successful login
 * - Links to forgot password and email login
 * - Locale-aware navigation
 *
 * @example
 * ```tsx
 * <AuthPageOrganism
 *   headerLabel={t('auth.login.title')}
 *   backButtonLabel={t('auth.login.backButton')}
 *   backButtonHref="/"
 * >
 *   <LoginFormOrganism />
 * </AuthPageOrganism>
 * ```
 */
export const LoginFormOrganism = React.forwardRef<
  HTMLFormElement,
  LoginFormOrganismProps
>(({ className }, ref) => {
  const t = useTranslations();
  const { redirectAfterLogin } = useAuthRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use Next.js API route instead of direct backend call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setSuccess(t('auth.login.success'));

      // Remove client-side cookie setting - API route handles httpOnly cookies
      // The /api/auth/login route already sets the httpOnly cookies properly

      // Remove insecure localStorage usage
      localStorage.removeItem('user');

      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        redirectAfterLogin();
      }, 100);
    } catch (err: any) {
      setError(err.message || t('auth.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={className || 'space-y-4'}
      suppressHydrationWarning
    >
      <div className="space-y-2" suppressHydrationWarning>
        <Label htmlFor="email">{t('auth.login.email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.login.email')}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2" suppressHydrationWarning>
        <Label htmlFor="password">{t('auth.login.password')}</Label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.login.password')}
          required
          disabled={isLoading}
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('Common.general.loading') : t('auth.login.submit')}
      </Button>

      <div className="text-center space-y-2">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline block"
        >
          {t('auth.login.forgotPassword')}
        </Link>

        <div className="text-sm text-muted-foreground">
          o{' '}
          <Link
            href="/auth/email-login"
            className="text-primary hover:underline"
          >
            {t('auth.login.emailLogin')}
          </Link>
        </div>
      </div>
    </form>
  );
});

LoginFormOrganism.displayName = 'LoginFormOrganism';

export default LoginFormOrganism;
