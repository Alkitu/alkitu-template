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
 * NEW: Get the GLOBAL active theme (platform-wide)
 *
 * Uses React's cache() to deduplicate requests within the same render pass
 */
export const getGlobalActiveTheme = cache(async () => {
  try {
    return await serverTrpc.theme.getGlobalActiveTheme.query();
  } catch (error) {
    console.error('Failed to fetch global active theme:', error);
    return null;
  }
});

/**
 * @deprecated Use getGlobalActiveTheme instead
 * Cached version of getCompanyThemes for better performance
 */
export const getCompanyThemesCached = cache(async (companyId: string) => {
  console.warn('getCompanyThemesCached is deprecated. Use getGlobalActiveTheme instead.');
  return serverTrpc.theme.getCompanyThemes.query({
    companyId,
    activeOnly: false,
  });
});

/**
 * @deprecated Use getGlobalActiveTheme instead
 * Get the default or favorite theme for a company
 */
export const getDefaultTheme = cache(async (companyId: string) => {
  console.warn('getDefaultTheme is deprecated. Use getGlobalActiveTheme instead.');
  return getGlobalActiveTheme();
});

/**
 * @deprecated Use getGlobalActiveTheme instead
 * Get the active theme for a specific user
 */
export const getUserActiveTheme = cache(async (userId: string) => {
  console.warn('getUserActiveTheme is deprecated. Use getGlobalActiveTheme instead.');
  return getGlobalActiveTheme();
});
