import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { ChatGateway } from './chat.gateway';
import { EmailService } from '../email/email.service';
import {
  ConversationStatus,
  Priority,
  Conversation,
  ChatMessage,
  ContactInfo,
  User,
} from '@prisma/client';
import { ConversationResult, MessageResult } from './interfaces/chat.interface';
import type {
  StartConversationInput,
  SendMessageInput,
  GetConversationsInput,
  AssignConversationInput,
  UpdateStatusInput,
  ReplyToMessageInput,
  AddInternalNoteInput,
  MarkAsReadInput,
  MarkAsDeliveredInput,
} from '../trpc/schemas/chat.schemas';
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
    private readonly emailService: EmailService,
  ) {}

  private sanitizeConversation(conversation: Conversation): Conversation {
    // Remove sensitive data if any, or format for public consumption
    return conversation;
  }

  private sanitizeContactInfo(contactInfo: ContactInfo): ContactInfo {
    // Remove sensitive data if any
    return contactInfo;
  }

  private sanitizeMessage(
    message: ChatMessage & { senderUser?: User | null },
  ): any {
    if (message.senderUser) {
      const msg = message as any;
      msg.senderName =
        `${message.senderUser.firstname} ${message.senderUser.lastname}`.trim() ||
        'Support';
      msg.senderRole = message.senderUser.role;
    }
    return message;
  }

  async startConversation(
    data: StartConversationInput,
  ): Promise<ConversationResult> {
    // Sanitize inputs: treat empty strings as undefined
    const email = data.email?.trim() || undefined;
    const phone = data.phone?.trim() || undefined;
    const userId = data.userId?.trim() || undefined;

    let contactInfo: ContactInfo | null = null;

    // 1. If userId is provided, try to find contact info for this user
    if (userId) {
      contactInfo = await this.prisma.contactInfo.findFirst({
        where: { userId: userId },
      });
    }

    // 2. If not found by userId, try email
    if (!contactInfo && email) {
      contactInfo = await this.contactInfoRepository.findByEmail(email);
    }

    // 3. If not found by email, try phone
    if (!contactInfo && phone) {
      contactInfo = await this.contactInfoRepository.findByPhone(phone);
    }

    // 4. Create or Update Contact Info
    if (!contactInfo) {
      try {
        contactInfo = await this.contactInfoRepository.create({
          email: email,
          phone: phone,
          name: data.name,
          company: data.company,
          source: data.source,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          userId: userId, // Link to user if available
        });
      } catch (error: any) {
        // Handle race condition: Unique constraint violation
        // Check both Prisma code P2002 and error message string as fallback
        const isUniqueConstraintError =
          error.code === 'P2002' ||
          (error.message && error.message.includes('Unique constraint failed'));

        if (isUniqueConstraintError) {
          // Robust Recovery: Try to find the existing record by ANY provided unique identifier
          const conditions: any[] = [];

          if (userId) conditions.push({ userId });
          if (email) conditions.push({ email });
          if (phone) conditions.push({ phone });

          if (conditions.length > 0) {
            contactInfo = await this.prisma.contactInfo.findFirst({
              where: {
                OR: conditions,
              },
            });
          }

          if (!contactInfo) {
            console.error('Failed to recover from unique constraint error:', {
              error: error.message,
              data: { userId, email, phone },
            });
            throw error; // If still not found, it's unrecoverable
          }
        } else {
          throw error;
        }
      }
    } else if (userId && !contactInfo.userId) {
      // ... update logic
      contactInfo = await this.prisma.contactInfo.update({
        where: { id: contactInfo.id },
        data: { userId: userId },
      });
    }

    const conversation = await this.conversationRepository.create({
      contactInfoId: contactInfo.id,
      status: ConversationStatus.OPEN,
      priority: Priority.NORMAL,
      source: data.source || 'website',
      clientUserId: data.userId, // Link conversation to user
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

  async sendMessage(data: SendMessageInput): Promise<MessageResult> {
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

    this.websocketGateway.sendMessageToConversation(data.conversationId, message);

    if (data.isFromVisitor) {
      await this.notificationService.notifyNewChatMessage(message);
    }

    return {
      message: this.sanitizeMessage(message),
    };
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const messages =
      await this.messageRepository.findByConversationId(conversationId);
    return messages.map((msg) => this.sanitizeMessage(msg));
  }

  async getConversationsVisitor(data: {
    conversationIds?: string[];
  }): Promise<Conversation[]> {
    if (!data.conversationIds || data.conversationIds.length === 0) return [];

    return this.conversationRepository.findAll({
      where: { id: { in: data.conversationIds } },
      include: { contactInfo: true },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findAll({
      where: { clientUserId: userId },
      include: { contactInfo: true },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getConversations(filter: GetConversationsInput): Promise<{ conversations: Conversation[], total: number, page: number, limit: number, totalPages: number }> {
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

    const page = filter.page || 1;
    const limit = filter.limit || 10;

    const [conversations, total] = await Promise.all([
      this.conversationRepository.findAll({
        where: whereClause,
        include: { contactInfo: true, messages: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.conversation.count({ where: whereClause }),
    ]);

    const sanitizedConversations = conversations.map((conversation) =>
      this.sanitizeConversation(conversation),
    );

    return {
      conversations: sanitizedConversations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConversationById(conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findAll({
      where: { id: conversationId },
      include: { contactInfo: true, messages: true },
    });

    if (!conversation || conversation.length === 0) {
      throw new NotFoundException('Conversation not found');
    }

    return this.sanitizeConversation(conversation[0]);
  }

  async assignConversation(data: AssignConversationInput): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.conversationRepository.update(data.conversationId, {
      assignedToId: data.assignedToId,
    });
  }

  async updateStatus(data: UpdateStatusInput): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.conversationRepository.update(data.conversationId, {
      status: data.status,
    });
  }

  async replyToMessage(data: ReplyToMessageInput): Promise<MessageResult> {
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

    this.websocketGateway.sendMessageToConversation(data.conversationId, message);

    return { message: this.sanitizeMessage(message) };
  }

  async addInternalNote(data: AddInternalNoteInput): Promise<Conversation> {
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

  async markAsRead(
    data: MarkAsReadInput & { isVisitor?: boolean },
  ): Promise<void> {
    // Mark messages as read based on who is doing the reading
    // If visitor is reading, mark messages FROM support as read
    // If admin is reading, mark messages FROM visitor as read
    await this.prisma.chatMessage.updateMany({
      where: {
        conversationId: data.conversationId,
        isFromVisitor: data.isVisitor ? false : true,
        isRead: false,
      },
      data: {
        isRead: true,
        isDelivered: true,
      },
    });
  }

  async markAsDelivered(data: MarkAsDeliveredInput & { isVisitor?: boolean }): Promise<void> {
    // Mark messages as delivered when they are received by the client
    await this.prisma.chatMessage.updateMany({
      where: {
        conversationId: data.conversationId,
        isFromVisitor: data.isVisitor ? false : true,
        isDelivered: false,
      },
      data: { isDelivered: true },
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

  async sendEmailTranscript(
    conversationId: string,
    email: string,
  ): Promise<void> {
    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const messages =
      await this.messageRepository.findByConversationId(conversationId);

    let transcriptHtml = `<h1>Chat Transcript - ${conversationId}</h1>`;
    transcriptHtml += `<p>Conversation started at: ${conversation.createdAt.toLocaleString()}</p><hr/>`;

    messages.forEach((msg) => {
      const sender = msg.isFromVisitor ? 'Visitor' : 'Support';
      transcriptHtml += `<p><strong>${sender}</strong> (${msg.createdAt.toLocaleString()}):<br/>${msg.content}</p>`;
    });

    await this.emailService.sendEmail({
      to: email,
      subject: `Chat Transcript - ${conversationId}`,
      html: transcriptHtml,
    });
  }

  /**
   * Get or create a conversation for a specific request
   * Enables internal team communication about a request
   */
  async getOrCreateRequestConversation(
    requestId: string,
  ): Promise<Conversation> {
    // 1. Check if request already has a conversation
    const existingRequest = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: {
        conversations: {
          where: { type: 'INTERNAL_REQUEST' },
          take: 1,
        },
        user: true,
        assignedTo: true,
      },
    });

    if (!existingRequest) {
      throw new NotFoundException('Request not found');
    }

    // If conversation already exists, return it
    if (
      existingRequest.conversations &&
      existingRequest.conversations.length > 0
    ) {
      return existingRequest.conversations[0];
    }

    // 2. Create or get contact info for the request user
    let contactInfo = await this.prisma.contactInfo.findFirst({
      where: { userId: existingRequest.userId },
    });

    if (!contactInfo) {
      contactInfo = await this.prisma.contactInfo.create({
        data: {
          userId: existingRequest.userId,
          email: existingRequest.user.email,
          name: `${existingRequest.user.firstname} ${existingRequest.user.lastname}`,
        },
      });
    }

    // 3. Create conversation of type INTERNAL_REQUEST
    const conversation = await this.prisma.conversation.create({
      data: {
        contactInfoId: contactInfo.id,
        clientUserId: existingRequest.userId,
        assignedToId: existingRequest.assignedToId,
        type: 'INTERNAL_REQUEST',
        status: 'OPEN',
        source: 'request-system',
        tags: [`request:${requestId}`],
        requestId: requestId,
      },
    });

    return conversation;
  }
}
