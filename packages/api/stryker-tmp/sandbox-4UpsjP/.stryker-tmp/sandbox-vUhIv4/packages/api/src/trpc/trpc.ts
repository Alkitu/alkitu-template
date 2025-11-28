// @ts-nocheck
// 
import { initTRPC } from '@trpc/server';
import { PrismaService } from '../prisma.service';

export const t = initTRPC.context<{ prisma: PrismaService }>().create();
