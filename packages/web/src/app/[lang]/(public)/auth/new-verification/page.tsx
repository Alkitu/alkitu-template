'use client';

import {
  AuthPageOrganism,
  NewVerificationFormOrganism,
} from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * New Verification Page
 *
 * Email verification page following Atomic Design principles.
 * Uses NewVerificationFormOrganism which automatically verifies on mount.
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function NewVerificationPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.newVerification.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <NewVerificationFormOrganism />
    </AuthPageOrganism>
  );
}
