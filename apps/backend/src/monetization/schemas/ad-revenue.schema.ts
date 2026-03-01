import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdImpressionDocument = AdImpression & Document;

@Schema({ timestamps: true })
export class AdImpression {
    @Prop({ type: Types.ObjectId, ref: 'Video', required: true, index: true })
    videoId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    creatorId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    viewerId: Types.ObjectId;

    @Prop()
    adId: string;

    @Prop({ required: true })
    revenue: number; // Amount shared with creator

    @Prop({ default: 'USD' })
    currency: string;

    @Prop()
    country: string;

    @Prop()
    deviceType: string;
}

export const AdImpressionSchema = SchemaFactory.createForClass(AdImpression);
