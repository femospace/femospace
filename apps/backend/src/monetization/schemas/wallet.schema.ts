import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
    userId: Types.ObjectId;

    @Prop({ default: 0, min: 0 })
    coinBalance: number; // For users to spend

    @Prop({ default: 0, min: 0 })
    cashBalance: number; // For creators to withdraw

    @Prop({ default: 'USD' })
    currency: string;

    @Prop({ default: 'active', enum: ['active', 'frozen', 'flagged'] })
    status: string;

    @Prop({ default: 0 })
    totalEarned: number;

    @Prop({ default: 0 })
    totalSpent: number;

    @Prop({ select: false })
    lastChecksum: string; // Anti-tamper
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
