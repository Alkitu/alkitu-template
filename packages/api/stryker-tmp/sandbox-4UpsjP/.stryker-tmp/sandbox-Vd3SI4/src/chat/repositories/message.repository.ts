// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IMessageRepository } from '../interfaces/chat.interface';
import { ChatMessage } from '@prisma/client';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({ data });
  }

  async findByConversationId(conversationId: string): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({ where: { conversationId } });
  }
}
