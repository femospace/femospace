import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    NotFoundException,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Put('update')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Req() req: any, @Body() updateData: any) {
        const userId = req.user.userId || req.user.sub || req.user.id;
        const user = await this.usersService.update(userId, updateData);
        if (!user) throw new NotFoundException('User not found');
        return { success: true, data: user };
    }

    @Put('me/profile')
    @UseGuards(JwtAuthGuard)
    async updateMyProfile(@Req() req: any, @Body() updateData: any) {
        const userId = req.user.userId || req.user.sub || req.user.id;
        const user = await this.usersService.update(userId, updateData);
        if (!user) throw new NotFoundException('User not found');
        return { success: true, data: user };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: any) {
        const userId = req.user.userId || req.user.sub || req.user.id;
        const user = await this.usersService.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return { success: true, user };
    }

    @Post('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadAvatar(@Req() req: any, @UploadedFile() file: any) {
        const userId = req.user.userId;
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

        const user = await this.usersService.update(userId, { 'profile.avatarUrl': avatarUrl } as any);
        return { success: true, data: { avatarUrl, user } };
    }

    @Post('cover')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/covers',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadCover(@Req() req: any, @UploadedFile() file: any) {
        const userId = req.user.userId;
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const coverUrl = `${baseUrl}/uploads/covers/${file.filename}`;

        const user = await this.usersService.update(userId, { 'profile.coverImage': coverUrl } as any);
        return { success: true, data: { coverUrl, user } };
    }
    @Patch('me/profile')
    @UseGuards(JwtAuthGuard)
    async patchMyProfile(@Req() req: any, @Body() updateData: any) {
        const userId = req.user.userId || req.user.sub || req.user.id;
        const user = await this.usersService.update(userId, updateData);
        if (!user) throw new NotFoundException('User not found');
        return { success: true, data: user };
    }

    @Get(':username/full')
    async getProfile(@Param('username') username: string) {
        return { success: false, message: 'Use ID for now' };
    }
}
