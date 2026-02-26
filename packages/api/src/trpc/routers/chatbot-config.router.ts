import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { chatbotConfigSchemas } from '../schemas/chatbot-config.schemas';
import type { Prisma } from '@prisma/client';

export const chatbotConfigRouter = createTRPCRouter({
  get: publicProcedure
    .input(chatbotConfigSchemas.getChatbotConfig)
    .query(async ({ ctx }) => {
      return ctx.chatbotConfigService.getChatbotConfig();
    }),

  update: protectedProcedure
    .input(chatbotConfigSchemas.updateChatbotConfig)
    .mutation(async ({ input, ctx }) => {
      const { schedule, ...rest } = input;
      return ctx.chatbotConfigService.updateChatbotConfig({
        ...rest,
        ...(schedule !== undefined && {
          schedule: schedule as unknown as Prisma.JsonValue,
        }),
      });
    }),
});
