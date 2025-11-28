// @ts-nocheck
import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { ChatModule } from '../chat/chat.module';
import { ChatbotConfigModule } from '../chatbot-config/chatbot-config.module';

@Module({
  imports: [UsersModule, EmailModule, NotificationModule, WebSocketModule, ChatModule, ChatbotConfigModule],
  providers: [TrpcService, TrpcRouter, PrismaService],
  exports: [TrpcService],
})
export class TrpcModule {}
