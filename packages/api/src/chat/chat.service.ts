import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '@/notification/notification.service';
import { ChatGateway } from './chat.gateway';
import {
  ConversationStatus,
  Priority,
  Conversation,
  ChatMessage,
  ContactInfo,
} from '@prisma/client';
import { ConversationResult, MessageResult } from './interfaces/chat.interface';
import {
  StartConversationDto,
  SendMessageDto,
  GetConversationsDto,
  AssignConversationDto,
  UpdateStatusDto,
  ReplyToMessageDto,
  AddInternalNoteDto,
  MarkAsReadDto,
} from './dto/chat.dto';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ContactInfoRepository } from './repositories/contact-info.repository';

export interface ChatAnalytics {
  totalConversations: number;
  openConversations: number;
  resolvedConversations: number;
  leadsCaptured: number;
  averageResponseTime: number;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly contactInfoRepository: ContactInfoRepository,
    private readonly notificationService: NotificationService,
    private readonly websocketGateway: ChatGateway,
  ) {}

  private sanitizeConversation(conversation: Conversation): Conversation {
    // Remove sensitive data if any, or format for public consumption
    return conversation;
  }

  private sanitizeContactInfo(contactInfo: ContactInfo): ContactInfo {
    // Remove sensitive data if any
    return contactInfo;
  }

  private sanitizeMessage(message: ChatMessage): ChatMessage {
    // Remove sensitive data if any
    return message;
  }

  async startConversation(
    data: StartConversationDto,
  ): Promise<ConversationResult> {
    let contactInfo = await this.contactInfoRepository.findByEmail(
      data.email || '',
    );
    if (!contactInfo) {
      contactInfo = await this.contactInfoRepository.create({
        email: data.email,
        phone: data.phone,
        name: data.name,
        company: data.company,
        source: data.source,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    }

    const conversation = await this.conversationRepository.create({
      contactInfoId: contactInfo.id,
      status: ConversationStatus.OPEN,
      priority: Priority.NORMAL,
      source: data.source || 'website',
    });

    if (data.message) {
      await this.sendMessage({
        conversationId: conversation.id,
        content: data.message,
        isFromVisitor: true,
      });
    }

    await this.notificationService.notifyNewChatConversation(conversation);

    return {
      conversation: this.sanitizeConversation(conversation),
      contactInfo: this.sanitizeContactInfo(contactInfo),
    };
  }

  async sendMessage(data: SendMessageDto): Promise<MessageResult> {
    const message = await this.messageRepository.create({
      conversationId: data.conversationId,
      content: data.content,
      isFromVisitor: data.isFromVisitor,
      senderUserId: data.senderUserId,
      metadata: data.metadata,
    });

    await this.conversationRepository.updateLastMessageTime(
      data.conversationId,
      message.createdAt,
    );

    this.websocketGateway.server.emit('newMessage', message); // Emit to all connected clients

    if (data.isFromVisitor) {
      await this.notificationService.notifyNewChatMessage(message);
    }

    return {
      message: this.sanitizeMessage(message),
    };
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return this.messageRepository.findByConversationId(conversationId);
  }

  async getConversations(filter: GetConversationsDto): Promise<Conversation[]> {
    interface WhereClause {
      status?: ConversationStatus;
      priority?: Priority;
      OR?: Array<{
        contactInfo?: {
          email?: { contains: string; mode: 'insensitive' };
          name?: { contains: string; mode: 'insensitive' };
        };
        messages?: {
          some?: {
            content?: { contains: string; mode: 'insensitive' };
          };
        };
      }>;
    }

    const whereClause: WhereClause = {};
    if (filter.status) whereClause.status = filter.status;
    if (filter.priority) whereClause.priority = filter.priority;
    if (filter.search) {
      whereClause.OR = [
        {
          contactInfo: {
            email: { contains: filter.search, mode: 'insensitive' },
          },
        },
        {
          contactInfo: {
            name: { contains: filter.search, mode: 'insensitive' },
          },
        },
        {
          messages: {
            some: {
              content: { contains: filter.search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    const conversations = await this.conversationRepository.findAll({
      where: whereClause,
      include: { contactInfo: true, messages: true },
      skip: ((filter.page || 1) - 1) * (filter.limit || 10),
      take: filter.limit || 10,
    });

    return conversations.map((conversation) =>
      this.sanitizeConversation(conversation),
    );
  }

  async assignConversation(data: AssignConversationDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.conversationRepository.update(data.conversationId, {
      assignedToId: data.assignedToId,
    });
  }

  async updateStatus(data: UpdateStatusDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.conversationRepository.update(data.conversationId, {
      status: data.status,
    });
  }

  async replyToMessage(data: ReplyToMessageDto): Promise<MessageResult> {
    const message = await this.messageRepository.create({
      conversationId: data.conversationId,
      content: data.content,
      isFromVisitor: false,
      senderUserId: data.senderUserId,
    });

    await this.conversationRepository.updateLastMessageTime(
      data.conversationId,
      message.createdAt,
    );

    this.websocketGateway.server.emit('newMessage', message); // Emit to all connected clients

    return { message: this.sanitizeMessage(message) };
  }

  async addInternalNote(data: AddInternalNoteDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');

    const newNotes = conversation.internalNotes
      ? `${conversation.internalNotes}\n${data.note}`
      : data.note;

    return this.conversationRepository.update(data.conversationId, {
      internalNotes: newNotes,
    });
  }

  async markAsRead(data: MarkAsReadDto): Promise<void> {
    // This would typically mark messages as read for a specific user
    // For simplicity, we'll assume marking all messages in a conversation as read for now
    await this.prisma.chatMessage.updateMany({
      where: {
        conversationId: data.conversationId,
        isFromVisitor: true,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getChatAnalytics(days: number = 30): Promise<ChatAnalytics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalConversations,
      openConversations,
      resolvedConversations,
      leadsCaptured,
    ] = await Promise.all([
      this.conversationRepository.findAll({
        where: { createdAt: { gte: startDate } },
      }),
      this.conversationRepository.findAll({
        where: {
          status: ConversationStatus.OPEN,
          createdAt: { gte: startDate },
        },
      }),
      this.conversationRepository.findAll({
        where: {
          status: ConversationStatus.RESOLVED,
          createdAt: { gte: startDate },
        },
      }),
      this.contactInfoRepository.findAll({
        where: { createdAt: { gte: startDate } },
      }),
    ]);

    // Calculate average response time (simplified for now)
    // This would require more complex logic to track agent response times
    const averageResponseTime = 0;

    return {
      totalConversations: totalConversations.length,
      openConversations: openConversations.length,
      resolvedConversations: resolvedConversations.length,
      leadsCaptured: leadsCaptured.length,
      averageResponseTime,
    };
  }
}
