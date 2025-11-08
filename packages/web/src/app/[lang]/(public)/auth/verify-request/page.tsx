'use client';

import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';
import { Typography } from '@/components/atomic-design/atoms/typography';

export default function VerifyRequestPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.verifyRequest.title')}
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
