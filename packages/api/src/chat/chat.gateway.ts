/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatMessage } from '@prisma/client';

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
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      let token =
        client.handshake.auth?.token || client.handshake.query?.token;

      // Fallback: read auth-token from cookies (HttpOnly cookie sent via withCredentials)
      if (!token || token === 'mock-token') {
        const cookieHeader = client.handshake.headers.cookie;
        if (cookieHeader) {
          const cookies = cookieHeader.split(';').reduce(
            (acc, cookie) => {
              const [key, value] = cookie.trim().split('=');
              acc[key] = value;
              return acc;
            },
            {} as Record<string, string>,
          );

          if (cookies['auth-token']) {
            token = cookies['auth-token'];
          }
        }
      }

      // Allow anonymous connections for visitor chat (no token required)
      // Visitors authenticate implicitly by providing a valid conversationId when joining
      if (token && typeof token === 'string' && token !== 'mock-token') {
        try {
          const payload: JwtPayload =
            await this.jwtService.verifyAsync(token);
          const userId = payload.sub || payload.userId;

          if (userId && typeof userId === 'string') {
            client.userId = userId;
            this.logger.log(
              `Authenticated user ${userId} connected to chat (socket ${client.id})`,
            );
          }
        } catch {
          // Token verification failed — allow as anonymous visitor
          this.logger.debug(
            `Client ${client.id} connected to chat as anonymous (invalid token)`,
          );
        }
      } else {
        this.logger.debug(
          `Client ${client.id} connected to chat as anonymous (no token)`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error during chat connection for client ${client.id}:`,
        error,
      );
      // Don't disconnect — allow anonymous chat
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    const label = client.userId || 'anonymous';
    this.logger.debug(`Chat client disconnected: ${label} (socket ${client.id})`);
  }

  @SubscribeMessage('chat:join')
  async handleJoin(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    if (!data?.conversationId) return;

    const room = `conversation:${data.conversationId}`;
    await client.join(room);

    const label = client.userId || 'anonymous';
    this.logger.debug(`${label} joined room ${room}`);

    client.emit('chat:joined', { conversationId: data.conversationId });
  }

  @SubscribeMessage('chat:leave')
  async handleLeave(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    if (!data?.conversationId) return;

    const room = `conversation:${data.conversationId}`;
    await client.leave(room);

    const label = client.userId || 'anonymous';
    this.logger.debug(`${label} left room ${room}`);
  }

  @SubscribeMessage('chat:typing')
  async handleTyping(
    @MessageBody() data: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    if (!data?.conversationId) return;

    const room = `conversation:${data.conversationId}`;
    // Broadcast to everyone in the room except the sender
    client.to(room).emit('chat:typing', {
      conversationId: data.conversationId,
      isTyping: data.isTyping,
      userId: client.userId || null,
    });
  }

  /**
   * Send a message to all clients in a specific conversation room.
   * Called by ChatService when a new message is created.
   */
  sendMessageToConversation(
    conversationId: string,
    message: ChatMessage,
  ): void {
    const room = `conversation:${conversationId}`;
    this.server.to(room).emit('chat:newMessage', message);
    this.logger.debug(
      `Emitted chat:newMessage to room ${room} (message ${message.id})`,
    );
  }
}
