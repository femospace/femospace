import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { Session, SessionSchema } from './schemas/session.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
        UsersModule,
    ],
    controllers: [SecurityController],
    providers: [SecurityService],
    exports: [SecurityService],
})
export class SecurityModule { }
