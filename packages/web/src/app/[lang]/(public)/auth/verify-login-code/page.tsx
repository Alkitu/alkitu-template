'use client';

import { VerifyLoginCodeFormOrganism } from '@/components/organisms';
import { Typography } from '@/components/atoms/typography';
import { useTranslations } from '@/context/TranslationsContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Verify Login Code Page
 *
 * Email code verification page following Atomic Design principles.
 * Uses VerifyLoginCodeFormOrganism which includes its own header and description.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
function VerifyLoginCodeContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  if (!email) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-destructive">
          {t('auth.verifyLoginCode.title')}
        </h1>
        <Typography variant="p" className="text-muted-foreground">
          {t('auth.verifyLoginCode.emailMissing')}
        </Typography>
      </div>
    );
  }

  return <VerifyLoginCodeFormOrganism email={email} />;
}

export default function VerifyLoginCodePage() {
  const t = useTranslations();

  return (
    <Suspense fallback={<div>{t('auth.verifyLoginCode.loading')}</div>}>
      <VerifyLoginCodeContent />
    </Suspense>
  );
}
