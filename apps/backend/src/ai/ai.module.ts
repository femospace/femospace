import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { AIConversation, AIConversationSchema } from './schemas/ai-conversation.schema';
import { AIMessage, AIMessageSchema } from './schemas/ai-message.schema';
import { AIFile, AIFileSchema } from './schemas/ai-file.schema';
import { WalletModule } from '../wallet/wallet.module';
import { GeminiService } from '../common/services/gemini.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AIConversation.name, schema: AIConversationSchema },
            { name: AIMessage.name, schema: AIMessageSchema },
            { name: AIFile.name, schema: AIFileSchema },
        ]),
        WalletModule,
    ],
    controllers: [AIController],
    providers: [AIService, GeminiService],
    exports: [AIService, GeminiService],
})
export class AIModule { }
