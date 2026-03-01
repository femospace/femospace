import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreatorApplication, CreatorApplicationDocument } from './schemas/creator-application.schema';
import { ApplyCreatorDto } from './dto/apply-creator.dto';

@Injectable()
export class CreatorService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(CreatorApplication.name) private creatorApplicationModel: Model<CreatorApplicationDocument>,
    ) { }

    async applyForCreatorCertification(userId: string, applyCreatorDto: ApplyCreatorDto): Promise<CreatorApplicationDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user is already certified
        if (user.isCreatorCertified) {
            throw new BadRequestException('You are already a certified creator');
        }

        // Check if there's already a pending application
        const existingApplication = await this.creatorApplicationModel.findOne({
            userId: new Types.ObjectId(userId),
            status: 'pending',
        });

        if (existingApplication) {
            throw new BadRequestException('You already have a pending application');
        }

        // Create new application
        const application = new this.creatorApplicationModel({
            userId: new Types.ObjectId(userId),
            fullName: applyCreatorDto.fullName,
            reason: applyCreatorDto.reason,
            portfolioLinks: applyCreatorDto.portfolioLinks,
            femoEmailOrId: applyCreatorDto.femoEmailOrId,
            mobileNumber: applyCreatorDto.mobileNumber,
            creatorAccountName: applyCreatorDto.creatorAccountName,
            accountType: applyCreatorDto.accountType,
            creationDate: new Date(applyCreatorDto.creationDate),
            currentStatus: applyCreatorDto.currentStatus,
            status: 'pending',
        });

        return application.save();
    }

    async getMyApplication(userId: string): Promise<CreatorApplicationDocument | null> {
        return this.creatorApplicationModel
            .findOne({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }

    async getAllApplications(status?: string): Promise<CreatorApplicationDocument[]> {
        const filter: any = {};
        if (status) {
            filter.status = status;
        }

        return this.creatorApplicationModel
            .find(filter)
            .populate('userId', 'username email profile femoId')
            .sort({ createdAt: -1 })
            .exec();
    }

    async approveApplication(applicationId: string, adminId: string): Promise<CreatorApplicationDocument> {
        const application = await this.creatorApplicationModel.findById(applicationId);
        if (!application) {
            throw new NotFoundException('Application not found');
        }

        if (application.status !== 'pending') {
            throw new BadRequestException('Application is not pending');
        }

        // Update application
        application.status = 'approved';
        application.reviewedBy = new Types.ObjectId(adminId);
        application.reviewedAt = new Date();
        await application.save();

        // Update user
        const user = await this.userModel.findById(application.userId);
        if (user) {
            user.isCreatorCertified = true;
            await user.save();
        }

        return application;
    }

    async rejectApplication(applicationId: string, adminId: string, reason?: string): Promise<CreatorApplicationDocument> {
        const application = await this.creatorApplicationModel.findById(applicationId);
        if (!application) {
            throw new NotFoundException('Application not found');
        }

        if (application.status !== 'pending') {
            throw new BadRequestException('Application is not pending');
        }

        // Update application
        application.status = 'rejected';
        application.reviewedBy = new Types.ObjectId(adminId);
        application.reviewedAt = new Date();
        if (reason) {
            application.rejectionReason = reason;
        }
        await application.save();

        return application;
    }
}
