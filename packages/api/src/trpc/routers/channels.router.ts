import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { channelsSchemas } from '../schemas/channels.schemas';
import { requireFeature } from '../middlewares/roles.middleware';

/**
 * Team Channels Router
 * All endpoints protected by 'team-channels' feature flag
 */

// Create a base procedure with team-channels feature flag requirement
const teamChannelsProcedure = protectedProcedure.use(requireFeature('team-channels'));

export const channelsRouter = createTRPCRouter({
  create: teamChannelsProcedure
    .input(channelsSchemas.createChannel)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore - Assuming we add channelsService to context
      return await ctx.channelsService.createChannel(input, ctx.user.id);
    }),

  getMyChannels: teamChannelsProcedure.query(async ({ ctx }) => {
    // @ts-ignore
    return await ctx.channelsService.getUserChannels(ctx.user.id);
  }),

  getChannel: teamChannelsProcedure
    .input(channelsSchemas.getChannel)
    .query(async ({ input, ctx }) => {
      // @ts-ignore
      const channel = await ctx.channelsService.getChannelDetails(
        input.channelId,
      );

      // Basic security: Check if user is member?
      // Ideally the service should handle this or we filtered by finding if member exists.
      // For now assuming if you have ID you can view (or service handles it)
      return channel;
    }),

  getMessages: teamChannelsProcedure
    .input(channelsSchemas.getMessages)
    .query(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.getChannelMessages(input.channelId);
    }),

  getReplies: teamChannelsProcedure
    .input(channelsSchemas.getReplies)
    .query(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.getThreadMessages(input.parentId);
    }),

  sendMessage: teamChannelsProcedure
    .input(channelsSchemas.sendMessage)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      // @ts-ignore
      return await ctx.channelsService.sendMessage(ctx.user.id, input);
    }),

  update: teamChannelsProcedure
    .input(channelsSchemas.updateChannel)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.updateChannel(input.channelId, input);
    }),

  delete: teamChannelsProcedure
    .input(channelsSchemas.deleteChannel)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.deleteChannel(input.channelId);
    }),

  createDM: teamChannelsProcedure
    .input(channelsSchemas.createDM)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.createDM(
        ctx.user.id,
        input.targetUserIds,
      );
    }),

  toggleFavorite: teamChannelsProcedure
    .input(channelsSchemas.toggleFavorite)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.toggleFavorite(
        input.channelId,
        ctx.user.id,
      );
    }),

  markAsRead: teamChannelsProcedure
    .input(channelsSchemas.markAsRead)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.markMessagesAsRead(
        input.channelId,
        ctx.user.id,
      );
    }),

  addMember: teamChannelsProcedure
    .input(channelsSchemas.addMember)
    .mutation(async ({ input, ctx }) => {
      // @ts-ignore
      return await ctx.channelsService.addMember(
        input.channelId as string,
        input.userId as string,
        input.role,
      );
    }),

  archiveChannel: teamChannelsProcedure
    .input(channelsSchemas.archiveChannel)
    .mutation(async ({ input, ctx }) => {
      return await ctx.channelsService.archiveChannel(
        input.channelId,
        ctx.user.id,
      );
    }),

  hideChannel: teamChannelsProcedure
    .input(channelsSchemas.hideChannel)
    .mutation(async ({ input, ctx }) => {
      return await ctx.channelsService.hideChannel(
        input.channelId,
        ctx.user.id,
      );
    }),

  leaveChannel: teamChannelsProcedure
    .input(channelsSchemas.leaveChannel)
    .mutation(async ({ input, ctx }) => {
      return await ctx.channelsService.leaveChannel(
        input.channelId,
        ctx.user.id,
      );
    }),
});
