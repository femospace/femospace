import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
    userId: string;

    @Prop({ required: true })
    action: string; // e.g., 'LOGIN', 'PASSWORD_CHANGE', 'MFA_ENABLED', 'PAYMENT_INITIATED'

    @Prop({ required: true })
    category: string; // e.g., 'AUTH', 'SECURITY', 'FINANCE', 'CONTENT'

    @Prop({ type: MongooseSchema.Types.Mixed })
    metadata: any; // e.g., { ip: '...', userAgent: '...', deviceId: '...' }

    @Prop({ enum: ['SUCCESS', 'FAILURE', 'WARNING'], default: 'SUCCESS' })
    status: string;

    @Prop()
    ipAddress: string;

    @Prop()
    userAgent: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 }); // Retain for 1 year
