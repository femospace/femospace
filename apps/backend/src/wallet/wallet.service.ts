import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from './schemas/wallet.schema';
import { Transaction, TransactionType, PaymentMethod } from './schemas/transaction.schema';
import { Escrow } from './schemas/escrow.schema';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
        @InjectModel(Escrow.name) private escrowModel: Model<Escrow>,
    ) { }

    async getOrCreateWallet(userId: string): Promise<Wallet> {
        if (!userId) throw new BadRequestException('User ID is required');

        // Ensure we use ObjectId if it's a valid hex string, 
        // otherwise try plain string (for flexibility/testing)
        const id = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;

        let wallet = await this.walletModel.findOne({ userId: id });
        if (!wallet) {
            wallet = new this.walletModel({ userId: id });
            try {
                await wallet.save();
            } catch (err) {
                // Handle duplicate key if multiple requests hit at once
                if (err.code === 11000) {
                    const existing = await this.walletModel.findOne({ userId: id });
                    if (!existing) throw new NotFoundException('Wallet creation conflict');
                    return existing;
                }
                throw err;
            }
        }
        return wallet;
    }

    async recordTransaction(
        userId: string,
        type: TransactionType,
        amount: number,
        method: PaymentMethod,
        referenceId?: string,
        description?: string,
        metadata?: any,
        status: 'pending' | 'completed' | 'failed' = 'completed'
    ): Promise<Transaction> {
        const id = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
        const transaction = new this.transactionModel({
            userId: id,
            type,
            amount,
            method,
            referenceId,
            description,
            metadata,
            status,
        });
        return await transaction.save();
    }

    /**
     * Deposit logic: In a real system, this would be called AFTER gateway verification (webhook)
     * For the manual Bank Transfer, it will start with 'pending' status.
     */
    async deposit(userId: string, amount: number, method: PaymentMethod, referenceId?: string): Promise<any> {
        const wallet = await this.getOrCreateWallet(userId);

        // Create pending transaction if it's bank transfer or needs manual verification
        const status = method === 'bank-transfer' ? 'pending' : 'completed';
        const transaction = await this.recordTransaction(userId, 'deposit', amount, method, referenceId, `Deposit via ${method}`, {}, status);

        if (status === 'completed') {
            wallet.availableBalance += amount;
            await wallet.save();
        }

        return { wallet, transaction };
    }

    /**
     * Marketplace Escrow: Holds buyer funds when an order is placed.
     */
    async holdInEscrow(buyerId: string, sellerId: string, amount: number, orderId: string): Promise<Escrow> {
        const buyerWallet = await this.getOrCreateWallet(buyerId);

        if (buyerWallet.availableBalance < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }

        // Move from available to escrow balance
        buyerWallet.availableBalance -= amount;
        buyerWallet.escrowBalance += amount;
        await buyerWallet.save();

        // Create Escrow Record
        const escrow = new this.escrowModel({
            orderId,
            buyerId,
            sellerId,
            amount,
            status: 'held',
            releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Auto-release in 7 days
        });

        await escrow.save();
        await this.recordTransaction(buyerId, 'escrow', amount, 'femo-wallet', orderId, 'Purchase held in escrow');

        return escrow;
    }

    /**
     * Release Escrow: Buyer confirms delivery or auto-release timer is hit.
     */
    async releaseEscrow(orderId: string): Promise<void> {
        const escrow = await this.escrowModel.findOne({ orderId, status: 'held' });
        if (!escrow) throw new NotFoundException('No active escrow found for this order');

        const sellerWallet = await this.getOrCreateWallet(escrow.sellerId.toString());
        const buyerWallet = await this.getOrCreateWallet(escrow.buyerId.toString());

        // Update Buyer Balance (Remove from escrow)
        buyerWallet.escrowBalance -= escrow.amount;
        await buyerWallet.save();

        // Update Seller Balance (Add to pending first, move to withdrawable after review if needed)
        sellerWallet.availableBalance += escrow.amount;
        await sellerWallet.save();

        // Update Escrow Status
        escrow.status = 'released';
        await escrow.save();

        // Log release transaction for both
        await this.recordTransaction(escrow.buyerId.toString(), 'release', escrow.amount, 'femo-wallet', orderId, 'Funds released to seller');
        await this.recordTransaction(escrow.sellerId.toString(), 'purchase', escrow.amount, 'femo-wallet', orderId, 'Sales profit received');
    }

    /**
     * AI Credits logic: Deduct small amounts based on tool use.
     */
    async deductAICredits(userId: string, amount: number, toolName: string): Promise<void> {
        const wallet = await this.getOrCreateWallet(userId);
        if (wallet.availableBalance < amount) {
            throw new BadRequestException(`Insufficient balance for AI Tool: ${toolName}`);
        }

        wallet.availableBalance -= amount;
        await wallet.save();

        await this.recordTransaction(userId, 'ai-credit', amount, 'femo-wallet', toolName, `AI Usage: ${toolName}`);
    }

    async getTransactions(userId: string): Promise<Transaction[]> {
        const id = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
        return await this.transactionModel.find({ userId: id }).sort({ createdAt: -1 });
    }

    async getWalletStats(userId: string): Promise<Wallet> {
        return await this.getOrCreateWallet(userId);
    }
}
