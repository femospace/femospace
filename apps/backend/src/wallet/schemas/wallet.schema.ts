import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop({ required: true, default: 0 })
    availableBalance: number;

    @Prop({ required: true, default: 0 })
    pendingBalance: number;

    @Prop({ required: true, default: 0 })
    escrowBalance: number;

    @Prop({ required: true, default: 0 })
    withdrawableBalance: number;

    @Prop({ required: true, default: 'USD' })
    currency: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
