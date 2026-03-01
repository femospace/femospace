import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FollowsDocument = Follows & Document;

@Schema({ timestamps: true })
export class Follows {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  followerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  followingId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FollowsSchema = SchemaFactory.createForClass(Follows);
FollowsSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
