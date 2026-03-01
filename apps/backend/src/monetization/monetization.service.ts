import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MonetizationProfile, MonetizationProfileDocument } from './schemas/monetization-profile.schema';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Payout, PayoutDocument } from './schemas/payout.schema';
import { Gift, GiftDocument } from './schemas/gift.schema';
import { SubscriptionTier, SubscriptionTierDocument, UserSubscription, UserSubscriptionDocument } from './schemas/subscription.schema';
import { AdImpression, AdImpressionDocument } from './schemas/ad-revenue.schema';
import { SendTipDto, BuyCoinsDto, WithdrawFundsDto } from './dto/monetization.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { KycService } from '../kyc/kyc.service';
import { KYCStatus } from '../kyc/schemas/kyc-profile.schema';

@Injectable()
export class MonetizationService {
    constructor(
        @InjectModel(MonetizationProfile.name) private profileModel: Model<MonetizationProfileDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(Transaction.name) private transModel: Model<TransactionDocument>,
        @InjectModel(Payout.name) private payoutModel: Model<PayoutDocument>,
        @InjectModel(Gift.name) private giftModel: Model<GiftDocument>,
        @InjectModel(SubscriptionTier.name) private tierModel: Model<SubscriptionTierDocument>,
        @InjectModel(UserSubscription.name) private subModel: Model<UserSubscriptionDocument>,
        @InjectModel(AdImpression.name) private adModel: Model<AdImpressionDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private kycService: KycService,
    ) { }

    async getStats(userId: string) {
        let profile = await this.profileModel.findOne({ userId: new Types.ObjectId(userId) });
        if (!profile) {
            profile = await this.profileModel.create({ userId: new Types.ObjectId(userId) });
        }
        return profile;
    }

    async getWallet(userId: string) {
        let wallet = await this.walletModel.findOne({ userId: new Types.ObjectId(userId) });
        if (!wallet) {
            wallet = await this.walletModel.create({ userId: new Types.ObjectId(userId), coinBalance: 0, cashBalance: 0 });
        }
        return wallet;
    }

    async withdraw(userId: string, dto: WithdrawFundsDto) {
        const kyc = await this.kycService.getProfile(userId);
        if (kyc.status !== KYCStatus.APPROVED) {
            throw new BadRequestException('Identity verification required for withdrawals');
        }
        const uId = new Types.ObjectId(userId);
        const wallet = await this.getWallet(userId);

        if (wallet.cashBalance < dto.amount) {
            throw new BadRequestException('Insufficient earnings for withdrawal');
        }

        const payout = new this.payoutModel({
            userId: uId,
            amount: dto.amount,
            method: dto.method,
            methodDetails: dto.methodDetails,
            status: 'pending'
        });

        await this.walletModel.updateOne(
            { userId: uId },
            { $inc: { cashBalance: -dto.amount } }
        );

        await this.transModel.create({
            fromUserId: uId,
            amount: dto.amount,
            type: 'withdrawal',
            status: 'pending',
            description: `Withdrawal request via ${dto.method}`,
            metadata: { method: dto.method }
        });

        return payout.save();
    }

    async enableMonetization(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        // Check eligibility: Account age >= 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date((user as any).createdAt) > thirtyDaysAgo) {
            throw new BadRequestException('Account must be at least 30 days old to monetize');
        }

        if (!user.isEmailVerified) {
            throw new BadRequestException('Email must be verified to enable monetization');
        }

