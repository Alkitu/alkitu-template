import { INestApplication, Injectable } from '@nestjs/common';
import { TrpcRouter } from './trpc.router';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaService } from '../prisma.service';
import { ChatService } from '../chat/chat.service';
import { ChannelsService } from '../channels/channels.service';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TrpcService {
  constructor(
    private readonly trpcRouter: TrpcRouter,
    private prisma: PrismaService,
    private chatService: ChatService,
    private channelsService: ChannelsService,
    private chatbotConfigService: ChatbotConfigService,
    private jwtService: JwtService,
  ) {}

  applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.trpcRouter.appRouter(),
        createContext: ({ req }) => {
          let user = undefined;

          try {
            // Parse auth-token from cookies
            const cookieHeader = req.headers.cookie;
            if (cookieHeader) {
              const cookies = cookieHeader.split(';').reduce(
                (acc, cookie) => {
                  const [key, value] = cookie.trim().split('=');
                  acc[key] = value;
                  return acc;
                },
                {} as Record<string, string>,
              );

              const token = cookies['auth-token'];

              if (token) {
                const decoded = this.jwtService.verify(token);
                if (decoded) {
                  user = {
                    id: decoded.sub || decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                  };
                }
              }
            }
          } catch (error) {
            // Invalid token or verification failed - proceed as anonymous
          }

          return {
            prisma: this.prisma,
            chatService: this.chatService,
            channelsService: this.channelsService,
            chatbotConfigService: this.chatbotConfigService,
            user,
          };
        },
      }),
    );
  }
}
