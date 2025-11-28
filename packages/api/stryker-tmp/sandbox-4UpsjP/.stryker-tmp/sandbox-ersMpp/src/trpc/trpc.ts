// @ts-nocheck
// 
import { initTRPC } from '@trpc/server';
import { PrismaService } from '../prisma.service';
import { ChatService } from '../chat/chat.service';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';

export interface Context {
  prisma: PrismaService;
  chatService: ChatService;
  chatbotConfigService: ChatbotConfigService;
}

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;
