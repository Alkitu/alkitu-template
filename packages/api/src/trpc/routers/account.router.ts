import { t, protectedProcedure } from '../trpc';
import { type PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { handlePrismaError } from '../utils/prisma-error-mapper';
import {
  unlinkAccountSchema,
  canLinkProviderSchema,
} from '../schemas/account.schemas';

/**
 * Account tRPC Router
 * Handles linked OAuth accounts (view, unlink, check linkability)
 *
 * Security:
 * - All endpoints require authentication
 * - Users can only manage their own linked accounts
 * - Prevents unlinking the sole sign-in method
 */
export function createAccountRouter(prisma: PrismaClient) {
  return t.router({
    /**
     * Get all linked OAuth accounts for the current user
     * Also returns whether the user has a password set
     */
    getLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
      try {
        const [accounts, user] = await Promise.all([
          prisma.account.findMany({
            where: { userId: ctx.user.id },
            select: {
              id: true,
              provider: true,
              providerAccountId: true,
            },
          }),
          prisma.user.findUnique({
            where: { id: ctx.user.id },
            select: { password: true },
          }),
        ]);

        return {
          accounts,
          hasPassword: !!user?.password,
        };
      } catch (error) {
        handlePrismaError(error, 'fetch linked accounts');
      }
    }),

    /**
     * Unlink an OAuth account from the current user
     * Security: verifies ownership and prevents removing the sole auth method
     */
    unlinkAccount: protectedProcedure
      .input(unlinkAccountSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // Verify the account belongs to the current user
          const account = await prisma.account.findUnique({
            where: { id: input.accountId },
          });

          if (!account) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Account not found',
            });
          }

          if (account.userId !== ctx.user.id) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Cannot unlink an account that does not belong to you',
            });
          }

          // Safety check: don't allow removing the last auth method
          const [accountCount, user] = await Promise.all([
            prisma.account.count({ where: { userId: ctx.user.id } }),
            prisma.user.findUnique({
              where: { id: ctx.user.id },
              select: { password: true },
            }),
          ]);

          const hasPassword = !!user?.password;

          if (!hasPassword && accountCount <= 1) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message:
                'Cannot disconnect your only sign-in method. Set a password first.',
            });
          }

          await prisma.account.delete({ where: { id: input.accountId } });

          return { success: true };
        } catch (error) {
          handlePrismaError(error, 'unlink account');
        }
      }),

    /**
     * Check if the current user can link a specific provider
     * Returns false if they already have that provider linked
     */
    canLinkProvider: protectedProcedure
      .input(canLinkProviderSchema)
      .query(async ({ input, ctx }) => {
        try {
          const existing = await prisma.account.findFirst({
            where: {
              userId: ctx.user.id,
              provider: input.provider,
            },
          });

          return { canLink: !existing };
        } catch (error) {
          handlePrismaError(error, 'check link provider');
        }
      }),
  });
}
