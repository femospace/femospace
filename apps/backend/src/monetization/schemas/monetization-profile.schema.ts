import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonetizationProfileDocument = MonetizationProfile & Document;

@Schema({ timestamps: true })
export class MonetizationProfile {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
    userId: Types.ObjectId;

    @Prop({ default: false })
    isEnabled: boolean;

    @Prop({ default: false })
    isApproved: boolean;

    @Prop({ default: 0 })
    totalEarnings: number; // In base currency (e.g., cents or coins)

    @Prop({ default: 0 })
    adRevenue: number;

    @Prop({ default: 0 })
    fanSupportRevenue: number;

    @Prop({ default: 0 })
    subscriptionRevenue: number;

    @Prop({ default: 0 })
    productSalesRevenue: number;

    @Prop({ type: Date })
    approvedAt: Date;
}

export const MonetizationProfileSchema = SchemaFactory.createForClass(MonetizationProfile);
