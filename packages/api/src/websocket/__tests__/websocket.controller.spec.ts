import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketController } from '../websocket.controller';
import { NotificationGateway } from '../websocket.gateway';

describe('WebSocketController', () => {
  let controller: WebSocketController;
  let notificationGateway: NotificationGateway;

  const createMockServer = () => ({
    engine: { clientsCount: 5 },
    sockets: {
      adapter: {
        rooms: new Map([
          ['user:123', new Set(['socket1', 'socket2'])],
          ['conversation:456', new Set(['socket3'])],
          ['notification:789', new Set(['socket4'])],
          ['socket1', new Set(['socket1'])], // Individual socket room
        ]),
      },
      sockets: new Map([
        ['socket1', {
          handshake: { time: '2024-01-01T00:00:00.000Z' },
          rooms: new Set(['socket1', 'user:123']),
          emit: jest.fn(),
          disconnect: jest.fn(),
        }],
        ['socket2', {
          handshake: { time: '2024-01-01T00:00:00.000Z' },
          rooms: new Set(['socket2', 'user:123']),
          emit: jest.fn(),
          disconnect: jest.fn(),
        }],
        ['socket3', {
          handshake: { time: '2024-01-01T00:00:00.000Z' },
          rooms: new Set(['socket3', 'conversation:456']),
          emit: jest.fn(),
          disconnect: jest.fn(),
        }],
      ]),
    },
    emit: jest.fn(),
  });

  const createMockUserSockets = () => new Map([
    ['user1', new Set(['socket1', 'socket2'])],
    ['user2', new Set(['socket3'])],
  ]);

  const mockNotificationGateway = {
    server: null as any,
    getUserSockets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebSocketController],
      providers: [
        {
          provide: NotificationGateway,
          useValue: mockNotificationGateway,
        },
      ],
    }).compile();

    controller = module.get<WebSocketController>(WebSocketController);
    notificationGateway = module.get<NotificationGateway>(NotificationGateway);

    // Reset mocks and set default state
    jest.clearAllMocks();
    mockNotificationGateway.server = createMockServer();
    mockNotificationGateway.getUserSockets.mockReturnValue(createMockUserSockets());
  });

  describe('getWebSocketStatus', () => {
    it('should return active status with connection statistics', async () => {
      const result = await controller.getWebSocketStatus();

      expect(result).toEqual({
        status: 'active',
        totalConnections: 5,
        connectedUsers: 2,
        activeRooms: 3,
        namespace: '/notifications',
        timestamp: expect.any(String),
      });
    });

    it('should return inactive status when server is not available', async () => {
      mockNotificationGateway.server = null;
      mockNotificationGateway.getUserSockets.mockReturnValue(null);

      const result = await controller.getWebSocketStatus();

      expect(result).toEqual({
        status: 'inactive',
        totalConnections: 0,
        connectedUsers: 0,
        activeRooms: 0,
        namespace: '/notifications',
        timestamp: expect.any(String),
      });
    });

    it('should handle missing userSocketsMap', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(null);

      const result = await controller.getWebSocketStatus();

      expect(result.connectedUsers).toBe(0);
    });
  });

  describe('getActiveConnections', () => {
    it('should return active connections with user details', async () => {
      const result = await controller.getActiveConnections();

      expect(result).toEqual({
        totalConnections: 2,
        connections: [
          {
            userId: 'user1',
            socketIds: ['socket1', 'socket2'],
            connectedAt: '2024-01-01T00:00:00.000Z',
            rooms: ['socket1', 'user:123'],
            socketCount: 2,
          },
          {
            userId: 'user2',
            socketIds: ['socket3'],
            connectedAt: '2024-01-01T00:00:00.000Z',
            rooms: ['socket3', 'conversation:456'],
            socketCount: 1,
          },
        ],
      });
    });

    it('should return empty connections when server is not available', async () => {
      mockNotificationGateway.server = null;
      mockNotificationGateway.getUserSockets.mockReturnValue(null);

      const result = await controller.getActiveConnections();

      expect(result).toEqual({
        totalConnections: 0,
        connections: [],
      });
    });

    it('should return empty connections when userSocketsMap is not available', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(null);

      const result = await controller.getActiveConnections();

      expect(result).toEqual({
        totalConnections: 0,
        connections: [],
      });
    });

    it('should handle missing socket in server', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(new Map([
        ['user1', new Set(['missing-socket'])],
      ]));

      const result = await controller.getActiveConnections();

      expect(result).toEqual({
        totalConnections: 1,
        connections: [{
          userId: 'user1',
          socketIds: ['missing-socket'],
          connectedAt: expect.any(String),
          rooms: [],
          socketCount: 1,
        }],
      });
    });
  });

  describe('getActiveRooms', () => {
    it('should return active rooms with type classification', async () => {
      const result = await controller.getActiveRooms();

      expect(result).toEqual({
        totalRooms: 3,
        rooms: [
          {
            name: 'user:123',
            type: 'user',
            memberCount: 2,
            members: ['socket1', 'socket2'],
          },
          {
            name: 'conversation:456',
            type: 'conversation',
            memberCount: 1,
            members: ['socket3'],
          },
          {
            name: 'notification:789',
            type: 'notification',
            memberCount: 1,
            members: ['socket4'],
          },
        ],
      });
    });

    it('should return empty rooms when server is not available', async () => {
      mockNotificationGateway.server = null;

      const result = await controller.getActiveRooms();

      expect(result).toEqual({
        totalRooms: 0,
        rooms: [],
      });
    });

    it('should classify unknown room types', async () => {
      const customRooms = new Map([
        ['custom:room', new Set(['socket1'])],
      ]);
      mockNotificationGateway.server = createMockServer();
      mockNotificationGateway.server.sockets.adapter.rooms = customRooms;

      const result = await controller.getActiveRooms();

      expect(result).toEqual({
        totalRooms: 1,
        rooms: [{
          name: 'custom:room',
          type: 'unknown',
          memberCount: 1,
          members: ['socket1'],
        }],
      });
    });
  });

  describe('broadcastMessage', () => {
    it('should broadcast message to all clients', async () => {
      const result = await controller.broadcastMessage();

      expect(mockNotificationGateway.server.emit).toHaveBeenCalledWith('system:broadcast', {
        type: 'system_broadcast',
        message: 'System maintenance notification - please save your work',
        timestamp: expect.any(String),
      });

      expect(result).toEqual({
        message: 'Broadcast sent successfully',
        recipientCount: 5,
        timestamp: expect.any(String),
      });
    });

    it('should handle unavailable server', async () => {
      mockNotificationGateway.server = null;

      const result = await controller.broadcastMessage();

      expect(result).toEqual({
        message: 'WebSocket server not available',
        recipientCount: 0,
        timestamp: expect.any(String),
      });
    });
  });

  describe('disconnectUser', () => {
    it('should disconnect user successfully', async () => {
      const result = await controller.disconnectUser('user1');

      expect(mockNotificationGateway.server.sockets.sockets.get('socket1').emit).toHaveBeenCalledWith(
        'system:force_disconnect',
        {
          reason: 'Disconnected by administrator',
          timestamp: expect.any(String),
        }
      );
      expect(mockNotificationGateway.server.sockets.sockets.get('socket1').disconnect).toHaveBeenCalledWith(true);
      expect(mockNotificationGateway.server.sockets.sockets.get('socket2').emit).toHaveBeenCalledWith(
        'system:force_disconnect',
        {
          reason: 'Disconnected by administrator',
          timestamp: expect.any(String),
        }
      );
      expect(mockNotificationGateway.server.sockets.sockets.get('socket2').disconnect).toHaveBeenCalledWith(true);

      expect(result).toEqual({
        message: 'User disconnected successfully',
        userId: 'user1',
        disconnectedSockets: 2,
        timestamp: expect.any(String),
      });
    });

    it('should handle user not found', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(new Map());

      const result = await controller.disconnectUser('nonexistent-user');

      expect(result).toEqual({
        message: 'User not found or not connected',
        userId: 'nonexistent-user',
        disconnectedSockets: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle server not available', async () => {
      mockNotificationGateway.server = null;
      mockNotificationGateway.getUserSockets.mockReturnValue(null);

      const result = await controller.disconnectUser('user1');

      expect(result).toEqual({
        message: 'WebSocket server not available',
        userId: 'user1',
        disconnectedSockets: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle userSocketsMap not available', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(null);

      const result = await controller.disconnectUser('user1');

      expect(result).toEqual({
        message: 'WebSocket server not available',
        userId: 'user1',
        disconnectedSockets: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle user with empty socket set', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(new Map([
        ['user1', new Set()],
      ]));

      const result = await controller.disconnectUser('user1');

      expect(result).toEqual({
        message: 'User not found or not connected',
        userId: 'user1',
        disconnectedSockets: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle missing socket in server during disconnect', async () => {
      mockNotificationGateway.getUserSockets.mockReturnValue(new Map([
        ['user1', new Set(['missing-socket', 'socket1'])],
      ]));

      const result = await controller.disconnectUser('user1');

      expect(result).toEqual({
        message: 'User disconnected successfully',
        userId: 'user1',
        disconnectedSockets: 1, // Only socket1 exists and gets disconnected
        timestamp: expect.any(String),
      });
    });
  });
});