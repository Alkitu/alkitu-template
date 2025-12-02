import { z } from 'zod';

/**
 * Request Zod Schemas (ALI-119)
 */

/**
 * Request status enum schema
 */
export const RequestStatusSchema = z.enum([
  'PENDING',
  'ONGOING',
  'COMPLETED',
  'CANCELLED',
]);

/**
 * Template responses schema (dynamic JSON object)
 */
export const TemplateResponsesSchema = z.record(z.unknown());

/**
 * Rich text note schema (TipTap JSON format)
 */
export const NoteSchema = z.record(z.unknown()).nullable().optional();

/**
 * Create request schema
 */
export const CreateRequestSchema = z.object({
  serviceId: z
    .string()
    .min(1, 'Service ID is required')
    .regex(/^[a-f\d]{24}$/i, 'Invalid service ID format'),
  locationId: z
    .string()
    .min(1, 'Location ID is required')
    .regex(/^[a-f\d]{24}$/i, 'Invalid location ID format'),
  executionDateTime: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: 'Execution date must be in the future',
    }),
  templateResponses: TemplateResponsesSchema.refine(
    (responses) => Object.keys(responses).length > 0,
    {
      message: 'Template responses cannot be empty',
    }
  ),
  note: NoteSchema,
});

/**
 * Update request schema
 */
export const UpdateRequestSchema = z.object({
  locationId: z
    .string()
    .min(1, 'Location ID is required')
    .regex(/^[a-f\d]{24}$/i, 'Invalid location ID format')
    .optional(),
  executionDateTime: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: 'Execution date must be in the future',
    })
    .optional(),
  templateResponses: TemplateResponsesSchema.optional(),
  note: NoteSchema,
  status: RequestStatusSchema.optional(),
  assignedToId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID format')
    .nullable()
    .optional(),
});

/**
 * Assign request schema
 */
export const AssignRequestSchema = z.object({
  assignedToId: z
    .string()
    .min(1, 'Assigned user ID is required')
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID format'),
});

/**
 * Request cancellation schema
 */
export const RequestCancellationSchema = z.object({
  reason: z.string().max(1000, 'Reason cannot exceed 1000 characters').optional(),
});

/**
 * Complete request schema
 */
export const CompleteRequestSchema = z.object({
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

/**
 * Request ID param schema
 */
export const RequestIdSchema = z
  .string()
  .min(1, 'Request ID is required')
  .regex(/^[a-f\d]{24}$/i, 'Invalid request ID format');

/**
 * Request query filters schema
 */
export const RequestQuerySchema = z.object({
  status: RequestStatusSchema.optional(),
  userId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID format')
    .optional(),
  serviceId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid service ID format')
    .optional(),
  assignedToId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID format')
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

/**
 * Status transition validation schema
 */
export const StatusTransitionSchema = z.object({
  currentStatus: RequestStatusSchema,
  newStatus: RequestStatusSchema,
});

/**
 * Inferred types from schemas
 */
export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;
export type UpdateRequestInput = z.infer<typeof UpdateRequestSchema>;
export type AssignRequestInput = z.infer<typeof AssignRequestSchema>;
export type RequestCancellationInput = z.infer<typeof RequestCancellationSchema>;
export type CompleteRequestInput = z.infer<typeof CompleteRequestSchema>;
export type RequestIdInput = z.infer<typeof RequestIdSchema>;
export type RequestQueryInput = z.infer<typeof RequestQuerySchema>;
export type StatusTransitionInput = z.infer<typeof StatusTransitionSchema>;
