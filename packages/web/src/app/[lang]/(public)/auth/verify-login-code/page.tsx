'use client';

import { VerifyLoginCodeForm } from '@/components/custom/auth/forms/verify-login-code-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyLoginCodeContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  if (!email) {
    return (
      <AuthCardWrapper
        headerLabel={t('auth.verifyCode.invalidEmail') || 'Email requerido'}
        backButtonLabel={t('auth.verifyCode.backToEmailLogin') || 'Volver a login con email'}
        backButtonHref="/auth/email-login"
      >
        <div className="text-center text-muted-foreground">
          {t('auth.verifyCode.emailMissing') || 'Email no encontrado. Por favor solicita un nuevo código.'}
        </div>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      headerLabel={t('auth.verifyCode.title') || 'Verifica tu código'}
      backButtonLabel={t('auth.verifyCode.backToEmailLogin') || 'Usar otro email'}
      backButtonHref="/auth/email-login"
    >
      <VerifyLoginCodeForm email={email} />
    </AuthCardWrapper>
  );
}

export default function VerifyLoginCodePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyLoginCodeContent />
    </Suspense>
  );
}