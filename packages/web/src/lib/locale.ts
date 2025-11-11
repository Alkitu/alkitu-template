/**
 * Utility functions for handling localized routes
 */

/**
 * Extract locale from pathname
 * @param pathname - Current pathname
 * @returns locale ('es' | 'en') or default 'es'
 */
export function getLocaleFromPathname(pathname: string): 'es' | 'en' {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment === 'es' || firstSegment === 'en') {
    return firstSegment;
  }

  // Default to Spanish if no locale found
  return 'es';
}

/**
 * Generate localized route
 * @param route - Base route (e.g., '/auth/login')
 * @param locale - Target locale
 * @returns Localized route (e.g., '/es/auth/login')
 */
export function getLocalizedRoute(route: string, locale: 'es' | 'en'): string {
  // Remove leading slash if present for consistency
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  return `/${locale}${cleanRoute}`;
}

/**
 * Get current locale and generate localized route
 * @param route - Base route (e.g., '/auth/login')
 * @param pathname - Current pathname (from usePathname)
 * @returns Localized route for current locale
 */
export function getCurrentLocalizedRoute(
  route: string,
  pathname: string,
): string {
  const currentLocale = getLocaleFromPathname(pathname);
  return getLocalizedRoute(route, currentLocale);
}
