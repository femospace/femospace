import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionTierDocument = SubscriptionTier & Document;

@Schema({ timestamps: true })
export class SubscriptionTier {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    creatorId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // e.g. "Bronze", "Silver", "Gold"

    @Prop({ required: true })
    price: number; // in USD

    @Prop({ type: [String] })
    benefits: string[]; // e.g. ["Badge", "Exclusive Live"]

    @Prop({ default: true })
    isActive: boolean;
}

export const SubscriptionTierSchema = SchemaFactory.createForClass(SubscriptionTier);

export type UserSubscriptionDocument = UserSubscription & Document;

@Schema({ timestamps: true })
export class UserSubscription {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    creatorId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'SubscriptionTier', required: true })
    tierId: Types.ObjectId;

    @Prop({ default: 'active', enum: ['active', 'cancelled', 'expired'] })
    status: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    stripeSubscriptionId: string;
}

export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);
