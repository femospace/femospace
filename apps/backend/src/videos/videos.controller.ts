import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVideoDto, VideoQueryDto } from './dto/video.dto';

@ApiTags('Videos Hub')
@ApiBearerAuth()
@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) { }

    @UseGuards(JwtAuthGuard)
    @Get('reels')
    @ApiOperation({ summary: 'Get short-form Reels' })
    async getReels(@Request() req: any, @Query() query: VideoQueryDto) {
        return this.videosService.findAll(req.user.userId, { ...query, type: 'reel' });
    }

    @UseGuards(JwtAuthGuard)
    @Get('live')
    @ApiOperation({ summary: 'Get active Live Streams' })
    async getLives(@Request() req: any, @Query() query: VideoQueryDto) {
        return this.videosService.findAll(req.user.userId, { ...query, type: 'live' });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get long-form Videos' })
    async getVideos(@Request() req: any, @Query() query: VideoQueryDto) {
        return this.videosService.findAll(req.user.userId, { ...query, type: 'video' });
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new video/reel record' })
    async create(@Request() req: any, @Body() data: CreateVideoDto) {
        return this.videosService.create(req.user.userId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('live/start')
    @ApiOperation({ summary: 'Generate stream key and start live' })
    async startLive(@Request() req: any, @Body() data: any) {
        return this.videosService.startLive(req.user.userId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('live/:id/end')
    @ApiOperation({ summary: 'End a live stream' })
    async endLive(@Param('id') id: string) {
        return this.videosService.endLive(id);
    }

    @Post(':id/like')
    @ApiOperation({ summary: 'Like a video' })
    async like(@Param('id') id: string) {
        return this.videosService.like(id);
    }

    @Post(':id/view')
    @ApiOperation({ summary: 'Increment view count' })
    async view(@Param('id') id: string) {
        return this.videosService.view(id);
    }

    // --- LIVE STUDIO ---

    @UseGuards(JwtAuthGuard)
    @Get('studio/scenes')
    @ApiOperation({ summary: 'Get creator studio scenes' })
    async getScenes(@Request() req: any) {
        return this.videosService.getStudioScenes(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('studio/scenes')
    @ApiOperation({ summary: 'Save studio scenes changes' })
    async saveScenes(@Request() req: any, @Body() scenes: any[]) {
        return this.videosService.saveStudioScenes(req.user.userId, scenes);
    }

    @UseGuards(JwtAuthGuard)
    @Post('studio/session/start')
    @ApiOperation({ summary: 'Start a new studio session' })
    async startStudioSession(@Request() req: any, @Body() data: any) {
        return this.videosService.startStudioSession(req.user.userId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('studio/session/:id/end')
    @ApiOperation({ summary: 'End an active studio session' })
    async endStudioSession(@Param('id') id: string) {
        return this.videosService.endStudioSession(id);
    }
}
