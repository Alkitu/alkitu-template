'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const redirectAfterLogin = () => {
    const redirectUrl = searchParams.get('redirect');
    
    // Obtener el idioma actual desde la ruta
    const currentLocale = pathname.split('/')[1] || 'es';
    
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
      // Redirección por defecto al admin dashboard con idioma
      const adminDashboardUrl = `/${currentLocale}/admin/dashboard`;
      console.log('Redirecting to default admin dashboard:', adminDashboardUrl);
      
      // Use window.location for more reliable redirect after login
      setTimeout(() => {
        window.location.href = adminDashboardUrl;
      }, 100);
    }
  };

  return { redirectAfterLogin };
}