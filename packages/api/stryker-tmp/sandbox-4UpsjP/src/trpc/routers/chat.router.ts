// @ts-nocheck
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { chatSchemas } from "../schemas/chat.schemas";
import { ChatService } from '../../chat/chat.service';

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
      return await ctx.chatService.sendMessage(input);
    }),

  getMessages: publicProcedure
    .input(chatSchemas.getMessages)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getMessages(input.conversationId);
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
      return await ctx.chatService.assignConversation(input);
    }),

  updateStatus: protectedProcedure
    .input(chatSchemas.updateStatus)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.updateStatus(input);
    }),

  replyToMessage: protectedProcedure
    .input(chatSchemas.replyToMessage)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.replyToMessage(input);
    }),

  addInternalNote: protectedProcedure
    .input(chatSchemas.addInternalNote)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.addInternalNote(input);
    }),

  markAsRead: protectedProcedure
    .input(chatSchemas.markAsRead)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsRead(input);
    }),

  getChatAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.chatService.getChatAnalytics();
    }),
});
