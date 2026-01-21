import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@alkitu/api/src/trpc/trpc.router';
import { cache } from 'react';

/**
 * Server-side tRPC client for use in Server Components and Server Actions
 *
 * This client can ONLY be used in:
 * - Server Components (async components)
 * - Server Actions
 * - Route Handlers
 *
 * DO NOT use in Client Components - use the regular `trpc` from './trpc.ts' instead
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { serverTrpc } from '@/lib/server-trpc';
 *
 * export default async function Page() {
 *   const themes = await serverTrpc.theme.getCompanyThemes.query({
 *     companyId: '6733c2fd80b7b58d4c36d966',
 *     activeOnly: false
 *   });
 *
 *   return <div>{themes.length} themes found</div>;
 * }
 * ```
 */
export const serverTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

/**
 * Cached version of getCompanyThemes for better performance
 *
 * Uses React's cache() to deduplicate requests within the same render pass
 */
export const getCompanyThemesCached = cache(async (companyId: string) => {
  return serverTrpc.theme.getCompanyThemes.query({
    companyId,
    activeOnly: false,
  });
});

/**
 * Get the default or favorite theme for a company
 *
 * Priority: isDefault → isFavorite → latest
 */
export const getDefaultTheme = cache(async (companyId: string) => {
  const themes = await getCompanyThemesCached(companyId);

  if (!themes || themes.length === 0) {
    return null;
  }

  // Priority 1: Find default theme
  let defaultTheme = themes.find((t: any) => t.isDefault);

  // Priority 2: Find favorite theme
  if (!defaultTheme) {
    defaultTheme = themes.find((t: any) => t.isFavorite);
  }

  // Priority 3: Use most recently updated
  if (!defaultTheme) {
    defaultTheme = themes[0]; // Already sorted by updatedAt desc
  }

  return defaultTheme;
});

/**
 * Get the active theme for a specific user
 */
export const getUserActiveTheme = cache(async (userId: string) => {
  try {
    return await serverTrpc.theme.getActive.query({ userId });
  } catch (error) {
    console.error('Failed to fetch user active theme:', error);
    return null;
  }
});
