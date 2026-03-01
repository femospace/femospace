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
        return this.postsService.create(req.user.userId, createPostDto);
    }

    @Get('feed')
    @UseGuards(JwtAuthGuard)
    getFeed(@Req() req: any, @Query('page') page: string, @Query('limit') limit: string) {
        return this.postsService.getFeed(req.user.userId, parseInt(page) || 1, parseInt(limit) || 10);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.postsService.findById(id, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Req() req: any, @Param('id') id: string) {
        return this.postsService.delete(req.user.userId, id);
    }

    @Post(':id/react')
    @UseGuards(JwtAuthGuard)
    react(@Req() req: any, @Param('id') id: string, @Body('type') type: string) {
        return this.postsService.react(req.user.userId, id, type);
    }

    @Post(':id/comment')
    @UseGuards(JwtAuthGuard)
    comment(@Req() req: any, @Param('id') id: string, @Body('content') content: string, @Body('parentId') parentId: string) {
        return this.postsService.addComment(req.user.userId, id, content, parentId);
    }

    @Post(':id/save')
    @UseGuards(JwtAuthGuard)
    save(@Req() req: any, @Param('id') id: string) {
        return this.postsService.savePost(req.user.userId, id);
    }

    @Post(':id/report')
    @UseGuards(JwtAuthGuard)
    report(@Req() req: any, @Param('id') id: string, @Body('reason') reason: string) {
        return this.postsService.reportPost(req.user.userId, id, reason);
    }

    @Get('by/:ownerType/:ownerId')
    @UseGuards(JwtAuthGuard)
    getByOwner(@Param('ownerType') ownerType: string, @Param('ownerId') ownerId: string) {
        return this.postsService.findAll({ ownerId, ownerType });
    }

    @Get('by/user/:userId')
    @UseGuards(JwtAuthGuard)
    getByUser(@Req() req: any, @Param('userId') userId: string) {
        return this.postsService.getPostsByUserId(userId, req.user.userId);
    }

    @Post(':id/vote')
    @UseGuards(JwtAuthGuard)
    voteOnPoll(@Req() req: any, @Param('id') id: string, @Body('optionIndex') optionIndex: number) {
        return this.postsService.voteOnPoll(req.user.userId, id, optionIndex);
    }

    @Get('user/:userId/count')
    async getPostCount(@Param('userId') userId: string) {
        const count = await this.postsService.getPostCount(userId);
        return { success: true, data: { count } };
    }
}
