// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  IMessageRepository,
  CreateMessageData,
} from '../interfaces/chat.interface';
import { ChatMessage } from '@prisma/client';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMessageData): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({
      data: {
        ...data,
        isRead: false,
        createdAt: new Date(),
      },
      include: {
        conversation: {
          include: {
            contactInfo: true,
          },
        },
      },
    });
  }

  async findByConversationId(conversationId: string): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        conversation: {
          select: { id: true, status: true },
        },
      },
    });
  }
}
