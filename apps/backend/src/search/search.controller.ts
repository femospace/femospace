import { Controller, Get, Query, UseGuards, Request, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Search Engine')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Global Search' })
    async search(@Request() req: any, @Query('q') query: string, @Query('type') type?: string) {
        if (!query) return { users: [], videos: [], reels: [], posts: [] };
        return this.searchService.globalSearch(req.user.userId, query, type);
    }

    @Get('suggestions')
    @ApiOperation({ summary: 'AI Search Suggestions' })
    async getSuggestions(@Query('q') query: string) {
        return this.searchService.getSuggestions(query);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Trending Searches' })
    async getTrending() {
        return this.searchService.getTrending();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('history')
    @ApiOperation({ summary: 'Save search history' })
    async saveHistory(@Request() req: any, @Query('q') query: string) {
        const userId = req.user.sub || req.user.id;
        return this.searchService.saveHistory(userId, query);
    }
}
