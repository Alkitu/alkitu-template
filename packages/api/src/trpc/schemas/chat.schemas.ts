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
  }),

  sendMessage: z.object({
    conversationId: z.string(),
    content: z.string(),
    isFromVisitor: z.boolean(),
    senderUserId: z.string().optional(),
    metadata: z.any().optional(),
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
};
