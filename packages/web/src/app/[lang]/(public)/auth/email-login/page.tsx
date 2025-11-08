'use client';

import { EmailCodeRequestForm } from '@/components/custom/auth/forms/email-code-request-form';
import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

export default function EmailLoginPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.emailLogin.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <EmailCodeRequestForm />
    </AuthPageOrganism>
  );
}