import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stories')
export class StoriesController {
    constructor(private readonly storiesService: StoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Req() req: any, @Body() dto: CreateStoryDto) {
        return this.storiesService.create(req.user.userId, dto);
    }

    @Get('feed')
    @UseGuards(JwtAuthGuard)
    getFeed(@Req() req: any) {
        return this.storiesService.getFeed(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.storiesService.findById(id, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Req() req: any, @Param('id') id: string) {
        return this.storiesService.delete(req.user.userId, id);
    }

    @Post(':id/react')
    @UseGuards(JwtAuthGuard)
    react(@Req() req: any, @Param('id') id: string, @Body('emoji') emoji: string) {
        return this.storiesService.react(req.user.userId, id, emoji);
    }

    @Post(':id/view')
    @UseGuards(JwtAuthGuard)
    view(@Req() req: any, @Param('id') id: string) {
        return this.storiesService.markAsViewed(req.user.userId, id);
    }

    @Post('highlights')
    @UseGuards(JwtAuthGuard)
    createHighlight(@Req() req: any, @Body() body: any) {
        return this.storiesService.createHighlight(req.user.userId, body.title, body.coverUrl, body.storyIds);
    }

    @Get('highlights/:ownerId')
    getHighlights(@Param('ownerId') ownerId: string) {
        return this.storiesService.getHighlights(ownerId);
    }

    @Get('by/user/:userId')
    @UseGuards(JwtAuthGuard)
    getByUser(@Req() req: any, @Param('userId') userId: string) {
        return this.storiesService.getStoriesByUserId(userId, req.user.userId);
    }
}
