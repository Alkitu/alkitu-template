'use client';

import { VerifyLoginCodeForm } from '@/components/custom/auth/forms/verify-login-code-form';
import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { useTranslations } from '@/context/TranslationContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyLoginCodeContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  if (!email) {
    return (
      <AuthPageOrganism
        headerLabel={t('auth.verifyLoginCode.title')}
        backButtonLabel={t('auth.backToLogin')}
        backButtonHref="/auth/email-login"
      >
        <Typography variant="p" className="text-center text-muted-foreground">
          {t('auth.verifyLoginCode.emailMissing')}
        </Typography>
      </AuthPageOrganism>
    );
  }

  return (
    <AuthPageOrganism
      headerLabel={t('auth.verifyLoginCode.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/email-login"
    >
      <VerifyLoginCodeForm email={email} />
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