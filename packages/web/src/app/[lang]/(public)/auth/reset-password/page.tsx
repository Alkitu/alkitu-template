'use client';

import { AuthPageOrganism, ResetPasswordFormOrganism } from '@/components/organisms';
import { FormError } from '@/components/primitives/ui/form-error';
import { useTranslations } from '@/context/TranslationsContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Reset Password Page
 *
 * Password reset page with token extraction following Atomic Design principles.
 * Uses ResetPasswordFormOrganism which includes its own header and description.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
function ResetPasswordContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <AuthPageOrganism
        headerLabel={t('auth.resetPassword.invalidToken')}
        headerIcon="mail"
        backButtonLabel={t('auth.backToLogin')}
        backButtonHref="/auth/login"
      >
        <FormError message={t('auth.resetPassword.tokenMissing')} />
      </AuthPageOrganism>
    );
  }

  return (
    <AuthPageOrganism
      headerLabel={t('auth.resetPassword.title')}
      headerIcon="mail"
      headerSubtitle={t('auth.resetPassword.description') || 'Ingresa tu nueva contraseña'}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <ResetPasswordFormOrganism token={token} />
    </AuthPageOrganism>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations();

  return (
    <Suspense fallback={<div>{t('auth.resetPassword.loading')}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
