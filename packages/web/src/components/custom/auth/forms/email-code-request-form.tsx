'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const EmailCodeRequestForm = () => {
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
        data.message ||
        'Se ha enviado un código de acceso a tu email'
      );

      // Redirect to code verification page after 2 seconds
      setTimeout(() => {
        router.push(`/auth/verify-login-code?email=${encodeURIComponent(email)}`);
      }, 2000);

    } catch (err: any) {
      setError(
        err.message || 
        t('auth.emailCode.error') || 
        'Error enviando el código de acceso'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t('auth.emailCode.title') || 'Acceso con código de email'}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.emailCode.description') || 
          'Ingresa tu email y te enviaremos un código de 6 dígitos para acceder'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
        <div className="space-y-2" suppressHydrationWarning>
          <Label htmlFor="email">
            {t('auth.emailCode.emailLabel') || 'Correo electrónico'}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailCode.emailPlaceholder') || 'tu@email.com'}
            required
            disabled={isLoading}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading 
            ? (t('Common.general.loading') || 'Enviando...') 
            : (t('auth.emailCode.submit') || 'Enviar código de acceso')
          }
        </Button>
      </form>

      <div className="text-center space-y-2">
        <Link 
          href="/auth/login" 
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          {t('auth.emailCode.backToLogin') || 'Volver al inicio de sesión'}
        </Link>
        
        <div className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link 
            href="/auth/register" 
            className="text-primary hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};