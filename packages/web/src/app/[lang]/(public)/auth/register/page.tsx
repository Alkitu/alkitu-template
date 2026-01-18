'use client';

import { AuthPageOrganism, RegisterFormOrganism } from '@/components/organisms';
import { useTranslations } from '@/context/TranslationsContext';
import Link from 'next/link';
import { Button } from '@/components/primitives/ui/button';

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <AuthPageOrganism
      headerLabel={t('auth.register.title') || 'Crear cuenta'}
      headerIcon="home"
      headerSubtitle={t('auth.register.subtitle') || 'Únete a Alianza y disfruta nuestros servicios'}
      backButtonLabel={t('auth.backToLogin') || 'Volver'}
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col gap-6">
        <RegisterFormOrganism />

        <div className="flex flex-col items-center gap-4 w-full">
           <Link href="/auth/login" className="text-body-sm text-foreground underline decoration-1 underline-offset-4">
              {t('auth.register.alreadyHaveAccount') || '¿Ya tienes cuenta?'}
           </Link>
           
           <Button variant="outline" className="w-full h-[52px] rounded-lg border-input text-foreground font-light hover:bg-accent hover:text-accent-foreground" asChild>
              <Link href="/auth/login">
                {t('auth.login.submit') || 'Iniciar Sesión'}
              </Link>
           </Button>
        </div>
      </div>
    </AuthPageOrganism>
  );
}
