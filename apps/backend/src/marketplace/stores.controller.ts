import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace/stores')
export class StoresController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Get('my-store')
    @UseGuards(JwtAuthGuard)
    async getMyStore(@Req() req: any) {
        const store = await this.marketplaceService.getStoreByOwner(req.user.userId);
        return { success: true, data: store };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createStore(@Req() req: any, @Body() data: any) {
        const store = await this.marketplaceService.createStore(req.user.userId, data);
        return { success: true, data: store };
    }

    @Get(':slug')
    async getStore(@Param('slug') slug: string) {
        const store = await this.marketplaceService.getStoreBySlug(slug);
        return { success: true, data: store };
    }
}
