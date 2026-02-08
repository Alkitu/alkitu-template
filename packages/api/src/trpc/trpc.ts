import { initTRPC, TRPCError } from '@trpc/server';
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

/**
 * Authentication middleware for protected procedures
 * Ensures user is authenticated before allowing access
 */
const requireAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-safe guaranteed user
    },
  });
});

/**
 * Protected procedure that requires authentication
 * Use this for any endpoint that needs a logged-in user
 */
export const protectedProcedure = t.procedure.use(requireAuth);
