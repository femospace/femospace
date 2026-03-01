import { Controller, Get, Post, Body, UseGuards, Request, UploadedFile, UseInterceptors, Param, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubmitLevel1Dto, SubmitLivenessDto } from './dto/kyc.dto';
import { KYCDocumentType } from './schemas/kyc-document.schema';
import { KYCStatus } from './schemas/kyc-profile.schema';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
    constructor(private readonly kycService: KycService) { }

    @Get('profile')
    getProfile(@Request() req: any) {
        return this.kycService.getProfile(req.user.userId);
    }

    @Post('level1')
    submitLevel1(@Request() req: any, @Body() dto: SubmitLevel1Dto) {
        return this.kycService.submitLevel1(req.user.userId, dto);
    }

    @Post('document/:type')
    @UseInterceptors(FileInterceptor('file'))
    uploadDocument(
        @Request() req: any,
        @Param('type') type: KYCDocumentType,
        @UploadedFile() file: Express.Multer.File
    ) {
        // In a real app, save file to secure storage and get path
        const mockPath = `/secure/kyc/${req.user.userId}/${type}_${Date.now()}.png`;
        return this.kycService.uploadDocument(req.user.userId, type, mockPath);
    }

    @Post('liveness')
    submitLiveness(@Request() req: any, @Body() dto: SubmitLivenessDto) {
        return this.kycService.submitLiveness(req.user.userId, dto);
    }

    // Admin Endpoints
    @Get('admin/pending')
    getPendingReviews(@Request() req: any) {
        // Role check would be here
        return this.kycService.getPendingReviews();
    }

    @Put('admin/review/:userId')
    reviewProfile(
        @Request() req: any,
        @Param('userId') userId: string,
        @Body() body: { status: KYCStatus, reason?: string }
    ) {
        return this.kycService.adminReview(userId, req.user.userId, body.status, body.reason);
    }
}
