import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { ChatModule } from '../chat/chat.module';
import { ChatbotConfigModule } from '../chatbot-config/chatbot-config.module';
import { ThemeModule } from '../theme/theme.module';
import { EmailTemplateModule } from '../email-templates/email-template.module';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    NotificationModule,
    WebSocketModule,
    ChatModule,
    ChatbotConfigModule,
    ThemeModule,
    EmailTemplateModule, // ALI-121: Email Templates Module
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [TrpcService, TrpcRouter, PrismaService],
  exports: [TrpcService],
})
export class TrpcModule {}
