import { z } from 'zod';
import { ConversationStatus, Priority } from '@prisma/client';

export const chatSchemas = {
  startConversation: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
    company: z.string().optional(),
    message: z.string().optional(),
    source: z.string().optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    userId: z.string().optional(),
  }),

  sendMessage: z.object({
    conversationId: z.string(),
    content: z.string(),
    isFromVisitor: z.boolean(),
    senderUserId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),

  getMessages: z.object({
    conversationId: z.string(),
  }),

  getConversations: z.object({
    status: z.nativeEnum(ConversationStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    search: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }),

  getConversationsVisitor: z.object({
    conversationIds: z.array(z.string()),
  }),

  assignConversation: z.object({
    conversationId: z.string(),
    assignedToId: z.string(),
  }),

  updateStatus: z.object({
    conversationId: z.string(),
    status: z.nativeEnum(ConversationStatus),
  }),

  replyToMessage: z.object({
    conversationId: z.string(),
    content: z.string(),
    senderUserId: z.string(),
  }),

  addInternalNote: z.object({
    conversationId: z.string(),
    note: z.string(),
  }),

  markAsRead: z.object({
    conversationId: z.string(),
    userId: z.string(),
  }),

  markAsDelivered: z.object({
    conversationId: z.string(),
  }),

  sendEmailTranscript: z.object({
    conversationId: z.string(),
    email: z.string().email(),
  }),

  markAsReadVisitor: z.object({
    conversationId: z.string(),
  }),

  getOrCreateRequestConversation: z.object({
    requestId: z.string(),
  }),
};

// Zod-inferred types — use these in services instead of DTOs
export type StartConversationInput = z.infer<typeof chatSchemas.startConversation>;
export type SendMessageInput = z.infer<typeof chatSchemas.sendMessage>;
export type GetConversationsInput = z.infer<typeof chatSchemas.getConversations>;
export type AssignConversationInput = z.infer<typeof chatSchemas.assignConversation>;
export type UpdateStatusInput = z.infer<typeof chatSchemas.updateStatus>;
export type ReplyToMessageInput = z.infer<typeof chatSchemas.replyToMessage>;
export type AddInternalNoteInput = z.infer<typeof chatSchemas.addInternalNote>;
export type MarkAsReadInput = z.infer<typeof chatSchemas.markAsRead>;
export type MarkAsDeliveredInput = z.infer<typeof chatSchemas.markAsDelivered>;
