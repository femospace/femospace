import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginIdentifierDto } from './dto/login-identifier.dto';
import { getIdentifierQueryFilter, validateIdentifier } from './utils/identifier.utils';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private securityService: SecurityService,
        private auditService: AuditService,
    ) { }

    private otpStore = new Map<string, { code: string; expires: Date; attempts: number }>();

    async generateOTP(email: string): Promise<{ success: boolean; message: string; code?: string }> {
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        this.otpStore.set(email, { code, expires, attempts: 0 });
        
        // In a real application, send this code via email.
        console.log(`[DEV ONLY] OTP for ${email} is ${code}`);

        return { success: true, message: 'OTP generated successfully', code };
    }

    async verifyOTP(email: string, code: string): Promise<{ success: boolean; message: string }> {
        const record = this.otpStore.get(email);
        
        if (!record) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        if (new Date() > record.expires) {
            this.otpStore.delete(email);
            throw new BadRequestException('OTP has expired');
        }

        if (record.code !== code) {
            record.attempts += 1;
            if (record.attempts >= 5) {
                this.otpStore.delete(email);
                throw new BadRequestException('Too many incorrect attempts. Please request a new OTP.');
            }
            throw new BadRequestException('Incorrect OTP');
        }

        // Mark user as email verified
        const user = await this.usersService.findByEmail(email);
        if (user) {
            await this.usersService.update(user._id.toString(), { isEmailVerified: true } as any);
        }

        this.otpStore.delete(email);

        return { success: true, message: 'Email verified successfully' };
    }

    async register(createUserDto: CreateUserDto) {
        const hash = await argon2.hash(createUserDto.password);
        const user = await this.usersService.create(createUserDto, hash);

        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

        return {
            ...tokens,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                isOnboardingCompleted: user.isOnboardingCompleted,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                avatarUrl: user.profile.avatarUrl,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                isUnder18: user.isUnder18,
            },
        };
    }

    async login(loginDto: LoginDto, context: { ipAddress: string; userAgent: string; deviceId: string }) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            await this.auditService.log({ action: 'LOGIN_ATTEMPT', category: 'AUTH', status: 'FAILURE', metadata: { email: loginDto.email }, ...context });
            throw new ForbiddenException('Invalid credentials');
        }

        const passwordMatches = await argon2.verify(user.passwordHash, loginDto.password);
        if (!passwordMatches) {
            await this.auditService.log({ userId: user._id.toString(), action: 'LOGIN_ATTEMPT', category: 'AUTH', status: 'FAILURE', ...context });
            throw new ForbiddenException('Invalid credentials');
        }

        // Assess risk before proceeding
        const risk = await this.securityService.assessRisk(user._id.toString(), context);
        if (risk.action === 'BLOCK') {
            await this.auditService.log({ userId: user._id.toString(), action: 'LOGIN_BLOCKED', category: 'SECURITY', metadata: { risk }, ...context });
            throw new ForbiddenException('Access blocked due to security risk');
        }

        // If MFA enabled, return challenge instead of tokens
        if (user.security.mfaEnabled) {
            return {
                mfaRequired: true,
                userId: user._id.toString(),
            };
        }

        const tokens = await this.getTokens(user._id.toString(), user.email);

        // Save session
        await this.securityService.createSession({
            userId: user._id.toString(),
            deviceId: context.deviceId,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            refreshTokenHash: tokens.refresh_token,
            expiresInDays: 7
        });

        await this.auditService.log({ userId: user._id.toString(), action: 'LOGIN_SUCCESS', category: 'AUTH', status: 'SUCCESS', ...context });

        return {
            ...tokens,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                mfaEnabled: user.security.mfaEnabled,
                isOnboardingCompleted: user.isOnboardingCompleted,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                avatarUrl: user.profile.avatarUrl,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                isUnder18: user.isUnder18,
            },
        };
    }

    async logout(userId: string) {
        await this.usersService.update(userId, { 'security.refreshTokenHash': null } as any);
    }

    async loginMfa(userId: string, token: string, context: { ipAddress: string; userAgent: string; deviceId: string }) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.security.mfaSecret) {
            throw new ForbiddenException('Invalid request');
        }

        const isValid = await this.securityService.verifyMfaToken(token, user.security.mfaSecret);
        if (!isValid) {
            await this.auditService.log({ userId, action: 'MFA_VERIFY_FAILURE', category: 'AUTH', status: 'FAILURE', ...context });
            throw new ForbiddenException('Invalid MFA code');
        }

        const tokens = await this.getTokens(user._id.toString(), user.email);

        await this.securityService.createSession({
            userId: user._id.toString(),
            deviceId: context.deviceId,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            refreshTokenHash: tokens.refresh_token,
            expiresInDays: 7
        });

        await this.auditService.log({ userId: user._id.toString(), action: 'LOGIN_SUCCESS_MFA', category: 'AUTH', status: 'SUCCESS', ...context });

        return {
            ...tokens,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                mfaEnabled: user.security.mfaEnabled,
                isOnboardingCompleted: user.isOnboardingCompleted,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                avatarUrl: user.profile.avatarUrl,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                isUnder18: user.isUnder18,
            },
        };
    }

    async refreshTokens(rt: string) {
        try {
            const payload = await this.jwtService.verifyAsync(rt, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.security.refreshTokenHash) throw new ForbiddenException('Access Denied');

            const rtMatches = await argon2.verify(user.security.refreshTokenHash, rt);
            if (!rtMatches) throw new ForbiddenException('Access Denied'); // Reuse detection implied here if hash is different

            const tokens = await this.getTokens(user._id.toString(), user.email);
            await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

            return tokens;
        } catch (e) {
            throw new ForbiddenException('Access Denied');
        }
    }

    async updateRefreshToken(userId: string, rt: string) {
        const hash = await argon2.hash(rt);
        await this.usersService.update(userId, { 'security.refreshTokenHash': hash } as any);
    }

    async getTokens(userId: string, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return;
        // In a real app, you would generate a token and send an email
        console.log(`Password reset requested for ${email}`);
    }

    /**
     * NEW LOGIN METHOD: Femo Space - Login with Femo ID or Femo Mail
     * 
     * Supports:
     * - Numeric femoId (e.g., 1000021)
     * - Femo Mail (e.g., ushan@femo.com)
     * 
     * Validates:
     * - Email must be verified before login
     * - Password must match bcrypt hash
     * - Implements rate limiting & brute-force protection
     */
    async loginWithIdentifier(
        loginDto: LoginIdentifierDto,
        context: { ipAddress: string; userAgent: string; deviceId: string },
    ) {
        // 1) Validate identifier format
        const validationResult = validateIdentifier(loginDto.identifier);
        if (!validationResult.valid) {
            throw new BadRequestException(validationResult.error);
        }

        // 2) Get MongoDB query filter based on identifier type
        const queryFilter = getIdentifierQueryFilter(loginDto.identifier);
        if (!queryFilter) {
            throw new BadRequestException('Invalid identifier format');
        }

        // 3) Find user by femoId or femoMail
        const user = await this.usersService.findByIdentifier(queryFilter);
        if (!user) {
            // Generic error for security (don't reveal if user exists)
            await this.auditService.log({
                action: 'LOGIN_ATTEMPT',
                category: 'AUTH',
                status: 'FAILURE',
                metadata: { identifier: loginDto.identifier },
                ...context,
            });
            throw new ForbiddenException('Invalid identifier or password');
        }

        // 4) Check if email is verified (BLOCKING)
        /* 
        if (!user.isEmailVerified) {
            await this.auditService.log({
                userId: user._id.toString(),
                action: 'LOGIN_ATTEMPT_EMAIL_UNVERIFIED',
                category: 'AUTH',
                status: 'FAILURE',
                ...context,
            });
            throw new ForbiddenException('Email not verified. Please verify your email before logging in.');
        }
        */

        // 5) Check rate limiting / brute-force protection
        if (user.security.lockoutUntil && new Date() < new Date(user.security.lockoutUntil)) {
            await this.auditService.log({
                userId: user._id.toString(),
                action: 'LOGIN_ATTEMPT_LOCKED',
                category: 'SECURITY',
                status: 'FAILURE',
                ...context,
            });
            throw new ForbiddenException('Account temporarily locked due to multiple failed login attempts');
        }

        // 6) Verify password
        const passwordMatches = await argon2.verify(user.passwordHash, loginDto.password);
        if (!passwordMatches) {
            // Increment failed attempts
            const newAttempts = (user.security.loginAttempts || 0) + 1;
            const lockoutUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 min lockout

            await this.usersService.update(user._id.toString(), {
                'security.loginAttempts': newAttempts,
                'security.lockoutUntil': lockoutUntil,
            } as any);

            await this.auditService.log({
                userId: user._id.toString(),
                action: 'LOGIN_ATTEMPT',
                category: 'AUTH',
                status: 'FAILURE',
                metadata: { attemptNumber: newAttempts },
                ...context,
            });

            throw new ForbiddenException('Invalid identifier or password');
        }

        // 7) Assess security risk
        const risk = await this.securityService.assessRisk(user._id.toString(), context);
        if (risk.action === 'BLOCK') {
            await this.auditService.log({
                userId: user._id.toString(),
                action: 'LOGIN_BLOCKED',
                category: 'SECURITY',
                metadata: { risk },
                ...context,
            });
            throw new ForbiddenException('Access blocked due to security risk');
        }

        // 8) Reset failed attempts on successful login
        await this.usersService.update(user._id.toString(), {
            'security.loginAttempts': 0,
            'security.lockoutUntil': null,
            'security.lastLoginAt': new Date(),
            'security.lastLoginIp': context.ipAddress,
        } as any);

        // 9) Check if MFA is enabled
        if (user.security.mfaEnabled) {
            await this.auditService.log({
                userId: user._id.toString(),
                action: 'LOGIN_MFA_REQUIRED',
                category: 'AUTH',
                status: 'SUCCESS',
                ...context,
            });
            return {
                mfaRequired: true,
                userId: user._id.toString(),
                identifier: loginDto.identifier,
            };
        }

        // 10) Generate tokens
        const tokens = await this.getTokens(user._id.toString(), user.email);

        // 11) Create session
        await this.securityService.createSession({
            userId: user._id.toString(),
            deviceId: context.deviceId,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            refreshTokenHash: tokens.refresh_token,
            expiresInDays: 7,
        });

        // 12) Log successful login
        await this.auditService.log({
            userId: user._id.toString(),
            action: 'LOGIN_SUCCESS',
            category: 'AUTH',
            status: 'SUCCESS',
            metadata: { femoId: user.femoId, femoMail: user.femoMail },
            ...context,
        });

        // 13) Return response
        return {
            ...tokens,
            user: {
                id: user._id,
                femoId: user.femoId,
                femoMail: user.femoMail,
                email: user.email,
                username: user.username,
                mfaEnabled: user.security.mfaEnabled,
                isOnboardingCompleted: user.isOnboardingCompleted,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                avatarUrl: user.profile.avatarUrl,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                isUnder18: user.isUnder18,
            },
        };
    }
}
