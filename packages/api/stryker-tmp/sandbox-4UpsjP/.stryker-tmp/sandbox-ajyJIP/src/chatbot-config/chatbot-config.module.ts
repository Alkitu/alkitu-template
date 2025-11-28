// @ts-nocheck
// 
import { Module } from '@nestjs/common';
import { ChatbotConfigService } from './chatbot-config.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ChatbotConfigService, PrismaService],
  exports: [ChatbotConfigService],
})
export class ChatbotConfigModule {}
