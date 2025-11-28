// @ts-nocheck
// 
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { NotificationGateway } from './websocket.gateway';

@ApiTags('websocket')
@Controller('websocket')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class WebSocketController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get WebSocket server status',
    description:
      'Get current WebSocket server status and connection statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'WebSocket status retrieved successfully',
    schema: {
      example: {
        status: 'active',
        totalConnections: 25,
        connectedUsers: 18,
        activeRooms: 5,
        serverUptime: '2h 15m 30s',
        namespace: '/notifications',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Employee access required',
  })
  async getWebSocketStatus() {
    // Access private properties using bracket notation as a workaround
    const userSocketsMap = (this.notificationGateway as any).userSockets;
    const server = this.notificationGateway.server;

    const totalConnections = server ? server.engine.clientsCount : 0;
    const connectedUsers = userSocketsMap ? userSocketsMap.size : 0;

    // Get all rooms except default socket rooms
    const allRooms = server
      ? Array.from(server.sockets.adapter.rooms.keys())
      : [];
    const activeRooms = allRooms.filter(
      (room) =>
        room.startsWith('user:') ||
        room.startsWith('conversation:') ||
        room.startsWith('notification:'),
    ).length;

    return {
      status: server ? 'active' : 'inactive',
      totalConnections,
      connectedUsers,
      activeRooms,
      namespace: '/notifications',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('connections')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get active WebSocket connections',
    description: 'Get information about currently active WebSocket connections',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved active connections',
    schema: {
      type: 'object',
      properties: {
        totalConnections: { type: 'number', example: 3 },
        connections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              userId: { type: 'string', example: '60d5ecb74f3b2c001c8b4566' },
              socketIds: { type: 'array', items: { type: 'string' } },
              connectedAt: { type: 'string', format: 'date-time' },
              rooms: { type: 'array', items: { type: 'string' } },
              socketCount: { type: 'number' },
            },
          },
        },
      },
      example: {
        totalConnections: 3,
        connections: [
          {
            userId: '60d5ecb74f3b2c001c8b4566',
            socketIds: ['socket_123', 'socket_456'],
            connectedAt: '2024-06-29T12:00:00.000Z',
            rooms: ['user:60d5ecb74f3b2c001c8b4566', 'conversation:123'],
            socketCount: 2,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getActiveConnections(): Promise<{
    totalConnections: number;
    connections: Array<{
      userId: string;
      socketIds: string[];
      connectedAt: string;
      rooms: string[];
      socketCount: number;
    }>;
  }> {
    const userSocketsMap = (this.notificationGateway as any).userSockets;
    const server = this.notificationGateway.server;

    if (!userSocketsMap || !server) {
      return {
        totalConnections: 0,
        connections: [],
      };
    }

    const connections: Array<{
      userId: string;
      socketIds: string[];
      connectedAt: string;
      rooms: string[];
      socketCount: number;
    }> = [];

    for (const [userId, socketIds] of userSocketsMap.entries()) {
      const socketIdsArray = Array.from(socketIds as Set<string>);
      const firstSocket = server.sockets.sockets.get(
        socketIdsArray[0] as string,
      );

      connections.push({
        userId: userId as string,
        socketIds: socketIdsArray,
        connectedAt: firstSocket?.handshake?.time || new Date().toISOString(),
        rooms: firstSocket ? Array.from(firstSocket.rooms) : [],
        socketCount: socketIdsArray.length,
      });
    }

    return {
      totalConnections: connections.length,
      connections,
    };
  }

  @Get('rooms')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get active WebSocket rooms',
    description: 'Get information about currently active WebSocket rooms',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved active rooms',
    schema: {
      type: 'object',
      properties: {
        totalRooms: { type: 'number', example: 2 },
        rooms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'user:60d5ecb74f3b2c001c8b4566',
              },
              type: { type: 'string', example: 'user' },
              memberCount: { type: 'number', example: 1 },
              members: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
      example: {
        totalRooms: 2,
        rooms: [
          {
            name: 'user:60d5ecb74f3b2c001c8b4566',
            type: 'user',
            memberCount: 1,
            members: ['socket_123'],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Employee access required',
  })
  async getActiveRooms(): Promise<{
    totalRooms: number;
    rooms: Array<{
      name: string;
      type: string;
      memberCount: number;
      members: string[];
    }>;
  }> {
    const server = this.notificationGateway.server;

    if (!server) {
      return {
        totalRooms: 0,
        rooms: [],
      };
    }

    const allRooms = Array.from(server.sockets.adapter.rooms.entries());
    const rooms: Array<{
      name: string;
      type: string;
      memberCount: number;
      members: string[];
    }> = [];

    for (const [roomName, socketSet] of allRooms) {
      // Skip individual socket rooms (they are socket IDs)
      if (server.sockets.sockets.has(roomName)) {
        continue;
      }

      let roomType = 'unknown';
      if (roomName.startsWith('user:')) {
        roomType = 'user';
      } else if (roomName.startsWith('conversation:')) {
        roomType = 'conversation';
      } else if (roomName.startsWith('notification:')) {
        roomType = 'notification';
      }

      rooms.push({
        name: roomName,
        type: roomType,
        memberCount: socketSet.size,
        members: Array.from(socketSet),
      });
    }

    return {
      totalRooms: rooms.length,
      rooms,
    };
  }

  @Post('broadcast')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Broadcast message to all connected clients',
    description:
      'Send a broadcast message to all currently connected WebSocket clients. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Broadcast message sent successfully',
    schema: {
      example: {
        message: 'Broadcast sent successfully',
        recipientCount: 25,
        timestamp: '2024-06-29T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async broadcastMessage() {
    const server = this.notificationGateway.server;

    if (!server) {
      return {
        message: 'WebSocket server not available',
        recipientCount: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const broadcastData = {
      type: 'system_broadcast',
      message: 'System maintenance notification - please save your work',
      timestamp: new Date().toISOString(),
    };

    server.emit('system:broadcast', broadcastData);

    return {
      message: 'Broadcast sent successfully',
      recipientCount: server.engine.clientsCount,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('connections/user/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Disconnect specific user',
    description:
      'Force disconnect all WebSocket connections for a specific user. Admin only.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to disconnect',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'User disconnected successfully',
    schema: {
      example: {
        message: 'User disconnected successfully',
        userId: '60d5ecb74f3b2c001c8b4566',
        disconnectedSockets: 2,
        timestamp: '2024-06-29T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'User not found or not connected' })
  async disconnectUser(@Param('userId') userId: string) {
    const userSocketsMap = (this.notificationGateway as any).userSockets;
    const server = this.notificationGateway.server;

    if (!userSocketsMap || !server) {
      return {
        message: 'WebSocket server not available',
        userId,
        disconnectedSockets: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const socketIds = userSocketsMap.get(userId);
    if (!socketIds || socketIds.size === 0) {
      return {
        message: 'User not found or not connected',
        userId,
        disconnectedSockets: 0,
        timestamp: new Date().toISOString(),
      };
    }

    let disconnectedCount = 0;
    for (const socketId of socketIds) {
      const socket = server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('system:force_disconnect', {
          reason: 'Disconnected by administrator',
          timestamp: new Date().toISOString(),
        });
        socket.disconnect(true);
        disconnectedCount++;
      }
    }

    return {
      message: 'User disconnected successfully',
      userId,
      disconnectedSockets: disconnectedCount,
      timestamp: new Date().toISOString(),
    };
  }
}
