import { NextMiddleware, NextResponse, NextRequest } from 'next/server';
import { PROTECTED_ROUTES } from '@/lib/routes/protected-routes';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';
import { verifyJWT, type VerifiedJWTPayload } from '@/lib/auth/verify-jwt';
import { logger } from '@/lib/logger';
import {
  AUTH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  AUTH_COOKIE_OPTIONS,
} from '@/lib/auth/constants';

const DEFAULT_LOCALE = 'es';
const SUPPORTED_LOCALES = ['es', 'en'];
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Attempt to refresh the access token using the refresh token cookie.
 * Returns the new tokens or null if refresh fails.
 */
async function refreshTokens(
  request: NextRequest,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshTokenCookie = request.cookies.get(REFRESH_TOKEN_COOKIE);
  if (!refreshTokenCookie) {
    logger.debug('[AUTH] No refresh token found for refresh attempt');
    return null;
  }

  try {
    logger.debug('[AUTH] Attempting token refresh via API');
    const refreshResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
      },
    );

    if (!refreshResponse.ok) {
      logger.debug('[AUTH] Refresh API returned non-OK status', {
        status: refreshResponse.status,
      });
      return null;
    }

    const refreshData = await refreshResponse.json();
    return {
      accessToken: refreshData.access_token,
      refreshToken: refreshData.refresh_token,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[AUTH] Error during token refresh', { error: message });
    return null;
  }
}

/**
 * Set auth cookies on a NextResponse.
 */
