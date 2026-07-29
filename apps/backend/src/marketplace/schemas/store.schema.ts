import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema({ _id: false })
class StorePolicies {
    @Prop()
    shipping: string;

    @Prop()
    refund: string;

    @Prop()
    privacy: string;
}

@Schema({ timestamps: true })
export class Store {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true, unique: true, index: true })
    name: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop()
    description: string;

    @Prop()
    logoUrl?: string;

    @Prop()
    bannerUrl?: string;

    @Prop({ default: 0 })
    followerCount: number;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: 0 })
    reviewCount: number;

    @Prop({ type: StorePolicies, default: () => ({}) })
    policies: StorePolicies;

    @Prop({
        required: true,
        enum: ['pending', 'active', 'suspended', 'closed'],
        default: 'pending',
        index: true
    })
    status: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ type: Object })
    businessInfo: {
        registrationNumber?: string;
        taxId?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.index({ name: 'text', description: 'text' });
