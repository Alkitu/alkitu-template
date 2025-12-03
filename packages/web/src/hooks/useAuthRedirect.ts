'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Auth redirect hook with ALI-115 onboarding support
 *
 * Handles post-login redirects based on:
 * - Profile completion status (profileComplete)
 * - User role (CLIENT, EMPLOYEE, ADMIN)
 * - Redirect URL parameter
 *
 * Flow:
 * 1. If profileComplete=false → redirect to /onboarding
 * 2. If profileComplete=true → redirect based on role or redirect URL
 */
export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const redirectAfterLogin = (userData?: {
    profileComplete?: boolean;
    role?: string;
  }) => {
    console.log('[redirectAfterLogin] Called with userData:', userData);
    const redirectUrl = searchParams.get('redirect');

    // Obtener el idioma actual desde la ruta
    const currentLocale = pathname.split('/')[1] || 'es';
    console.log('[redirectAfterLogin] Current locale:', currentLocale);

    // Check if profile is incomplete (ALI-115)
    if (userData && userData.profileComplete === false) {
      const onboardingUrl = `/${currentLocale}/onboarding`;
      console.log('[redirectAfterLogin] Profile incomplete, redirecting to:', onboardingUrl);
      console.log('[redirectAfterLogin] About to call router.push()...');
      router.push(onboardingUrl);
      console.log('[redirectAfterLogin] router.push() called successfully');
      return;
    }

    // Profile is complete, proceed with normal redirect
    if (redirectUrl) {
      // Decodificar y usar la URL de redirect
      const decodedUrl = decodeURIComponent(redirectUrl);
      console.log('[redirectAfterLogin] Redirecting to redirect URL:', decodedUrl);

      // Si la URL no tiene idioma, agregarlo
      if (!decodedUrl.startsWith('/es/') && !decodedUrl.startsWith('/en/')) {
        const finalUrl = `/${currentLocale}${decodedUrl}`;
        console.log('[redirectAfterLogin] About to call router.push():', finalUrl);
        router.push(finalUrl);
        console.log('[redirectAfterLogin] router.push() called successfully');
      } else {
        console.log('[redirectAfterLogin] About to call router.push():', decodedUrl);
        router.push(decodedUrl);
        console.log('[redirectAfterLogin] router.push() called successfully');
      }
    } else {
      // Redirect based on role
      let dashboardUrl = `/${currentLocale}/admin/dashboard`;

      if (userData && userData.role) {
        const role = userData.role.toUpperCase();
        console.log('[redirectAfterLogin] User role:', role);
        switch (role) {
          case 'CLIENT':
          case 'LEAD':
          case 'USER':
            // Client dashboard
            dashboardUrl = `/${currentLocale}/dashboard`;
            break;
          case 'EMPLOYEE':
            // Employee dashboard
            dashboardUrl = `/${currentLocale}/employee/dashboard`;
            break;
          case 'ADMIN':
          case 'MODERATOR':
          default:
            // Admin dashboard
            dashboardUrl = `/${currentLocale}/admin/dashboard`;
            break;
        }
      }

      console.log('[redirectAfterLogin] Final dashboard URL:', dashboardUrl);
      console.log('[redirectAfterLogin] About to call router.push()...');
      router.push(dashboardUrl);
      console.log('[redirectAfterLogin] router.push() called successfully');
    }
  };

  return { redirectAfterLogin };
}
