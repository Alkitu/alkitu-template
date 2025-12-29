'use client';

import React, { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import { Label } from '@/components/primitives/ui/label';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import type { ForgotPasswordFormOrganismProps } from './ForgotPasswordFormOrganism.types';

/**
 * ForgotPasswordFormOrganism - Organism Component
 *
 * A complete forgot password form organism that handles the password reset request flow.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Email input for password reset
 * - API integration with /api/auth/forgot-password
 * - Loading states
 * - Error and success messages
 * - Link back to login page
 * - Form clearing after successful submission
 *
 * @example
 * ```tsx
 * <AuthPageOrganism
 *   headerLabel={t('auth.forgotPassword.title')}
 *   backButtonLabel={t('auth.backToLogin')}
 *   backButtonHref="/auth/login"
 * >
 *   <ForgotPasswordFormOrganism />
 * </AuthPageOrganism>
 * ```
 */
export const ForgotPasswordFormOrganism = React.forwardRef<
  HTMLDivElement,
  ForgotPasswordFormOrganismProps
>(({ className }, ref) => {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error sending reset email');
      }

      setSuccess(
        data.message ||
          'Se ha enviado un email con las instrucciones para restablecer tu contraseña',
      );
      setEmail(''); // Clear form
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.forgotPassword.error') ||
          'Error enviando el email de restablecimiento',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className={className || 'space-y-6'}>
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground">
          {t('auth.forgotPassword.description') ||
            'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        suppressHydrationWarning
      >
        <div className="space-y-2" suppressHydrationWarning>
          <Label htmlFor="email">
            {t('auth.forgotPassword.emailLabel') || 'Correo electrónico'}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              t('auth.forgotPassword.emailPlaceholder') || 'tu@email.com'
            }
            required
            disabled={isLoading}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? t('Common.general.loading') || 'Enviando...'
            : t('auth.forgotPassword.submit') ||
              'Enviar enlace de restablecimiento'}
        </Button>
      </form>
    </div>
  );
});

ForgotPasswordFormOrganism.displayName = 'ForgotPasswordFormOrganism';

export default ForgotPasswordFormOrganism;
