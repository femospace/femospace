import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema({ timestamps: true })
export class Follow {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    followerId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    followingId: string;

    @Prop({ default: 'standard', enum: ['standard', 'close_friend'] })
    category: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Compound index to ensure uniqueness of follow relationship
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
