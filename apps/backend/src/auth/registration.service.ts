import {
    Injectable,
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateStep1Dto } from './dto/create-step1.dto';
import { CreateStep2Dto } from './dto/create-step2.dto';
import { CreateStep3Dto } from './dto/create-step3.dto';
import { PasswordValidator } from '../common/utils/password-validator';
import { FemoIdGenerator } from '../common/utils/femo-id-generator';
import { FemoMailUtils } from '../common/utils/femo-mail.utils';
import * as argon2 from 'argon2';

interface RegistrationSession {
    step1Data: CreateStep1Dto;
    step2Data?: CreateStep2Dto;
    step3Data?: CreateStep3Dto;
    sessionToken: string;
    createdAt: Date;
    expiresAt: Date;
}

@Injectable()
export class RegistrationService {
    private readonly logger = new Logger(RegistrationService.name);
    private registrationSessions: Map<string, RegistrationSession> = new Map();
    private SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    /**
     * STEP 1: Process personal information
     */
    async processStep1(dto: CreateStep1Dto): Promise<{ sessionToken: string }> {
        try {
            // Validate birthday is a valid date and person is 18+
            const birthDate = new Date(dto.birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 13) {
                throw new BadRequestException('You must be at least 13 years old to register');
            }

            // Generate session token
            const sessionToken = this.generateSessionToken();

            // Store registration session
            const session: RegistrationSession = {
                step1Data: dto,
                sessionToken,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + this.SESSION_EXPIRY_MS),
            };

            this.registrationSessions.set(sessionToken, session);
            this.logger.log(`Step 1 completed for session: ${sessionToken}`);

            return { sessionToken };
        } catch (error) {
            this.logger.error(`Step 1 processing failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * STEP 2: Process account information (email, password, country, terms)
     */
    async processStep2(sessionToken: string, dto: CreateStep2Dto): Promise<{ sessionToken: string }> {
        try {
            // Validate session
            const session = this.validateSession(sessionToken);

            // Validate email format
            if (!this.isValidEmail(dto.email)) {
                throw new BadRequestException('Invalid email format');
            }

            // Check if email already exists
            const existingUser = await this.userModel.findOne({ email: dto.email });
            if (existingUser) {
                throw new ConflictException('Email already registered');
            }

            // Validate passwords match
            if (!PasswordValidator.passwordsMatch(dto.password, dto.confirmPassword)) {
                throw new BadRequestException('Passwords do not match');
            }

            // Validate password strength
            if (!PasswordValidator.isValid(dto.password)) {
                throw new BadRequestException(PasswordValidator.getValidationMessage());
            }

            // Validate terms and privacy are accepted
            if (!dto.termsAccepted || !dto.privacyAccepted) {
                throw new BadRequestException('You must accept Terms & Conditions and Privacy Policy');
            }

            // Update session with step 2 data
            session.step2Data = dto;
            this.registrationSessions.set(sessionToken, session);
            this.logger.log(`Step 2 completed for session: ${sessionToken}`);

            return { sessionToken };
        } catch (error) {
            this.logger.error(`Step 2 processing failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * STEP 3: Finalize registration (Femo ID, Femo Mail, Phone)
     */
    async processStep3(sessionToken: string, dto: CreateStep3Dto): Promise<any> {
        try {
            // Validate session
            const session = this.validateSession(sessionToken);
            const step1 = session.step1Data;
            const step2 = session.step2Data;

            if (!step2) {
                throw new BadRequestException('Step 2 data is missing. Please complete Step 2 first.');
            }

            // Validate Femo Mail format
            const femoMail = FemoMailUtils.formatEmail(dto.femoMailName);
            if (!FemoMailUtils.isValidFormat(femoMail)) {
                throw new BadRequestException('Invalid Femo Mail format');
            }

            // Check if Femo Mail already exists
            const existingFemoMail = await this.userModel.findOne({ femoMail });
            if (existingFemoMail) {
                throw new ConflictException('This Femo Mail is already taken');
            }

            // Generate Femo ID (increment by user count)
            const userCount = await this.userModel.countDocuments();
            const femoId = FemoIdGenerator.generate(userCount);

            // Hash password
            const passwordHash = await argon2.hash(step2.password);

            // Generate username from email (for backward compatibility)
            const username = step2.email.split('@')[0];

            // Create user document
            const user = new this.userModel({
                femoId,
                email: step2.email,
                passwordHash,
                username,
                femoMail,
                profile: {
                    firstName: step1.firstName,
                    lastName: step1.lastName,
                    birthday: new Date(step1.birthday),
                    gender: step1.gender,
                    country: step2.country,
                },
                phone: dto.phoneCountryCode
                    ? {
                        countryCode: dto.phoneCountryCode,
                        number: dto.phoneNumber,
                        verified: false,
                    }
                    : null,
                termsAccepted: step2.termsAccepted,
                privacyAccepted: step2.privacyAccepted,
                isEmailVerified: false,
                isPhoneVerified: false,
            });

            await user.save();
            this.logger.log(`User registered successfully: ${user._id} (Femo ID: ${femoId})`);

            // Clean up session
            this.registrationSessions.delete(sessionToken);

            return {
                success: true,
                userId: user._id,
                femoId: user.femoId,
                femoMail: user.femoMail,
                message: 'Registration completed successfully',
            };
        } catch (error) {
            this.logger.error(`Step 3 processing failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get Femo Mail suggestions based on username
     */
    async getFemoMailSuggestions(username: string): Promise<string[]> {
        try {
            // Get all existing Femo Mails from database
            const existingMails = (await this.userModel.find({}, 'femoMail')).map((u) => u.femoMail);

            // Generate suggestions avoiding existing ones
            const suggestions = FemoMailUtils.generateSuggestions(username, existingMails);

            return suggestions;
        } catch (error) {
            this.logger.error(`Failed to generate suggestions: ${error.message}`);
            throw new InternalServerErrorException('Could not generate suggestions');
        }
    }

    /**
     * Validate Femo Mail availability
     */
    async validateFemoMailAvailability(femoMailName: string): Promise<{ available: boolean; message: string }> {
        try {
            const femoMail = FemoMailUtils.formatEmail(femoMailName);

            if (!FemoMailUtils.isValidFormat(femoMail)) {
                return {
                    available: false,
                    message: 'Invalid Femo Mail format',
                };
            }

            const exists = await this.userModel.findOne({ femoMail });
            if (exists) {
                return {
                    available: false,
                    message: 'This Femo Mail is already taken',
                };
            }

            return {
                available: true,
                message: 'Femo Mail is available',
            };
        } catch (error) {
            this.logger.error(`Validation failed: ${error.message}`);
            throw new InternalServerErrorException('Could not validate availability');
        }
    }

    /**
     * Validate email availability (Step 2)
     */
    async validateEmailAvailability(email: string): Promise<{ available: boolean; message: string }> {
        try {
            if (!this.isValidEmail(email)) {
                return {
                    available: false,
                    message: 'Invalid email format',
                };
            }

            const exists = await this.userModel.findOne({ email });
            if (exists) {
                return {
                    available: false,
                    message: 'Email already registered',
                };
            }

            return {
                available: true,
                message: 'Email is available',
            };
        } catch (error) {
            this.logger.error(`Email validation failed: ${error.message}`);
            throw new InternalServerErrorException('Could not validate email');
        }
    }

    /**
     * Check password strength
     */
    getPasswordStrength(password: string): any {
        return PasswordValidator.calculateStrength(password);
    }

    // ======================== PRIVATE HELPERS ========================

    private generateSessionToken(): string {
        return `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private validateSession(sessionToken: string): RegistrationSession {
        const session = this.registrationSessions.get(sessionToken);

        if (!session) {
            throw new BadRequestException('Invalid or expired session token');
        }

        if (new Date() > session.expiresAt) {
            this.registrationSessions.delete(sessionToken);
            throw new BadRequestException('Session expired. Please restart registration');
        }

        return session;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
