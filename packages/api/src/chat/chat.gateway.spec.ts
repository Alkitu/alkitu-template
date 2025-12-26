/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from '@prisma/client';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: jest.Mocked<Server>;
  let mockSocket: jest.Mocked<Socket>;

  beforeEach(async () => {
    // Create mock server
    mockServer = {
      emit: jest.fn(),
    } as any;

    // Create mock socket
    mockSocket = {
      id: 'test-socket-id',
      disconnect: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      gateway.handleConnection(mockSocket);

      expect(consoleSpy).toHaveBeenCalledWith(`Client connected: ${mockSocket.id}`);
      
      consoleSpy.mockRestore();
    });

    it('should handle connection with different socket id', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const differentSocket = { ...mockSocket, id: 'different-socket-id' } as any;

      gateway.handleConnection(differentSocket);

      expect(consoleSpy).toHaveBeenCalledWith('Client connected: different-socket-id');
      
      consoleSpy.mockRestore();
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      gateway.handleDisconnect(mockSocket);

      expect(consoleSpy).toHaveBeenCalledWith(`Client disconnected: ${mockSocket.id}`);
      
      consoleSpy.mockRestore();
    });

    it('should handle disconnection with different socket id', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const differentSocket = { ...mockSocket, id: 'another-socket-id' } as any;

      gateway.handleDisconnect(differentSocket);

      expect(consoleSpy).toHaveBeenCalledWith('Client disconnected: another-socket-id');
      
      consoleSpy.mockRestore();
    });
  });

  describe('handleMessage', () => {
    it('should handle incoming message without errors', () => {
      const testData = 'test message data';

      // This method doesn't do anything currently, but we test it doesn't throw
      expect(() => {
        gateway.handleMessage(testData, mockSocket);
      }).not.toThrow();
    });

    it('should handle empty message data', () => {
      const testData = '';

      expect(() => {
        gateway.handleMessage(testData, mockSocket);
      }).not.toThrow();
    });

    it('should handle null message data', () => {
      const testData = null as any;

      expect(() => {
        gateway.handleMessage(testData, mockSocket);
      }).not.toThrow();
    });
  });

  describe('sendMessageUpdate', () => {
    it('should emit new message to all clients', () => {
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

      gateway.sendMessageUpdate(mockMessage);

      expect(mockServer.emit).toHaveBeenCalledWith('newMessage', mockMessage);
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit message from agent', () => {
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

      gateway.sendMessageUpdate(agentMessage);

      expect(mockServer.emit).toHaveBeenCalledWith('newMessage', agentMessage);
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit internal note message', () => {
      const internalMessage: ChatMessage = {
        id: 'msg-125',
        conversationId: 'conv-123',
        content: 'Internal note for agents',
        isFromVisitor: false,
        senderUserId: 'agent-123',
        createdAt: new Date(),
        isRead: false,
        isDelivered: false,
        metadata: { isInternal: true },
      };

      gateway.sendMessageUpdate(internalMessage);

      expect(mockServer.emit).toHaveBeenCalledWith('newMessage', internalMessage);
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple message updates', () => {
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

      gateway.sendMessageUpdate(message1);
      gateway.sendMessageUpdate(message2);

      expect(mockServer.emit).toHaveBeenCalledTimes(2);
      expect(mockServer.emit).toHaveBeenNthCalledWith(1, 'newMessage', message1);
      expect(mockServer.emit).toHaveBeenNthCalledWith(2, 'newMessage', message2);
    });
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should have server property', () => {
    expect(gateway.server).toBeDefined();
    expect(gateway.server).toBe(mockServer);
  });
});