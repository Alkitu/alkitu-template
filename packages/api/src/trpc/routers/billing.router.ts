import { t } from '../trpc';
import { z } from 'zod';

export const billingRouter = t.router({
  getBillingRecords: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const billingRecords = await ctx.prisma.billing.findMany({
        where: { userId: input.userId },
      });
      return {
        billingRecords,
        message: `Getting billing records for user ${input.userId}`,
      };
    }),
  createBillingRecord: t.procedure
    .input(
      z.object({
        userId: z.string(),
        plan: z.string(),
        status: z.string(),
        amount: z.number(),
        currency: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
        paymentMethod: z.string().optional(),
        transactionId: z.string().optional(),
      }),
    )
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
  updateBillingRecord: t.procedure
    .input(
      z.object({
        id: z.string(),
        plan: z.string().optional(),
        status: z.string().optional(),
        amount: z.number().optional(),
        currency: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        paymentMethod: z.string().optional(),
        transactionId: z.string().optional(),
      }),
    )
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
  deleteBillingRecord: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.billing.delete({ where: { id: input.id } });
      return { message: 'Billing record deleted successfully' };
    }),
});
