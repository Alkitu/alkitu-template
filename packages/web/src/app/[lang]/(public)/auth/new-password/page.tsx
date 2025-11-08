'use client';

import { NewPasswordForm } from '@/components/custom/auth/forms/new-password-form';
import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

export default function NewPasswordPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.newPassword.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <NewPasswordForm />
    </AuthPageOrganism>
  );
}
