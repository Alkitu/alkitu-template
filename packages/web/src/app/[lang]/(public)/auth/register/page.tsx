'use client';

import { AuthPageOrganism, RegisterFormOrganism } from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * Register Page
 *
 * User registration page following Atomic Design principles.
 * Demonstrates the proper pattern for auth pages with translations.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function RegisterPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.register.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
      showSocial
      socialDividerText={t('auth.socialDivider')}
      socialPlaceholderText={t('auth.socialPlaceholder')}
    >
      <RegisterFormOrganism />
    </AuthPageOrganism>
  );
}
