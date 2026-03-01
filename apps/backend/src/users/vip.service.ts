import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { VipPurchase, VipPurchaseDocument } from './schemas/vip-purchase.schema';
import { BuyVipDto } from './dto/buy-vip.dto';

@Injectable()
export class VipService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(VipPurchase.name) private vipPurchaseModel: Model<VipPurchaseDocument>,
    ) { }

    // VIP Pricing (in USD)
    private readonly VIP_PRICING = {
        12: 29.00, // 12 months for $29 (Special Offer, Regular $49)
    };

    async getVipPricing() {
        return this.VIP_PRICING;
    }

    async buyVip(userId: string, buyVipDto: BuyVipDto): Promise<VipPurchaseDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { durationMonths, paymentMethod, transactionId } = buyVipDto;

        // Get price
        const amount = this.VIP_PRICING[durationMonths as keyof typeof this.VIP_PRICING];
        if (!amount) {
            throw new BadRequestException('Invalid duration');
        }

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

        // Create purchase record
        const purchase = new this.vipPurchaseModel({
            userId: new Types.ObjectId(userId),
            amount,
            paymentMethod,
            transactionId: transactionId || `VIP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            durationMonths,
            expiresAt,
            status: 'completed', // In production, this would be 'pending' until payment confirmed
        });

        await purchase.save();

        // Update user VIP status
        user.isVip = true;
        user.vipExpiresAt = expiresAt;
        await user.save();

        return purchase;
    }

    async getVipStatus(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if VIP expired
        if (user.isVip && user.vipExpiresAt && new Date() > user.vipExpiresAt) {
            user.isVip = false;
            await user.save();
        }

        return {
            isVip: user.isVip,
            vipExpiresAt: user.vipExpiresAt,
            daysRemaining: user.vipExpiresAt
                ? Math.ceil((user.vipExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : 0,
        };
    }

    async getVipPurchaseHistory(userId: string): Promise<VipPurchaseDocument[]> {
        return this.vipPurchaseModel
            .find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
}
