'use client';

import { trpc } from '@/lib/trpc';

/**
 * Hook to get authenticated user data for theme operations
 * Provides userId, companyId, and role needed for theme CRUD operations
 */
export function useThemeAuth() {
  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    userId: user?.id || null,
    companyId: user?.companyId || null,
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    user,
  };
}
