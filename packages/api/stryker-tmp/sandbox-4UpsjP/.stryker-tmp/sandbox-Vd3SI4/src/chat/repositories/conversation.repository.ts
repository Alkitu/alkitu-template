// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IConversationRepository } from '../interfaces/chat.interface';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<Conversation> {
    return this.prisma.conversation.create({ data });
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({ where: { id } });
  }

  async findAll(filter: any): Promise<Conversation[]> {
    return this.prisma.conversation.findMany(filter);
  }

  async updateLastMessageTime(conversationId: string, lastMessageAt: Date): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt },
    });
  }

  async update(conversationId: string, data: any): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data,
    });
  }
}
