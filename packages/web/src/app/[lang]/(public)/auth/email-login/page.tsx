'use client';

import {
  AuthPageOrganism,
  EmailCodeRequestFormOrganism,
} from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * Email Login Page
 *
 * Passwordless login via email code page following Atomic Design principles.
 * Uses EmailCodeRequestFormOrganism which includes its own header and description.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function EmailLoginPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.emailLogin.title')}
      headerIcon="mail"
      headerSubtitle={t('auth.emailLogin.description') || 'Ingresa tu correo y te enviaremos un código para iniciar sesión'}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <EmailCodeRequestFormOrganism />
    </AuthPageOrganism>
  );
}
