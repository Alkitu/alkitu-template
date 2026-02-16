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
 *   const themes = await serverTrpc.theme.listAllThemes.query();
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
 * Get the GLOBAL active theme (platform-wide)
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
