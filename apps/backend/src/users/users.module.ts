import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { VipPurchase, VipPurchaseSchema } from './schemas/vip-purchase.schema';
import { CreatorApplication, CreatorApplicationSchema } from './schemas/creator-application.schema';

import { LegalModule } from '../legal/legal.module';

import { UsersController } from './users.controller';
import { VipController } from './vip.controller';
import { CreatorController } from './creator.controller';

import { VipService } from './vip.service';
import { CreatorService } from './creator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VipPurchase.name, schema: VipPurchaseSchema },
      { name: CreatorApplication.name, schema: CreatorApplicationSchema },
    ]),
    LegalModule,
  ],
  controllers: [UsersController, VipController, CreatorController],
  providers: [UsersService, VipService, CreatorService],
  exports: [UsersService, VipService, CreatorService],
})
export class UsersModule { }
