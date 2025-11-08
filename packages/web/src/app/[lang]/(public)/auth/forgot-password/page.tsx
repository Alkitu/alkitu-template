'use client';

import { ForgotPasswordForm } from '@/components/custom/auth/forms/forgot-password-form';
import { AuthPageOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

export default function ForgotPasswordPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.forgotPassword.title')}
      backButtonLabel={t('auth.backToLogin')}
      backButtonHref="/auth/login"
    >
      <ForgotPasswordForm />
    </AuthPageOrganism>
  );
}