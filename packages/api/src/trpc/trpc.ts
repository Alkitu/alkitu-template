import { initTRPC } from '@trpc/server';
import { PrismaService } from '../prisma.service';
import { ChatService } from '../chat/chat.service';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';
import { ChannelsService } from '../channels/channels.service';
import { AccessControlService } from '../access-control/access-control.service';

export interface Context {
  prisma: PrismaService;
  chatService: ChatService;
  channelsService: ChannelsService;
  chatbotConfigService: ChatbotConfigService;
  accessControl: AccessControlService;
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
