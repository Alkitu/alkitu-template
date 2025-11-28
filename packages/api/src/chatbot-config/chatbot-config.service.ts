import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ChatbotConfig } from '@prisma/client';

@Injectable()
export class ChatbotConfigService {
  constructor(private prisma: PrismaService) {}

  async getChatbotConfig(): Promise<ChatbotConfig | null> {
    // Assuming there's only one chatbot configuration, or we fetch the first one
    return this.prisma.chatbotConfig.findFirst();
  }

  async updateChatbotConfig(
    data: Partial<ChatbotConfig>,
  ): Promise<ChatbotConfig> {
    // Assuming there's only one chatbot configuration, we'll upsert it
    const existingConfig = await this.prisma.chatbotConfig.findFirst();

    if (existingConfig) {
      return this.prisma.chatbotConfig.update({
        where: { id: existingConfig.id },
        data,
      });
    } else {
      return this.prisma.chatbotConfig.create({ data });
    }
  }
}
