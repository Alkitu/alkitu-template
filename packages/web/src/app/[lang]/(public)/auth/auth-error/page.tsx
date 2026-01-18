'use client';

import { AuthPageOrganism } from '@/components/organisms';
import { FormError } from '@/components/primitives/ui/form-error';
import { useTranslations } from '@/context/TranslationsContext';

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
      headerIcon="alertTriangle"
      headerSubtitle={t('auth.error.message') || 'Algo salió mal. Por favor, inténtalo de nuevo.'}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <FormError message={t('auth.error.message')} />
    </AuthPageOrganism>
  );
}
