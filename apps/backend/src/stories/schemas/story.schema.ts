import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StoryDocument = Story & Document;

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  rotation: number;
}

export interface EmojiOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface StoryAudio {
  trackId: string;
  type: 'music' | 'sfx';
  startAt: number;
  volume: number;
}

@Schema({ _id: false })
class StoryMedia {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['image', 'video'] })
  type: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ default: 15 }) // Duration in seconds
  duration: number;
}

@Schema({ _id: false })
class StoryInteractions {
  @Prop({ default: 0 }) viewsCount: number;
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] }) viewers: Types.ObjectId[];
  @Prop({ type: [{ userId: Types.ObjectId, emoji: String, createdAt: Date }], default: [] })
  reactions: { userId: Types.ObjectId; emoji: string; createdAt: Date }[];
}

@Schema({ timestamps: true })
export class Story {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, enum: ['user', 'page', 'group', 'channel', 'business'], index: true })
  ownerType: string;

  @Prop({ type: StoryMedia, required: true })
  media: StoryMedia;

  @Prop({
    required: true,
    enum: ['image', 'video', 'text', 'poll', 'quiz', 'link', 'product', 'live', 'ai'],
    default: 'image'
  })
  type: string;

  @Prop({
    required: true,
    enum: ['public', 'followers', 'friends', 'members', 'subscribers', 'private', 'custom'],
    default: 'public'
  })
  audience: string;

  @Prop({ type: StoryInteractions, default: () => ({}) })
  interactions: StoryInteractions;

  @Prop({ type: Object, default: { textItems: [], emojiItems: [] } })
  overlays?: { textItems: TextOverlay[]; emojiItems: EmojiOverlay[] };

  @Prop({ type: Object, default: null })
  audio?: StoryAudio | null;

  @Prop({ type: Object })
  content?: Record<string, any>; // Stickers, text overlays, poll options, quiz questions

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: Object })
  aiMetadata?: {
    caption?: string;
    tags?: string[];
    toxicityScore?: number;
  };

  @Prop({ required: true, enum: ['safe', 'restricted'], default: 'safe', index: true })
  contentSafetyLevel: string;
}

export const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.index({ ownerId: 1, createdAt: -1 });
