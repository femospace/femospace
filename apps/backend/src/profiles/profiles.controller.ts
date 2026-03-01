import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get('suggestions')
    @UseGuards(JwtAuthGuard)
    getSuggestions(@Req() req: any) {
        return this.profilesService.getSuggestions(req.user.userId);
    }

    @Get('search')
    search(@Query('q') query: string) {
        return this.profilesService.search(query);
    }

    @Get(':username')
    getProfile(@Param('username') username: string) {
        return this.profilesService.findByUsername(username);
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    updateMyProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profilesService.update(req.user.userId, updateProfileDto);
    }

    @Post('verify')
    @UseGuards(JwtAuthGuard) // In a real app, this would be admin-only
    verifyProfile(@Body() body: { username: string, badgeType: string }) {
        return this.profilesService.verify(body.username, body.badgeType);
    }

    @Get('insights/me')
    @UseGuards(JwtAuthGuard)
    getMyInsights(@Req() req: any) {
        // This would lead to a more complex service call
        return {
            message: 'Insights feature coming soon',
            userId: req.user.userId,
        };
    }

    // Follow system endpoints
    @Post('follow')
    @UseGuards(JwtAuthGuard)
    followProfile(@Req() req: any, @Body('username') username: string) {
        return this.profilesService.follow(req.user.userId, username);
    }

    @Delete('unfollow')
    @UseGuards(JwtAuthGuard)
    unfollowProfile(@Req() req: any, @Body('username') username: string) {
        return this.profilesService.unfollow(req.user.userId, username);
    }

    @Post('ai/generate-bio')
    @UseGuards(JwtAuthGuard)
    generateBio(@Req() req: any, @Body('keywords') keywords: string[]) {
        return this.profilesService.generateBio(req.user.userId, keywords);
    }

    @Get('me/strength')
    @UseGuards(JwtAuthGuard)
    getProfileStrength(@Req() req: any) {
        return this.profilesService.getProfileStrength(req.user.userId);
    }

    @Post('block')
    @UseGuards(JwtAuthGuard)
    blockProfile(@Req() req: any, @Body('username') username: string) {
        return { message: `Blocked ${username}` };
    }
}
