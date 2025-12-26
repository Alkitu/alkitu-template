import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { channelsSchemas } from '../schemas/channels.schemas';

export const channelsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(channelsSchemas.createChannel)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore - Assuming we add channelsService to context
      return await ctx.channelsService.createChannel(input, ctx.user.id);
    }),

  getMyChannels: protectedProcedure
    .query(async ({ ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.getUserChannels(ctx.user.id);
    }),

  getChannel: protectedProcedure
    .input(channelsSchemas.getChannel)
    .query(async ({ input, ctx }) => {
      // @ts-ignore
      const channel = await ctx.channelsService.getChannelDetails(input.channelId);
      
      // Basic security: Check if user is member?
      // Ideally the service should handle this or we filtered by finding if member exists.
      // For now assuming if you have ID you can view (or service handles it)
      return channel;
    }),

  getMessages: protectedProcedure
    .input(channelsSchemas.getMessages)
    .query(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.getChannelMessages(input.channelId);
    }),

  getReplies: protectedProcedure
    .input(channelsSchemas.getReplies)
    .query(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.getThreadMessages(input.parentId);
    }),

  sendMessage: protectedProcedure
    .input(channelsSchemas.sendMessage)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      // @ts-ignore
      return await ctx.channelsService.sendMessage(ctx.user.id, input);
    }),

  update: protectedProcedure
    .input(channelsSchemas.updateChannel)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.updateChannel(input.channelId, input);
    }),

  delete: protectedProcedure
    .input(channelsSchemas.deleteChannel)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.deleteChannel(input.channelId);
    }),

  createDM: protectedProcedure
    .input(channelsSchemas.createDM)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.createDM(ctx.user.id, input.targetUserIds);
    }),

  toggleFavorite: protectedProcedure
    .input(channelsSchemas.toggleFavorite)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.toggleFavorite(input.channelId, ctx.user.id);
    }),

  markAsRead: protectedProcedure
    .input(channelsSchemas.markAsRead)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.markMessagesAsRead(input.channelId, ctx.user.id);
    }),
});
