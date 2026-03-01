import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument, Message } from './schemas/chat.schema';
import { AISession, AISessionDocument } from './schemas/ai-session.schema';

@Injectable()
export class ChatService implements OnModuleInit {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        @InjectModel(Message.name) private messageModel: Model<Message>,
        @InjectModel(AISession.name) private aiSessionModel: Model<AISessionDocument>,
    ) { }

    async onModuleInit() {
        const chatCount = await this.chatModel.countDocuments();
        if (chatCount === 0) {
            // Seed with proper ObjectIds if possible, or just leave empty for now
            // since we don't have user IDs handy here.
        }
    }

    async getChats(userId: string) {
        return this.chatModel.find({ participants: new Types.ObjectId(userId) })
            .sort({ updatedAt: -1 })
            .populate('participants', 'username firstName lastName avatarUrl femoId')
            .exec();
    }

    async getChatById(chatId: string) {
        return this.chatModel.findById(chatId).exec();
    }

    async createChat(userId: string, data: { participants: string[], type?: string, name?: string, supportMeta?: any }) {
        const participantIds = data.participants.map(id => new Types.ObjectId(id));
        const uId = new Types.ObjectId(userId);

        if (!participantIds.some(id => id.equals(uId))) {
            participantIds.push(uId);
        }

        if (data.type === 'direct' || !data.type) {
            const existing = await this.chatModel.findOne({
                type: 'direct',
                participants: { $all: participantIds, $size: 2 }
            });
            if (existing) return existing;
        }

        if (data.type === 'support') {
            const existing = await this.chatModel.findOne({
                type: 'support',
                participants: { $in: [uId] },
                "supportMeta.status": { $in: ['open', 'pending'] }
            });
            if (existing) return existing;
        }

        return this.chatModel.create({
            ...data,
            participants: participantIds,
            admins: [userId]
        });
    }

    async createSupportChat(userId: string) {
        return this.createChat(userId, {
            participants: [userId],
            type: 'support',
            name: 'Femo Support Bot',
            supportMeta: {
                isSupport: true,
                status: 'open',
                createdFrom: 'system'
            }
        });
    }

    async handleSupportAIResponse(chatId: string, content: string) {
        const aiResponse = `I'm the Femo Support Assistant. You said: "${content}". A human admin will assist you shortly if needed.`;
        return this.sendMessage('system_support_bot', chatId, aiResponse, 'text');
    }

    async markAsSeen(userId: string, chatId: string) {
        await this.chatModel.findByIdAndUpdate(chatId, {
            $set: { [`unreadCounts.${userId}`]: 0 }
        });
        await this.messageModel.updateMany(
            { chatId, seenBy: { $ne: userId } },
            { $push: { seenBy: userId }, status: 'seen' }
        );
    }

    async getMessages(chatId: string, limit: number = 50) {
        return this.messageModel.find({ chatId }).sort({ createdAt: -1 }).limit(limit).exec();
    }

    async sendMessage(senderId: string, chatId: string, content: string, type: string = 'text', metadata: any = {}) {
        const message = await this.messageModel.create({
            chatId,
            senderId,
            content,
            type,
            metadata,
            status: 'sent'
        });

        await this.chatModel.findByIdAndUpdate(chatId, {
            lastMessage: {
                text: type === 'text' ? content : `Sent a ${type}`,
                senderId,
                type,
                createdAt: new Date(),
            },
            updatedAt: new Date(),
        });

        return message;
    }

    async getOrCreateAISession(userId: string, mode: string = 'casual') {
        let session = await this.aiSessionModel.findOne({ userId, mode }).exec();
        if (!session) {
            session = await this.aiSessionModel.create({ userId, mode, history: [] });
        }
        return session;
    }

    async chatWithAI(userId: string, mode: string, message: string) {
        const session = await this.getOrCreateAISession(userId, mode);

        // In a real app, integrate with AI API here
        const aiResponse = `I am your Femo AI ${mode} assistant. You said: "${message}". How can I help you further?`;

        session.history.push({ role: 'user', content: message, timestamp: new Date() });
        session.history.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });

        await session.save();
        return { response: aiResponse, session };
    }

    async addParticipant(chatId: string, userId: string, targetUserId: string) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) throw new Error('Chat not found');
        if (!chat.admins.includes(userId) && chat.type !== 'group') throw new Error('Unauthorized');

        await this.chatModel.findByIdAndUpdate(chatId, {
            $addToSet: { participants: new Types.ObjectId(targetUserId) }
        });
        return this.chatModel.findById(chatId).populate('participants');
    }

    async removeParticipant(chatId: string, userId: string, targetUserId: string) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) throw new Error('Chat not found');
        if (!chat.admins.includes(userId)) throw new Error('Unauthorized');

        await this.chatModel.findByIdAndUpdate(chatId, {
            $pull: { participants: new Types.ObjectId(targetUserId), admins: targetUserId }
        });
        return this.chatModel.findById(chatId).populate('participants');
    }

    async leaveChat(chatId: string, userId: string) {
        await this.chatModel.findByIdAndUpdate(chatId, {
            $pull: { participants: new Types.ObjectId(userId), admins: userId }
        });
        return { message: 'Left chat' };
    }

    async starMessage(userId: string, messageId: string) {
        const message = await this.messageModel.findById(messageId);
        if (!message) throw new Error('Message not found');

        if (message.starredBy.includes(userId)) {
            await this.messageModel.findByIdAndUpdate(messageId, { $pull: { starredBy: userId } });
            message.starredBy = message.starredBy.filter(id => id !== userId);
        } else {
            await this.messageModel.findByIdAndUpdate(messageId, { $addToSet: { starredBy: userId } });
            message.starredBy.push(userId);
        }
        return message;
    }

    async deleteMessage(userId: string, messageId: string) {
        const message = await this.messageModel.findById(messageId);
        if (!message) throw new Error('Message not found');
        if (message.senderId !== userId) throw new Error('Unauthorized');

        await this.messageModel.findByIdAndDelete(messageId);
        return { message: 'Message deleted' };
    }
}
