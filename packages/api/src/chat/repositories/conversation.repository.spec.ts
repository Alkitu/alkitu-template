/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ConversationRepository } from './conversation.repository';
import { PrismaService } from '../../prisma.service';
import {
  CreateConversationData,
  UpdateConversationData,
  ConversationFindOptions,
} from '../interfaces/chat.interface';
import { Conversation, ConversationStatus, Priority } from '@prisma/client';

describe('ConversationRepository', () => {
  let repository: ConversationRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockConversation: Conversation = {
    id: 'conv-123',
    contactInfoId: 'contact-123',
    status: ConversationStatus.OPEN,
    priority: Priority.NORMAL,
    source: 'website',
    assignedToId: null,
    clientUserId: null,
    tags: [],
    internalNotes: null,
    lastMessageAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationRepository,
        {
          provide: PrismaService,
          useValue: {
            conversation: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<ConversationRepository>(ConversationRepository);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new conversation', async () => {
      const createData: CreateConversationData = {
        contactInfoId: 'contact-123',
        status: ConversationStatus.OPEN,
        priority: Priority.NORMAL,
        source: 'website',
      };

      const expectedData = {
        ...createData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      (prismaService.conversation.create as jest.Mock).mockResolvedValue(mockConversation);

      const result = await repository.create(createData);

      expect(prismaService.conversation.create).toHaveBeenCalledWith({
        data: expectedData,
      });
      expect(result).toEqual(mockConversation);
    });

    it('should create conversation with assigned user', async () => {
      const createData: CreateConversationData = {
        contactInfoId: 'contact-123',
        status: ConversationStatus.OPEN,
        priority: Priority.HIGH,
        source: 'email',
        assignedToId: 'user-123',
      };

      const conversationWithAssignment = {
        ...mockConversation,
        priority: Priority.HIGH,
        source: 'email',
        assignedToId: 'user-123',
      };

      (prismaService.conversation.create as jest.Mock).mockResolvedValue(conversationWithAssignment);

      const result = await repository.create(createData);

      expect(prismaService.conversation.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(conversationWithAssignment);
    });
  });

  describe('findById', () => {
    it('should find conversation by id with all relations', async () => {
      const conversationId = 'conv-123';
      const conversationWithRelations = {
        ...mockConversation,
        contactInfo: {
          id: 'contact-123',
          email: 'test@example.com',
          firstname: 'John Doe',
        },
        messages: [
          {
            id: 'msg-123',
            content: 'Hello',
            createdAt: new Date(),
          },
        ],
        assignedTo: {
          id: 'user-123',
          email: 'agent@example.com',
          firstname: 'Agent Smith',
        },
      };

      (prismaService.conversation.findUnique as jest.Mock).mockResolvedValue(conversationWithRelations);

      const result = await repository.findById(conversationId);

      expect(prismaService.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: conversationId },
        include: {
          contactInfo: true,
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          assignedTo: {
            select: { id: true, email: true, firstname: true, lastname: true },
          },
        },
      });
      expect(result).toEqual(conversationWithRelations);
    });

    it('should return null when conversation not found', async () => {
      const conversationId = 'non-existent-id';

      (prismaService.conversation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(conversationId);

      expect(prismaService.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: conversationId },
        include: {
          contactInfo: true,
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          assignedTo: {
            select: { id: true, email: true, firstname: true, lastname: true },
          },
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all conversations with default options', async () => {
      const options: ConversationFindOptions = {};
      const conversations = [mockConversation];

      (prismaService.conversation.findMany as jest.Mock).mockResolvedValue(conversations);

      const result = await repository.findAll(options);

      expect(prismaService.conversation.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: undefined,
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(conversations);
    });

    it('should find conversations with where conditions', async () => {
      const options: ConversationFindOptions = {
        where: {
          status: ConversationStatus.OPEN,
          priority: Priority.HIGH,
        },
      };
      const conversations = [mockConversation];

      (prismaService.conversation.findMany as jest.Mock).mockResolvedValue(conversations);

      const result = await repository.findAll(options);

      expect(prismaService.conversation.findMany).toHaveBeenCalledWith({
        where: {
          status: ConversationStatus.OPEN,
          priority: Priority.HIGH,
        },
        include: undefined,
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(conversations);
    });

    it('should find conversations with pagination', async () => {
      const options: ConversationFindOptions = {
        skip: 10,
        take: 5,
      };
      const conversations = [mockConversation];

      (prismaService.conversation.findMany as jest.Mock).mockResolvedValue(conversations);

      const result = await repository.findAll(options);

      expect(prismaService.conversation.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: undefined,
        skip: 10,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(conversations);
    });

    it('should find conversations with custom ordering', async () => {
      const options: ConversationFindOptions = {
        orderBy: { lastMessageAt: 'desc' },
      };
      const conversations = [mockConversation];

      (prismaService.conversation.findMany as jest.Mock).mockResolvedValue(conversations);

      const result = await repository.findAll(options);

      expect(prismaService.conversation.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: undefined,
        skip: undefined,
        take: undefined,
        orderBy: { lastMessageAt: 'desc' },
      });
      expect(result).toEqual(conversations);
    });

    it('should find conversations with include relations', async () => {
      const options: ConversationFindOptions = {
        include: {
          contactInfo: true,
          messages: true,
        },
      };
      const conversationsWithRelations = [
        {
          ...mockConversation,
          contactInfo: { email: 'test@example.com' },
          messages: [{ id: 'msg-123', content: 'Hello' }],
        },
      ];

      (prismaService.conversation.findMany as jest.Mock).mockResolvedValue(conversationsWithRelations);

      const result = await repository.findAll(options);

      expect(prismaService.conversation.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: {
          contactInfo: true,
          messages: true,
        },
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(conversationsWithRelations);
    });
  });

  describe('updateLastMessageTime', () => {
    it('should update last message time', async () => {
      const conversationId = 'conv-123';
      const lastMessageAt = new Date();
      const updatedConversation = {
        ...mockConversation,
        lastMessageAt,
        updatedAt: expect.any(Date),
      };

      (prismaService.conversation.update as jest.Mock).mockResolvedValue(updatedConversation);

      const result = await repository.updateLastMessageTime(conversationId, lastMessageAt);

      expect(prismaService.conversation.update).toHaveBeenCalledWith({
        where: { id: conversationId },
        data: {
          lastMessageAt,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedConversation);
    });
  });

  describe('update', () => {
    it('should update conversation with status change', async () => {
      const conversationId = 'conv-123';
      const updateData: UpdateConversationData = {
        status: ConversationStatus.RESOLVED,
      };
      const updatedConversation = {
        ...mockConversation,
        status: ConversationStatus.RESOLVED,
        updatedAt: expect.any(Date),
      };

      (prismaService.conversation.update as jest.Mock).mockResolvedValue(updatedConversation);

      const result = await repository.update(conversationId, updateData);

      expect(prismaService.conversation.update).toHaveBeenCalledWith({
        where: { id: conversationId },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should update conversation with assignment', async () => {
      const conversationId = 'conv-123';
      const updateData: UpdateConversationData = {
        assignedToId: 'user-456',
        status: ConversationStatus.IN_PROGRESS,
      };
      const updatedConversation = {
        ...mockConversation,
        assignedToId: 'user-456',
        status: ConversationStatus.IN_PROGRESS,
        updatedAt: expect.any(Date),
      };

      (prismaService.conversation.update as jest.Mock).mockResolvedValue(updatedConversation);

      const result = await repository.update(conversationId, updateData);

      expect(prismaService.conversation.update).toHaveBeenCalledWith({
        where: { id: conversationId },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should update conversation priority', async () => {
      const conversationId = 'conv-123';
      const updateData: UpdateConversationData = {
        priority: Priority.LOW,
      };
      const updatedConversation = {
        ...mockConversation,
        priority: Priority.LOW,
        updatedAt: expect.any(Date),
      };

      (prismaService.conversation.update as jest.Mock).mockResolvedValue(updatedConversation);

      const result = await repository.update(conversationId, updateData);

      expect(prismaService.conversation.update).toHaveBeenCalledWith({
        where: { id: conversationId },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedConversation);
    });
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});