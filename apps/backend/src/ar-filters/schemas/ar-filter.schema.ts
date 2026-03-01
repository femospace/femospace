import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ARFilterDocument = ARFilter & Document;

@Schema({ timestamps: true })
export class ARFilter {
    @Prop({ required: true, unique: true, index: true })
    filterId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['beauty', 'color', 'mask', '3d', 'interactive'], index: true })
    category: string;

    @Prop({ required: true })
    thumbnail: string; // URL or emoji

    @Prop()
    description?: string;

    @Prop()
    assetPath?: string; // Path to 3D model or texture

    @Prop({ type: Object })
    metadata?: {
        cssFilter?: string;
        renderingType?: 'css' | 'canvas' | 'webgl';
        requiresFaceDetection?: boolean;
        gpuAccelerated?: boolean;
    };

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isPremium: boolean;

    @Prop({ default: 0 })
    usageCount: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    tags: string[];
}

export const ARFilterSchema = SchemaFactory.createForClass(ARFilter);

// Indexes
ARFilterSchema.index({ category: 1, isActive: 1 });
ARFilterSchema.index({ usageCount: -1 });
ARFilterSchema.index({ createdAt: -1 });
