import { initTRPC } from '@trpc/server';
import { PrismaService } from '../prisma.service';
import { ChatService } from '../chat/chat.service';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';
import { ChannelsService } from '../channels/channels.service';

export interface Context {
  prisma: PrismaService;
  chatService: ChatService;
  channelsService: ChannelsService;
  chatbotConfigService: ChatbotConfigService;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;
