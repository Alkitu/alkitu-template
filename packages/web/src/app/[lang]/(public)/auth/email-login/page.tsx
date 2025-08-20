'use client';

import { EmailCodeRequestForm } from '@/components/custom/auth/forms/email-code-request-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function EmailLoginPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel={t('auth.emailCode.title') || 'Acceso con código de email'}
      backButtonLabel={t('auth.emailCode.backToLogin') || 'Volver al Login'}
      backButtonHref="/auth/login"
    >
      <EmailCodeRequestForm />
    </AuthCardWrapper>
  );
}