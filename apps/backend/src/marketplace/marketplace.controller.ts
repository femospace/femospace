import { Controller, Get, Query } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Get('discovery')
    async getDiscovery() {
        // Return curated lists: featured, trending, new arrivals
        const products = await this.marketplaceService.findProducts({ status: 'active' }, { createdAt: -1 }, 12);
        const featured = await this.marketplaceService.findProducts({ status: 'active', isFeatured: true }, { createdAt: -1 }, 8);

        return {
            success: true,
            data: {
                featured: featured.products,
                trending: products.products, // mockup trending logic
                newArrivals: products.products,
            }
        };
    }

    @Get('search')
    async search(@Query() query: any) {
        const filters: any = { status: 'active' };
        if (query.q) filters.$text = { $search: query.q };
        if (query.category) filters.category = query.category;
        if (query.minPrice || query.maxPrice) {
            filters.price = {};
            if (query.minPrice) filters.price.$gte = parseFloat(query.minPrice);
            if (query.maxPrice) filters.price.$lte = parseFloat(query.maxPrice);
        }

        const result = await this.marketplaceService.findProducts(
            filters,
            { createdAt: -1 },
            parseInt(query.limit) || 20,
            parseInt(query.skip) || 0
        );

        return {
            success: true,
            data: result,
        };
    }
}
