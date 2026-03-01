import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { Mail, MailSchema } from './schemas/mail.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Mail.name, schema: MailSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
