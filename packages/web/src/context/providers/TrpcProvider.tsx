'use client';

import { ReactNode, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';

/**
 * Wrapper Client Component para el provider de tRPC con React Query.
 * Usa el QueryClient existente en lugar de crear uno nuevo.
 *
 * @param children - Componentes hijos que tendrán acceso a tRPC
 * @returns JSX.Element - Provider de tRPC envolviendo a los hijos
 */
export function TrpcProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url:
            process.env.NODE_ENV === 'production'
              ? '/api/trpc'
              : 'http://localhost:3001/trpc',
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
