import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req, Query, Param, UnauthorizedException } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('security')
export class SecurityController {
    constructor(private readonly securityService: SecurityService) { }

    @Get('sessions')
    @UseGuards(JwtAuthGuard)
    getActiveSessions(@Req() req: any) {
        return this.securityService.getActiveSessions(req.user.userId || req.user.sub || req.user.id);
    }

    @Delete('sessions/:deviceId')
    @UseGuards(JwtAuthGuard)
    invalidateSession(@Req() req: any, @Param('deviceId') deviceId: string) {
        return this.securityService.invalidateSession(req.user.userId || req.user.sub || req.user.id, deviceId);
    }

    @Delete('sessions')
    @UseGuards(JwtAuthGuard)
    invalidateAllSessions(@Req() req: any) {
        return this.securityService.invalidateAllSessions(req.user.userId || req.user.sub || req.user.id);
    }

    @Post('mfa/setup')
    @UseGuards(JwtAuthGuard)
    setupMfa(@Req() req: any) {
        const secret = this.securityService.generateMfaSecret();
        const qrCode = this.securityService.getMfaQrCode(req.user.email, secret);
        return { secret, qrCode };
    }

    @Post('mfa/verify')
    @UseGuards(JwtAuthGuard)
    async verifyMfa(@Req() req: any, @Body('token') token: string, @Body('secret') secret: string) {
        const isValid = await this.securityService.verifyMfaToken(token, secret);
        if (isValid) {
            await this.securityService.enableMfa(req.user.userId || req.user.sub || req.user.id, secret);
        }
        return { isValid };
    }

    @Get('risk-assessment')
    @UseGuards(JwtAuthGuard)
    getRiskAssessment(@Req() req: any) {
        return this.securityService.assessRisk(req.user.userId || req.user.sub || req.user.id, {
            ipAddress: req.ip,
            deviceId: req.headers['x-device-id'] || 'unknown',
            userAgent: req.headers['user-agent'],
        });
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Req() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
        return this.securityService.changePassword(
            req.user.userId || req.user.sub || req.user.id,
            body.currentPassword,
            body.newPassword
        );
    }

    @Get('login-activity')
    @UseGuards(JwtAuthGuard)
    getLoginActivity(@Req() req: any) {
        return this.securityService.getLoginActivity(req.user.userId || req.user.sub || req.user.id);
    }

    @Get('blocked-users')
    @UseGuards(JwtAuthGuard)
    getBlockedUsers(@Req() req: any) {
        return this.securityService.getBlockedUsers(req.user.userId || req.user.sub || req.user.id);
    }

    @Post('block/:targetId')
    @UseGuards(JwtAuthGuard)
    blockUser(@Req() req: any, @Param('targetId') targetId: string) {
        return this.securityService.blockUser(req.user.userId || req.user.sub || req.user.id, targetId);
    }

    @Delete('block/:targetId')
    @UseGuards(JwtAuthGuard)
    unblockUser(@Req() req: any, @Param('targetId') targetId: string) {
        return this.securityService.unblockUser(req.user.userId || req.user.sub || req.user.id, targetId);
    }

    @Get('privacy')
    @UseGuards(JwtAuthGuard)
    getPrivacySettings(@Req() req: any) {
        return this.securityService.getPrivacySettings(req.user.userId || req.user.sub || req.user.id);
    }

    @Put('privacy')
    @UseGuards(JwtAuthGuard)
    updatePrivacySettings(@Req() req: any, @Body() data: any) {
        return this.securityService.updatePrivacySettings(req.user.userId || req.user.sub || req.user.id, data);
    }

    @Put('account-recovery')
    @UseGuards(JwtAuthGuard)
    updateAccountRecovery(@Req() req: any, @Body() data: any) {
        return this.securityService.updateAccountRecovery(req.user.userId || req.user.sub || req.user.id, data);
    }
}
