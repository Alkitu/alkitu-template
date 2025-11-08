'use client';

import { ResetPasswordForm } from '@/components/custom/auth/forms/reset-password-form';
import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { useTranslations } from '@/context/TranslationContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <AuthPageOrganism
        headerLabel={t('auth.resetPassword.invalidToken')}
        backButtonLabel={t('auth.backToLogin')}
        backButtonHref="/auth/login"
      >
        <Typography variant="p" className="text-center text-muted-foreground">
          {t('auth.resetPassword.tokenMissing')}
        </Typography>
      </AuthPageOrganism>
    );
  }

  return (
    <AuthPageOrganism
      headerLabel={t('auth.resetPassword.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <ResetPasswordForm token={token} />
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
