import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Get user notifications' })
    async getNotifications(@Request() req: any, @Query('category') category?: string) {
        const userId = req.user.sub || req.user.id;
        return this.notificationsService.findAll(userId, category);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread count' })
    async getUnreadCount(@Request() req: any) {
        const userId = req.user.sub || req.user.id;
        return { count: await this.notificationsService.getUnreadCount(userId) };
    }

    @Post(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    async markRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }

    @Post('read-all')
    @ApiOperation({ summary: 'Mark all as read' })
    async markReadAll(@Request() req: any) {
        const userId = req.user.sub || req.user.id;
        return this.notificationsService.markAllAsRead(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a notification' })
    async deleteOne(@Param('id') id: string) {
        return this.notificationsService.deleteOne(id);
    }

    @Get('settings')
    @ApiOperation({ summary: 'Get notification settings' })
    async getSettings(@Request() req: any) {
        const userId = req.user.sub || req.user.id;
        return this.notificationsService.getSettings(userId);
    }

    @Post('settings')
    @ApiOperation({ summary: 'Update notification settings' })
    async updateSettings(@Request() req: any, @Body() data: any) {
        const userId = req.user.sub || req.user.id;
        return this.notificationsService.updateSettings(userId, data);
    }
}
