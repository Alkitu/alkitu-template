// @ts-nocheck
// 
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enable CORS for WebSocket
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    // Handle incoming messages from clients if needed
    // For now, we'll primarily use the service to emit messages
  }

  // This method will be called by the ChatService to emit messages
  sendMessageUpdate(message: any) {
    this.server.emit('newMessage', message);
  }
}
