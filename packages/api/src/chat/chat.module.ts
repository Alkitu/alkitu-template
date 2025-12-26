import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ContactInfoRepository } from './repositories/contact-info.repository';

@Module({
  imports: [NotificationModule],
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
