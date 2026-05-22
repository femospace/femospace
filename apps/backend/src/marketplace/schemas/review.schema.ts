import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ required: true, enum: ['product', 'store'], index: true })
    targetType: string;

    @Prop({ required: true, type: Types.ObjectId, index: true })
    targetId: Types.ObjectId; // productId or storeId

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ default: false })
    isVerifiedPurchase: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Order' })
    orderId?: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ targetId: 1, targetType: 1 });
ReviewSchema.index({ userId: 1 });
