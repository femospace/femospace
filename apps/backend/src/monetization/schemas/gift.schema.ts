import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GiftDocument = Gift & Document;

@Schema({ timestamps: true })
export class Gift {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    coinValue: number;

    @Prop()
    imageUrl: string;

    @Prop()
    animationUrl: string; // For custom Lottie/Video animations

    @Prop({ default: 'standard', enum: ['standard', 'premium', 'exclusive', 'event'] })
    category: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);
