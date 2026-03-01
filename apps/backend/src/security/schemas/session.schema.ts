import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: string;

    @Prop({ required: true })
    deviceId: string;

    @Prop()
    deviceName: string;

    @Prop()
    deviceType: string;

    @Prop()
    location: string;

    @Prop({ required: true, index: true })
    refreshTokenHash: string;

    @Prop()
    ipAddress: string;

    @Prop()
    userAgent: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    lastActiveAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });
