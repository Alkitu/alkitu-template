import { trpc } from '@/lib/trpc';

/**
 * Hook to check if a feature flag is enabled
 * Caches the result for 5 minutes to reduce database queries
 *
 * @param key - The feature flag key (e.g., "chat", "analytics")
 * @returns Object with isEnabled (boolean) and isLoading (boolean)
 *
 * @example
 * const { isEnabled: chatEnabled, isLoading } = useFeatureFlag('chat');
 * if (chatEnabled) {
 *   // Render chat components
 * }
 */
export function useFeatureFlag(key: string) {
  const { data: isEnabled, isLoading } = trpc.featureFlags.isEnabled.useQuery(
    { key },
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return {
    isEnabled: isEnabled ?? false,
    isLoading,
  };
}

/**
 * Hook to get all feature flags
 * Useful for admin settings pages
 *
 * @returns Object with features array, isLoading, and refetch function
 */
export function useFeatureFlags() {
  const {
    data: features,
    isLoading,
    refetch,
  } = trpc.featureFlags.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    features: features ?? [],
    isLoading,
    refetch,
  };
}
