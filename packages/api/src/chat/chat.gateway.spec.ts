/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: jest.Mocked<Server>;
  let mockSocket: jest.Mocked<AuthenticatedSocket>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    // Create mock server with room support
    const mockToEmit = { emit: jest.fn() };
    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnValue(mockToEmit),
    } as any;

    // Create mock socket
    mockSocket = {
      id: 'test-socket-id',
      disconnect: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
      join: jest.fn().mockResolvedValue(undefined),
      leave: jest.fn().mockResolvedValue(undefined),
      to: jest.fn().mockReturnValue({ emit: jest.fn() }),
      handshake: {
        auth: {},
        query: {},
        headers: {},
      },
    } as any;

    jwtService = {
      verifyAsync: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should have server property', () => {
    expect(gateway.server).toBeDefined();
    expect(gateway.server).toBe(mockServer);
  });

  describe('handleConnection', () => {
    it('should authenticate user with valid JWT from cookie', async () => {
      mockSocket.handshake.headers.cookie = 'auth-token=valid-jwt-token';
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-123' });

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.userId).toBe('user-123');
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-jwt-token');
    });

    it('should authenticate user with token from handshake auth', async () => {
      mockSocket.handshake.auth = { token: 'auth-jwt-token' };
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-456' });

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.userId).toBe('user-456');
    });

    it('should allow anonymous connection when no token provided', async () => {
      await gateway.handleConnection(mockSocket);

      expect(mockSocket.userId).toBeUndefined();
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should allow anonymous connection when JWT verification fails', async () => {
      mockSocket.handshake.headers.cookie = 'auth-token=invalid-token';
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.userId).toBeUndefined();
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should skip mock-token and treat as anonymous', async () => {
      mockSocket.handshake.auth = { token: 'mock-token' };

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.userId).toBeUndefined();
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should handle disconnect for authenticated user', () => {
      mockSocket.userId = 'user-123';

      expect(() => {
        gateway.handleDisconnect(mockSocket);
      }).not.toThrow();
    });

    it('should handle disconnect for anonymous user', () => {
      expect(() => {
        gateway.handleDisconnect(mockSocket);
      }).not.toThrow();
    });
  });

  describe('handleJoin', () => {
    it('should join conversation room', async () => {
      await gateway.handleJoin({ conversationId: 'conv-123' }, mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('conversation:conv-123');
      expect(mockSocket.emit).toHaveBeenCalledWith('chat:joined', {
        conversationId: 'conv-123',
      });
    });

    it('should not join when conversationId is missing', async () => {
      await gateway.handleJoin({ conversationId: '' }, mockSocket);

      expect(mockSocket.join).not.toHaveBeenCalled();
    });

    it('should not join when data is null', async () => {
      await gateway.handleJoin(null as any, mockSocket);

      expect(mockSocket.join).not.toHaveBeenCalled();
    });
  });

  describe('handleLeave', () => {
    it('should leave conversation room', async () => {
      await gateway.handleLeave({ conversationId: 'conv-123' }, mockSocket);

      expect(mockSocket.leave).toHaveBeenCalledWith('conversation:conv-123');
    });

    it('should not leave when conversationId is missing', async () => {
      await gateway.handleLeave({ conversationId: '' }, mockSocket);

      expect(mockSocket.leave).not.toHaveBeenCalled();
    });
  });

  describe('handleTyping', () => {
    it('should broadcast typing event to room', async () => {
      mockSocket.userId = 'user-123';
      const mockRoomEmit = { emit: jest.fn() };
      mockSocket.to = jest.fn().mockReturnValue(mockRoomEmit) as any;

      await gateway.handleTyping(
        { conversationId: 'conv-123', isTyping: true },
        mockSocket,
      );

      expect(mockSocket.to).toHaveBeenCalledWith('conversation:conv-123');
      expect(mockRoomEmit.emit).toHaveBeenCalledWith('chat:typing', {
        conversationId: 'conv-123',
        isTyping: true,
        userId: 'user-123',
      });
    });

    it('should not broadcast when conversationId is missing', async () => {
      await gateway.handleTyping(
        { conversationId: '', isTyping: true },
        mockSocket,
      );

      expect(mockSocket.to).not.toHaveBeenCalled();
    });
  });

  describe('sendMessageToConversation', () => {
    it('should emit message to conversation room', () => {
      const mockMessage: ChatMessage = {
        id: 'msg-123',
        conversationId: 'conv-123',
        content: 'Test message content',
        isFromVisitor: true,
        senderUserId: null,
        createdAt: new Date(),
        isRead: false,
        isDelivered: false,
        metadata: null,
      };

      gateway.sendMessageToConversation('conv-123', mockMessage);

      expect(mockServer.to).toHaveBeenCalledWith('conversation:conv-123');
      expect(mockServer.to('conversation:conv-123').emit).toHaveBeenCalledWith(
        'chat:newMessage',
        mockMessage,
      );
    });

    it('should emit agent message to conversation room', () => {
      const agentMessage: ChatMessage = {
        id: 'msg-124',
        conversationId: 'conv-123',
        content: 'Agent response',
        isFromVisitor: false,
        senderUserId: 'agent-123',
        createdAt: new Date(),
        isRead: false,
        isDelivered: false,
        metadata: null,
      };

      gateway.sendMessageToConversation('conv-123', agentMessage);

      expect(mockServer.to).toHaveBeenCalledWith('conversation:conv-123');
    });

    it('should handle multiple message updates to same room', () => {
      const message1: ChatMessage = {
        id: 'msg-126',
        conversationId: 'conv-123',
        content: 'First message',
        isFromVisitor: true,
        senderUserId: null,
        createdAt: new Date(),
        isRead: false,
        isDelivered: false,
        metadata: null,
      };

      const message2: ChatMessage = {
        id: 'msg-127',
        conversationId: 'conv-123',
        content: 'Second message',
        isFromVisitor: false,
        senderUserId: 'agent-123',
        createdAt: new Date(),
        isRead: false,
        isDelivered: false,
        metadata: null,
      };

      gateway.sendMessageToConversation('conv-123', message1);
      gateway.sendMessageToConversation('conv-123', message2);

      expect(mockServer.to).toHaveBeenCalledTimes(2);
    });
  });
});
