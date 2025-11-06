'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import Link from 'next/link';

export const ForgotPasswordForm = () => {
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
        'Se ha enviado un email con las instrucciones para restablecer tu contraseña'
      );
      setEmail(''); // Clear form
    } catch (err: any) {
      setError(
        err.message || 
        t('auth.forgotPassword.error') || 
        'Error enviando el email de restablecimiento'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t('auth.forgotPassword.title') || '¿Olvidaste tu contraseña?'}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.forgotPassword.description') || 
          'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
        <div className="space-y-2" suppressHydrationWarning>
          <Label htmlFor="email">
            {t('auth.forgotPassword.emailLabel') || 'Correo electrónico'}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.forgotPassword.emailPlaceholder') || 'tu@email.com'}
            required
            disabled={isLoading}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading 
            ? (t('Common.general.loading') || 'Enviando...') 
            : (t('auth.forgotPassword.submit') || 'Enviar enlace de restablecimiento')
          }
        </Button>
      </form>

      <div className="text-center">
        <Link 
          href="/auth/login" 
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          {t('auth.forgotPassword.backToLogin') || 'Volver al inicio de sesión'}
        </Link>
      </div>
    </div>
  );
};