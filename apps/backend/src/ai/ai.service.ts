import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIConversation, AIConversationDocument } from './schemas/ai-conversation.schema';
import { AIMessage, AIMessageDocument } from './schemas/ai-message.schema';
import { CreateAIConversationDto } from './dto/create-conversation.dto';
import { SendAIMessageDto } from './dto/send-message.dto';
import { WalletService } from '../wallet/wallet.service';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../common/services/gemini.service';
import OpenAI from 'openai';

@Injectable()
export class AIService {
    private readonly AI_CREDIT_COST = 0.05; // $0.05 per AI request
    private readonly openai: OpenAI;

    constructor(
        @InjectModel(AIConversation.name) private conversationModel: Model<AIConversationDocument>,
        @InjectModel(AIMessage.name) private messageModel: Model<AIMessageDocument>,
        private readonly walletService: WalletService,
        private readonly configService: ConfigService,
        private readonly geminiService: GeminiService,
    ) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        this.openai = new OpenAI({ apiKey });
    }

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
        // 0. Verify conversation belongs to user
        const conversation = await this.conversationModel.findOne({ _id: sendDto.conversationId, userId });
        if (!conversation) {
            throw new NotFoundException('Conversation not found or access denied');
        }

        // 1. Deduct AI Credits BEFORE making the expensive API call
        try {
            await this.walletService.deductAICredits(userId, this.AI_CREDIT_COST, 'AI Chat GPT-4');
        } catch (error) {
            throw new Error('Insufficient balance to use AI features. Please top up your wallet.');
        }

        // 2. Save User Message
        const userMessage = new this.messageModel({
            conversationId: sendDto.conversationId,
            role: 'user',
            content: sendDto.content,
            attachments: sendDto.attachments || [],
        });
        await userMessage.save();

        // 3. Generate REAL AI Response from OpenAI
        const previousMessages = await this.messageModel
            .find({ conversationId: sendDto.conversationId })
            .sort({ createdAt: 1 })
            .limit(10)
            .exec();

        const messagesForOpenAI: any[] = previousMessages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        if (!messagesForOpenAI.some(m => m.content === sendDto.content)) {
            messagesForOpenAI.push({ role: 'user', content: sendDto.content });
        }

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are Antigravity, the official AI assistant of FemoSpace. You help users with marketplace deals, video content, and business tools. Keep responses concise and professional." },
                ...messagesForOpenAI
            ],
            temperature: 0.7,
        });

        const aiResponseContent = completion.choices[0].message.content || 'I am sorry, I could not process that request.';

        const aiMessage = new this.messageModel({
            conversationId: sendDto.conversationId,
            role: 'assistant',
            content: aiResponseContent,
        });
        await aiMessage.save();

        // 4. Update conversation timestamp
        await this.conversationModel.updateOne({ _id: sendDto.conversationId }, { updatedAt: new Date() });

        return [userMessage, aiMessage];
    }

    /**
     * Specialized tool logic (Post Gen, SEO, Ad Copy)
     * Deducts higher credits for specialized intelligence tools.
     */
    async generateToolResponse(userId: string, toolType: string, input: any): Promise<any> {
        const cost = 0.50; // $0.50 per tool generation

        // 1. Credit Check
        try {
            await this.walletService.deductAICredits(userId, cost, `${toolType} Generation`);
        } catch (error) {
            throw new Error('Insufficient balance for specialized AI tools.');
        }

        // 2. Specialized System Prompt
        let systemPrompt = "You are an expert content creator.";
        if (toolType === 'SEO_OPTIMIZER') systemPrompt = "You are an SEO specialist. Optimize the following text for search engines, focusing on high-intent keywords.";
        if (toolType === 'AD_COPY') systemPrompt = "You are a professional copywriter. Create high-converting ad copy for social media based on the provided product details.";
        if (toolType === 'POST_GEN') systemPrompt = "You are a social media influencer. Generate a viral-style post with emojis and hashtags.";

        // 3. Real Gemini Call (Faster and specifically good for content tools)
        const prompt = `${systemPrompt}\n\nInput: ${typeof input === 'string' ? input : JSON.stringify(input)}`;
        const content = await this.geminiService.generateResponse(prompt);

        return {
            tool: toolType,
            content,
            meta: {
                creditsUsed: cost,
                engine: 'gemini-1.5-flash',
                timestamp: new Date().toISOString()
            }
        };
    }

    async deleteConversation(userId: string, conversationId: string): Promise<void> {
        const result = await this.conversationModel.deleteOne({ _id: conversationId, userId });
        if (result.deletedCount > 0) {
            await this.messageModel.deleteMany({ conversationId });
        }
    }
}
