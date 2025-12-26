import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { chatSchemas } from '../schemas/chat.schemas';

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
      return await ctx.chatService.sendMessage(input as any);
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
      return await ctx.chatService.markAsRead({ conversationId: input.conversationId, userId: 'visitor', isVisitor: true });
    }),

  markAsDeliveredVisitor: publicProcedure
    .input(chatSchemas.markAsDelivered)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsDelivered({ conversationId: input.conversationId, userId: 'visitor', isVisitor: true });
    }),

  getMyConversations: protectedProcedure
    .query(async ({ ctx }) => {
      // Access authenticated user via ctx.user
      return await ctx.chatService.getUserConversations(ctx.user.id);
    }),

  // Admin API for internal management
  getConversations: protectedProcedure
    .input(chatSchemas.getConversations)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getConversations(input);
    }),

  assignConversation: protectedProcedure
    .input(chatSchemas.assignConversation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.assignConversation(input as any);
    }),

  updateStatus: protectedProcedure
    .input(chatSchemas.updateStatus)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.updateStatus(input as any);
    }),

  replyToMessage: protectedProcedure
    .input(chatSchemas.replyToMessage)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.replyToMessage(input as any);
    }),

  addInternalNote: protectedProcedure
    .input(chatSchemas.addInternalNote)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.addInternalNote(input as any);
    }),

  markAsRead: protectedProcedure
    .input(chatSchemas.markAsRead)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsRead(input as any);
    }),

  markAsDelivered: protectedProcedure
    .input(chatSchemas.markAsDelivered)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsDelivered(input as any);
    }),

  getChatAnalytics: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.chatService.getChatAnalytics();
  }),
  sendEmailTranscript: publicProcedure
    .input(chatSchemas.sendEmailTranscript)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore - Assuming chatService will have this method implemented
      return await ctx.chatService.sendEmailTranscript(input.conversationId, input.email);
    }),
});
