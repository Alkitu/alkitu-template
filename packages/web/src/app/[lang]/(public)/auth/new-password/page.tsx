'use client';

import {
  AuthPageOrganism,
  NewPasswordFormOrganism,
} from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * New Password Page
 *
 * Password reset page with token verification following Atomic Design principles.
 * Uses NewPasswordFormOrganism which extracts token from URL parameters.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function NewPasswordPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.newPassword.title')}
      headerIcon="key"
      headerSubtitle={t('auth.newPassword.description') || 'Introduce una nueva contraseña'}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <NewPasswordFormOrganism />
    </AuthPageOrganism>
  );
}
