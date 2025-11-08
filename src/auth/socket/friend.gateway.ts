import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: {origin: '*'}})
export class FriendGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private emailSocketMap = new Map<string, string>();

  handleConnection(client: Socket) {
    const email = client.handshake.auth.email;
    if (email) {
      this.emailSocketMap.set(email, client.id);
      console.log(`✅ Socket connected: ${email} - ${client.id}`);
    } else {
      console.warn('❌ Client connected without email!');
    }
  }

  handleDisconnect(client: Socket) {
    const disconnectedEmail = [...this.emailSocketMap.entries()]
      .find(([email, id]) => id === client.id)?.[0];

    if (disconnectedEmail) {
      this.emailSocketMap.delete(disconnectedEmail);
      console.log(`🔌 Disconnected: ${disconnectedEmail}`);
    }
  }

  sendFriendRequest(recipientEmail: string, payload: any) {
    const socketId = this.emailSocketMap.get(recipientEmail);
    if (socketId) {
      this.server.to(socketId).emit('friend-request', payload);
      console.log(`📤 Sent friend request to ${recipientEmail}`);
    } else {
      console.warn(`⚠️ Socket not found for email: ${recipientEmail}`);
    }
  }
}