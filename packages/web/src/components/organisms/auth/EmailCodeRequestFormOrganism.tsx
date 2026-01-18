'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/ui/button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { Icon } from '@/components/atoms/icons/Icon';
import type { EmailCodeRequestFormOrganismProps } from './EmailCodeRequestFormOrganism.types';

/**
 * EmailCodeRequestFormOrganism - Organism Component
 *
 * A complete email code request form organism that handles passwordless login code request.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Email input for login code request
 * - API integration with /api/auth/send-login-code
 * - Loading states
 * - Error and success messages
 * - Automatic redirect to code verification page
 * - Links to login and registration pages
 *
 * @example
 * ```tsx
 * <AuthPageOrganism
 *   headerLabel={t('auth.emailCode.title')}
 *   backButtonLabel={t('auth.backToLogin')}
 *   backButtonHref="/auth/login"
 * >
 *   <EmailCodeRequestFormOrganism />
 * </AuthPageOrganism>
 * ```
 */
export const EmailCodeRequestFormOrganism = React.forwardRef<
  HTMLDivElement,
  EmailCodeRequestFormOrganismProps
>(({ className }, ref) => {
  const t = useTranslations();
  const router = useRouter();
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
      const response = await fetch('/api/auth/send-login-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error sending login code');
      }

      setSuccess(
        data.message || 'Se ha enviado un código de acceso a tu email',
      );

      // Redirect to code verification page after 2 seconds
      setTimeout(() => {
        router.push(
          `/auth/verify-login-code?email=${encodeURIComponent(email)}`,
        );
      }, 2000);
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.emailCode.error') ||
          'Error enviando el código de acceso',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className={className || 'space-y-6'}>
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground">
          {t('auth.emailCode.description') ||
            'Ingresa tu email y te enviaremos un código de 6 dígitos para acceder'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        suppressHydrationWarning
      >
        <InputGroup
          label={t('auth.emailCode.emailLabel') || 'Correo electrónico'}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailCode.emailPlaceholder') || 'tu@email.com'}
          required
          disabled={isLoading}
          iconLeft={<Icon name="mail" size="sm" className="text-muted-foreground" />}
        />

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-[48px] rounded-lg mt-2 font-medium"
          disabled={isLoading}
        >
          {isLoading
            ? t('Common.general.loading') || 'Enviando...'
            : t('auth.emailCode.submit') || 'Enviar código de acceso'}
        </Button>
      </form>

      <div className="text-center">
        <div className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
});

EmailCodeRequestFormOrganism.displayName = 'EmailCodeRequestFormOrganism';

export default EmailCodeRequestFormOrganism;
