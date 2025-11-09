'use client';

import { AuthPageOrganism, ForgotPasswordFormOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

/**
 * Forgot Password Page
 *
 * Password reset request page following Atomic Design principles.
 * Uses ForgotPasswordFormOrganism which includes its own header and description.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function ForgotPasswordPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.forgotPassword.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <ForgotPasswordFormOrganism />
    </AuthPageOrganism>
  );
}