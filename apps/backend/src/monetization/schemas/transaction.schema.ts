import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    fromUserId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    toUserId: Types.ObjectId;

    @Prop({ required: true })
    amount: number; // Gross amount

    @Prop({ default: 0 })
    feeAmount: number; // Platform cut

    @Prop({ default: 0 })
    netAmount: number; // Final creator earning or net value

    @Prop({ required: true, enum: ['coin_purchase', 'gift_send', 'subscription_payment', 'ad_revenue', 'creator_fund', 'withdrawal', 'refund'] })
    type: string;

    @Prop({ default: 'USD' })
    currency: string;

    @Prop({ default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'] })
    status: string;

    @Prop({ index: true })
    externalTransactionId: string; // Stripe/PayPal ID

    @Prop({ enum: ['stripe', 'paypal', 'apple_pay', 'google_pay', 'internal'] })
    paymentProvider: string;

    @Prop()
    description: string;

    @Prop({ type: Object })
    metadata: {
        giftId?: string;
        liveStreamId?: string;
        subscriptionTierId?: string;
        videoId?: string;
        adId?: string;
        payoutId?: string;
        [key: string]: any;
    };

    @Prop({ type: Types.ObjectId, ref: 'Transaction' })
    parentTransactionId: Types.ObjectId; // For refunds/reversals
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
