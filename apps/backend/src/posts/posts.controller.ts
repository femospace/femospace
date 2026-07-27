import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Req() req: any, @Body() createPostDto: CreatePostDto) {
        return this.postsService.create(req.user.sub || req.user.userId, createPostDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getPublicFeed(@Req() req: any, @Query('page') page: string, @Query('limit') limit: string) {
        return this.postsService.getFeed(req.user.sub || req.user.userId, parseInt(page) || 1, parseInt(limit) || 20);
    }

    @Get('trending')
    @UseGuards(JwtAuthGuard)
    getTrending(@Req() req: any, @Query('page') page: string, @Query('limit') limit: string) {
        return this.postsService.getFeed(req.user.sub || req.user.userId, parseInt(page) || 1, parseInt(limit) || 20);
    }

    @Get('following')
    @UseGuards(JwtAuthGuard)
    getFollowingFeed(@Req() req: any, @Query('page') page: string, @Query('limit') limit: string) {
        return this.postsService.getFeed(req.user.sub || req.user.userId, parseInt(page) || 1, parseInt(limit) || 20);
    }

    @Get('feed')
    @UseGuards(JwtAuthGuard)
    getFeed(@Req() req: any, @Query('page') page: string, @Query('limit') limit: string) {
        return this.postsService.getFeed(req.user.sub || req.user.userId, parseInt(page) || 1, parseInt(limit) || 10);
    }

    // IMPORTANT: specific routes MUST come before :id wildcard
    @Get('by/user/:userId')
    @UseGuards(JwtAuthGuard)
    getByUser(@Req() req: any, @Param('userId') userId: string) {
        return this.postsService.getPostsByUserId(userId, req.user.sub || req.user.userId);
    }

    @Get('by/:ownerType/:ownerId')
    @UseGuards(JwtAuthGuard)
    getByOwner(@Param('ownerType') ownerType: string, @Param('ownerId') ownerId: string) {
        return this.postsService.findAll({ ownerId, ownerType });
    }

    @Get('user/:userId/count')
    async getPostCount(@Param('userId') userId: string) {
        const count = await this.postsService.getPostCount(userId);
        return { success: true, data: { count } };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.postsService.findById(id, req.user.sub || req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Req() req: any, @Param('id') id: string) {
        return this.postsService.delete(req.user.sub || req.user.userId, id);
    }

    @Post(':id/react')
    @UseGuards(JwtAuthGuard)
    react(@Req() req: any, @Param('id') id: string, @Body('type') type: string) {
        return this.postsService.react(req.user.sub || req.user.userId, id, type);
    }

    @Post(':id/comment')
    @UseGuards(JwtAuthGuard)
    comment(@Req() req: any, @Param('id') id: string, @Body('content') content: string, @Body('parentId') parentId: string) {
        return this.postsService.addComment(req.user.sub || req.user.userId, id, content, parentId);
    }

    @Post(':id/save')
    @UseGuards(JwtAuthGuard)
    save(@Req() req: any, @Param('id') id: string) {
        return this.postsService.savePost(req.user.sub || req.user.userId, id);
    }

    @Post(':id/report')
    @UseGuards(JwtAuthGuard)
    report(@Req() req: any, @Param('id') id: string, @Body('reason') reason: string) {
        return this.postsService.reportPost(req.user.sub || req.user.userId, id, reason);
    }

    @Post(':id/vote')
    @UseGuards(JwtAuthGuard)
    voteOnPoll(@Req() req: any, @Param('id') id: string, @Body('optionIndex') optionIndex: number) {
        return this.postsService.voteOnPoll(req.user.sub || req.user.userId, id, optionIndex);
    }
}
