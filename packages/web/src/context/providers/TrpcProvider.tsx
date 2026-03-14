'use client';

import { ReactNode, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';

function getAuthToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_TOKEN_COOKIE}=([^;]*)`));
  return match?.[1];
}

export function TrpcProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/trpc`,
          headers() {
            const token = getAuthToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
