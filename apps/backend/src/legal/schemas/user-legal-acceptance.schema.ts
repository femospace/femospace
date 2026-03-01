import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class UserLegalAcceptance extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ required: true })
    termsVersion: string;

    @Prop({ required: true })
    privacyVersion: string;

    @Prop({ required: true })
    language: string;

    @Prop({ required: true })
    acceptedAt: Date;

    @Prop({ required: true })
    ip: string;

    @Prop({ required: true })
    device: string;
}

export const UserLegalAcceptanceSchema = SchemaFactory.createForClass(UserLegalAcceptance);
UserLegalAcceptanceSchema.index({ userId: 1, termsVersion: 1, privacyVersion: 1 });
