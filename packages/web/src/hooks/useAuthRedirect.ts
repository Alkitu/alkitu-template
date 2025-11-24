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
    const redirectUrl = searchParams.get('redirect');

    // Obtener el idioma actual desde la ruta
    const currentLocale = pathname.split('/')[1] || 'es';

    // Check if profile is incomplete (ALI-115)
    if (userData && userData.profileComplete === false) {
      console.log('Profile incomplete, redirecting to onboarding');
      const onboardingUrl = `/${currentLocale}/onboarding`;
      setTimeout(() => {
        window.location.href = onboardingUrl;
      }, 100);
      return;
    }

    // Profile is complete, proceed with normal redirect
    if (redirectUrl) {
      // Decodificar y usar la URL de redirect
      const decodedUrl = decodeURIComponent(redirectUrl);
      console.log('Redirecting to redirect URL:', decodedUrl);

      // Si la URL no tiene idioma, agregarlo
      if (!decodedUrl.startsWith('/es/') && !decodedUrl.startsWith('/en/')) {
        router.push(`/${currentLocale}${decodedUrl}`);
      } else {
        router.push(decodedUrl);
      }
    } else {
      // Redirect based on role
      let dashboardUrl = `/${currentLocale}/admin/dashboard`;

      if (userData && userData.role) {
        switch (userData.role.toUpperCase()) {
          case 'CLIENT':
          case 'LEAD':
          case 'USER':
            // Client dashboard (when implemented)
            dashboardUrl = `/${currentLocale}/dashboard`;
            break;
          case 'EMPLOYEE':
          case 'ADMIN':
          case 'MODERATOR':
          default:
            // Admin dashboard
            dashboardUrl = `/${currentLocale}/admin/dashboard`;
            break;
        }
      }

      console.log('Redirecting to dashboard:', dashboardUrl);

      // Use window.location for more reliable redirect after login
      setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 100);
    }
  };

  return { redirectAfterLogin };
}
