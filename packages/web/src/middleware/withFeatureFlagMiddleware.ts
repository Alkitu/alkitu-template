import { NextMiddleware, NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Feature Flag Middleware
 *
 * Protects routes that require specific feature flags to be enabled.
 * If a user tries to access a feature-gated route when the feature is disabled,
 * they are redirected to the feature-disabled page.
 *
 * @example
 * Route protection:
 * - /admin/chat → requires 'support-chat' flag
 * - /admin/channels → requires 'team-channels' flag
 * - /admin/analytics → requires 'analytics' flag
 */

/**
 * Map of routes to required feature flags
 * Sorted by path length (longest first) for accurate matching
 *
 * NOTE: The addons management page (/admin/settings/addons) is NOT included here
 * because it's where admins manage feature flags. Gating it would create a circular
 * dependency where you can't access the page to enable features.
 */
const FEATURE_GATED_ROUTES: Record<string, string> = {
  '/admin/chat/analytics': 'support-chat',
  '/admin/chat': 'support-chat',
  '/admin/channels': 'team-channels',
  '/admin/analytics': 'analytics',
  '/admin/notifications': 'notifications',
  // REMOVED: '/admin/settings/addons' - Must always be accessible to admins
};

/**
 * Check if a feature flag is enabled (server-side)
 *
 * @param key - Feature flag key
 * @returns Promise<boolean> - true if enabled, false otherwise
 */
async function checkFeatureFlag(key: string): Promise<boolean> {
  try {
    // Call internal API to check feature flag status
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/feature-flags/${key}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use 5 second timeout
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      console.error(
        `[FEATURE FLAG MIDDLEWARE] Failed to check feature flag: ${key}`,
      );
      // FAIL CLOSED for admin routes (deny access on error)
      return false;
    }

    const data = await response.json();
    return data.enabled === true;
  } catch (error) {
    console.error(
      `[FEATURE FLAG MIDDLEWARE] Error checking feature flag "${key}":`,
      error,
    );
    // FAIL CLOSED for admin routes (deny access on error)
    // This is more secure but may impact UX if API is down
    return false;
  }
}

/**
 * Feature Flag Middleware
 *
 * Should be executed AFTER authentication middleware in the chain.
 */
export function withFeatureFlagMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    console.log('[FEATURE FLAG MIDDLEWARE] Processing:', pathname);

    // Skip for API routes, static files, and auth routes
    if (
      pathname.match(/^\/(?:api|_next|.*\..*)/) ||
      pathname.includes('/auth/') ||
      pathname.includes('/unauthorized') ||
      pathname.includes('/feature-disabled')
    ) {
      return next(request, event);
    }

    // Remove language prefix to get clean path
    const cleanPath = getCleanPath(pathname);

    // Find matching feature-gated route (longest match first)
    const matchedRoute = Object.keys(FEATURE_GATED_ROUTES)
      .sort((a, b) => b.length - a.length)
      .find((route) => cleanPath.startsWith(route));

    if (!matchedRoute) {
      // No feature flag required for this route
      return next(request, event);
    }

    const requiredFlag = FEATURE_GATED_ROUTES[matchedRoute];
    console.log(
      `[FEATURE FLAG MIDDLEWARE] Route "${cleanPath}" requires feature: "${requiredFlag}"`,
    );

    // Check if feature is enabled
    const isEnabled = await checkFeatureFlag(requiredFlag);

    if (!isEnabled) {
      console.log(
        `[FEATURE FLAG MIDDLEWARE] Feature "${requiredFlag}" is disabled. Redirecting to feature-disabled page.`,
      );

      const locale = getLocaleFromPath(pathname) || 'es';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/feature-disabled`;
      url.searchParams.set('feature', requiredFlag);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    console.log(
      `[FEATURE FLAG MIDDLEWARE] Feature "${requiredFlag}" is enabled. Allowing access.`,
    );
    return next(request, event);
  };
}

/**
 * Remove language prefix from path
 */
function getCleanPath(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && ['es', 'en'].includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

/**
 * Extract locale from path
 */
function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1];
  return ['es', 'en'].includes(firstSegment) ? firstSegment : null;
}
