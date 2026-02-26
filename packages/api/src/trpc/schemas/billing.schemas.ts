import { z } from 'zod';

export const getBillingRecordsSchema = z.object({
  userId: z.string(),
});

export const createBillingRecordSchema = z.object({
  userId: z.string(),
  plan: z.string(),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
});

export const updateBillingRecordSchema = z.object({
  id: z.string(),
  plan: z.string().optional(),
  status: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
});

export const deleteBillingRecordSchema = z.object({
  id: z.string(),
});

export type GetBillingRecordsInput = z.infer<typeof getBillingRecordsSchema>;
export type CreateBillingRecordInput = z.infer<typeof createBillingRecordSchema>;
export type UpdateBillingRecordInput = z.infer<typeof updateBillingRecordSchema>;
export type DeleteBillingRecordInput = z.infer<typeof deleteBillingRecordSchema>;
