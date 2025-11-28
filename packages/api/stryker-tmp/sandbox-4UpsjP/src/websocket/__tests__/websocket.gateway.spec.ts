/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotificationGateway } from '../websocket.gateway';
import { NotificationService } from '@/notification/notification.service';

// Mock Socket.io Server
const mockEmit = jest.fn();
const mockServer = {
  to: jest.fn(() => ({ emit: mockEmit })),
  emit: jest.fn(),
};

interface MockSocket {
  id: string;
  handshake: {
    auth: Record<string, any>;
    query: Record<string, any>;
  };
  join: jest.Mock;
  leave: jest.Mock;
  emit: jest.Mock;
  disconnect: jest.Mock;
  userId?: string;
  // Add required Socket properties for compatibility
  nsp?: any;
  client?: any;
  recovered?: boolean;
  data?: any;
}

// Mock Socket
const mockSocket: MockSocket = {
  id: 'test-socket-id',
  handshake: {
    auth: { token: 'valid-jwt-token' },
    query: {},
  },
  join: jest.fn(),
  leave: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
};

// Mock authenticated socket with userId
const mockAuthenticatedSocket: MockSocket = {
  ...mockSocket,
  userId: 'test-user-id',
};

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockNotificationService = {
    setNotificationGateway: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationGateway,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    gateway = module.get<NotificationGateway>(NotificationGateway);

    // Mock the server
    gateway.server = mockServer as any;

    // Clear all mocks
    jest.clearAllMocks();
    mockServer.to.mockClear();
    mockServer.emit.mockClear();
    mockEmit.mockClear();
    mockSocket.emit.mockClear();
    mockSocket.join.mockClear();
    mockSocket.leave.mockClear();
    mockSocket.disconnect.mockClear();
    mockAuthenticatedSocket.emit.mockClear();
    mockAuthenticatedSocket.join.mockClear();
    mockAuthenticatedSocket.leave.mockClear();
    mockAuthenticatedSocket.disconnect.mockClear();
    mockJwtService.verifyAsync.mockClear();
    mockNotificationService.setNotificationGateway.mockClear();
  });

  describe('onModuleInit', () => {
    it('should set notification gateway in notification service', () => {
      gateway.onModuleInit();
      expect(
        mockNotificationService.setNotificationGateway,
      ).toHaveBeenCalledWith(gateway);
    });
  });

  describe('handleConnection', () => {
    it('should authenticate and connect valid user', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'test-user-id',
        email: 'test@example.com',
      });

      await gateway.handleConnection(mockSocket as any);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        'valid-jwt-token',
      );
      expect(mockSocket.join).toHaveBeenCalledWith('user:test-user-id');
      expect(mockSocket.emit).toHaveBeenCalledWith('connection:confirmed', {
        userId: 'test-user-id',
        socketId: 'test-socket-id',
      });
    });

    it('should disconnect client without token', async () => {
      const socketWithoutToken: MockSocket = {
        ...mockSocket,
        handshake: { auth: {}, query: {} },
      };

      await gateway.handleConnection(socketWithoutToken as any);

      expect(socketWithoutToken.disconnect).toHaveBeenCalled();
      expect(mockJwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should disconnect client with invalid token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await gateway.handleConnection(mockSocket as any);

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should disconnect client with token without userId', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        email: 'test@example.com',
        // Missing sub/userId
      });

      await gateway.handleConnection(mockSocket as any);

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should handle token from query params', async () => {
      const socketWithQueryToken: MockSocket = {
        ...mockSocket,
        handshake: {
          auth: {},
          query: { token: 'query-token' },
        },
      };

      mockJwtService.verifyAsync.mockResolvedValue({
        userId: 'test-user-id',
      });

      await gateway.handleConnection(socketWithQueryToken as any);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('query-token');
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user socket tracking on disconnect', () => {
      // First connect the user
      gateway['userSockets'].set(
        'test-user-id',
        new Set(['socket-1', 'test-socket-id']),
      );

      gateway.handleDisconnect(mockAuthenticatedSocket as any);

      const userSockets = gateway['userSockets'].get('test-user-id');
      expect(userSockets?.has('test-socket-id')).toBe(false);
    });

    it('should remove user entry when no more sockets', () => {
      // Set up single socket for user
      gateway['userSockets'].set('test-user-id', new Set(['test-socket-id']));

      gateway.handleDisconnect(mockAuthenticatedSocket as any);

      expect(gateway['userSockets'].has('test-user-id')).toBe(false);
    });

    it('should handle disconnect for unauthenticated socket', () => {
      expect(() => gateway.handleDisconnect(mockSocket as any)).not.toThrow();
    });
  });

  describe('handleSubscribe', () => {
    it('should confirm subscription for authenticated user', async () => {
      await gateway.handleSubscribe(mockAuthenticatedSocket as any);

      expect(mockAuthenticatedSocket.emit).toHaveBeenCalledWith(
        'notification:subscribed',
        {
          userId: 'test-user-id',
        },
      );
    });

    it('should handle subscription for unauthenticated socket', async () => {
      // Create a socket without userId
      const unauthenticatedSocket: MockSocket = {
        ...mockSocket,
        userId: undefined, // Explicitly undefined
      };

      await gateway.handleSubscribe(unauthenticatedSocket as any);
      // Should not emit anything for unauthenticated socket (no userId)
      expect(unauthenticatedSocket.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleUnsubscribe', () => {
    it('should unsubscribe authenticated user', async () => {
      await gateway.handleUnsubscribe(mockAuthenticatedSocket as any);

      expect(mockAuthenticatedSocket.leave).toHaveBeenCalledWith(
        'user:test-user-id',
      );
      expect(mockAuthenticatedSocket.emit).toHaveBeenCalledWith(
        'notification:unsubscribed',
        {
          userId: 'test-user-id',
        },
      );
    });
  });

  describe('sendNotificationToUser', () => {
    it('should send notification to specific user', async () => {
      const userId = 'test-user-id';
      const notification = { type: 'test', message: 'Test notification' };

      await gateway.sendNotificationToUser(userId, notification);

      expect(mockServer.to).toHaveBeenCalledWith('user:test-user-id');
      expect(mockEmit).toHaveBeenCalledWith('notification:new', notification);
      expect(mockEmit).toHaveBeenCalledWith('notification:count_updated');
    });
  });

  describe('broadcastNotification', () => {
    it('should broadcast notification to all users', async () => {
      const notification = { type: 'broadcast', message: 'Broadcast message' };

      await gateway.broadcastNotification(notification);

      expect(mockServer.emit).toHaveBeenCalledWith(
        'notification:broadcast',
        notification,
      );
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      // Set up some test data
      gateway['userSockets'].set('user-1', new Set(['socket-1', 'socket-2']));
      gateway['userSockets'].set('user-2', new Set(['socket-3']));
    });

    it('should return correct connected users count', () => {
      expect(gateway.getConnectedUsersCount()).toBe(2);
    });

    it('should check if user is online', () => {
      expect(gateway.isUserOnline('user-1')).toBe(true);
      expect(gateway.isUserOnline('user-3')).toBe(false);
    });

    it('should return correct socket count for user', () => {
      expect(gateway.getUserSocketCount('user-1')).toBe(2);
      expect(gateway.getUserSocketCount('user-2')).toBe(1);
      expect(gateway.getUserSocketCount('user-3')).toBe(0);
    });
  });
});
