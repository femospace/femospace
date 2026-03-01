import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayoutDocument = Payout & Document;

@Schema({ timestamps: true })
export class Payout {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ required: true, enum: ['bank', 'paypal', 'crypto'] })
    method: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'processed', 'rejected'] })
    status: string;

    @Prop({ type: Object })
    methodDetails: any; // e.g. bank account info, paypal email, wallet address

    @Prop()
    processedAt: Date;

    @Prop()
    rejectionReason: string;
}

export const PayoutSchema = SchemaFactory.createForClass(Payout);
