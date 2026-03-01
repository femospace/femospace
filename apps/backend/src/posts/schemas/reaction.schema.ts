import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReactionDocument = Reaction & Document;

@Schema({ timestamps: true })
export class Reaction {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Post', index: true })
    postId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
        default: 'like'
    })
    type: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

ReactionSchema.index({ postId: 1, userId: 1 }, { unique: true });
