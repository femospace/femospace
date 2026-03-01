import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioService } from './audio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('audio-tracks')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  async uploadTrack(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { type: string; title: string; artist?: string; durationSec: number },
    @CurrentUser() user: any,
  ) {
    if (!['music', 'sfx'].includes(body.type)) {
      throw new BadRequestException('Type must be "music" or "sfx"');
    }

    const track = await this.audioService.uploadTrack(
      file,
      body.type as 'music' | 'sfx',
      body.title,
      body.artist,
      body.durationSec,
      user.id,
    );

    return { success: true, data: track };
  }

  @Get('search')
  async searchTracks(
    @Query('q') q: string,
    @Query('type') type?: 'music' | 'sfx',
    @Query('limit') limit: string = '50',
  ) {
    const tracks = await this.audioService.searchTracks(q, type, parseInt(limit));
    return { success: true, data: tracks };
  }

  @Get('trending')
  async getTrendingTracks(
    @Query('type') type?: 'music' | 'sfx',
    @Query('limit') limit: string = '20',
  ) {
    const tracks = await this.audioService.getTrendingTracks(type, parseInt(limit));
    return { success: true, data: tracks };
  }

  @Get(':id')
  async getTrack(@Query('id') id: string) {
    const track = await this.audioService.getTrack(id);
    if (!track) {
      return { success: false, message: 'Track not found' };
    }
    return { success: true, data: track };
  }
}
