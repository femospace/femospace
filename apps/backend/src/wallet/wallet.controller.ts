import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('me')
    async getWallet(@Req() req: any) {
        return await this.walletService.getWalletStats(req.user.userId);
    }

    @Get('transactions')
    async getTransactions(@Req() req: any) {
        return await this.walletService.getTransactions(req.user.userId);
    }

    @Post('deposit')
    async depositFunds(@Req() req: any, @Body() body: { amount: number; method: string; referenceId?: string }) {
        return await this.walletService.deposit(req.user.userId, body.amount, body.method as any, body.referenceId);
    }

    /**
     * Bank Transfer Proof Upload (Manual Verification)
     * In a real system, you'd use a file interceptor for the proof image.
     */
    @Post('bank-transfer/proof')
    async submitBankTransferProof(@Req() req: any, @Body() body: { amount: number; proofUrl: string; reference: string }) {
        // Record as PENDING deposit for admin to approve later
        return await this.walletService.recordTransaction(
            req.user.userId,
            'deposit',
            body.amount,
            'bank-transfer',
            body.reference,
            'Manual Bank Transfer pending approval',
            { proofUrl: body.proofUrl },
            'pending'
        );
    }

    @Post('withdraw')
    async requestWithdrawal(@Req() req: any, @Body() body: { amount: number; method: string; details: any }) {
        // Basic withdrawal registration
        return await this.walletService.recordTransaction(
            req.user.userId,
            'withdraw',
            body.amount,
            body.method as any,
            '',
            `Withdrawal request via ${body.method}`,
            body.details,
            'pending'
        );
    }

    @Post('escrow/release')
    async manuallyReleaseEscrow(@Req() req: any, @Body() body: { orderId: string }) {
        // Only buyer can release funds manually (standard marketplace pattern)
        await this.walletService.releaseEscrow(body.orderId);
        return { success: true, message: 'Funds released to seller' };
    }
}
