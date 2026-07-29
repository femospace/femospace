import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Post', index: true })
    postId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Comment', index: true })
    parentId?: Types.ObjectId; // For threaded comments

    @Prop({ required: true })
    content: string;

    @Prop({ type: [String], default: [] })
    attachments: string[]; // Media URLs (GIFs, images)

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    likedBy: Types.ObjectId[];

    @Prop({ default: false })
    isPinned: boolean;

    @Prop({ default: false })
    isHighlighted: boolean; // For creator/admin highlight

    @Prop({ default: 'published', enum: ['published', 'hidden', 'flagged', 'deleted'] })
    status: string;

    @Prop({ type: Object })
    aiModeration?: {
        isSpam: boolean;
        toxicityScore: number;
        flaggedAt: Date;
    };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ postId: 1, createdAt: -1 });
