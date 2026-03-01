import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LiveStreamDocument = LiveStream & Document;

@Schema({ timestamps: true })
export class LiveStream {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    streamKey: string;

    @Prop({ required: true, enum: ['waiting', 'live', 'ended', 'error'], default: 'waiting', index: true })
    status: string;

    @Prop()
    streamUrl?: string;

    @Prop()
    thumbnailUrl?: string;

    @Prop({ default: 0 })
    currentViewers: number;

    @Prop({ default: 0 })
    totalViews: number;

    @Prop({ default: 0 })
    peakViewers: number;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    viewers: Types.ObjectId[];

    @Prop({ type: Object })
    analytics?: {
        avgWatchTime: number;
        chatMessages: number;
        reactions: {
            like: number;
            love: number;
            wow: number;
            haha: number;
        };
    };

    @Prop()
    startedAt?: Date;

    @Prop()
    endedAt?: Date;

    @Prop({ default: false })
    saveAsVideo: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Video' })
    savedVideoId?: Types.ObjectId;

    @Prop({ enum: ['public', 'private', 'unlisted'], default: 'public' })
    visibility: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    moderators: Types.ObjectId[];

    @Prop({ type: Object })
    rtmpSettings?: {
        server: string;
        streamKey: string;
    };
}

export const LiveStreamSchema = SchemaFactory.createForClass(LiveStream);

// Indexes
LiveStreamSchema.index({ status: 1, createdAt: -1 });
LiveStreamSchema.index({ userId: 1, status: 1 });
LiveStreamSchema.index({ currentViewers: -1 });
