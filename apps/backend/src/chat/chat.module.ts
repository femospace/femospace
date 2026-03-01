import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema, Message, MessageSchema } from './schemas/chat.schema';
import { AISession, AISessionSchema } from './schemas/ai-session.schema';
import { ChatGateway } from './chat.gateway';
import { Call, CallSchema } from './schemas/call.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: Message.name, schema: MessageSchema },
            { name: AISession.name, schema: AISessionSchema },
            { name: Call.name, schema: CallSchema },
        ]),
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    exports: [ChatService],
})
export class ChatModule { }
