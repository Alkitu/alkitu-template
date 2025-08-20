'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface VerifyLoginCodeFormProps {
  email: string;
}

export const VerifyLoginCodeForm = ({ email }: VerifyLoginCodeFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { redirectAfterLogin } = useAuthRedirect();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take the last character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          setCode(digits.split(''));
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = code.join('');
    
    if (codeString.length !== 6) {
      setError('Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-login-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          code: codeString
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido o expirado');
      }

      setSuccess('¡Código verificado correctamente! Iniciando sesión...');

      // Remove client-side storage usage for security
      localStorage.removeItem('user');

      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        redirectAfterLogin();
      }, 1000);

    } catch (err: any) {
      setError(
        err.message || 
        t('auth.verifyCode.error') || 
        'Error verificando el código'
      );
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

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
        throw new Error(data.message || 'Error reenviando el código');
      }

      setSuccess('Código reenviado correctamente');
      setCanResend(false);
      setCountdown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

    } catch (err: any) {
      setError(err.message || 'Error reenviando el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t('auth.verifyCode.title') || 'Verifica tu código'}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.verifyCode.description') || 
          `Hemos enviado un código de 6 dígitos a:`}
        </p>
        <p className="text-sm font-medium text-primary">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
        <div className="space-y-2">
          <Label className="text-center block">
            {t('auth.verifyCode.codeLabel') || 'Código de verificación'}
          </Label>
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full" disabled={isLoading || code.join('').length !== 6}>
          {isLoading 
            ? (t('Common.general.loading') || 'Verificando...') 
            : (t('auth.verifyCode.submit') || 'Verificar código')
          }
        </Button>
      </form>

      <div className="text-center space-y-4">
        <div>
          {canResend ? (
            <Button 
              variant="ghost" 
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-sm"
            >
              Reenviar código
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Reenviar código en {countdown}s
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Link 
            href="/auth/email-login" 
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline block"
          >
            Usar otro email
          </Link>
          <Link 
            href="/auth/login" 
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline block"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};