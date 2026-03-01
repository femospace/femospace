import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AIConversationDocument = AIConversation & Document;

@Schema({ timestamps: true })
export class AIConversation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ required: true, default: 'New Conversation' })
  title: string;

  @Prop({ default: false })
  isPinned: boolean;
}

export const AIConversationSchema = SchemaFactory.createForClass(AIConversation);
