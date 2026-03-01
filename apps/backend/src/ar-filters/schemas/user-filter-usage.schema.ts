import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserFilterUsageDocument = UserFilterUsage & Document;

@Schema({ timestamps: true })
export class UserFilterUsage {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'ARFilter', index: true })
    filterId: Types.ObjectId;

    @Prop({ default: 0 })
    usageCount: number;

    @Prop()
    lastUsed: Date;

    @Prop({ type: [Date], default: [] })
    usageHistory: Date[];
}

export const UserFilterUsageSchema = SchemaFactory.createForClass(UserFilterUsage);

// Compound indexes
UserFilterUsageSchema.index({ userId: 1, filterId: 1 }, { unique: true });
UserFilterUsageSchema.index({ userId: 1, lastUsed: -1 });
UserFilterUsageSchema.index({ filterId: 1, usageCount: -1 });
