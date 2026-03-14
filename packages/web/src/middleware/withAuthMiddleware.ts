import { NextMiddleware, NextResponse, NextRequest } from 'next/server';
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
import {
  isBypassRoute,
  isPublicRoute,
  isAuthPageRoute,
  getRequiredRoles,
} from '@/lib/routes/route-access';
import { getCleanPath, resolveLocale } from '@/lib/routes/path-utils';

// ─── Token helpers (internal) ──────────────────────────────────────

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

/**
 * Get the role-specific dashboard path for a given role.
 */
function getDashboardForRole(role: string): string {
  switch (role.toUpperCase()) {
    case 'CLIENT':
    case 'LEAD':
    case 'USER':
      return 'client/dashboard';
    case 'EMPLOYEE':
      return 'employee/dashboard';
    case 'ADMIN':
    case 'MODERATOR':
      return 'admin/dashboard';
    default:
      return 'client/dashboard';
  }
}

// ─── Main middleware ───────────────────────────────────────────────

export function withAuthMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // ── 1. SKIP_AUTH dev bypass ──────────────────────────────────
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

    // ── 2. Bypass routes (API, _next, static files) ─────────────
    if (isBypassRoute(pathname)) {
      return next(request, event);
    }

    const cleanPath = getCleanPath(pathname);

    // ── 3. Auth pages — redirect away if already logged in ──────
    if (isAuthPageRoute(cleanPath)) {
      const authCookie = request.cookies.get(AUTH_TOKEN_COOKIE);

      if (authCookie) {
        try {
          const tokenPayload = await verifyJWT(authCookie.value);
          if (tokenPayload) {
            const userRole =
              tokenPayload.role || (tokenPayload as any).user?.role;
            const locale = resolveLocale(pathname, request);
            const dashboard = getDashboardForRole(userRole);

            logger.debug(
              '[AUTH] Authenticated user on auth page, redirecting',
              { destination: `/${locale}/${dashboard}` },
            );
            return NextResponse.redirect(
              new URL(`/${locale}/${dashboard}`, request.url),
            );
          }
        } catch {
          // Token invalid — let them through to auth page
        }
      }

      logger.debug('[AUTH] Allowing access to auth route', { pathname });
      return next(request, event);
    }

    // ── 4. Public routes — no auth needed ────────────────────────
    if (isPublicRoute(cleanPath)) {
      logger.debug('[AUTH] Public route, passing through', { cleanPath });
      return next(request, event);
    }

    // ── 5. DENY BY DEFAULT — authenticate ────────────────────────
    logger.debug('[AUTH] Protected route, authenticating', { cleanPath });

    const locale = resolveLocale(pathname, request);

    const redirectToLogin = () => {
      const redirectUrl = new URL(
        `/${locale}/auth/login?redirect=${encodeURIComponent(pathname)}`,
        request.url,
      );
      logger.debug('[AUTH] Redirecting to login', { locale });
      return NextResponse.redirect(redirectUrl);
    };

    // ── 5a. Get or refresh token ─────────────────────────────────
    const authCookie = request.cookies.get(AUTH_TOKEN_COOKIE);

    if (!authCookie) {
      logger.debug('[AUTH] No auth cookie found, attempting refresh');
      const tokens = await refreshTokens(request);
      if (!tokens) {
        return redirectToLogin();
      }

      const response = NextResponse.next();
      setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
      logger.debug('[AUTH] Token refreshed successfully');
      request.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      return next(request, event);
    }

    let userRole: string | undefined;
    let tokenPayload: VerifiedJWTPayload | null = null;
    let currentAccessToken = authCookie.value;

    tokenPayload = await verifyJWT(currentAccessToken);

    if (tokenPayload) {
      userRole = tokenPayload.role || (tokenPayload as any).user?.role;

      if (!userRole) {
        logger.debug('[AUTH] Token missing role, attempting refresh');
        const tokens = await refreshTokens(request);
        if (tokens) {
          currentAccessToken = tokens.accessToken;
          tokenPayload = await verifyJWT(tokens.accessToken);
          userRole = tokenPayload?.role || (tokenPayload as any)?.user?.role;
          request.cookies.set(AUTH_TOKEN_COOKIE, tokens.accessToken);
          request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
        }
      }
    } else {
      logger.debug('[AUTH] Token verification failed, attempting refresh');
      const tokens = await refreshTokens(request);
      if (tokens) {
        currentAccessToken = tokens.accessToken;
        tokenPayload = await verifyJWT(tokens.accessToken);
        userRole = tokenPayload?.role || (tokenPayload as any)?.user?.role;
        request.cookies.set(AUTH_TOKEN_COOKIE, tokens.accessToken);
        request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
      } else {
        return redirectToLogin();
      }
    }

    if (!userRole) {
      logger.debug('[AUTH] No user role resolved, redirecting to login');
      return redirectToLogin();
    }

    // ── 5b. Role-based authorization ─────────────────────────────
    const userRoleEnum = userRole.toUpperCase() as UserRole;
    const requiredRoles = getRequiredRoles(cleanPath);

    if (!hasRole(userRoleEnum, requiredRoles)) {
      logger.debug('[AUTH] Insufficient role', {
        userRole: userRoleEnum,
        requiredRoles,
      });
      return NextResponse.redirect(
        new URL(`/${locale}/unauthorized`, request.url),
      );
    }

    // ── 5c. PENDING status redirects ─────────────────────────────
    if (tokenPayload && tokenPayload.status === 'PENDING') {
      const { emailVerified, profileComplete } = tokenPayload;

      if (!emailVerified) {
        logger.debug('[AUTH] PENDING user, redirecting to email verification');
        return NextResponse.redirect(
          new URL(`/${locale}/auth/verify-email`, request.url),
        );
      }

      if (!profileComplete) {
        logger.debug('[AUTH] PENDING user, redirecting to onboarding');
        return NextResponse.redirect(
          new URL(`/${locale}/onboarding`, request.url),
        );
      }
    }

    // ── 5d. Dashboard redirect by role ───────────────────────────
    if (cleanPath === '/dashboard' || cleanPath === '/dashboard/') {
      const dashboard = getDashboardForRole(userRoleEnum);
      if (dashboard !== 'dashboard') {
        logger.debug('[AUTH] Redirecting to role-specific dashboard', {
          destination: `/${locale}/${dashboard}`,
        });
        return NextResponse.redirect(
          new URL(`/${locale}/${dashboard}`, request.url),
        );
      }
    }

    return next(request, event);
  };
}
