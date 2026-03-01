import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationSchema, NotificationSettings, NotificationSettingsSchema } from './schemas/notification.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
            { name: NotificationSettings.name, schema: NotificationSettingsSchema },
        ]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
