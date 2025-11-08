'use client';

import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { RegisterForm } from '@/components/custom/auth/forms/register-form';
import { useTranslations } from '@/context/TranslationContext';

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
      <RegisterForm />
    </AuthPageOrganism>
  );
}
