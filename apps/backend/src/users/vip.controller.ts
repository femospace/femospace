import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { VipService } from './vip.service';
import { BuyVipDto } from './dto/buy-vip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vip')
@UseGuards(JwtAuthGuard)
export class VipController {
    constructor(private readonly vipService: VipService) { }

    @Get('pricing')
    async getPricing() {
        const pricing = await this.vipService.getVipPricing();
        return {
            success: true,
            data: pricing,
        };
    }

    @Post('buy')
    async buyVip(@Req() req: any, @Body() buyVipDto: BuyVipDto) {
        const userId = req.user.userId;
        const purchase = await this.vipService.buyVip(userId, buyVipDto);
        return {
            success: true,
            message: 'VIP badge purchased successfully!',
            data: purchase,
        };
    }

    @Get('status')
    async getStatus(@Req() req: any) {
        const userId = req.user.userId;
        const status = await this.vipService.getVipStatus(userId);
        return {
            success: true,
            data: status,
        };
    }

    @Get('history')
    async getHistory(@Req() req: any) {
        const userId = req.user.userId;
        const history = await this.vipService.getVipPurchaseHistory(userId);
        return {
            success: true,
            data: history,
        };
    }
}
