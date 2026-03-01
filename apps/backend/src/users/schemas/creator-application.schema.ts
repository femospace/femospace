import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CreatorApplicationDocument = CreatorApplication & Document;

@Schema({ timestamps: true })
export class CreatorApplication {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    reason: string;

    @Prop({ type: [String], default: [] })
    portfolioLinks: string[];

    @Prop({ required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true })
    status: string;

    @Prop({ required: true })
    femoEmailOrId: string;

    @Prop({ required: true })
    mobileNumber: string;

    @Prop({ required: true })
    creatorAccountName: string;

    @Prop({ required: true })
    accountType: string; // page, group, channel, etc.

    @Prop({ required: true })
    creationDate: Date;

    @Prop({ required: true })
    currentStatus: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    reviewedBy: Types.ObjectId;

    @Prop()
    reviewedAt: Date;

    @Prop()
    rejectionReason: string;
}

export const CreatorApplicationSchema = SchemaFactory.createForClass(CreatorApplication);
