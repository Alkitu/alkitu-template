'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/molecules-alianza/Button';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { trpc } from '@/lib/trpc';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import type { LoginFormOrganismProps } from './LoginFormOrganism.types';

/**
 * LoginFormOrganism - Organism Component
 *
 * A complete login form organism that handles the entire authentication flow.
 * Follows Atomic Design principles as a self-contained feature component.
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
      localStorage.removeItem('user');

      const userData = data.user
        ? {
            profileComplete: data.user.profileComplete ?? true,
            role: data.user.role,
          }
        : undefined;

      await trpcUtils.user.me.invalidate();
      redirectAfterLogin(userData);
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
        <FormInput
          label={t('auth.login.email')}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.login.email') || 'ejemplo@correo.com'}
          required
          disabled={isLoading}
          icon={<Mail className="h-4 w-4" />}
        />

        <FormInput
          label={t('auth.login.password')}
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.login.password') || '••••••••'}
          required
          disabled={isLoading}
          icon={<Lock className="h-4 w-4" />}
          iconRight={
            <Button
              type="button"
              variant="nude"
              size="sm"
              iconOnly
              iconLeft={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button 
        type="submit" 
        className="w-full mt-2" 
        disabled={isLoading}
      >
        {isLoading ? t('Common.general.loading') : t('auth.login.submit') || 'Iniciar sesión con correo'}
      </Button>
    </form>
  );
});

LoginFormOrganism.displayName = 'LoginFormOrganism';

export default LoginFormOrganism;
