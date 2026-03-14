/**
 * Shared path and locale utilities for middleware.
 *
 * Centralizes locale extraction and path cleaning logic
 * used by both auth and feature-flag middlewares.
 */
import type { NextRequest } from 'next/server';

export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE = 'es';
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Remove the locale prefix from a pathname.
 * `/es/admin/dashboard` → `/admin/dashboard`
 * `/admin/dashboard`    → `/admin/dashboard`
 */
export function getCleanPath(pathname: string): string {
  const segments = pathname.split('/');
  if (
    segments.length > 1 &&
    (SUPPORTED_LOCALES as readonly string[]).includes(segments[1])
  ) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

/**
 * Extract locale from the first path segment, if present.
 */
export function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1];
  return (SUPPORTED_LOCALES as readonly string[]).includes(firstSegment)
    ? firstSegment
    : null;
}

/**
 * Read the preferred locale from the NEXT_LOCALE cookie.
 */
export function getLocaleFromCookie(request: NextRequest): string | null {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (
    cookieLocale &&
    (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)
  ) {
    return cookieLocale;
  }
  return null;
}

/**
 * Resolve the best locale: path → cookie → default.
 */
export function resolveLocale(pathname: string, request: NextRequest): string {
  return (
    getLocaleFromPath(pathname) ||
    getLocaleFromCookie(request) ||
    DEFAULT_LOCALE
  );
}
