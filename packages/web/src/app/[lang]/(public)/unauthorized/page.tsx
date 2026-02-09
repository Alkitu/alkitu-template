'use client';

import { UnauthorizedOrganism } from '@/components/organisms-alianza';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * Unauthorized Page
 *
 * Displays an access denied message following Atomic Design principles.
 * This page is shown when users try to access resources without proper permissions.
 *
 * Pattern:
 * 1. Use useTranslations() hook to get translation function
 * 2. Prepare all text props with translations
 * 3. Render UnauthorizedOrganism with prepared props
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function UnauthorizedPage() {
  const t = useTranslations();

  return (
    <UnauthorizedOrganism
      title={t('auth.unauthorized.title')}
      description={t('auth.unauthorized.description')}
      message={t('auth.unauthorized.message')}
      dashboardButtonText={t('auth.unauthorized.goToDashboard')}
      loginButtonText={t('auth.unauthorized.goToLogin')}
    />
  );
}
