import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { verifyJWT } from '@/lib/auth/verify-jwt';
import {
  AUTH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  AUTH_COOKIE_OPTIONS,
} from '@/lib/auth/constants';

/**
 * OAuth Callback Handler
 *
 * Receives tokens from the backend OAuth callback, verifies the JWT,
 * sets authentication cookies, and redirects the user appropriately.
 *
 * Flow:
 * 1. Backend redirects here with access_token and refresh_token as query params
 * 2. Verify the JWT to extract user data
 * 3. Set auth cookies (same pattern as login route)
 * 4. Redirect to onboarding if profileComplete=false, else dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const mode = searchParams.get('mode');

    if (!accessToken || !refreshToken) {
      logger.warn('[oauth-callback] Missing tokens in callback');
      return NextResponse.redirect(
        new URL('/auth/login?error=oauth_failed', request.url),
      );
    }

    // Verify the JWT to extract user info
    const payload = await verifyJWT(accessToken);
    if (!payload) {
      logger.warn('[oauth-callback] Invalid access token received');
      return NextResponse.redirect(
        new URL('/auth/login?error=oauth_failed', request.url),
      );
    }

    const lang = 'en'; // Default language; could be extracted from cookie/header

    // Link mode: user was already logged in and connected a provider.
    // Don't overwrite cookies — just redirect to the profile page.
    if (mode === 'link') {
      logger.debug('[oauth-callback] OAuth link successful', {
        email: payload.email,
        provider: payload.provider,
      });

      return NextResponse.redirect(
        new URL(`/${lang}/profile?tab=accounts&linked=google`, request.url),
      );
    }

    // Default login mode: set cookies and redirect based on profile completion
    const redirectPath = payload.profileComplete
      ? `/${lang}/dashboard`
      : `/${lang}/onboarding`;

    const redirectUrl = new URL(redirectPath, request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set authentication cookies
    response.cookies.set(AUTH_TOKEN_COOKIE, accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    logger.debug('[oauth-callback] OAuth login successful', {
      email: payload.email,
      profileComplete: payload.profileComplete,
      provider: payload.provider,
    });

    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('[oauth-callback] OAuth callback error', { error: message });

    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_failed', request.url),
    );
  }
}
