'use client';

import { NewVerificationForm } from '@/components/custom/auth/forms/new-verification-form';
import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

export default function NewVerificationPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.newVerification.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <NewVerificationForm />
    </AuthPageOrganism>
  );
}
