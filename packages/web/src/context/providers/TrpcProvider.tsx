'use client';

import { ReactNode, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';

export function TrpcProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
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
