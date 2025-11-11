import { NextMiddleware, NextResponse, NextRequest } from 'next/server';
import { PROTECTED_ROUTES } from '@/lib/routes/protected-routes';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';

const DEFAULT_LOCALE = 'es';
const SUPPORTED_LOCALES = ['es', 'en'];
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function withAuthMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // TEMPORAL: Bypass de autenticación para desarrollo
    if (process.env.SKIP_AUTH === 'true') {
      console.log('[AUTH MIDDLEWARE] BYPASSING AUTH - DEVELOPMENT MODE');
      return next(request, event);
    }

    console.log('[AUTH MIDDLEWARE] Processing:', pathname);
    console.log('[AUTH MIDDLEWARE] Request URL:', request.url);
    console.log(
      '[AUTH MIDDLEWARE] Request Headers:',
      request.headers.get('cookie'),
    );

    // Si es una ruta de API, archivos estáticos o login, continuar
    if (
      pathname.match(/^\/(?:api|_next|.*\..*)/) ||
      pathname === '/not-found' ||
      isAuthRoute(pathname)
    ) {
      console.log('[AUTH MIDDLEWARE] Skipping auth check for:', pathname);
      return next(request, event);
    }

    // Verificar si la ruta requiere autenticación
    const cleanPath = getCleanPath(pathname);
    const requiredRoles = getRequiredRoles(cleanPath);

    console.log('[AUTH MIDDLEWARE] Clean path:', cleanPath);
    console.log('[AUTH MIDDLEWARE] Required roles:', requiredRoles);

    if (!requiredRoles) {
      console.log('[AUTH MIDDLEWARE] No roles required, allowing access');
      return next(request, event);
    }

    // Verificar autenticación
    const authCookie = request.cookies.get('auth-token');

    console.log('[AUTH MIDDLEWARE] Auth cookie object:', authCookie);
    console.log('[AUTH MIDDLEWARE] Auth cookie value:', authCookie?.value);
    console.log('[AUTH MIDDLEWARE] Auth cookie exists:', !!authCookie);

    const redirectToLogin = (req: NextRequest) => {
      // Primero intentar obtener locale de la URL, luego de la cookie, finalmente usar default
      const locale = getLocaleFromPath(req.nextUrl.pathname) ||
                     getLocaleFromCookie(req) ||
                     DEFAULT_LOCALE;
      console.log('[AUTH MIDDLEWARE] Redirect locale determined:', locale);

      const redirectUrl = new URL(
        `/${locale}/auth/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`,
        req.url,
      );
      console.log('[AUTH MIDDLEWARE] Redirecting to:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    };

    if (!authCookie) {
      console.log('[AUTH MIDDLEWARE] No auth cookie found.');
      const refreshTokenCookie = request.cookies.get('refresh-token');

      if (!refreshTokenCookie) {
        console.log(
          '[AUTH MIDDLEWARE] No refresh token found. Redirecting to login.',
        );
        return redirectToLogin(request);
      }

      console.log('[AUTH MIDDLEWARE] Attempting to refresh token...');
      try {
        const refreshResponse = await fetch(
          `${request.nextUrl.origin}/api/auth/refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
          },
        );

        if (!refreshResponse.ok) {
          console.log(
            '[AUTH MIDDLEWARE] Refresh token failed. Redirecting to login.',
          );
          return redirectToLogin(request);
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.access_token;
        const newRefreshToken = refreshData.refresh_token;

        const response = NextResponse.next();
        response.cookies.set('auth-token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60,
          path: '/',
        });
        response.cookies.set('refresh-token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });

        console.log(
          '[AUTH MIDDLEWARE] Token refreshed successfully. Rewriting request headers.',
        );
        // Rewrite the request headers with the new access token for the current request
        request.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return next(request, event);
      } catch (refreshError) {
        console.error(
          '[AUTH MIDDLEWARE] Error during token refresh:',
          refreshError,
        );
        return redirectToLogin(request);
      }
    }

    // Helper function to refresh token and retry request
    const refreshAccessToken = async (req: NextRequest) => {
      const refreshTokenCookie = req.cookies.get('refresh-token');
      if (!refreshTokenCookie) {
        console.log(
          '[AUTH MIDDLEWARE] No refresh token found for refresh attempt.',
        );
        return null;
      }

      try {
        console.log('[AUTH MIDDLEWARE] Attempting to refresh token via API...');
        const refreshResponse = await fetch(
          `${req.nextUrl.origin}/api/auth/refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
          },
        );

        if (!refreshResponse.ok) {
          console.log(
            '[AUTH MIDDLEWARE] Refresh token API failed (status:',
            refreshResponse.status,
            ').',
          );
          return null;
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.access_token;
        const newRefreshToken = refreshData.refresh_token;

        // Update cookies in the response
        const response = NextResponse.next(); // Create a dummy response to set cookies
        response.cookies.set('auth-token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60,
          path: '/',
        });
        response.cookies.set('refresh-token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
        // Apply the cookie changes to the original request for subsequent middleware/handlers
        req.cookies.set('auth-token', newAccessToken);
        req.cookies.set('refresh-token', newRefreshToken);

        console.log('[AUTH MIDDLEWARE] Token refreshed successfully.');
        return newAccessToken;
      } catch (error) {
        console.error('[AUTH MIDDLEWARE] Error during token refresh:', error);
        return null;
      }
    };

    // Get user role from JWT token instead of making API calls
    let userRole: string | undefined;
    let currentAccessToken = authCookie?.value;

    if (currentAccessToken) {
      console.log('[AUTH MIDDLEWARE] Current Access Token:', currentAccessToken);
      try {
        // Decode JWT to get user role using edge-compatible base64 decoding
        const base64Url = currentAccessToken.split('.')[1];
        console.log('[AUTH MIDDLEWARE] Base64Url part:', base64Url);
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        console.log('[AUTH MIDDLEWARE] Base64 part (adjusted):', base64);
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        console.log('[AUTH MIDDLEWARE] JSON Payload (decoded):', jsonPayload);
        const tokenPayload = JSON.parse(jsonPayload);
        userRole = tokenPayload.role || tokenPayload.user?.role;
        
        console.log('[AUTH MIDDLEWARE] User role from token:', userRole);
        console.log('[AUTH MIDDLEWARE] Token expiration (exp):', tokenPayload.exp);
        console.log('[AUTH MIDDLEWARE] Current time (Date.now()):', Date.now());
        
        // If role is not in token or token is expired, try to refresh
        if (!userRole || tokenPayload.exp * 1000 < Date.now()) {
          console.log('[AUTH MIDDLEWARE] Token expired or missing role. Attempting refresh...');
          const newAccessToken = await refreshAccessToken(request);
          
          if (newAccessToken) {
            currentAccessToken = newAccessToken;
            // Try to get role from new token
            const newBase64Url = newAccessToken.split('.')[1];
            const newBase64 = newBase64Url.replace(/-/g, '+').replace(/_/g, '/');
            const newJsonPayload = decodeURIComponent(atob(newBase64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const newTokenPayload = JSON.parse(newJsonPayload);
            userRole = newTokenPayload.role || newTokenPayload.user?.role;
            console.log('[AUTH MIDDLEWARE] User role from refreshed token:', userRole);
            console.log('[AUTH MIDDLEWARE] Refreshed token expiration (exp):', newTokenPayload.exp);
          } else {
            console.log('[AUTH MIDDLEWARE] Refresh failed. Redirecting to login.');
            return redirectToLogin(request);
          }
        }
      } catch (error) {
        console.error('[AUTH MIDDLEWARE] Error decoding token:', error);
        return redirectToLogin(request);
      }
    }

    if (!userRole) {
      console.log(
        '[AUTH MIDDLEWARE] User role is undefined after backend fetch. Redirecting to login.',
      );
      const locale = getLocaleFromPath(pathname) ||
                     getLocaleFromCookie(request) ||
                     DEFAULT_LOCALE;
      const redirectUrl = new URL(
        `/${locale}/auth/login?redirect=${encodeURIComponent(pathname)}`,
        request.url,
      );
      console.log('[AUTH MIDDLEWARE] Redirecting to:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    // Verificar autorización por rol
    const userRoleEnum = userRole.toUpperCase() as UserRole;
    console.log('[AUTH MIDDLEWARE] User role (enum):', userRoleEnum);
    console.log('[AUTH MIDDLEWARE] Required roles for path:', requiredRoles);

    if (!requiredRoles.includes(userRoleEnum)) {
      console.log(
        '[AUTH MIDDLEWARE] User role does not match required roles. Redirecting to unauthorized.',
      );
      const locale = getLocaleFromPath(pathname) ||
                     getLocaleFromCookie(request) ||
                     DEFAULT_LOCALE;
      const redirectUrl = new URL(`/${locale}/unauthorized`, request.url);
      console.log('[AUTH MIDDLEWARE] Redirecting to:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }
    console.log(
      '[AUTH MIDDLEWARE] User role matches required roles. Allowing access.',
    );

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

  // Verificar si es una ruta de auth con o sin idioma
  const cleanPath = getCleanPath(pathname);
  return (
    authRoutes.some((route) => cleanPath.startsWith(route)) ||
    authRoutes.some((route) => pathname.includes(route))
  );
}

function getCleanPath(pathname: string): string {
  // Remover el prefijo de idioma para obtener la ruta limpia
  const segments = pathname.split('/');
  if (segments.length > 1 && ['es', 'en'].includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

function getRequiredRoles(path: string): UserRole[] | null {
  const matchingRoutes = PROTECTED_ROUTES.filter((route) => {
    // Exact match
    if (route.path === path) {
      return true;
    }
    // Nested match (e.g., /dashboard/users matches /dashboard)
    return path.startsWith(route.path + '/');
  });

  if (matchingRoutes.length === 0) {
    return null;
  }

  // Sort by path length in descending order to get the most specific route first
  matchingRoutes.sort((a, b) => b.path.length - a.path.length);

  // Return roles of the most specific matching route
  return matchingRoutes[0].roles;
}

function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
}

function getLocaleFromCookie(request: NextRequest): string | null {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  console.log('[AUTH MIDDLEWARE] Cookie NEXT_LOCALE:', cookieLocale);

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  return null;
}
