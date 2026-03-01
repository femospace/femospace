import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Map to track user presence: userId -> socketId
    private userSocketMap = new Map<string, string>();

    constructor(private readonly chatService: ChatService) { }

    async handleConnection(client: Socket) {
        // We'll handle authentication if needed, but for now just log
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        // Remove from presença
        for (const [userId, socketId] of this.userSocketMap.entries()) {
            if (socketId === client.id) {
                this.userSocketMap.delete(userId);
                this.server.emit('presence_update', { userId, status: 'offline' });
                break;
            }
        }
    }

    @SubscribeMessage('identify')
    handleIdentify(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
        this.userSocketMap.set(data.userId, client.id);
        this.server.emit('presence_update', { userId: data.userId, status: 'online' });
        return { status: 'ok' };
    }

    @SubscribeMessage('join_chat')
    handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
        client.join(data.chatId);
        return { status: 'joined', chatId: data.chatId };
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { chatId: string; senderId: string; content: string; type?: string; metadata?: any }
    ) {
        const message = await this.chatService.sendMessage(
            data.senderId,
            data.chatId,
            data.content,
            data.type || 'text',
            data.metadata
        );

        // Broadcast to all users in the chat room
        this.server.to(data.chatId).emit('new_message', message);

        // Handle Support AI Response
        const chat = await this.chatService.getChatById(data.chatId);
        if (chat && chat.type === 'support' && data.senderId !== 'system_support_bot') {
            if (!chat.supportMeta?.assignedAdminId) {
                setTimeout(async () => {
                    const botReply = await this.chatService.handleSupportAIResponse(data.chatId, data.content);
                    this.server.to(data.chatId).emit('new_message', botReply);
                }, 1000);
            }
        }

        // Notify other participants for unread counts if they are not in the room? 
        // Socket.io handles local room broadcast easily.
        return message;
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { chatId: string; userId: string; isTyping: boolean }
    ) {
        client.to(data.chatId).emit('user_typing', data);
    }

    // --- WebRTC SIP/Signaling for Calls ---

    @SubscribeMessage('call_user')
    handleCallUser(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { toUserId: string; fromUserId: string; chatId: string; type: 'voice' | 'video'; signal: any }
    ) {
        const targetSocketId = this.userSocketMap.get(data.toUserId);
        if (targetSocketId) {
            this.server.to(targetSocketId).emit('incoming_call', {
                fromUserId: data.fromUserId,
                chatId: data.chatId,
                type: data.type,
                signal: data.signal
            });
        }
    }

    @SubscribeMessage('answer_call')
    handleAnswerCall(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { toUserId: string; signal: any }
    ) {
        const targetSocketId = this.userSocketMap.get(data.toUserId);
        if (targetSocketId) {
            this.server.to(targetSocketId).emit('call_accepted', {
                signal: data.signal
            });
        }
    }

    @SubscribeMessage('end_call')
    handleEndCall(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { chatId: string; toUserId: string }
    ) {
        const targetSocketId = this.userSocketMap.get(data.toUserId);
        if (targetSocketId) {
            this.server.to(targetSocketId).emit('call_ended', { chatId: data.chatId });
        }
    }
}
