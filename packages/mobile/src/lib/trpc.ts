import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@alkitu/api/src/trpc/trpc.router';

export const trpc = createTRPCReact<AppRouter>();
export type { AppRouter };
