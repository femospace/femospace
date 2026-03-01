import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { AIConversation, AIConversationSchema } from './schemas/ai-conversation.schema';
import { AIMessage, AIMessageSchema } from './schemas/ai-message.schema';
import { AIFile, AIFileSchema } from './schemas/ai-file.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AIConversation.name, schema: AIConversationSchema },
            { name: AIMessage.name, schema: AIMessageSchema },
            { name: AIFile.name, schema: AIFileSchema },
        ]),
    ],
    controllers: [AIController],
    providers: [AIService],
})
export class AIModule { }
