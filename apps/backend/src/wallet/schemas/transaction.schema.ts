import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'on-hold';
export type TransactionType = 'deposit' | 'withdraw' | 'purchase' | 'escrow' | 'release' | 'refund' | 'subscription' | 'ai-credit';
export type PaymentMethod = 'paypal' | 'binance' | 'stripe' | 'skrill' | 'bank-transfer' | 'femo-wallet' | 'payoneer';

@Schema({ timestamps: true })
export class Transaction extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    type: TransactionType;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, default: 'USD' })
    currency: string;

    @Prop({ required: true, default: 'pending' })
    status: TransactionStatus;

    @Prop({ required: true })
    method: PaymentMethod;

    @Prop()
    referenceId: string; // Internal or External IDs (Order ID, PP Trans ID, etc.)

    @Prop()
    description: string;

    @Prop({ type: Object })
    metadata: any; // Additional data for specific methods or types
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