        return this.profileModel.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            { isEnabled: true },
            { upsert: true, new: true }
        );
    }

    async buyCoins(userId: string, dto: BuyCoinsDto) {
        // Stripe integration point: In production, verify dto.paymentMethodId with Stripe
        const uId = new Types.ObjectId(userId);

        await this.walletModel.updateOne(
            { userId: uId },
            { $inc: { coinBalance: dto.amount } },
            { upsert: true }
        );

        const trans = new this.transModel({
            fromUserId: uId,
            amount: dto.amount,
            type: 'coin_purchase',
            status: 'completed',
            paymentProvider: 'stripe',
            externalTransactionId: dto.paymentMethodId || `SIM_${Date.now()}`,
            description: `Purchased ${dto.amount} coins`,
        });
        return trans.save();
    }

    async sendTip(userId: string, dto: SendTipDto) {
        const fromId = new Types.ObjectId(userId);
        const toId = new Types.ObjectId(dto.toUserId);

        if (userId === dto.toUserId) throw new BadRequestException('Cannot tip yourself');

        const wallet = await this.getWallet(userId);
        if (wallet.coinBalance < dto.amount) {
            throw new BadRequestException('Insufficient balance');
        }

        const receiverProfile = await this.profileModel.findOne({ userId: toId });
        if (!receiverProfile || !receiverProfile.isEnabled) {
            throw new BadRequestException('Receiver has not enabled monetization');
        }

        // 1 coin = $0.01USD
        const earning = dto.amount * 0.01;

        await this.walletModel.updateOne({ userId: fromId }, { $inc: { coinBalance: -dto.amount, totalSpent: dto.amount } });
        await this.walletModel.updateOne(
            { userId: toId },
            { $inc: { cashBalance: earning, totalEarned: earning } },
            { upsert: true }
        );

        const trans = new this.transModel({
            fromUserId: fromId,
            toUserId: toId,
            amount: dto.amount,
            netAmount: earning,
            type: 'gift_send',
            status: 'completed',
            description: dto.message || 'Tip from user',
            metadata: { postId: dto.postId }
        });
        return trans.save();
    }

    async getGifts() {
        return this.giftModel.find({ isActive: true }).exec();
    }

    async sendGift(senderId: string, giftId: string, creatorId: string, liveStreamId?: string) {
        const sId = new Types.ObjectId(senderId);
        const cId = new Types.ObjectId(creatorId);
        const gId = new Types.ObjectId(giftId);

        if (senderId === creatorId) throw new BadRequestException('Cannot gift yourself');

        const gift = await this.giftModel.findById(giftId);
        if (!gift) throw new NotFoundException('Gift not found');

        const senderWallet = await this.getWallet(senderId);
        if (senderWallet.coinBalance < gift.coinValue) {
            throw new BadRequestException('Insufficient coins');
        }

        const creatorProfile = await this.profileModel.findOne({ userId: cId });
        if (!creatorProfile || !creatorProfile.isEnabled) {
            throw new BadRequestException('Creator has not enabled monetization');
        }

        // Logic: 70% to creator, 30% to platform
        // 1 coin = $0.01 (Internal conversion rate)
        const creatorEarning = (gift.coinValue * 0.7) * 0.01;
        const platformFee = (gift.coinValue * 0.3) * 0.01;

        // Atomic Updates
        await this.walletModel.updateOne({ userId: sId }, { $inc: { coinBalance: -gift.coinValue, totalSpent: gift.coinValue } });
        await this.walletModel.updateOne(
            { userId: cId },
            { $inc: { cashBalance: creatorEarning, totalEarned: creatorEarning } },
            { upsert: true }
        );

        const trans = new this.transModel({
            fromUserId: sId,
            toUserId: cId,
            amount: gift.coinValue,
            feeAmount: platformFee,
            netAmount: creatorEarning,
            type: 'gift_send',
            status: 'completed',
            description: `Sent ${gift.name} gift`,
            metadata: { giftId, liveStreamId }
        });

        // Trigger Real-time Event (In production, inject Gateway)
        // this.eventEmitter.emit('gift.sent', { senderId, creatorId, gift });

        return trans.save();
    }

    // --- Subscriptions ---

    async createTier(creatorId: string, dto: any) {
        return this.tierModel.create({
            creatorId: new Types.ObjectId(creatorId),
            ...dto
        });
    }

    async getCreatorTiers(creatorId: string) {
        return this.tierModel.find({ creatorId: new Types.ObjectId(creatorId), isActive: true }).exec();
    }

    async subscribe(userId: string, tierId: string) {
        const uId = new Types.ObjectId(userId);
        const tier = await this.tierModel.findById(tierId);
        if (!tier) throw new NotFoundException('Tier not found');

        // Verify payment via Stripe...

        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(now.getMonth() + 1);

        const sub = new this.subModel({
            userId: uId,
            creatorId: tier.creatorId,
            tierId: tier._id,
            status: 'active',
            startDate: now,
            endDate
        });

        // Split revenue: 70/30
        const earning = tier.price * 0.7;
        await this.walletModel.updateOne(
            { userId: tier.creatorId },
            { $inc: { cashBalance: earning, totalEarned: earning } },
            { upsert: true }
        );

        return sub.save();
    }

    // --- Ads ---

    async trackAdImpression(creatorId: string, videoId: string, revenue: number) {
        // revenue is platform-assigned based on CPM
        const cId = new Types.ObjectId(creatorId);
        const creatorShare = revenue * 0.55; // 55% share

        await this.walletModel.updateOne(
            { userId: cId },
            { $inc: { cashBalance: creatorShare, totalEarned: creatorShare } },
            { upsert: true }
        );

        return this.adModel.create({
            creatorId: cId,
            videoId: new Types.ObjectId(videoId),
            revenue: creatorShare
        });
    }

    // --- Analytics ---

    async getEarningsBreakdown(userId: string) {
        const uId = new Types.ObjectId(userId);
        const stats = await this.transModel.aggregate([
            { $match: { toUserId: uId, status: 'completed' } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$netAmount' }
                }
            }
        ]);

        const wallet = await this.getWallet(userId);
        const profile = await this.getStats(userId);

        return {
            totalEarnings: wallet.totalEarned,
            currentBalance: wallet.cashBalance,
            withdrawableBalance: wallet.cashBalance,
            breakdown: stats,
            profileStatus: profile.isEnabled
        };
    }

    async getTransactionHistory(userId: string) {
        return this.transModel.find({
            $or: [
                { fromUserId: new Types.ObjectId(userId) },
                { toUserId: new Types.ObjectId(userId) }
            ]
        }).sort({ createdAt: -1 }).limit(50).exec();
    }

    async getPayoutHistory(userId: string) {
        return this.payoutModel.find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
}
