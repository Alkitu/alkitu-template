import { getLocalizedRoute } from '../locale';

/**
 * An array of routes that are accessible to the public.
 * @type {string[]}
 */
export const publicRoutes = ['/', '/es', '/en'];

/**
 * An array of routes that are used for authentication.
 * those routes will redirect logged-in users to dashboard after login.
 * only logged-out users can access those routes.
 * @type {string[]}
 */
export const authRoutes = [
  '/es/auth/login',
  '/en/auth/login',
  '/es/auth/register',
  '/en/auth/register',
  '/es/auth/auth-error',
  '/en/auth/auth-error',
  '/es/auth/reset-password',
  '/en/auth/reset-password',
  '/es/auth/new-password',
  '/en/auth/new-password',
  '/es/auth/new-verification',
  '/en/auth/new-verification',
  '/es/auth/verify-request',
  '/en/auth/verify-request',
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset-password',
  '/auth/new-password',
];

/**
 * An array of routes that require authentication (private routes).
 * Unauthenticated users will be redirected to login page.
 * @type {string[]}
 */
export const privateRoutes = [
  '/es/admin',
  '/en/admin',
  '/es/dashboard',
  '/en/dashboard',
  '/admin',
  '/dashboard',
];

/**
 * An array of admin-only routes that require ADMIN role.
 * Users without ADMIN role will be redirected to dashboard.
 * @type {string[]}
 */
export const adminRoutes = ['/es/admin', '/en/admin', '/admin'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Get the default redirect path after successful login
 * @param locale - Current locale ('es' | 'en')
 * @returns Localized admin dashboard route
 */
export const getDefaultLoginRedirect = (locale: 'es' | 'en' = 'es'): string => {
  return getLocalizedRoute('/admin/dashboard', locale);
};

/**
 * Get the default redirect path for unauthenticated users
 * @param locale - Current locale ('es' | 'en')
 * @returns Localized login route
 */
export const getDefaultAuthRedirect = (locale: 'es' | 'en' = 'es'): string => {
  return getLocalizedRoute('/auth/login', locale);
};

/**
 * @deprecated Use getDefaultLoginRedirect() instead
 * The default redirect path after successful login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/admin/dashboard';

/**
 * @deprecated Use getDefaultAuthRedirect() instead
 * The default redirect path for unauthenticated users
 * @type {string}
 */
export const DEFAULT_AUTH_REDIRECT = '/auth/login';

/**
 * Routes that need special redirection handling
 * @type {string[]}
 */
export const routesNeedRedirect = ['/auth', '/es/auth', '/en/auth'];

/**
 * Check if a route is public
 * @param {string} pathname - The pathname to check
 * @returns {boolean}
 */
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(route + '/') ||
      (route !== '/' && pathname.startsWith(route)),
  );
};

/**
 * Check if a route is an auth route
 * @param {string} pathname - The pathname to check
 * @returns {boolean}
 */
export const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some((route) => pathname.startsWith(route));
};

/**
 * Check if a route is private (requires authentication)
 * @param {string} pathname - The pathname to check
 * @returns {boolean}
 */
export const isPrivateRoute = (pathname: string): boolean => {
  return privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
};

/**
 * Check if a route requires admin role
 * @param {string} pathname - The pathname to check
 * @returns {boolean}
 */
export const isAdminRoute = (pathname: string): boolean => {
  return adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
};

/**
 * Check if a route is an API auth route
 * @param {string} pathname - The pathname to check
 * @returns {boolean}
 */
export const isApiAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith(apiAuthPrefix);
};
