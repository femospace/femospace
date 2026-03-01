import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AIMessageDocument = AIMessage & Document;

@Schema({ _id: false })
export class AIAttachment {
    @Prop({ required: true, enum: ['image', 'video', 'audio', 'file', 'code'] })
    type: string;

    @Prop({ required: true })
    url: string;

    @Prop({ type: Object })
    metadata: any; // size, name, mimeType, etc.
}

@Schema({ timestamps: true })
export class AIMessage {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AIConversation', required: true, index: true })
    conversationId: string;

    @Prop({ required: true, enum: ['user', 'assistant', 'system'] })
    role: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [AIAttachment], default: [] })
    attachments: AIAttachment[];
}

export const AIMessageSchema = SchemaFactory.createForClass(AIMessage);
