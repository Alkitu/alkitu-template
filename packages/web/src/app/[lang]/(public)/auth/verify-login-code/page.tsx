'use client';

import { AuthPageOrganism, VerifyLoginCodeFormOrganism } from '@/components/organisms';
import { Typography } from '@/components/atoms/typography';
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
        backButtonLabel={t('auth.backToLogin')}
        backButtonHref="/auth/login"
      >
        <Typography variant="p" className="text-center text-destructive">
          {t('auth.verifyLoginCode.emailMissing')}
        </Typography>
      </AuthPageOrganism>
    );
  }

  return (
    <AuthPageOrganism
      headerLabel={t('auth.verifyCode.title')}
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