function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  response.cookies.set(AUTH_TOKEN_COOKIE, accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export function withAuthMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // TEMPORAL: Bypass de autenticación para desarrollo
    // CRITICAL SECURITY: This bypass is ONLY allowed in development
    if (process.env.SKIP_AUTH === 'true') {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'SECURITY ERROR: SKIP_AUTH cannot be enabled in production environment',
        );
      }
      logger.warn('[AUTH] AUTHENTICATION BYPASS ACTIVE - DEVELOPMENT ONLY');
      return next(request, event);
    }

    logger.debug('[AUTH] Processing path', { pathname });

    // Check if user is already authenticated and trying to access auth pages
    if (isAuthRoute(pathname)) {
      const authCookie = request.cookies.get(AUTH_TOKEN_COOKIE);

      if (authCookie) {
        try {
          const tokenPayload = await verifyJWT(authCookie.value);

          if (tokenPayload) {
            const userRole = (
              tokenPayload.role || (tokenPayload as any).user?.role
            )?.toUpperCase();
            const locale =
              getLocaleFromPath(pathname) ||
              getLocaleFromCookie(request) ||
              DEFAULT_LOCALE;

            let dashboardUrl: string;
            switch (userRole) {
              case 'CLIENT':
              case 'LEAD':
              case 'USER':
                dashboardUrl = `/${locale}/client/dashboard`;
                break;
              case 'EMPLOYEE':
                dashboardUrl = `/${locale}/employee/dashboard`;
                break;
              case 'ADMIN':
              case 'MODERATOR':
                dashboardUrl = `/${locale}/admin/dashboard`;
                break;
              default:
                dashboardUrl = `/${locale}/client/dashboard`;
            }

            logger.debug('[AUTH] Authenticated user on auth page, redirecting', {
              destination: dashboardUrl,
            });
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
          }
        } catch {
          // If token is invalid, continue to auth page normally
        }
      }

      logger.debug('[AUTH] Allowing access to auth route', { pathname });
      return next(request, event);
    }

    // Si es una ruta de API, archivos estáticos, continuar
    if (
      pathname.match(/^\/(?:api|_next|.*\..*)/) ||
      pathname === '/not-found'
    ) {
      return next(request, event);
    }

    // Verificar si la ruta requiere autenticación
    const cleanPath = getCleanPath(pathname);
    const requiredRoles = getRequiredRoles(cleanPath);

    logger.debug('[AUTH] Route check', { cleanPath, requiredRoles });

    if (!requiredRoles) {
      return next(request, event);
    }

    // Verificar autenticación
    const authCookie = request.cookies.get(AUTH_TOKEN_COOKIE);

    const redirectToLogin = (req: NextRequest) => {
      const locale =
        getLocaleFromPath(req.nextUrl.pathname) ||
        getLocaleFromCookie(req) ||
        DEFAULT_LOCALE;

      const redirectUrl = new URL(
        `/${locale}/auth/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`,
        req.url,
      );
      logger.debug('[AUTH] Redirecting to login', { locale });
      return NextResponse.redirect(redirectUrl);
    };

    if (!authCookie) {
      logger.debug('[AUTH] No auth cookie found, attempting refresh');

      const tokens = await refreshTokens(request);
      if (!tokens) {
        return redirectToLogin(request);
      }

      const response = NextResponse.next();
      setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

      logger.debug('[AUTH] Token refreshed successfully');
      request.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      return next(request, event);
    }

    // Get user role from JWT token
    let userRole: string | undefined;
    let tokenPayload: VerifiedJWTPayload | null = null;
    let currentAccessToken = authCookie.value;

    tokenPayload = await verifyJWT(currentAccessToken);

    if (tokenPayload) {
      userRole = tokenPayload.role || (tokenPayload as any).user?.role;

      // If token is expired (verifyJWT already checks, but role might be missing), try refresh
      if (!userRole) {
        logger.debug('[AUTH] Token missing role, attempting refresh');
        const tokens = await refreshTokens(request);

        if (tokens) {
          currentAccessToken = tokens.accessToken;
          tokenPayload = await verifyJWT(tokens.accessToken);
          userRole = tokenPayload?.role || (tokenPayload as any)?.user?.role;

          // Update cookies on the request for subsequent middleware
          request.cookies.set(AUTH_TOKEN_COOKIE, tokens.accessToken);
          request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
        }
      }
    } else {
      // Token verification failed — try refresh
      logger.debug('[AUTH] Token verification failed, attempting refresh');
      const tokens = await refreshTokens(request);

      if (tokens) {
        currentAccessToken = tokens.accessToken;
        tokenPayload = await verifyJWT(tokens.accessToken);
        userRole = tokenPayload?.role || (tokenPayload as any)?.user?.role;

        request.cookies.set(AUTH_TOKEN_COOKIE, tokens.accessToken);
        request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
      } else {
        return redirectToLogin(request);
      }
    }

    if (!userRole) {
      logger.debug('[AUTH] No user role resolved, redirecting to login');
      const locale =
        getLocaleFromPath(pathname) ||
        getLocaleFromCookie(request) ||
        DEFAULT_LOCALE;
      const redirectUrl = new URL(
        `/${locale}/auth/login?redirect=${encodeURIComponent(pathname)}`,
        request.url,
      );
      return NextResponse.redirect(redirectUrl);
    }

    // Verificar autorización por rol (usando jerarquía de roles)
    const userRoleEnum = userRole.toUpperCase() as UserRole;

    if (!hasRole(userRoleEnum, requiredRoles)) {
      logger.debug('[AUTH] Insufficient role', {
        userRole: userRoleEnum,
        requiredRoles,
      });
      const locale =
        getLocaleFromPath(pathname) ||
        getLocaleFromCookie(request) ||
        DEFAULT_LOCALE;
      const redirectUrl = new URL(`/${locale}/unauthorized`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check for PENDING status - redirect to complete verification/onboarding
    if (tokenPayload && tokenPayload.status === 'PENDING') {
      const emailVerified = tokenPayload.emailVerified;
      const profileComplete = tokenPayload.profileComplete;
      const locale =
        getLocaleFromPath(pathname) ||
        getLocaleFromCookie(request) ||
        DEFAULT_LOCALE;

      if (!emailVerified) {
        const verifyUrl = new URL(
          `/${locale}/auth/verify-email`,
          request.url,
        );
        logger.debug('[AUTH] PENDING user, redirecting to email verification');
        return NextResponse.redirect(verifyUrl);
      }

      if (!profileComplete) {
        const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
        logger.debug('[AUTH] PENDING user, redirecting to onboarding');
        return NextResponse.redirect(onboardingUrl);
      }
    }

    // Role-based dashboard redirects
    if (cleanPath === '/dashboard' || cleanPath === '/dashboard/') {
      const locale =
        getLocaleFromPath(pathname) ||
        getLocaleFromCookie(request) ||
        DEFAULT_LOCALE;

      let roleDashboard: string;
      switch (userRoleEnum) {
        case UserRole.CLIENT:
          roleDashboard = 'client/dashboard';
          break;
        case UserRole.EMPLOYEE:
          roleDashboard = 'employee/dashboard';
          break;
        case UserRole.ADMIN:
          roleDashboard = 'admin/dashboard';
          break;
        default:
          roleDashboard = 'dashboard';
      }

      if (roleDashboard !== 'dashboard') {
        const redirectUrl = new URL(
          `/${locale}/${roleDashboard}`,
          request.url,
        );
        logger.debug('[AUTH] Redirecting to role-specific dashboard', {
          destination: redirectUrl.pathname,
        });
        return NextResponse.redirect(redirectUrl);
      }
    }

    return next(request, event);
  };
}

function isAuthRoute(pathname: string): boolean {
  const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/unauthorized',
  ];

  const cleanPath = getCleanPath(pathname);
  return (
    authRoutes.some((route) => cleanPath.startsWith(route)) ||
    authRoutes.some((route) => pathname.includes(route))
  );
}

function getCleanPath(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && ['es', 'en'].includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

function getRequiredRoles(path: string): UserRole[] | null {
  const matchingRoutes = PROTECTED_ROUTES.filter((route) => {
    if (route.path === path) {
      return true;
    }
    return path.startsWith(route.path + '/');
  });

  if (matchingRoutes.length === 0) {
    return null;
  }

  matchingRoutes.sort((a, b) => b.path.length - a.path.length);
  return matchingRoutes[0].roles;
}

function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
}

function getLocaleFromCookie(request: NextRequest): string | null {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }
  return null;
}
