// @ts-nocheck
// 
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ContactInfoRepository } from './repositories/contact-info.repository';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    PrismaService,
    NotificationService,
    ConversationRepository,
    MessageRepository,
    ContactInfoRepository,
  ],
  exports: [ChatService],
})
export class ChatModule {}
