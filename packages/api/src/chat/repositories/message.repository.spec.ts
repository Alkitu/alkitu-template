/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { MessageRepository } from './message.repository';
import { PrismaService } from '../../prisma.service';
import { CreateMessageData } from '../interfaces/chat.interface';
import { ChatMessage } from '@prisma/client';

describe('MessageRepository', () => {
  let repository: MessageRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockMessage: ChatMessage = {
    id: 'msg-123',
    conversationId: 'conv-123',
    content: 'Hello, how can I help you?',
    isFromVisitor: false,
    senderUserId: 'user-123',
    isRead: false,
    metadata: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageRepository,
        {
          provide: PrismaService,
          useValue: {
            chatMessage: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<MessageRepository>(MessageRepository);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new message from visitor', async () => {
      const createData: CreateMessageData = {
        conversationId: 'conv-123',
        content: 'I need help with my order',
        isFromVisitor: true,
        senderUserId: null,
      };

      const messageWithRelations = {
        ...mockMessage,
        content: 'I need help with my order',
        isFromVisitor: true,
        senderUserId: null,
        conversation: {
          id: 'conv-123',
          status: 'OPEN',
          contactInfo: {
            id: 'contact-123',
            email: 'visitor@example.com',
            name: 'John Visitor',
          },
        },
      };

      (prismaService.chatMessage.create as jest.Mock).mockResolvedValue(messageWithRelations);

      const result = await repository.create(createData);

      expect(prismaService.chatMessage.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          isRead: false,
          createdAt: expect.any(Date),
        },
        include: {
          conversation: {
            include: {
              contactInfo: true,
            },
          },
        },
      });
      expect(result).toEqual(messageWithRelations);
    });

    it('should create a new message from agent', async () => {
      const createData: CreateMessageData = {
        conversationId: 'conv-123',
        content: 'Thank you for contacting us. How can I assist you today?',
        isFromVisitor: false,
        senderUserId: 'agent-456',
      };

      const agentMessage = {
        ...mockMessage,
        content: 'Thank you for contacting us. How can I assist you today?',
        isFromVisitor: false,
        senderUserId: 'agent-456',
        conversation: {
          id: 'conv-123',
          status: 'IN_PROGRESS',
          contactInfo: {
            id: 'contact-123',
            email: 'visitor@example.com',
            name: 'John Visitor',
          },
        },
      };

      (prismaService.chatMessage.create as jest.Mock).mockResolvedValue(agentMessage);

      const result = await repository.create(createData);

      expect(prismaService.chatMessage.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          isRead: false,
          createdAt: expect.any(Date),
        },
        include: {
          conversation: {
            include: {
              contactInfo: true,
            },
          },
        },
      });
      expect(result).toEqual(agentMessage);
    });

    it('should create an internal note message', async () => {
      const createData: CreateMessageData = {
        conversationId: 'conv-123',
        content: 'Customer seems frustrated, handle with care',
        isFromVisitor: false,
        senderUserId: 'agent-789',
        metadata: { isInternal: true },
      };

      const internalMessage = {
        ...mockMessage,
        content: 'Customer seems frustrated, handle with care',
        isFromVisitor: false,
        senderUserId: 'agent-789',
        metadata: { isInternal: true },
        conversation: {
          id: 'conv-123',
          status: 'OPEN',
          contactInfo: {
            id: 'contact-123',
            email: 'visitor@example.com',
            name: 'John Visitor',
          },
        },
      };

      (prismaService.chatMessage.create as jest.Mock).mockResolvedValue(internalMessage);

      const result = await repository.create(createData);

      expect(prismaService.chatMessage.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          isRead: false,
          createdAt: expect.any(Date),
        },
        include: {
          conversation: {
            include: {
              contactInfo: true,
            },
          },
        },
      });
      expect(result).toEqual(internalMessage);
    });

    it('should set isRead to false by default', async () => {
      const createData: CreateMessageData = {
        conversationId: 'conv-123',
        content: 'Test message',
        isFromVisitor: true,
        senderUserId: null,
      };

      (prismaService.chatMessage.create as jest.Mock).mockResolvedValue(mockMessage);

      await repository.create(createData);

      expect(prismaService.chatMessage.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          isRead: false,
          createdAt: expect.any(Date),
        },
        include: {
          conversation: {
            include: {
              contactInfo: true,
            },
          },
        },
      });
    });
  });

  describe('findByConversationId', () => {
    it('should find all messages for a conversation', async () => {
      const conversationId = 'conv-123';
      const messages = [
        {
          ...mockMessage,
          id: 'msg-123',
          content: 'First message',
          isFromVisitor: true,
          senderUserId: null,
          conversation: {
            id: 'conv-123',
            status: 'OPEN',
          },
        },
        {
          ...mockMessage,
          id: 'msg-124',
          content: 'Agent reply',
          isFromVisitor: false,
          senderUserId: 'agent-456',
          conversation: {
            id: 'conv-123',
            status: 'IN_PROGRESS',
          },
        },
      ];

      (prismaService.chatMessage.findMany as jest.Mock).mockResolvedValue(messages);

      const result = await repository.findByConversationId(conversationId);

      expect(prismaService.chatMessage.findMany).toHaveBeenCalledWith({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: {
          conversation: {
            select: { id: true, status: true },
          },
        },
      });
      expect(result).toEqual(messages);
    });

    it('should return empty array when no messages found', async () => {
      const conversationId = 'conv-empty';

      (prismaService.chatMessage.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByConversationId(conversationId);

      expect(prismaService.chatMessage.findMany).toHaveBeenCalledWith({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: {
          conversation: {
            select: { id: true, status: true },
          },
        },
      });
      expect(result).toEqual([]);
    });

    it('should order messages by creation time ascending', async () => {
      const conversationId = 'conv-123';
      const now = new Date();
      const earlier = new Date(now.getTime() - 60000); // 1 minute earlier

      const messages = [
        {
          ...mockMessage,
          id: 'msg-124',
          content: 'Second message',
          createdAt: now,
          conversation: {
            id: 'conv-123',
            status: 'OPEN',
          },
        },
        {
          ...mockMessage,
          id: 'msg-123',
          content: 'First message',
          createdAt: earlier,
          conversation: {
            id: 'conv-123',
            status: 'OPEN',
          },
        },
      ];

      (prismaService.chatMessage.findMany as jest.Mock).mockResolvedValue(messages);

      const result = await repository.findByConversationId(conversationId);

      expect(prismaService.chatMessage.findMany).toHaveBeenCalledWith({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: {
          conversation: {
            select: { id: true, status: true },
          },
        },
      });
      expect(result).toEqual(messages);
    });

    it('should include conversation status in the result', async () => {
      const conversationId = 'conv-123';
      const messagesWithStatus = [
        {
          ...mockMessage,
          conversation: {
            id: 'conv-123',
            status: 'RESOLVED',
          },
        },
      ];

      (prismaService.chatMessage.findMany as jest.Mock).mockResolvedValue(messagesWithStatus);

      const result = await repository.findByConversationId(conversationId);

      expect(result[0]).toHaveProperty('conversation');
      expect((result[0] as any).conversation).toEqual({
        id: 'conv-123',
        status: 'RESOLVED',
      });
    });
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});