'use client';

import { ResetPasswordFormOrganism } from '@/components/atomic-design/organisms';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { useTranslations } from '@/context/TranslationContext';
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
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-destructive">
          {t('auth.resetPassword.invalidToken')}
        </h1>
        <Typography variant="p" className="text-muted-foreground">
          {t('auth.resetPassword.tokenMissing')}
        </Typography>
      </div>
    );
  }

  return <ResetPasswordFormOrganism token={token} />;
}

export default function ResetPasswordPage() {
  const t = useTranslations();

  return (
    <Suspense fallback={<div>{t('auth.resetPassword.loading')}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
