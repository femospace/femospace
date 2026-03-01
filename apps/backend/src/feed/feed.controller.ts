import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Feed & Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class FeedController {
    constructor(
        private readonly feedService: FeedService,
        private readonly postsService: PostsService
    ) { }

    @Get('feed')
    @ApiOperation({ summary: 'Get personalized user feed' })
    @ApiResponse({ status: 200, description: 'Return paginated feed items.' })
    @ApiQuery({ name: 'cursor', required: false, type: String })
    async getFeed(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        const userId = req.user.userId || req.user.sub || req.user.id;
        return this.postsService.getFeed(userId, parseInt(page || '1') || 1, parseInt(limit || '10') || 10);
    }

    /*
    @Post('posts')
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
    async createPost(@Request() req: any, @Body() createPostDto: CreatePostDto) {
        const userId = req.user.sub || req.user.id;
        return this.feedService.create(userId, createPostDto);
    }
    */

    @Get('posts/:id')
    @ApiOperation({ summary: 'Get a single post by ID' })
    async getPost(@Param('id') id: string) {
        return this.feedService.findOne(id);
    }

    @Post('posts/:id/like')
    @ApiOperation({ summary: 'Like or unlike a post' })
    async likePost(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.sub || req.user.id;
        return this.feedService.likePost(userId, id);
    }
}
