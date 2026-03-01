import { Controller, Post, Get, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { ApplyCreatorDto } from './dto/apply-creator.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('creator')
export class CreatorController {
    constructor(private readonly creatorService: CreatorService) { }

    @Post('apply')
    @UseGuards(JwtAuthGuard)
    async apply(@Req() req: any, @Body() applyCreatorDto: ApplyCreatorDto) {
        const userId = req.user.userId;
        const application = await this.creatorService.applyForCreatorCertification(userId, applyCreatorDto);
        return {
            success: true,
            message: 'Application submitted successfully! Our team will review it soon.',
            data: application,
        };
    }

    @Get('my-application')
    @UseGuards(JwtAuthGuard)
    async getMyApplication(@Req() req: any) {
        const userId = req.user.userId;
        const application = await this.creatorService.getMyApplication(userId);
        return {
            success: true,
            data: application,
        };
    }

    // Admin-only routes
    @Get('admin/applications')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getAllApplications(@Query('status') status?: string) {
        const applications = await this.creatorService.getAllApplications(status);
        return {
            success: true,
            data: applications,
        };
    }

    @Post('admin/approve/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async approveApplication(@Param('id') id: string, @Req() req: any) {
        const adminId = req.user.userId;
        const application = await this.creatorService.approveApplication(id, adminId);
        return {
            success: true,
            message: 'Application approved successfully!',
            data: application,
        };
    }

    @Post('admin/reject/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async rejectApplication(
        @Param('id') id: string,
        @Req() req: any,
        @Body('reason') reason?: string
    ) {
        const adminId = req.user.userId;
        const application = await this.creatorService.rejectApplication(id, adminId, reason);
        return {
            success: true,
            message: 'Application rejected.',
            data: application,
        };
    }
}
