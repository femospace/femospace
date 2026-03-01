import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LegalDocument extends Document {
    @Prop({ required: true, enum: ['terms', 'privacy'] })
    type: string;

    @Prop({ required: true })
    version: string;

    @Prop({ required: true })
    language: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: Date.now })
    publishedAt: Date;
}

export const LegalDocumentSchema = SchemaFactory.createForClass(LegalDocument);
LegalDocumentSchema.index({ type: 1, language: 1, version: 1 }, { unique: true });
