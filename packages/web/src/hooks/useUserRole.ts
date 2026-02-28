'use client';

import { useState, useEffect } from 'react';

/**
 * Module-level cache to avoid repeated API calls across component mounts.
 * Resets on page navigation (full reload).
 */
let cachedRole: string | null = null;
let fetchPromise: Promise<string | null> | null = null;

async function fetchRole(): Promise<string | null> {
  try {
    const res = await fetch('/api/users/profile');
    if (!res.ok) return null;
    const data = await res.json();
    return data.role ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns the authenticated user's role from /api/users/profile.
 *
 * Caches the result in module scope so only one fetch happens regardless
 * of how many components mount this hook.
 */
export function useUserRole() {
  const [role, setRole] = useState<string | null>(cachedRole);
  const [isLoading, setIsLoading] = useState(cachedRole === null);

  useEffect(() => {
    if (cachedRole !== null) {
      setRole(cachedRole);
      setIsLoading(false);
      return;
    }

    // Deduplicate concurrent fetches
    if (!fetchPromise) {
      fetchPromise = fetchRole();
    }

    fetchPromise.then((r) => {
      cachedRole = r;
      fetchPromise = null;
      setRole(r);
      setIsLoading(false);
    });
  }, []);

  return {
    role,
    isAdmin: role?.toUpperCase() === 'ADMIN',
    isLoading,
  };
}
