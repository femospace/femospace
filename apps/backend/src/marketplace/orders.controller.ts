import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Post()
    async createOrder(@Req() req: any, @Body() data: any) {
        const order = await this.marketplaceService.createOrder(req.user.userId, data);
        return { success: true, data: order };
    }

    @Get('history')
    async getMyOrders(@Req() req: any) {
        const orders = await this.marketplaceService.getBuyerOrders(req.user.userId);
        return { success: true, data: orders };
    }

    @Get('sales')
    async getSales(@Req() req: any) {
        const orders = await this.marketplaceService.getSellerOrders(req.user.userId);
        return { success: true, data: orders };
    }
}
