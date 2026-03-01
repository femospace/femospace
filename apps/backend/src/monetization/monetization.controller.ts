import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { MonetizationService } from './monetization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendTipDto, BuyCoinsDto, WithdrawFundsDto } from './dto/monetization.dto';

@Controller('monetization')
@UseGuards(JwtAuthGuard)
export class MonetizationController {
    constructor(private readonly monService: MonetizationService) { }

    @Get('stats')
    async getStats(@Request() req: any) {
        return this.monService.getStats(req.user.id);
    }

    @Get('wallet')
    async getWallet(@Request() req: any) {
        return this.monService.getWallet(req.user.id);
    }

    @Post('enable')
    async enableMonetization(@Request() req: any) {
        return this.monService.enableMonetization(req.user.id);
    }

    @Post('buy-coins')
    async buyCoins(@Request() req: any, @Body() dto: BuyCoinsDto) {
        return this.monService.buyCoins(req.user.id, dto);
    }

    @Post('tip')
    async sendTip(@Request() req: any, @Body() dto: SendTipDto) {
        return this.monService.sendTip(req.user.id, dto);
    }

    @Post('withdraw')
    async withdraw(@Request() req: any, @Body() dto: WithdrawFundsDto) {
        return this.monService.withdraw(req.user.id, dto);
    }

    @Get('transactions')
    async getTransactions(@Request() req: any) {
        return this.monService.getTransactionHistory(req.user.id);
    }

    @Get('payouts')
    async getPayouts(@Request() req: any) {
        return this.monService.getPayoutHistory(req.user.id);
    }

    @Get('gifts')
    async getGifts() {
        return this.monService.getGifts();
    }

    @Post('gift/send')
    async sendGift(@Request() req: any, @Body() body: { giftId: string, creatorId: string, liveStreamId?: string }) {
        return this.monService.sendGift(req.user.id, body.giftId, body.creatorId, body.liveStreamId);
    }

    @Post('tiers')
    async createTier(@Request() req: any, @Body() dto: any) {
        return this.monService.createTier(req.user.id, dto);
    }

    @Get('creator/tiers/:id')
    async getCreatorTiers(@Param('id') id: string) {
        return this.monService.getCreatorTiers(id);
    }

    @Post('subscribe')
    async subscribe(@Request() req: any, @Body() body: { tierId: string }) {
        return this.monService.subscribe(req.user.id, body.tierId);
    }

    @Get('earnings/breakdown')
    async getEarningsBreakdown(@Request() req: any) {
        return this.monService.getEarningsBreakdown(req.user.id);
    }
}
