import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ContactInfoRepository } from './repositories/contact-info.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    NotificationModule,
    EmailModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    PrismaService,
    ConversationRepository,
    MessageRepository,
    ContactInfoRepository,
  ],
  exports: [ChatService],
})
export class ChatModule {}
