import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    url: string;

    @Prop()
    thumbnailUrl: string;

    @Prop({ required: true })
    creatorId: string;

    @Prop({ enum: ['reel', 'video', 'live'], required: true })
    type: string;

    @Prop({ default: 'public' })
    visibility: string;

    @Prop({ type: Object, default: { likes: 0, views: 0, shares: 0, comments: 0 } })
    metrics: {
        likes: number;
        views: number;
        shares: number;
        comments: number;
    };

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Object, default: {} })
    aiMetadata: {
        captions?: string;
        summary?: string;
        highlights?: any[];
        score?: number;
        nsfwScore?: number;
    };

    @Prop({ default: false })
    isLive: boolean;

    @Prop()
    duration?: number; // in seconds

    @Prop({ required: true, enum: ['safe', 'restricted'], default: 'safe', index: true })
    contentSafetyLevel: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
