import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MailDocument = Mail & Document;

@Schema({ timestamps: true })
export class Mail {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    fromUserId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    toUserIds: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    ccUserIds: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    bccUserIds: Types.ObjectId[];

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    body: string;

    @Prop({ type: [String], default: [] })
    attachments: string[];

    // We need to track reading state per recipient. 
    // For simplicity in this "simplified Gmail" model, we'll store per-user flags
    // if we want it to be robust. But the requirement says id, fromUserId, toUserIds, isRead, isDeleted...
    // To properly support "read/delete" per user, we might need a join table or a nested object.
    // However, for an "Internal Mail" system, usually, it's a copy in each user's inbox.
    // Let's use a simpler approach: multiple flags or a separate "MailStatus" array.

    // NEW APPROACH: To handle "isRead" and "isDeleted" per user (since a mail is one record with multiple recipients)
    @Prop({ type: Map, of: Boolean, default: {} })
    readBy: Map<string, boolean>; // userId -> true/false

    @Prop({ type: Map, of: Boolean, default: {} })
    deletedBy: Map<string, boolean>; // userId -> true/false

    @Prop({ default: false })
    isDraft: boolean;

    @Prop({ type: Date })
    deletedAt: Date; // For permanent cleanup logic if needed
}

export const MailSchema = SchemaFactory.createForClass(Mail);

// Indexes
MailSchema.index({ toUserIds: 1 });
MailSchema.index({ fromUserId: 1 });
MailSchema.index({ createdAt: -1 });
