'use client';

import { AuthPageOrganism } from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';
import { Typography } from '@/components/atoms-alianza/Typography';

export default function VerifyRequestPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.verifyRequest.title')}
      headerIcon="mail"
      headerSubtitle={t('auth.verifyRequest.message1') + ' ' + t('auth.verifyRequest.message2')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <Typography variant="p" className="text-center text-muted-foreground">
        {t('auth.verifyRequest.message1')}
        <br />
        {t('auth.verifyRequest.message2')}
      </Typography>
    </AuthPageOrganism>
  );
}
