import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follows, FollowsSchema } from './schemas/follows.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follows.name, schema: FollowsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
