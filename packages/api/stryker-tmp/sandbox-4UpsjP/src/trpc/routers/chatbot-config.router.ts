// @ts-nocheck
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { chatbotConfigSchemas } from "../schemas/chatbot-config.schemas";
import { ChatbotConfigService } from '../../chatbot-config/chatbot-config.service';

export const chatbotConfigRouter = createTRPCRouter({
  get: publicProcedure
    .input(chatbotConfigSchemas.getChatbotConfig)
    .query(async ({ ctx }) => {
      return ctx.chatbotConfigService.getChatbotConfig();
    }),

  update: protectedProcedure
    .input(chatbotConfigSchemas.updateChatbotConfig)
    .mutation(async ({ input, ctx }) => {
      return ctx.chatbotConfigService.updateChatbotConfig(input);
    }),
});
