'use client';

import { trpc } from '@/lib/trpc';

/**
 * Hook to get authenticated user data for theme operations
 * Provides userId, companyId, and role needed for theme CRUD operations
 *
 * FIX: Only execute query on client side to prevent SSR/CSR hook mismatch
 */
export function useThemeAuth() {
  // Only execute query on client side to prevent React 19 hydration errors
  const isClient = typeof window !== 'undefined';

  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isClient, // Only run query on client side
  });

  return {
    userId: user?.id || null,
    companyId: user?.company || null,
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    user,
  };
}
