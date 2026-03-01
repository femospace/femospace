import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  async follow(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (!user?.id) {
      throw new BadRequestException('User not authenticated');
    }

    await this.followsService.follow(user.id, userId);
    return { success: true, message: 'Followed successfully' };
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (!user?.id) {
      throw new BadRequestException('User not authenticated');
    }

    await this.followsService.unfollow(user.id, userId);
    return { success: true, message: 'Unfollowed successfully' };
  }

  @Get(':userId/is-following')
  @UseGuards(JwtAuthGuard)
  async isFollowing(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (!user?.id) {
      throw new BadRequestException('User not authenticated');
    }

    const isFollowing = await this.followsService.isFollowing(user.id, userId);
    return { success: true, data: { isFollowing } };
  }

  @Get(':userId/follow-stats')
  async getFollowStats(@Param('userId') userId: string) {
    const stats = await this.followsService.getFollowStats(userId);
    return { success: true, data: stats };
  }

  @Get(':userId/followers')
  async getFollowers(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const followers = await this.followsService.getFollowers(userId, 50, 0);
    return { success: true, data: followers };
  }

  @Get(':userId/following')
  async getFollowing(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const following = await this.followsService.getFollowing(userId, 50, 0);
    return { success: true, data: following };
  }
}
