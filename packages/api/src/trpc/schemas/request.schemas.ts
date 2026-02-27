import { z } from 'zod';
import { RequestStatus } from '@prisma/client';

/**
 * Schema for updating a request
 * Used by administrators to modify request details
 */
export const updateRequestSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  executionDateTime: z.string().datetime().or(z.date()),
  locationId: z.string().optional(),
  locationData: z
    .object({
      building: z.string().optional(),
      tower: z.string().optional(),
      floor: z.string().optional(),
      unit: z.string().optional(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
  templateResponses: z.record(z.string(), z.unknown()).optional(),
  note: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
});

export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;

/**
 * Schema for creating a request
 */
export const createRequestSchema = z.object({
  userId: z.string(),
  serviceId: z.string(),
  locationId: z.string(),
  executionDateTime: z.string().or(z.date()),
  templateResponses: z.record(z.string(), z.unknown()),
  note: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

/**
 * Schema for getting filtered requests
 */
export const getFilteredRequestsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.nativeEnum(RequestStatus).optional(),
  userId: z.string().optional(),
  serviceId: z.string().optional(),
  assignedToId: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetFilteredRequestsInput = z.infer<
  typeof getFilteredRequestsSchema
>;

/**
 * Schema for updating request status
 */
export const updateRequestStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(RequestStatus),
});

export type UpdateRequestStatusInput = z.infer<
  typeof updateRequestStatusSchema
>;

/**
 * Schema for assigning a request
 */
export const assignRequestSchema = z.object({
  id: z.string(),
  assignedToId: z.string(),
});

export type AssignRequestInput = z.infer<typeof assignRequestSchema>;

/**
 * Schema for cancelling a request
 */
export const cancelRequestSchema = z.object({
  id: z.string(),
  reason: z.string().optional(),
});

export type CancelRequestInput = z.infer<typeof cancelRequestSchema>;

/**
 * Schema for requesting cancellation (CLIENT only — does NOT change status)
 */
export const requestCancellationSchema = z.object({
  id: z.string(),
  reason: z.string().min(1),
});

export type RequestCancellationInput = z.infer<
  typeof requestCancellationSchema
>;

/**
 * Schema for getting request stats
 */
export const getRequestStatsSchema = z.object({}).optional();

/**
 * Schema for getting/deleting a request by ID
 */
export const getRequestByIdSchema = z.object({ id: z.string() });
export const deleteRequestSchema = z.object({ id: z.string() });
