// @ts-nocheck
// 
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from '@prisma/client';

@WebSocketGateway({ cors: true }) // Enable CORS for WebSocket
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @MessageBody() _data: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() _client: Socket,
  ): void {
    // Handle incoming messages from clients if needed
    // For now, we'll primarily use the service to emit messages
  }

  // This method will be called by the ChatService to emit messages
  sendMessageUpdate(message: ChatMessage): void {
    this.server.emit('newMessage', message);
  }
}
