// @ts-nocheck
import { INestApplication, Injectable } from '@nestjs/common';
import { TrpcRouter } from './trpc.router';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaService } from '../prisma.service';
import { ChatService } from '../chat/chat.service';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';

@Injectable()
export class TrpcService {
  constructor(
    private readonly trpcRouter: TrpcRouter,
    private prisma: PrismaService,
    private chatService: ChatService,
    private chatbotConfigService: ChatbotConfigService,
  ) {}

  applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.trpcRouter.appRouter,
        createContext: () => ({ 
          prisma: this.prisma,
          chatService: this.chatService,
          chatbotConfigService: this.chatbotConfigService,
        }),
      }),
    );
  }
}
