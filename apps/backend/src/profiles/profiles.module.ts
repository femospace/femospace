import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { Follow, FollowSchema } from './schemas/follow.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Profile.name, schema: ProfileSchema },
            { name: Follow.name, schema: FollowSchema },
        ]),
    ],
    controllers: [ProfilesController],
    providers: [ProfilesService],
    exports: [ProfilesService],
})
export class ProfilesModule { }
