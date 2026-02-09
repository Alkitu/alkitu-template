'use client';

import { AuthPageOrganism, LoginFormOrganism } from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
        headerLabel={t('auth.login.title') || 'Iniciar Sesión'}
        headerIcon="lock"
        headerSubtitle={t('auth.login.subtitle') || 'Ingresa los detalles de tu cuenta para continuar'}
        backButtonLabel={t('auth.backToHome') || 'Volver al Inicio'}
        backButtonHref="/"
        showSocial
        socialDividerText={t('auth.socialDivider') || 'O CONTINUAR CON'}
        socialPlaceholderText={t('auth.socialPlaceholder') || 'Los proveedores OAuth serán configurados con el backend'}
      >
      <div className="flex flex-col gap-6">
        <LoginFormOrganism />

        {/* Forgot Password & Email Code Links */}
        <div className="flex flex-col items-center gap-2 w-full text-center">
          <Link
            href="/auth/forgot-password"
            className="text-body-sm text-muted-foreground hover:text-primary transition-colors"
           >
            {t('auth.login.forgotPassword') || '¿Olvidaste tu contraseña?'}
          </Link>
          <div className="text-body-sm text-muted-foreground">
            o{' '}
            <Link
              href="/auth/email-login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.login.emailLogin') || 'accede con código de email'}
            </Link>
          </div>
        </div>
      </div>
    </AuthPageOrganism>
  );
}
