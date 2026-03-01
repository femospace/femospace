import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ required: true, index: true })
    userId: string;

    @Prop({ required: true })
    type: string; // like, comment, follow, system, etc.

    @Prop({ enum: ['social', 'content', 'community', 'system', 'monetization', 'business', 'ai'], required: true })
    category: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop()
    entityType?: string; // post, video, reel, page, group

    @Prop()
    entityId?: string;

    @Prop()
    senderId?: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ default: false })
    isMuted: boolean;

    @Prop({ enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
    priority: string;

    @Prop({ type: [String], default: ['in-app'] })
    deliveryChannels: string[];

    @Prop()
    expiresAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

@Schema({ timestamps: true })
export class NotificationSettings {
    @Prop({ required: true, unique: true, index: true })
    userId: string;

    @Prop({
        type: Map, of: Boolean, default: {
            social: true,
            content: true,
            community: true,
            system: true,
            monetization: true,
            business: true,
            ai: true
        }
    })
    categories: Map<string, boolean>;

    @Prop({
        type: Map, of: [String], default: {
            social: ['in-app', 'push'],
            system: ['in-app', 'push', 'email'],
            business: ['in-app', 'push', 'email', 'sms']
        }
    })
    channels: Map<string, string[]>;

    @Prop({ default: false })
    quietHoursEnabled: boolean;

    @Prop()
    quietHoursStart?: string; // HH:mm

    @Prop()
    quietHoursEnd?: string; // HH:mm
}

export const NotificationSettingsSchema = SchemaFactory.createForClass(NotificationSettings);
