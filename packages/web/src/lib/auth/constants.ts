/**
 * Shared authentication constants for cookie names, options, and token lifetimes.
 * All auth routes and middleware MUST use these constants instead of hardcoded strings.
 */

// Cookie names (use hyphens, NOT underscores)
export const AUTH_TOKEN_COOKIE = 'auth-token';
export const REFRESH_TOKEN_COOKIE = 'refresh-token';

// Token max ages in seconds
export const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

// Shared cookie options (without maxAge, which varies per token)
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
