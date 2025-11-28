import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '@/notification/notification.service';
import { ChatGateway } from './chat.gateway';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ContactInfoRepository } from './repositories/contact-info.repository';
import { ConversationStatus, Priority } from '@prisma/client';

describe('ChatService - Comprehensive Business Logic Tests', () => {
  let service: ChatService;
  let prismaService: jest.Mocked<PrismaService>;
  let notificationService: jest.Mocked<NotificationService>;
  let chatGateway: jest.Mocked<ChatGateway>;
  let conversationRepository: jest.Mocked<ConversationRepository>;
  let messageRepository: jest.Mocked<MessageRepository>;
  let contactInfoRepository: jest.Mocked<ContactInfoRepository>;

  // Mock data
  const mockContactInfo = {
    id: 'contact-1',
    email: 'test@example.com',
    phone: '+1234567890',
    name: 'John Doe',
    company: 'Test Company',
    source: 'website',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockConversation = {
    id: 'conv-1',
    contactInfoId: 'contact-1',
    status: ConversationStatus.OPEN,
    priority: Priority.NORMAL,
    source: 'website',
    assignedToId: null,
    internalNotes: null,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(),
    contactInfo: mockContactInfo,
    messages: [],
  };

  const mockMessage = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'Hello, I need help',
    isFromVisitor: true,
    senderUserId: null,
    metadata: null,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock WebSocket Gateway
  const mockWebSocketGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  // Mock PrismaService
  const mockPrismaService = {
    chatMessage: {
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationService,
          useValue: {
            notifyNewChatConversation: jest.fn(),
            notifyNewChatMessage: jest.fn(),
          },
        },
        {
          provide: ChatGateway,
          useValue: mockWebSocketGateway,
        },
        {
          provide: ConversationRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            updateLastMessageTime: jest.fn(),
          },
        },
        {
          provide: MessageRepository,
          useValue: {
            create: jest.fn(),
            findByConversationId: jest.fn(),
          },
        },
        {
          provide: ContactInfoRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prismaService = module.get(PrismaService);
    notificationService = module.get(NotificationService);
    chatGateway = module.get(ChatGateway);
    conversationRepository = module.get(ConversationRepository);
    messageRepository = module.get(MessageRepository);
    contactInfoRepository = module.get(ContactInfoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startConversation', () => {
    it('should create a new conversation with existing contact info', async () => {
      const startConversationDto = {
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        company: 'Test Company',
        source: 'website',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        message: 'Hello, I need help',
      };

      contactInfoRepository.findByEmail.mockResolvedValue(mockContactInfo);
      conversationRepository.create.mockResolvedValue(mockConversation);
      messageRepository.create.mockResolvedValue(mockMessage);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);
      notificationService.notifyNewChatConversation.mockResolvedValue(
        undefined,
      );
      notificationService.notifyNewChatMessage.mockResolvedValue(undefined);

      const result = await service.startConversation(startConversationDto);

      expect(contactInfoRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(conversationRepository.create).toHaveBeenCalledWith({
        contactInfoId: 'contact-1',
        status: ConversationStatus.OPEN,
        priority: Priority.NORMAL,
        source: 'website',
      });
      expect(messageRepository.create).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Hello, I need help',
        isFromVisitor: true,
      });
      expect(
        notificationService.notifyNewChatConversation,
      ).toHaveBeenCalledWith(mockConversation);
      expect(notificationService.notifyNewChatMessage).toHaveBeenCalledWith(
        mockMessage,
      );
      expect(result).toEqual({
        conversation: mockConversation,
        contactInfo: mockContactInfo,
      });
    });

    it('should create a new conversation with new contact info', async () => {
      const startConversationDto = {
        email: 'new@example.com',
        phone: '+1234567890',
        name: 'Jane Smith',
        company: 'New Company',
        source: 'website',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
      };

      const newContactInfo = {
        ...mockContactInfo,
        id: 'contact-2',
        email: 'new@example.com',
        name: 'Jane Smith',
      };
      const newConversation = {
        ...mockConversation,
        id: 'conv-2',
        contactInfoId: 'contact-2',
      };

      contactInfoRepository.findByEmail.mockResolvedValue(null);
      contactInfoRepository.create.mockResolvedValue(newContactInfo);
      conversationRepository.create.mockResolvedValue(newConversation);
      notificationService.notifyNewChatConversation.mockResolvedValue(
        undefined,
      );

      const result = await service.startConversation(startConversationDto);

      expect(contactInfoRepository.findByEmail).toHaveBeenCalledWith(
        'new@example.com',
      );
      expect(contactInfoRepository.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        phone: '+1234567890',
        name: 'Jane Smith',
        company: 'New Company',
        source: 'website',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
      });
      expect(conversationRepository.create).toHaveBeenCalledWith({
        contactInfoId: 'contact-2',
        status: ConversationStatus.OPEN,
        priority: Priority.NORMAL,
        source: 'website',
      });
      expect(result).toEqual({
        conversation: newConversation,
        contactInfo: newContactInfo,
      });
    });

    it('should create conversation without initial message', async () => {
      const startConversationDto = {
        email: 'test@example.com',
        name: 'John Doe',
        source: 'website',
      };

      contactInfoRepository.findByEmail.mockResolvedValue(mockContactInfo);
      conversationRepository.create.mockResolvedValue(mockConversation);
      notificationService.notifyNewChatConversation.mockResolvedValue(
        undefined,
      );

      const result = await service.startConversation(startConversationDto);

      expect(messageRepository.create).not.toHaveBeenCalled();
      expect(notificationService.notifyNewChatMessage).not.toHaveBeenCalled();
      expect(result).toEqual({
        conversation: mockConversation,
        contactInfo: mockContactInfo,
      });
    });
  });

  describe('sendMessage', () => {
    it('should send a message from visitor', async () => {
      const sendMessageDto = {
        conversationId: 'conv-1',
        content: 'Hello, I need help',
        isFromVisitor: true,
        metadata: { userAgent: 'Mozilla/5.0' },
      };

      messageRepository.create.mockResolvedValue(mockMessage);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);
      notificationService.notifyNewChatMessage.mockResolvedValue(undefined);

      const result = await service.sendMessage(sendMessageDto);

      expect(messageRepository.create).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Hello, I need help',
        isFromVisitor: true,
        senderUserId: undefined,
        metadata: { userAgent: 'Mozilla/5.0' },
      });
      expect(conversationRepository.updateLastMessageTime).toHaveBeenCalledWith(
        'conv-1',
        mockMessage.createdAt,
      );
      expect(chatGateway.server.emit).toHaveBeenCalledWith(
        'newMessage',
        mockMessage,
      );
      expect(notificationService.notifyNewChatMessage).toHaveBeenCalledWith(
        mockMessage,
      );
      expect(result).toEqual({ message: mockMessage });
    });

    it('should send a message from agent', async () => {
      const sendMessageDto = {
        conversationId: 'conv-1',
        content: 'How can I help you?',
        isFromVisitor: false,
        senderUserId: 'agent-1',
      };

      const agentMessage = {
        ...mockMessage,
        isFromVisitor: false,
        senderUserId: 'agent-1',
      };
      messageRepository.create.mockResolvedValue(agentMessage);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);

      const result = await service.sendMessage(sendMessageDto);

      expect(messageRepository.create).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'How can I help you?',
        isFromVisitor: false,
        senderUserId: 'agent-1',
        metadata: undefined,
      });
      expect(chatGateway.server.emit).toHaveBeenCalledWith(
        'newMessage',
        agentMessage,
      );
      expect(notificationService.notifyNewChatMessage).not.toHaveBeenCalled();
      expect(result).toEqual({ message: agentMessage });
    });
  });

  describe('getMessages', () => {
    it('should retrieve messages for a conversation', async () => {
      const conversationId = 'conv-1';
      const messages = [
        mockMessage,
        { ...mockMessage, id: 'msg-2', content: 'Another message' },
      ];

      messageRepository.findByConversationId.mockResolvedValue(messages);

      const result = await service.getMessages(conversationId);

      expect(messageRepository.findByConversationId).toHaveBeenCalledWith(
        conversationId,
      );
      expect(result).toEqual(messages);
    });

    it('should return empty array when no messages exist', async () => {
      const conversationId = 'conv-1';

      messageRepository.findByConversationId.mockResolvedValue([]);

      const result = await service.getMessages(conversationId);

      expect(result).toEqual([]);
    });
  });

  describe('getConversations', () => {
    it('should retrieve conversations with filters', async () => {
      const filter = {
        status: ConversationStatus.OPEN,
        priority: Priority.HIGH,
        search: 'test',
        page: 1,
        limit: 10,
      };

      const conversations = [mockConversation];
      conversationRepository.findAll.mockResolvedValue(conversations);

      const result = await service.getConversations(filter);

      expect(conversationRepository.findAll).toHaveBeenCalledWith({
        where: {
          status: ConversationStatus.OPEN,
          priority: Priority.HIGH,
          OR: [
            {
              contactInfo: { email: { contains: 'test', mode: 'insensitive' } },
            },
            {
              contactInfo: { name: { contains: 'test', mode: 'insensitive' } },
            },
            {
              messages: {
                some: { content: { contains: 'test', mode: 'insensitive' } },
              },
            },
          ],
        },
        include: { contactInfo: true, messages: true },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(conversations);
    });

    it('should retrieve conversations without filters', async () => {
      const filter = {};
      const conversations = [mockConversation];
      conversationRepository.findAll.mockResolvedValue(conversations);

      const result = await service.getConversations(filter);

      expect(conversationRepository.findAll).toHaveBeenCalledWith({
        where: {},
        include: { contactInfo: true, messages: true },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(conversations);
    });

    it('should handle pagination correctly', async () => {
      const filter = { page: 3, limit: 5 };
      const conversations = [mockConversation];
      conversationRepository.findAll.mockResolvedValue(conversations);

      const result = await service.getConversations(filter);

      expect(conversationRepository.findAll).toHaveBeenCalledWith({
        where: {},
        include: { contactInfo: true, messages: true },
        skip: 10, // (3-1) * 5
        take: 5,
      });
      expect(result).toEqual(conversations);
    });
  });

  describe('assignConversation', () => {
    it('should assign conversation to an agent', async () => {
      const assignData = {
        conversationId: 'conv-1',
        assignedToId: 'agent-1',
      };

      const updatedConversation = {
        ...mockConversation,
        assignedToId: 'agent-1',
      };
      conversationRepository.findById.mockResolvedValue(mockConversation);
      conversationRepository.update.mockResolvedValue(updatedConversation);

      const result = await service.assignConversation(assignData);

      expect(conversationRepository.findById).toHaveBeenCalledWith('conv-1');
      expect(conversationRepository.update).toHaveBeenCalledWith('conv-1', {
        assignedToId: 'agent-1',
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should throw NotFoundException when conversation not found', async () => {
      const assignData = {
        conversationId: 'non-existent',
        assignedToId: 'agent-1',
      };

      conversationRepository.findById.mockResolvedValue(null);

      await expect(service.assignConversation(assignData)).rejects.toThrow(
        NotFoundException,
      );
      expect(conversationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update conversation status', async () => {
      const updateData = {
        conversationId: 'conv-1',
        status: ConversationStatus.RESOLVED,
      };

      const updatedConversation = {
        ...mockConversation,
        status: ConversationStatus.RESOLVED,
      };
      conversationRepository.findById.mockResolvedValue(mockConversation);
      conversationRepository.update.mockResolvedValue(updatedConversation);

      const result = await service.updateStatus(updateData);

      expect(conversationRepository.findById).toHaveBeenCalledWith('conv-1');
      expect(conversationRepository.update).toHaveBeenCalledWith('conv-1', {
        status: ConversationStatus.RESOLVED,
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should throw NotFoundException when conversation not found', async () => {
      const updateData = {
        conversationId: 'non-existent',
        status: ConversationStatus.RESOLVED,
      };

      conversationRepository.findById.mockResolvedValue(null);

      await expect(service.updateStatus(updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(conversationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('replyToMessage', () => {
    it('should reply to a message', async () => {
      const replyData = {
        conversationId: 'conv-1',
        content: 'Thank you for contacting us',
        senderUserId: 'agent-1',
      };

      const replyMessage = {
        ...mockMessage,
        isFromVisitor: false,
        senderUserId: 'agent-1',
      };
      messageRepository.create.mockResolvedValue(replyMessage);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);

      const result = await service.replyToMessage(replyData);

      expect(messageRepository.create).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Thank you for contacting us',
        isFromVisitor: false,
        senderUserId: 'agent-1',
      });
      expect(conversationRepository.updateLastMessageTime).toHaveBeenCalledWith(
        'conv-1',
        replyMessage.createdAt,
      );
      expect(chatGateway.server.emit).toHaveBeenCalledWith(
        'newMessage',
        replyMessage,
      );
      expect(result).toEqual({ message: replyMessage });
    });
  });

  describe('addInternalNote', () => {
    it('should add internal note to conversation', async () => {
      const noteData = {
        conversationId: 'conv-1',
        note: 'Customer seems frustrated',
      };

      const updatedConversation = {
        ...mockConversation,
        internalNotes: 'Customer seems frustrated',
      };
      conversationRepository.findById.mockResolvedValue(mockConversation);
      conversationRepository.update.mockResolvedValue(updatedConversation);

      const result = await service.addInternalNote(noteData);

      expect(conversationRepository.findById).toHaveBeenCalledWith('conv-1');
      expect(conversationRepository.update).toHaveBeenCalledWith('conv-1', {
        internalNotes: 'Customer seems frustrated',
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should append to existing internal notes', async () => {
      const noteData = {
        conversationId: 'conv-1',
        note: 'Follow up required',
      };

      const conversationWithNotes = {
        ...mockConversation,
        internalNotes: 'Customer seems frustrated',
      };
      const updatedConversation = {
        ...mockConversation,
        internalNotes: 'Customer seems frustrated\nFollow up required',
      };

      conversationRepository.findById.mockResolvedValue(conversationWithNotes);
      conversationRepository.update.mockResolvedValue(updatedConversation);

      const result = await service.addInternalNote(noteData);

      expect(conversationRepository.update).toHaveBeenCalledWith('conv-1', {
        internalNotes: 'Customer seems frustrated\nFollow up required',
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should throw NotFoundException when conversation not found', async () => {
      const noteData = {
        conversationId: 'non-existent',
        note: 'Test note',
      };

      conversationRepository.findById.mockResolvedValue(null);

      await expect(service.addInternalNote(noteData)).rejects.toThrow(
        NotFoundException,
      );
      expect(conversationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark visitor messages as read', async () => {
      const markAsReadData = {
        conversationId: 'conv-1',
        userId: 'agent-1',
      };

      mockPrismaService.chatMessage.updateMany.mockResolvedValue({ count: 3 });

      await service.markAsRead(markAsReadData);

      expect(mockPrismaService.chatMessage.updateMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conv-1',
          isFromVisitor: true,
          isRead: false,
        },
        data: { isRead: true },
      });
    });

    it('should handle no unread messages', async () => {
      const markAsReadData = {
        conversationId: 'conv-1',
        userId: 'agent-1',
      };

      mockPrismaService.chatMessage.updateMany.mockResolvedValue({ count: 0 });

      await service.markAsRead(markAsReadData);

      expect(mockPrismaService.chatMessage.updateMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conv-1',
          isFromVisitor: true,
          isRead: false,
        },
        data: { isRead: true },
      });
    });
  });

  describe('getChatAnalytics', () => {
    it('should return chat analytics for default period', async () => {
      const mockAnalyticsData = {
        totalConversations: [
          mockConversation,
          { ...mockConversation, id: 'conv-2' },
        ],
        openConversations: [mockConversation],
        resolvedConversations: [
          {
            ...mockConversation,
            id: 'conv-3',
            status: ConversationStatus.RESOLVED,
          },
        ],
        leadsCaptured: [
          mockContactInfo,
          { ...mockContactInfo, id: 'contact-2' },
        ],
      };

      conversationRepository.findAll
        .mockResolvedValueOnce(mockAnalyticsData.totalConversations)
        .mockResolvedValueOnce(mockAnalyticsData.openConversations)
        .mockResolvedValueOnce(mockAnalyticsData.resolvedConversations);

      contactInfoRepository.findAll.mockResolvedValue(
        mockAnalyticsData.leadsCaptured,
      );

      const result = await service.getChatAnalytics();

      expect(result).toEqual({
        totalConversations: 2,
        openConversations: 1,
        resolvedConversations: 1,
        leadsCaptured: 2,
        averageResponseTime: 0,
      });
    });

    it('should return chat analytics for custom period', async () => {
      const mockAnalyticsData = {
        totalConversations: [mockConversation],
        openConversations: [mockConversation],
        resolvedConversations: [],
        leadsCaptured: [mockContactInfo],
      };

      conversationRepository.findAll
        .mockResolvedValueOnce(mockAnalyticsData.totalConversations)
        .mockResolvedValueOnce(mockAnalyticsData.openConversations)
        .mockResolvedValueOnce(mockAnalyticsData.resolvedConversations);

      contactInfoRepository.findAll.mockResolvedValue(
        mockAnalyticsData.leadsCaptured,
      );

      const result = await service.getChatAnalytics(7);

      expect(result).toEqual({
        totalConversations: 1,
        openConversations: 1,
        resolvedConversations: 0,
        leadsCaptured: 1,
        averageResponseTime: 0,
      });

      // Verify date filtering
      const calls = conversationRepository.findAll.mock.calls;
      expect(calls[0][0].where.createdAt.gte).toBeInstanceOf(Date);
      expect(calls[1][0].where.createdAt.gte).toBeInstanceOf(Date);
      expect(calls[2][0].where.createdAt.gte).toBeInstanceOf(Date);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const startConversationDto = {
        email: 'test@example.com',
        name: 'John Doe',
        source: 'website',
      };

      contactInfoRepository.findByEmail.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(
        service.startConversation(startConversationDto),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle notification service errors gracefully', async () => {
      const startConversationDto = {
        email: 'test@example.com',
        name: 'John Doe',
        source: 'website',
      };

      contactInfoRepository.findByEmail.mockResolvedValue(mockContactInfo);
      conversationRepository.create.mockResolvedValue(mockConversation);
      notificationService.notifyNewChatConversation.mockRejectedValue(
        new Error('Notification failed'),
      );

      await expect(
        service.startConversation(startConversationDto),
      ).rejects.toThrow('Notification failed');
    });
  });

  describe('WebSocket Integration', () => {
    it('should emit WebSocket events for new messages', async () => {
      const sendMessageDto = {
        conversationId: 'conv-1',
        content: 'Hello',
        isFromVisitor: true,
      };

      messageRepository.create.mockResolvedValue(mockMessage);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);
      notificationService.notifyNewChatMessage.mockResolvedValue(undefined);

      await service.sendMessage(sendMessageDto);

      expect(chatGateway.server.emit).toHaveBeenCalledWith(
        'newMessage',
        mockMessage,
      );
    });

    it('should emit WebSocket events for replies', async () => {
      const replyData = {
        conversationId: 'conv-1',
        content: 'Thank you for contacting us',
        senderUserId: 'agent-1',
      };

      const replyMessage = {
        ...mockMessage,
        isFromVisitor: false,
        senderUserId: 'agent-1',
      };
      messageRepository.create.mockResolvedValue(replyMessage);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);

      await service.replyToMessage(replyData);

      expect(chatGateway.server.emit).toHaveBeenCalledWith(
        'newMessage',
        replyMessage,
      );
    });
  });

  describe('Business Logic Edge Cases', () => {
    it('should handle empty email in startConversation', async () => {
      const startConversationDto = {
        email: '',
        name: 'John Doe',
        source: 'website',
      };

      contactInfoRepository.findByEmail.mockResolvedValue(null);
      contactInfoRepository.create.mockResolvedValue(mockContactInfo);
      conversationRepository.create.mockResolvedValue(mockConversation);
      notificationService.notifyNewChatConversation.mockResolvedValue(
        undefined,
      );

      const result = await service.startConversation(startConversationDto);

      expect(contactInfoRepository.findByEmail).toHaveBeenCalledWith('');
      expect(result).toBeDefined();
    });

    it('should handle long message content', async () => {
      const longMessage = 'A'.repeat(10000);
      const sendMessageDto = {
        conversationId: 'conv-1',
        content: longMessage,
        isFromVisitor: true,
      };

      const longMessageResult = { ...mockMessage, content: longMessage };
      messageRepository.create.mockResolvedValue(longMessageResult);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);
      notificationService.notifyNewChatMessage.mockResolvedValue(undefined);

      const result = await service.sendMessage(sendMessageDto);

      expect(result.message.content).toBe(longMessage);
    });

    it('should handle concurrent message sending', async () => {
      const sendMessageDto1 = {
        conversationId: 'conv-1',
        content: 'Message 1',
        isFromVisitor: true,
      };

      const sendMessageDto2 = {
        conversationId: 'conv-1',
        content: 'Message 2',
        isFromVisitor: true,
      };

      const message1 = { ...mockMessage, id: 'msg-1', content: 'Message 1' };
      const message2 = { ...mockMessage, id: 'msg-2', content: 'Message 2' };

      messageRepository.create
        .mockResolvedValueOnce(message1)
        .mockResolvedValueOnce(message2);
      conversationRepository.updateLastMessageTime.mockResolvedValue(undefined);
      notificationService.notifyNewChatMessage.mockResolvedValue(undefined);

      const [result1, result2] = await Promise.all([
        service.sendMessage(sendMessageDto1),
        service.sendMessage(sendMessageDto2),
      ]);

      expect(result1.message.content).toBe('Message 1');
      expect(result2.message.content).toBe('Message 2');
      expect(chatGateway.server.emit).toHaveBeenCalledTimes(2);
    });
  });
});
