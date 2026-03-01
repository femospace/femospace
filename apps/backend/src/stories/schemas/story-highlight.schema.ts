import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StoryHighlightDocument = StoryHighlight & Document;

@Schema({ timestamps: true })
export class StoryHighlight {
    @Prop({ required: true, type: Types.ObjectId, index: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    coverUrl: string;

    @Prop({ type: [Types.ObjectId], ref: 'Story', required: true })
    storyIds: Types.ObjectId[];

    @Prop({ default: true })
    isActive: boolean;
}

export const StoryHighlightSchema = SchemaFactory.createForClass(StoryHighlight);

StoryHighlightSchema.index({ ownerId: 1, createdAt: -1 });
