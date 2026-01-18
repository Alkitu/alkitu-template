'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/primitives/ui/button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { trpc } from '@/lib/trpc';
import { Icon } from '@/components/atoms/icons/Icon';
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
  const trpcUtils = trpc.useUtils();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      console.log('[LoginFormOrganism] Login successful, response data:', data);
      setSuccess(t('auth.login.success'));

      // Remove client-side cookie setting - API route handles httpOnly cookies
      // The /api/auth/login route already sets the httpOnly cookies properly

      // Remove insecure localStorage usage
      localStorage.removeItem('user');

      // ALI-115: Pass user data to redirect hook for profileComplete check
      const userData = data.user
        ? {
            profileComplete: data.user.profileComplete ?? true,
            role: data.user.role,
          }
        : undefined;

      console.log('[LoginFormOrganism] Prepared userData for redirect:', userData);
      console.log('[LoginFormOrganism] About to call redirectAfterLogin()...');

      // Invalidate TRPC user cache to ensure header updates immediately
      await trpcUtils.user.me.invalidate();

      // Redirect immediately - cookies are already set in the HTTP response
      redirectAfterLogin(userData);

      console.log('[LoginFormOrganism] redirectAfterLogin() called');
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
      <div className="space-y-4">
        <InputGroup
          label={t('auth.login.email')}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.login.email') || 'ejemplo@correo.com'}
          required
          disabled={isLoading}
          iconLeft={<Icon name="mail" size="sm" className="text-muted-foreground" />}
        />

        <div className="space-y-1">
            <InputGroup
            label={t('auth.login.password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.login.password') || '••••••••'}
            required
            disabled={isLoading}
            iconLeft={<Icon name="lock" size="sm" className="text-muted-foreground" />}
            iconRight={<Icon name={showPassword ? 'eyeOff' : 'eye'} size="sm" className="text-muted-foreground hover:text-foreground transition-colors" />}
            onIconRightClick={() => setShowPassword(!showPassword)} 
            />
        </div>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-[48px] rounded-lg mt-2 font-medium" 
        disabled={isLoading}
      >
        {isLoading ? t('Common.general.loading') : t('auth.login.submit') || 'Iniciar sesión con correo'}
      </Button>
    </form>
  );
});

LoginFormOrganism.displayName = 'LoginFormOrganism';

export default LoginFormOrganism;
