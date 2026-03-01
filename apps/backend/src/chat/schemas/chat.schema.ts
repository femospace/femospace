import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true, index: true })
    participants: Types.ObjectId[];

    @Prop({ enum: ['direct', 'group', 'channel', 'page', 'business', 'ai', 'support'], default: 'direct' })
    type: string;

    @Prop({ type: Object, default: undefined })
    supportMeta?: {
        isSupport: boolean;
        status: "open" | "pending" | "resolved";
        assignedAdminId?: string;
        createdFrom: "contact-us" | "help-center" | string;
    };

    @Prop()
    name?: string; // For groups/channels

    @Prop()
    avatar?: string; // For groups/channels

    @Prop()
    description?: string;

    @Prop({ type: Object })
    lastMessage?: {
        text: string;
        senderId: string;
        type: string;
        createdAt: Date;
    };

    @Prop({ type: [{ type: String }], default: [] })
    admins: string[];

    @Prop({ type: [{ type: String }], default: [] })
    bannedUsers: string[];

    @Prop({ default: false })
    isEncrypted: boolean;

    @Prop({ type: Map, of: Number, default: {} })
    unreadCounts: Map<string, number>; // Local unread count per user
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: String, required: true, index: true })
    chatId: string;

    @Prop({ type: String, required: true, index: true })
    senderId: string;

    @Prop({ required: true })
    content: string;

    @Prop({ enum: ['text', 'image', 'video', 'file', 'voice', 'location', 'contact', 'sticker', 'gif'], default: 'text' })
    type: string;

    @Prop({ type: Object, default: {} })
    metadata: {
        fileName?: string;
        fileUrl?: string;
        fileSize?: number;
        mimeType?: string;
        duration?: number;
        thumbnailUrl?: string;
        latitude?: number;
        longitude?: number;
        contactName?: string;
        contactNumber?: string;
    };

    @Prop({ enum: ['sent', 'delivered', 'seen', 'failed'], default: 'sent' })
    status: string;

    @Prop({ type: [{ userId: String, emoji: String }], default: [] })
    reactions: Array<{ userId: string; emoji: string }>;

    @Prop({ type: String })
    replyTo?: string; // ID of the message being replied to

    @Prop({ type: Date })
    deletedAt?: Date;

    @Prop({ type: [String], default: [] })
    seenBy: string[];

    @Prop({ type: String })
    forwardedFrom?: string; // Original sender ID if forwarded

    @Prop({ type: [String], default: [] })
    starredBy: string[]; // User IDs who starred this message
}

export const MessageSchema = SchemaFactory.createForClass(Message);
