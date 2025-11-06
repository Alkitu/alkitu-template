'use client';

import { ResetPasswordForm } from '@/components/custom/auth/forms/reset-password-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <AuthCardWrapper
        headerLabel={t('auth.resetPassword.invalidToken') || 'Token Inválido'}
        backButtonLabel={t('auth.resetPassword.backToLogin') || 'Volver al Login'}
        backButtonHref="/auth/login"
      >
        <div className="text-center text-muted-foreground">
          {t('auth.resetPassword.tokenMissing') || 'Token de reseteo no encontrado o inválido.'}
        </div>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      headerLabel={t('auth.resetPassword.title') || 'Restablecer Contraseña'}
      backButtonLabel={t('auth.resetPassword.backToLogin') || 'Volver al Login'}
      backButtonHref="/auth/login"
    >
      <ResetPasswordForm token={token} />
    </AuthCardWrapper>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
