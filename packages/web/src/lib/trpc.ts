import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@alkitu/api/src/trpc/trpc.router';

// Solo necesitamos el React Query client para componentes
export const trpc = createTRPCReact<AppRouter>();

// Re-export the type for convenience
export type { AppRouter };
