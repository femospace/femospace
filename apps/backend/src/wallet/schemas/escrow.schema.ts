import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed';

@Schema({ timestamps: true })
export class Escrow extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    buyerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sellerId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, default: 'held' })
    status: EscrowStatus;

    @Prop()
    releaseDate: Date; // Estimated or auto-release date

    @Prop({ required: true, default: 'USD' })
    currency: string;
}

export const EscrowSchema = SchemaFactory.createForClass(Escrow);
