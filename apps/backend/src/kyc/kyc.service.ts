import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { KYCProfile, KYCProfileDocument, KYCStatus, KYCLevel } from './schemas/kyc-profile.schema';
import { KYCDocument, KYCDocumentDocument, KYCDocumentType, KYCDocumentStatus } from './schemas/kyc-document.schema';
import { SubmitLevel1Dto, SubmitLivenessDto } from './dto/kyc.dto';

@Injectable()
export class KycService {
    constructor(
        @InjectModel(KYCProfile.name) private profileModel: Model<KYCProfileDocument>,
        @InjectModel(KYCDocument.name) private documentModel: Model<KYCDocumentDocument>,
    ) { }

    async getProfile(userId: string): Promise<KYCProfileDocument> {
        let profile = await this.profileModel.findOne({ userId });
        if (!profile) {
            profile = await this.profileModel.create({
                userId,
                status: KYCStatus.NOT_STARTED,
                level: KYCLevel.LEVEL_1,
                riskScore: 0,
            });
        }
        return profile;
    }

    async submitLevel1(userId: string, dto: SubmitLevel1Dto) {
        const profile = await this.getProfile(userId);

        profile.extractedData = {
            ...profile.extractedData,
            fullName: dto.fullName,
            dob: new Date(dto.dob),
            country: dto.country,
        };

        // Basic AML check mock
        profile.amlCheck = {
            lastChecked: new Date(),
            sanctionsList: false,
            pepMatch: false,
            watchlistMatch: false,
        };

        await profile.save();
        return profile;
    }

    async uploadDocument(userId: string, type: KYCDocumentType, filePath: string) {
        const profile = await this.getProfile(userId);

        const doc = await this.documentModel.create({
            userId,
            type,
            filePathEncrypted: this.encryptPath(filePath), // Mock encryption
            status: KYCDocumentStatus.PENDING,
            uploadedAt: new Date(),
        });

        if (profile.status === KYCStatus.NOT_STARTED || profile.status === KYCStatus.REJECTED) {
            profile.status = KYCStatus.PENDING;
            await profile.save();
        }

        return doc;
    }

    async submitLiveness(userId: string, dto: SubmitLivenessDto) {
        const profile = await this.getProfile(userId);
        profile.livenessVerification = dto;

        if (dto.faceMatchScore && dto.faceMatchScore > 0.8) {
            profile.status = KYCStatus.IN_REVIEW;
        } else {
            profile.riskScore += 20;
        }

        await profile.save();
        return profile;
    }

    async adminReview(userId: string, adminId: string, status: KYCStatus, reason?: string) {
        const profile = await this.profileModel.findOne({ userId });
        if (!profile) throw new NotFoundException('KYC Profile not found');

        profile.status = status;
        profile.reviewedBy = adminId;
        if (status === KYCStatus.APPROVED) {
            profile.approvedAt = new Date();
            profile.level = KYCLevel.LEVEL_2; // Move to next level if approved
        }
        if (reason) {
            profile.rejectionReason = reason;
        }

        await profile.save();
        return profile;
    }

    private encryptPath(path: string): string {
        // In production, use AES-256
        return `ENC:${Buffer.from(path).toString('base64')}`;
    }

    async checkMonetizationEligibility(userId: string): Promise<boolean> {
        const profile = await this.profileModel.findOne({ userId });
        return profile?.status === KYCStatus.APPROVED;
    }

    async getPendingReviews() {
        return this.profileModel.find({ status: KYCStatus.PENDING }).populate('userId', 'email username');
    }
}
