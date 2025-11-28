// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  IConversationRepository,
  CreateConversationData,
  UpdateConversationData,
  ConversationFindOptions,
} from '../interfaces/chat.interface';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateConversationData): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        contactInfo: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        assignedTo: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  }

  async findAll(options: ConversationFindOptions): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: options.where,
      include: options.include,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy || { createdAt: 'desc' },
    });
  }

  async updateLastMessageTime(
    conversationId: string,
    lastMessageAt: Date,
  ): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt,
        updatedAt: new Date(),
      },
    });
  }

  async update(
    conversationId: string,
    data: UpdateConversationData,
  ): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
