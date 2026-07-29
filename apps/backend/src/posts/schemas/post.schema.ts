import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ _id: false })
class Media {
    @Prop({ required: true })
    url: string;

    @Prop({ required: true, enum: ['image', 'video', 'audio', 'document'] })
    type: string;

    @Prop()
    thumbnailUrl?: string;

    @Prop()
    duration?: number; // In seconds

    @Prop({ type: Object })
    metadata?: Record<string, any>;
}

@Schema({ _id: false })
class PollOption {
    @Prop({ required: true })
    text: string;

    @Prop({ default: 0 })
    votes: number;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    voterIds: Types.ObjectId[];
}

@Schema({ _id: false })
class Stats {
    @Prop({ default: 0 }) views: number;
    @Prop({ default: 0 }) reach: number;
    @Prop({ default: 0 }) likes: number;
    @Prop({ default: 0 }) shares: number;
    @Prop({ default: 0 }) saves: number;
    @Prop({ default: 0 }) comments: number;
    @Prop({ default: 0 }) engagementRate: number;
    @Prop({ default: 0 }) revenue: number;
}

@Schema({ _id: false })
class AIMetadata {
    @Prop() generatedBy?: string;
    @Prop({ default: 0 }) spamScore: number;
    @Prop() sentiment?: string;
    @Prop({ type: [String] }) labels: string[];
    @Prop() autoTranslatedCaption?: string;
}

@Schema({ _id: false })
class Location {
    @Prop() name: string;
    @Prop({ type: [Number] }) coordinates: [number, number]; // [longitude, latitude]
    @Prop() city?: string;
    @Prop() country?: string;
}

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true, type: Types.ObjectId, index: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true, enum: ['user', 'page', 'group', 'channel', 'business'], index: true })
    ownerType: string;

    @Prop({
        required: true,
        enum: ['text', 'image', 'video', 'reel', 'poll', 'event', 'product', 'story', 'link', 'audio', 'document', 'ai']
    })
    type: string;

    @Prop()
    content: string;

    @Prop({ type: [Media], default: [] })
    media: Media[];

    @Prop({
        required: true,
        enum: ['public', 'followers', 'friends', 'members', 'subscribers', 'private', 'custom'],
        default: 'public'
    })
    visibility: string;

    @Prop({ type: [String], index: true })
    hashtags: string[];

    @Prop({ type: [{ id: Types.ObjectId, type: String, name: String }], default: [] })
    mentions: { id: Types.ObjectId; type: string; name: string }[];

    @Prop({ type: Location })
    location: Location;

    @Prop({ type: [PollOption] })
    pollOptions: PollOption[];

    @Prop()
    pollExpiresAt?: Date;

    @Prop({ type: Object }) // { productId, price, currency, buyUrl }
    productInfo?: Record<string, any>;

    @Prop({ type: Stats, default: () => ({}) })
    stats: Stats;

    @Prop({ default: false })
    isMonetized: boolean;

    @Prop({
        required: true,
        enum: ['draft', 'scheduled', 'published', 'archived', 'deleted'],
        default: 'published'
    })
    status: string;

    @Prop()
    scheduledAt?: Date;

    @Prop({ type: AIMetadata, default: () => ({}) })
    aiMetadata: AIMetadata;

    @Prop({ type: Types.ObjectId, ref: 'Post' })
    parentId?: Types.ObjectId; // For shares/quotes

    @Prop({ type: [String], default: [] })
    allowedLanguages: string[]; // For multi-language support

    @Prop({ required: true, enum: ['safe', 'restricted'], default: 'safe', index: true })
    contentSafetyLevel: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Indexes for performance
PostSchema.index({ ownerId: 1, ownerType: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ visibility: 1 });
