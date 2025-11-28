import { Module } from '@nestjs/common';
import { ChatbotConfigService } from './chatbot-config.service';
import { ChatbotConfigController } from './chatbot-config.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ChatbotConfigController],
  providers: [ChatbotConfigService, PrismaService],
  exports: [ChatbotConfigService],
})
export class ChatbotConfigModule {}
