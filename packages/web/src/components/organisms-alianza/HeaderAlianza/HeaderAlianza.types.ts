/**
 * HeaderAlianza Types
 *
 * Type definitions for the HeaderAlianza organism component.
 * This is the main navigation header with authentication, language switching, and theme management.
 */

/**
 * Route configuration for public navigation links
 */
export interface PublicRoute {
  /** Display name of the route */
  name: string;
  /** URL/path for the route */
  href: string;
}

/**
 * HeaderAlianza Props
 *
 * Note: HeaderAlianza currently has no props as it's a fully self-contained component.
 * All state and data is managed internally via hooks (tRPC, router, translations).
 *
 * Future enhancement: Consider making routes, user data, and callbacks configurable via props
 * for better testability and reusability.
 */
export interface HeaderAlianzaProps {
  // Reserved for future props
  // Potential props to add:
  // - routes?: PublicRoute[];
  // - onLogout?: () => void;
  // - user?: User;
}
