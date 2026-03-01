import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AISessionDocument = AISession & Document;

@Schema({ timestamps: true })
export class AISession {
    @Prop({ required: true })
    userId: string;

    @Prop({ enum: ['casual', 'productivity', 'coding', 'creator', 'business', 'learning'], default: 'casual' })
    mode: string;

    @Prop({ type: [{ role: String, content: String, timestamp: Date }], default: [] })
    history: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }>;

    @Prop({ type: Object, default: {} })
    memory: Record<string, any>;
}

export const AISessionSchema = SchemaFactory.createForClass(AISession);
