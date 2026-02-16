import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { chatSchemas } from '../schemas/chat.schemas';
import { requireFeature } from '../middlewares/roles.middleware';
import {
  SendMessageDto,
  AssignConversationDto,
  UpdateStatusDto,
  ReplyToMessageDto,
  AddInternalNoteDto,
  MarkAsReadDto,
  MarkAsDeliveredDto,
} from '../../chat/dto/chat.dto';

export const chatRouter = createTRPCRouter({
  // Public API for website visitors
  startConversation: publicProcedure
    .input(chatSchemas.startConversation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.startConversation(input);
    }),

  sendMessage: publicProcedure
    .input(chatSchemas.sendMessage)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.sendMessage(input as SendMessageDto);
    }),

  getMessages: publicProcedure
    .input(chatSchemas.getMessages)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getMessages(input.conversationId);
    }),

  getConversationsVisitor: publicProcedure
    .input(chatSchemas.getConversationsVisitor)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getConversationsVisitor(input);
    }),

  markAsReadVisitor: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsRead({
        conversationId: input.conversationId,
        userId: 'visitor',
        isVisitor: true,
      });
    }),

  markAsDeliveredVisitor: publicProcedure
    .input(chatSchemas.markAsDelivered)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsDelivered({
        conversationId: input.conversationId,
        isVisitor: true,
      });
    }),

  getMyConversations: protectedProcedure.query(async ({ ctx }) => {
    // Access authenticated user via ctx.user
    return await ctx.chatService.getUserConversations(ctx.user.id);
  }),

  // Admin API for internal management (protected by support-chat feature flag)
  getConversations: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.getConversations)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getConversations(input);
    }),

  getConversation: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.getMessages) // Reuse getMessages schema as it only requires conversationId
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getConversationById(input.conversationId);
    }),

  assignConversation: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.assignConversation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.assignConversation(
        input as AssignConversationDto,
      );
    }),

  updateStatus: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.updateStatus)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.updateStatus(input as UpdateStatusDto);
    }),

  replyToMessage: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.replyToMessage)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.replyToMessage(input as ReplyToMessageDto);
    }),

  addInternalNote: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.addInternalNote)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.addInternalNote(input as AddInternalNoteDto);
    }),

  markAsRead: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.markAsRead)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsRead(input as MarkAsReadDto);
    }),

  markAsDelivered: protectedProcedure
    .use(requireFeature('support-chat'))
    .input(chatSchemas.markAsDelivered)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsDelivered(input as MarkAsDeliveredDto);
    }),

  getChatAnalytics: protectedProcedure
    .use(requireFeature('support-chat'))
    .query(async ({ ctx }) => {
      return await ctx.chatService.getChatAnalytics();
    }),
  sendEmailTranscript: publicProcedure
    .input(chatSchemas.sendEmailTranscript)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.sendEmailTranscript(
        input.conversationId,
        input.email,
      );
    }),

  /**
   * Get or create a conversation for a request (internal team chat)
   * Protected by request-collaboration feature flag
   */
  getOrCreateRequestConversation: protectedProcedure
    .use(requireFeature('request-collaboration'))
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.getOrCreateRequestConversation(
        input.requestId,
      );
    }),
});
