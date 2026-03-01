import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonetizationController } from './monetization.controller';
import { MonetizationService } from './monetization.service';
import { MonetizationProfile, MonetizationProfileSchema } from './schemas/monetization-profile.schema';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Payout, PayoutSchema } from './schemas/payout.schema';
import { Gift, GiftSchema } from './schemas/gift.schema';
import { SubscriptionTier, SubscriptionTierSchema, UserSubscription, UserSubscriptionSchema } from './schemas/subscription.schema';
import { AdImpression, AdImpressionSchema } from './schemas/ad-revenue.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { KycModule } from '../kyc/kyc.module';

@Module({
    imports: [
        KycModule,
        MongooseModule.forFeature([
            { name: MonetizationProfile.name, schema: MonetizationProfileSchema },
            { name: Wallet.name, schema: WalletSchema },
            { name: Transaction.name, schema: TransactionSchema },
            { name: Payout.name, schema: PayoutSchema },
            { name: Gift.name, schema: GiftSchema },
            { name: SubscriptionTier.name, schema: SubscriptionTierSchema },
            { name: UserSubscription.name, schema: UserSubscriptionSchema },
            { name: AdImpression.name, schema: AdImpressionSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [MonetizationController],
    providers: [MonetizationService],
    exports: [MonetizationService],
})
export class MonetizationModule { }
