import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LegalService } from '../legal/legal.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private legalService: LegalService,
    ) { }

    async create(createUserDto: CreateUserDto, passwordHash: string): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const createdUser = new this.userModel({
            email: createUserDto.email,
            passwordHash,
            profile: {
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                birthday: new Date(createUserDto.birthday),
                gender: createUserDto.gender,
                country: createUserDto.country,
            },
            security: {
                loginAttempts: 0,
            },
            termsAccepted: createUserDto.termsAccepted,
            privacyAccepted: createUserDto.privacyAccepted,
            username: this.generateHandle(createUserDto),
            roles: ['user'],
            isUnder18: this.calculateIsUnder18(new Date(createUserDto.birthday)),
        });

        const user = await createdUser.save();

        // Record legal acceptance with detail
        await this.legalService.acceptLegal({
            userId: user._id.toString(),
            termsVersion: '1.0.0', // In production, get latest from DB
            privacyVersion: '1.0.0',
            language: 'en', // Should be passed in DTO
            ip: 'unknown', // Should be passed from controller
            device: 'unknown',
        });

        return user;
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    /**
     * Find user by identifier (femoId or femoMail)
     * @param filter - MongoDB filter: { femoId: number } or { femoMail: string }
     */
    async findByIdentifier(
        filter: { femoId: number } | { femoMail: string },
    ): Promise<UserDocument | null> {
        return this.userModel.findOne(filter).exec();
    }

    async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    private generateHandle(dto: CreateUserDto): string {
        const base = (dto.firstName + dto.lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `@${base}${random}`;
    }

    private calculateIsUnder18(birthday: Date): boolean {
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
    }
}
