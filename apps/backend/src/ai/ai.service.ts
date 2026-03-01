import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIConversation, AIConversationDocument } from './schemas/ai-conversation.schema';
import { AIMessage, AIMessageDocument } from './schemas/ai-message.schema';
import { CreateAIConversationDto } from './dto/create-conversation.dto';
import { SendAIMessageDto } from './dto/send-message.dto';

@Injectable()
export class AIService {
    constructor(
        @InjectModel(AIConversation.name) private conversationModel: Model<AIConversationDocument>,
        @InjectModel(AIMessage.name) private messageModel: Model<AIMessageDocument>,
    ) { }

    async createConversation(userId: string, createDto: CreateAIConversationDto): Promise<AIConversation> {
        const newConversation = new this.conversationModel({
            userId,
            title: createDto.title || 'New Conversation',
        });
        return newConversation.save();
    }

    async getUserConversations(userId: string): Promise<AIConversation[]> {
        return this.conversationModel.find({ userId }).sort({ updatedAt: -1 }).exec();
    }

    async getMessages(conversationId: string): Promise<AIMessage[]> {
        return this.messageModel.find({ conversationId }).sort({ createdAt: 1 }).exec();
    }

    async sendMessage(userId: string, sendDto: SendAIMessageDto): Promise<AIMessage[]> {
        // 1. Verify conversation belongs to user
        const conversation = await this.conversationModel.findOne({ _id: sendDto.conversationId, userId });
        if (!conversation) {
            throw new NotFoundException('Conversation not found or access denied');
        }

        // 2. Save User Message
        const userMessage = new this.messageModel({
            conversationId: sendDto.conversationId,
            role: 'user',
            content: sendDto.content,
            attachments: sendDto.attachments || [],
        });
        await userMessage.save();

        // 3. Generate AI Response (Mock logic for now)
        const aiResponseContent = this.generateMockResponse(sendDto.content);

        // Simulate processing delay if needed, but for API response we return immediately or use SSE for streaming.
        // For this implementation, we will return the user message and the AI message directly.

        const aiMessage = new this.messageModel({
            conversationId: sendDto.conversationId,
            role: 'assistant',
            content: aiResponseContent,
        });
        await aiMessage.save();

        // Update conversation timestamp
        await this.conversationModel.updateOne({ _id: sendDto.conversationId }, { updatedAt: new Date() });

        return [userMessage, aiMessage];
    }

    async deleteConversation(userId: string, conversationId: string): Promise<void> {
        const result = await this.conversationModel.deleteOne({ _id: conversationId, userId });
        if (result.deletedCount > 0) {
            await this.messageModel.deleteMany({ conversationId });
        }
    }

    private generateMockResponse(input: string): string {
        const responses = [
            "I'm processing your request. As an AI, I can help with coding, writing, or general questions.",
            "That's an interesting point! Tell me more.",
            "I can certainly help you with that. Here is a breakdown of the information...",
            "Could you clarify what you mean by that?",
            "Based on my analysis, the answer is 42.",
        ];

        if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
            return "Hello! How can I assist you today?";
        }

        if (input.toLowerCase().includes('code')) {
            return "I can help with coding! Here is a simple Python example:\n\n```python\nprint('Hello World')\n```";
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }
}
