import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationSettings } from './schemas/notification.schema';

@Injectable()
export class NotificationsService implements OnModuleInit {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        @InjectModel(NotificationSettings.name) private settingsModel: Model<NotificationSettings>,
    ) { }

    async onModuleInit() {
        const count = await this.notificationModel.countDocuments();
        if (count === 0) {
            await this.notificationModel.create([
                {
                    userId: 'mock-user-1',
                    type: 'like',
                    category: 'social',
                    title: 'New Like',
                    message: 'Sarah Jenkins liked your recent Reel.',
                    senderId: 'sarah_id',
                    entityType: 'reel',
                    entityId: 'r1',
                    priority: 'medium',
                },
                {
                    userId: 'mock-user-1',
                    type: 'payout',
                    category: 'monetization',
                    title: 'Payout Processed',
                    message: 'Your monthly earnings of $1,240.00 have been processed.',
                    priority: 'high',
                },
                {
                    userId: 'mock-user-1',
                    type: 'security',
                    category: 'system',
                    title: 'New Login Detected',
                    message: 'A new login from Windows PC in New York, USA.',
                    priority: 'critical',
                },
                {
                    userId: 'mock-user-1',
                    type: 'follow',
                    category: 'social',
                    title: 'New Follower',
                    message: 'Alex Rivera started following you.',
                    senderId: 'alex_id',
                    priority: 'medium',
                }
            ]);
        }
    }

    async findAll(userId: string, category?: string) {
        const query = { userId, ...(category && category !== 'all' ? { category } : {}) };
        return this.notificationModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async getUnreadCount(userId: string) {
        return this.notificationModel.countDocuments({ userId, isRead: false }).exec();
    }

    async markAsRead(id: string) {
        return this.notificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }

    async markAllAsRead(userId: string) {
        return this.notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    }

    async deleteOne(id: string) {
        return this.notificationModel.findByIdAndDelete(id);
    }

    async getSettings(userId: string) {
        let settings = await this.settingsModel.findOne({ userId }).exec();
        if (!settings) {
            settings = await this.settingsModel.create({ userId });
        }
        return settings;
    }

    async updateSettings(userId: string, data: any) {
        return this.settingsModel.findOneAndUpdate({ userId }, data, { new: true, upsert: true });
    }
}
