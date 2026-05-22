import { Controller, Get, Post, Body, Param, UseGuards, Req, Put } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace/products')
export class ProductsController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Get(':id')
    async getProduct(@Param('id') id: string) {
        const product = await this.marketplaceService.findProductById(id);
        return { success: true, data: product };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProduct(@Req() req: any, @Body() data: any) {
        const store = await this.marketplaceService.getStoreByOwner(req.user.userId);
        if (!store) {
            return { success: false, message: 'Seller store not found. Please create a store first.' };
        }
        const product = await this.marketplaceService.createProduct((store as any)._id as string, req.user.userId, data);
        return { success: true, data: product };
    }

    @Get('store/:storeId')
    async getStoreProducts(@Param('storeId') storeId: string) {
        const result = await this.marketplaceService.findProducts({ storeId }, { createdAt: -1 });
        return { success: true, data: result };
    }
}
