// @ts-nocheck
// 
import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';

@Module({
  imports: [UsersModule, EmailModule, NotificationModule, WebSocketModule],
  providers: [TrpcService, TrpcRouter, PrismaService, ChatbotConfigService],
  exports: [TrpcService],
})
export class TrpcModule {}
