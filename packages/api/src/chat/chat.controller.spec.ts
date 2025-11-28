/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
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

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            startConversation: jest.fn(),
            getConversations: jest.fn(),
            getMessages: jest.fn(),
            sendMessage: jest.fn(),
            replyToMessage: jest.fn(),
            assignConversation: jest.fn(),
            updateStatus: jest.fn(),
            addInternalNote: jest.fn(),
            markAsRead: jest.fn(),
            getChatAnalytics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService) as jest.Mocked<ChatService>;
  });

  describe('startConversation', () => {
    it('should start a new conversation', async () => {
      const startConversationDto: StartConversationDto = {
        message: 'Hello, I need help',
        email: 'user@example.com',
        name: 'John Doe',
        source: 'website',
      };

      const expectedResult = {
        conversation: {
          id: 'conv-123',
          status: 'OPEN',
          priority: 'NORMAL',
          source: 'website',
          createdAt: new Date(),
        },
        contactInfo: {
          id: 'contact-123',
          email: 'user@example.com',
          name: 'John Doe',
        },
      };

      chatService.startConversation.mockResolvedValue(expectedResult as any);

      const result = await controller.startConversation(startConversationDto);

      expect(chatService.startConversation).toHaveBeenCalledWith(startConversationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConversations', () => {
    it('should get conversations with filters', async () => {
      const filterDto: GetConversationsDto = {
        status: 'OPEN',
        priority: 'HIGH',
        search: 'urgent',
        page: 1,
        limit: 10,
      };

      const expectedResult = [
        {
          id: 'conv-123',
          status: 'OPEN',
          priority: 'HIGH',
          contactInfo: { email: 'user@example.com' },
          messages: [],
          createdAt: new Date(),
        },
      ];

      chatService.getConversations.mockResolvedValue(expectedResult as any);

      const result = await controller.getConversations(filterDto);

      expect(chatService.getConversations).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(expectedResult);
    });

    it('should get conversations without filters', async () => {
      const filterDto: GetConversationsDto = {};
      const expectedResult = [];

      chatService.getConversations.mockResolvedValue(expectedResult as any);

      const result = await controller.getConversations(filterDto);

      expect(chatService.getConversations).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMessages', () => {
    it('should get messages from a conversation', async () => {
      const conversationId = 'conv-123';
      const expectedResult = [
        {
          id: 'msg-123',
          content: 'Hello',
          isFromVisitor: true,
          senderUserId: null,
          createdAt: new Date(),
        },
        {
          id: 'msg-124',
          content: 'Hi there!',
          isFromVisitor: false,
          senderUserId: 'user-123',
          createdAt: new Date(),
        },
      ];

      chatService.getMessages.mockResolvedValue(expectedResult as any);

      const result = await controller.getMessages(conversationId);

      expect(chatService.getMessages).toHaveBeenCalledWith(conversationId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const sendMessageDto: SendMessageDto = {
        conversationId: 'conv-123',
        content: 'Thank you for contacting us',
        isFromVisitor: false,
        senderUserId: 'user-123',
      };

      const expectedResult = {
        message: {
          id: 'msg-125',
          conversationId: 'conv-123',
          content: 'Thank you for contacting us',
          isFromVisitor: false,
          senderUserId: 'user-123',
          createdAt: new Date(),
        },
      };

      chatService.sendMessage.mockResolvedValue(expectedResult as any);

      const result = await controller.sendMessage(sendMessageDto);

      expect(chatService.sendMessage).toHaveBeenCalledWith(sendMessageDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('replyToMessage', () => {
    it('should reply to a message', async () => {
      const replyDto: ReplyToMessageDto = {
        conversationId: 'conv-123',
        content: 'Agent reply message',
        senderUserId: 'agent-123',
      };

      const expectedResult = {
        message: {
          id: 'msg-126',
          conversationId: 'conv-123',
          content: 'Agent reply message',
          isFromVisitor: false,
          senderUserId: 'agent-123',
          createdAt: new Date(),
        },
      };

      chatService.replyToMessage.mockResolvedValue(expectedResult as any);

      const result = await controller.replyToMessage(replyDto);

      expect(chatService.replyToMessage).toHaveBeenCalledWith(replyDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('assignConversation', () => {
    it('should assign conversation to an agent', async () => {
      const conversationId = 'conv-123';
      const assignDto = { assignedToId: 'agent-123' };

      const expectedResult = {
        conversation: {
          id: 'conv-123',
          assignedToId: 'agent-123',
          updatedAt: new Date(),
        },
      };

      chatService.assignConversation.mockResolvedValue(expectedResult as any);

      const result = await controller.assignConversation(conversationId, assignDto);

      expect(chatService.assignConversation).toHaveBeenCalledWith({
        conversationId,
        assignedToId: 'agent-123',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateStatus', () => {
    it('should update conversation status', async () => {
      const conversationId = 'conv-123';
      const statusDto = { status: 'RESOLVED' as const };

      const expectedResult = {
        conversation: {
          id: 'conv-123',
          status: 'RESOLVED',
          updatedAt: new Date(),
        },
      };

      chatService.updateStatus.mockResolvedValue(expectedResult as any);

      const result = await controller.updateStatus(conversationId, statusDto);

      expect(chatService.updateStatus).toHaveBeenCalledWith({
        conversationId,
        status: 'RESOLVED',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addInternalNote', () => {
    it('should add internal note to conversation', async () => {
      const conversationId = 'conv-123';
      const noteDto = { note: 'Customer seems satisfied with the solution' };

      const expectedResult = {
        note: {
          id: 'note-123',
          conversationId: 'conv-123',
          note: 'Customer seems satisfied with the solution',
          createdAt: new Date(),
        },
      };

      chatService.addInternalNote.mockResolvedValue(expectedResult as any);

      const result = await controller.addInternalNote(conversationId, noteDto);

      expect(chatService.addInternalNote).toHaveBeenCalledWith({
        conversationId,
        note: 'Customer seems satisfied with the solution',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('markAsRead', () => {
    it('should mark conversation as read', async () => {
      const conversationId = 'conv-123';
      const readDto = { userId: 'user-123' };

      const expectedResult = {
        success: true,
        markedAsRead: true,
      };

      chatService.markAsRead.mockResolvedValue(expectedResult as any);

      const result = await controller.markAsRead(conversationId, readDto);

      expect(chatService.markAsRead).toHaveBeenCalledWith({
        conversationId,
        userId: 'user-123',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getChatAnalytics', () => {
    it('should get chat analytics with days parameter', async () => {
      const days = 30;
      const expectedResult = {
        totalConversations: 150,
        openConversations: 25,
        resolvedConversations: 120,
        leadsCaptured: 89,
        averageResponseTime: 0,
      };

      chatService.getChatAnalytics.mockResolvedValue(expectedResult as any);

      const result = await controller.getChatAnalytics(days);

      expect(chatService.getChatAnalytics).toHaveBeenCalledWith(days);
      expect(result).toEqual(expectedResult);
    });

    it('should get chat analytics without days parameter', async () => {
      const expectedResult = {
        totalConversations: 100,
        openConversations: 20,
        resolvedConversations: 75,
        leadsCaptured: 50,
        averageResponseTime: 0,
      };

      chatService.getChatAnalytics.mockResolvedValue(expectedResult as any);

      const result = await controller.getChatAnalytics();

      expect(chatService.getChatAnalytics).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});