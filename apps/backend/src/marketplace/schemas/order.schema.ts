import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class OrderItem {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
    productId: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: 1 })
    quantity: number;

    @Prop()
    imageUrl?: string;
}

@Schema({ _id: false })
class ShippingAddress {
    @Prop({ required: true }) fullName: string;
    @Prop({ required: true }) addressLine1: string;
    @Prop() addressLine2?: string;
    @Prop({ required: true }) city: string;
    @Prop() state?: string;
    @Prop({ required: true }) postalCode: string;
    @Prop({ required: true }) country: string;
    @Prop({ required: true }) phone: string;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    buyerId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Store', index: true })
    storeId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    sellerId: Types.ObjectId;

    @Prop({ type: [OrderItem], required: true })
    items: OrderItem[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true, default: 'USD' })
    currency: string;

    @Prop({
        required: true,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
        index: true
    })
    paymentStatus: string;

    @Prop({
        required: true,
        enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'processing',
        index: true
    })
    status: string;

    @Prop({ type: ShippingAddress, required: true })
    shippingAddress: ShippingAddress;

    @Prop()
    trackingNumber?: string;

    @Prop()
    shippingCarrier?: string;

    @Prop()
    paymentMethod?: string; // 'card', 'wallet', 'coins', 'cod'

    @Prop({ type: Types.ObjectId, ref: 'User' })
    affiliateId?: Types.ObjectId; // If bought through an affiliate

    @Prop({ default: 0 })
    commissionAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ buyerId: 1, createdAt: -1 });
OrderSchema.index({ sellerId: 1, createdAt: -1 });
OrderSchema.index({ storeId: 1, createdAt: -1 });
