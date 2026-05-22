import { Controller, Get, Post, Body, Param, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Get()
    async getCart(@Req() req: any) {
        const cart = await this.marketplaceService.getCart(req.user.userId);
        return { success: true, data: cart };
    }

    @Post('add')
    async addToCart(@Req() req: any, @Body() body: any) {
        const { productId, quantity, affiliateId } = body;
        const cart = await this.marketplaceService.addToCart(req.user.userId, productId, quantity, affiliateId);
        return { success: true, data: cart };
    }

    @Put('update')
    async updateItem(@Req() req: any, @Body() body: any) {
        const { productId, quantity } = body;
        const cart = await this.marketplaceService.updateCartItem(req.user.userId, productId, quantity);
        return { success: true, data: cart };
    }

    @Delete('item/:productId')
    async removeItem(@Req() req: any, @Param('productId') productId: string) {
        const cart = await this.marketplaceService.updateCartItem(req.user.userId, productId, 0);
        return { success: true, data: cart };
    }
}
