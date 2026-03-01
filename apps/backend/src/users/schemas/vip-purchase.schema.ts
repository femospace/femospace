import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VipPurchaseDocument = VipPurchase & Document;

@Schema({ timestamps: true })
export class VipPurchase {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: ['card', 'paypal', 'crypto', 'wallet'] })
    paymentMethod: string;

    @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' })
    status: string;

    @Prop()
    transactionId: string;

    @Prop({ required: true })
    durationMonths: number; // 1, 3, 6, 12

    @Prop()
    expiresAt: Date;
}

export const VipPurchaseSchema = SchemaFactory.createForClass(VipPurchase);
