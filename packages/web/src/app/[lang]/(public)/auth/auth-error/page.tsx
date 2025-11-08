'use client';

import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { Typography } from '@/components/atomic-design/atoms';
import { useTranslations } from '@/context/TranslationContext';

/**
 * Auth Error Page
 *
 * Displays authentication error messages following Atomic Design principles.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function AuthErrorPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.error.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <Typography
        variant="p"
        className="text-destructive text-center"
      >
        {t('auth.error.message')}
      </Typography>
    </AuthPageOrganism>
  );
}
