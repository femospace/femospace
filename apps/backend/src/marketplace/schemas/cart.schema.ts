import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ _id: false })
class CartItem {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
    productId: Types.ObjectId;

    @Prop({ required: true, default: 1 })
    quantity: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    affiliateId?: Types.ObjectId; // For commission if added from a creator's link
}

@Schema({ timestamps: true })
export class Cart {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: [CartItem], default: [] })
    items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
