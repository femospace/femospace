import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
class ProductMedia {
    @Prop({ required: true })
    url: string;

    @Prop({ required: true, enum: ['image', 'video'] })
    type: string;

    @Prop()
    thumbnailUrl?: string;
}

@Schema({ _id: false })
class Inventory {
    @Prop({ default: true })
    inStock: boolean;

    @Prop({ default: 0 })
    quantity: number;

    @Prop()
    sku?: string;
}

@Schema({ _id: false })
class ShippingOption {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    estimatedDays?: string;
}

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Store' })
    storeId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    sellerId: Types.ObjectId;

    @Prop({ required: true, index: 'text' })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: 'USD' })
    currency: string;

    @Prop({ type: [ProductMedia], default: [] })
    images: ProductMedia[];

    @Prop()
    video?: string;

    @Prop({ required: true, index: true })
    category: string;

    @Prop({ type: [String], index: true })
    tags: string[];

    @Prop({ type: Inventory, default: () => ({}) })
    inventory: Inventory;

    @Prop({ type: [ShippingOption], default: [] })
    shippingOptions: ShippingOption[];

    @Prop({ type: Object })
    location: {
        name: string;
        coordinates: [number, number];
    };

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: 0 })
    reviewCount: number;

    @Prop({
        required: true,
        enum: ['draft', 'active', 'out_of_stock', 'archived', 'rejected'],
        default: 'active',
        index: true
    })
    status: string;

    @Prop({ default: 0 })
    commissionRate: number; // For affiliate system

    @Prop({ default: false })
    isFeatured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ storeId: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ createdAt: -1 });
