'use client';

import { ForgotPasswordForm } from '@/components/custom/auth/forms/forgot-password-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function ForgotPasswordPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel={t('auth.forgotPassword.title') || '¿Olvidaste tu contraseña?'}
      backButtonLabel={t('auth.forgotPassword.backToLogin') || 'Volver al Login'}
      backButtonHref="/auth/login"
    >
      <ForgotPasswordForm />
    </AuthCardWrapper>
  );
}