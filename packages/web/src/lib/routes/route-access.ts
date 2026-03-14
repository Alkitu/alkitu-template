/**
 * Route access configuration — DENY BY DEFAULT.
 *
 * Every route requires authentication unless explicitly whitelisted
 * as public. Role requirements are derived from path prefixes.
 *
 * To add a public route:  add it to PUBLIC_PREFIXES or PUBLIC_EXACT.
 * To add a role-gated route: the prefix rules already cover /admin,
 *   /employee, /client. Any other authenticated route gets DEFAULT_ROLES.
 *
 * See docs/00-conventions/middleware-route-security.md for guidelines.
 */
import { UserRole } from '@alkitu/shared/enums/user-role.enum';

// ─── Public routes (no auth required) ──────────────────────────────
/** Routes whose prefix makes them public. */
export const PUBLIC_PREFIXES = [
  '/auth/',
  '/unauthorized',
  '/contrast-checker',
  '/design-system',
  '/chat/popup/',
  '/feature-disabled',
] as const;

/** Exact paths that are public (landing page, etc.). */
export const PUBLIC_EXACT = ['/', ''] as const;

// ─── Auth page routes (redirect authenticated users) ───────────────
/** Prefixes that are "auth pages" — logged-in users get redirected away. */
export const AUTH_PAGE_PREFIXES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

// ─── Role-based prefix rules ──────────────────────────────────────
interface RolePrefixRule {
  prefix: string;
  roles: UserRole[];
}

/**
 * Ordered from most-specific to least-specific.
 * First match wins.
 */
const ROLE_PREFIX_RULES: RolePrefixRule[] = [
  { prefix: '/admin', roles: [UserRole.ADMIN] },
  { prefix: '/employee', roles: [UserRole.EMPLOYEE] },
  { prefix: '/client', roles: [UserRole.CLIENT] },
];

/** Fallback roles for any authenticated route not covered by prefix rules. */
const DEFAULT_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.EMPLOYEE,
  UserRole.CLIENT,
  UserRole.LEAD,
];

// ─── Exported helpers ──────────────────────────────────────────────

/**
 * Should the request bypass auth entirely?
 * API routes, Next.js internals, static files, not-found.
 */
export function isBypassRoute(pathname: string): boolean {
  return (
    /^\/(?:api|_next|.*\..*)/.test(pathname) || pathname === '/not-found'
  );
}

/**
 * Is this a public route that requires NO authentication?
 * Operates on a clean path (locale already stripped).
 */
export function isPublicRoute(cleanPath: string): boolean {
  if ((PUBLIC_EXACT as readonly string[]).includes(cleanPath)) {
    return true;
  }
  return PUBLIC_PREFIXES.some((prefix) => cleanPath.startsWith(prefix));
}

/**
 * Is this an auth-page route? (login, register, etc.)
 * Authenticated users should be redirected away from these.
 * Operates on a clean path (locale already stripped).
 */
export function isAuthPageRoute(cleanPath: string): boolean {
  return AUTH_PAGE_PREFIXES.some(
    (prefix) => cleanPath === prefix || cleanPath.startsWith(prefix + '/'),
  );
}

/**
 * Get the roles required to access a route.
 * NEVER returns null — every non-public route requires at least DEFAULT_ROLES.
 * Operates on a clean path (locale already stripped).
 */
export function getRequiredRoles(cleanPath: string): UserRole[] {
  for (const rule of ROLE_PREFIX_RULES) {
    if (
      cleanPath === rule.prefix ||
      cleanPath.startsWith(rule.prefix + '/')
    ) {
      return rule.roles;
    }
  }
  return DEFAULT_ROLES;
}
