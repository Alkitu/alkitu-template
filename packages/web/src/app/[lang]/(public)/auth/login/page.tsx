'use client';

import { AuthPageOrganism, LoginFormOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

/**
 * Login Page
 *
 * Authentication page for user login following Atomic Design principles.
 * This page demonstrates the proper pattern for auth pages with translations.
 *
 * Pattern:
 * 1. Use useTranslations() hook to get translation function
 * 2. Prepare all text props with translations
 * 3. Render AuthPageOrganism with prepared props and form
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function LoginPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.login.title')}
      backButtonLabel={t('auth.backToHome')}
      backButtonHref="/"
      showSocial
      socialDividerText={t('auth.socialDivider')}
      socialPlaceholderText={t('auth.socialPlaceholder')}
    >
      <LoginFormOrganism />
    </AuthPageOrganism>
  );
}
