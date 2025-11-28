/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/require-await */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface JwtPayload {
  sub?: string;
  userId?: string;
  [key: string]: any;
}

@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? false
        : ['http://localhost:3000', 'http://localhost:3010'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  onModuleInit() {
    // Set this gateway in the notification service to avoid circular dependency
    this.notificationService.setNotificationGateway(this);
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from query params or headers
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token || typeof token !== 'string') {
        this.logger.warn(
          `Client ${client.id} attempted to connect without token`,
        );
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub || payload.userId;

      if (!userId || typeof userId !== 'string') {
        this.logger.warn(`Client ${client.id} has invalid token payload`);
        client.disconnect();
        return;
      }

      // Store user ID in socket
      client.userId = userId;

      // Track user's sockets
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join user-specific room
      await client.join(`user:${userId}`);

      this.logger.log(`User ${userId} connected with socket ${client.id}`);

      // Send connection confirmation
      client.emit('connection:confirmed', { userId, socketId: client.id });
    } catch (error) {
      this.logger.error(
        `Authentication failed for client ${client.id}:`,
        error,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.userId;

    if (userId) {
      // Remove socket from user's set
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(client.id);

        // If no more sockets for this user, remove the entry
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId);
        }
      }

      this.logger.log(`User ${userId} disconnected socket ${client.id}`);
    }
  }

  @SubscribeMessage('notification:subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    const userId = client.userId;
    if (userId) {
      // User is already subscribed when they connect
      client.emit('notification:subscribed', { userId });
      this.logger.log(`User ${userId} explicitly subscribed to notifications`);
    }
  }

  @SubscribeMessage('notification:unsubscribe')
  async handleUnsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    const userId = client.userId;
    if (userId) {
      await client.leave(`user:${userId}`);
      client.emit('notification:unsubscribed', { userId });
      this.logger.log(`User ${userId} unsubscribed from notifications`);
    }
  }

  // Method to send notification to specific user
  async sendNotificationToUser(
    userId: string,
    notification: any,
  ): Promise<void> {
    try {
      // Send to user's room
      this.server.to(`user:${userId}`).emit('notification:new', notification);

      // Also send unread count update
      // This would typically call the notification service to get updated count
      // For now, we'll emit a generic update event
      this.server.to(`user:${userId}`).emit('notification:count_updated');

      this.logger.log(`Sent notification to user ${userId}:`, notification);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${userId}:`,
        error,
      );
      throw error as Error;
    }
  }

  // Method to send notification to multiple users
  async sendNotificationToUsers(
    userIds: string[],
    notification: any,
  ): Promise<void> {
    const promises = userIds.map((userId) =>
      this.sendNotificationToUser(userId, notification),
    );
    await Promise.all(promises);
  }

  // Method to broadcast to all connected users
  async broadcastNotification(notification: any): Promise<void> {
    this.server.emit('notification:broadcast', notification);
    this.logger.log('Broadcast notification to all users:', notification);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    const userSockets = this.userSockets.get(userId);
    return userSockets ? userSockets.size > 0 : false;
  }

  // Get user's socket count (multiple tabs/devices)
  getUserSocketCount(userId: string): number {
    const userSockets = this.userSockets.get(userId);
    return userSockets ? userSockets.size : 0;
  }
}
