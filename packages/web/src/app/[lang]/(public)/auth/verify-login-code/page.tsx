'use client';

import { AuthPageOrganism, VerifyLoginCodeFormOrganism } from '@/components/organisms';
import { FormError } from '@/components/primitives/ui/form-error';
import { useTranslations } from '@/context/TranslationsContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Verify Login Code Page
 *
 * Email code verification page following Atomic Design principles.
 * Uses AuthPageOrganism wrapper with VerifyLoginCodeFormOrganism.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
function VerifyLoginCodeContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  if (!email) {
    return (
      <AuthPageOrganism
        headerLabel={t('auth.verifyLoginCode.title')}
        headerIcon="lock"
        headerSubtitle={t('auth.verifyLoginCode.description') || 'Hemos enviado un código de 6 dígitos'}
        backButtonLabel={t('auth.backToLogin')}
        backButtonHref="/auth/login"
      >
        <FormError message={t('auth.verifyLoginCode.emailMissing')} />
      </AuthPageOrganism>
    );
  }

  return (
    <AuthPageOrganism
      headerLabel={t('auth.verifyCode.title')}
      headerIcon="lock"
      headerSubtitle={t('auth.verifyLoginCode.description') || 'Hemos enviado un código de 6 dígitos'}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <VerifyLoginCodeFormOrganism email={email} />
    </AuthPageOrganism>
  );
}

export default function VerifyLoginCodePage() {
  const t = useTranslations();

  return (
    <Suspense fallback={<div>{t('auth.verifyLoginCode.loading')}</div>}>
      <VerifyLoginCodeContent />
    </Suspense>
  );
}
