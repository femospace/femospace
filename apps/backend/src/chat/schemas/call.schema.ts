import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CallDocument = Call & Document;

@Schema({ timestamps: true })
export class Call {
    @Prop({ type: String, required: true, index: true })
    chatId: string;

    @Prop({ type: String, required: true, index: true })
    callerId: string;

    @Prop({ type: [String], required: true })
    participants: string[];

    @Prop({ enum: ['voice', 'video'], default: 'voice' })
    type: string;

    @Prop({ enum: ['pending', 'ongoing', 'ended', 'missed', 'rejected'], default: 'pending' })
    status: string;

    @Prop()
    startedAt: Date;

    @Prop()
    endedAt: Date;

    @Prop({ default: 0 })
    duration: number; // in seconds
}

export const CallSchema = SchemaFactory.createForClass(Call);
