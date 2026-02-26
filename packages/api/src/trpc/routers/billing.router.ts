import { t, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { UserRole } from '@prisma/client';
import { adminProcedure } from '../middlewares/roles.middleware';
import {
  getBillingRecordsSchema,
  createBillingRecordSchema,
  updateBillingRecordSchema,
  deleteBillingRecordSchema,
} from '../schemas/billing.schemas';

/**
 * Billing Router Factory
 * Handles all billing-related queries and mutations
 *
 * Security:
 * - All endpoints require authentication
 * - Users can only access their own billing records (except ADMIN)
 * - Write operations (create/update/delete) require ADMIN role
 */
export function createBillingRouter() {
  return t.router({
    /**
     * Get billing records for a user
     * Security: Users can only view their own records, unless ADMIN
     */
    getBillingRecords: protectedProcedure
      .input(getBillingRecordsSchema)
      .use(async ({ ctx, next, input }) => {
        // Check ownership - only allow if requesting own data or is ADMIN
        if (ctx.user.role !== UserRole.ADMIN && ctx.user.id !== input.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot access billing records of another user',
          });
        }
        return next();
      })
      .query(async ({ input, ctx }) => {
        const billingRecords = await ctx.prisma.billing.findMany({
          where: { userId: input.userId },
          orderBy: { createdAt: 'desc' },
        });
        return {
          billingRecords,
          message: `Getting billing records for user ${input.userId}`,
        };
      }),

    /**
     * Create billing record
     * Security: ADMIN only
     */
    createBillingRecord: adminProcedure
      .input(createBillingRecordSchema)
      .mutation(async ({ input, ctx }) => {
        const newBillingRecord = await ctx.prisma.billing.create({
          data: {
            userId: input.userId,
            plan: input.plan,
            status: input.status,
            amount: input.amount,
            currency: input.currency,
            startDate: input.startDate,
            endDate: input.endDate,
            paymentMethod: input.paymentMethod,
            transactionId: input.transactionId,
          },
        });
        return {
          newBillingRecord,
          message: 'Billing record created successfully',
        };
      }),

    /**
     * Update billing record
     * Security: ADMIN only
     */
    updateBillingRecord: adminProcedure
      .input(updateBillingRecordSchema)
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const updatedBillingRecord = await ctx.prisma.billing.update({
          where: { id },
          data,
        });
        return {
          updatedBillingRecord,
          message: 'Billing record updated successfully',
        };
      }),

    /**
     * Delete billing record
     * Security: ADMIN only
     */
    deleteBillingRecord: adminProcedure
      .input(deleteBillingRecordSchema)
      .mutation(async ({ input, ctx }) => {
        await ctx.prisma.billing.delete({ where: { id: input.id } });
        return { message: 'Billing record deleted successfully' };
      }),
  });
}

/**
 * Legacy export for backward compatibility
 * TODO: Update main router to use createBillingRouter() factory
 */
export const billingRouter = createBillingRouter();
