import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { AuditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';
import { authenticator } from 'otplib';

@Injectable()
export class SecurityService {
    constructor(
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
        private auditService: AuditService,
        private usersService: UsersService,
    ) { }

    async createSession(data: {
        userId: string;
        deviceId: string;
        deviceName?: string;
        deviceType?: string;
        ipAddress?: string;
        userAgent?: string;
        refreshTokenHash: string;
        expiresInDays: number;
    }) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);

        const session = await this.sessionModel.findOneAndUpdate(
            { userId: data.userId, deviceId: data.deviceId },
            {
                ...data,
                expiresAt,
                isActive: true,
                lastActiveAt: new Date(),
            },
            { upsert: true, new: true },
        );

        await this.auditService.log({
            userId: data.userId,
            action: 'SESSION_CREATED',
            category: 'AUTH',
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            metadata: { deviceId: data.deviceId },
        });

        return session;
    }

    async invalidateSession(userId: string, deviceId: string) {
        await this.sessionModel.deleteOne({ userId, deviceId });
    }

    async invalidateAllSessions(userId: string) {
        await this.sessionModel.deleteMany({ userId });
    }

    async getActiveSessions(userId: string) {
        return this.sessionModel.find({ userId, isActive: true }).exec();
    }

    // --- MFA Logic ---

    generateMfaSecret() {
        return authenticator.generateSecret();
    }

    getMfaQrCode(email: string, secret: string) {
        return authenticator.keyuri(email, 'FEMO SPACE', secret);
    }

    async verifyMfaToken(token: string, secret: string) {
        return authenticator.verify({ token, secret });
    }

    async enableMfa(userId: string, secret: string) {
        await this.usersService.update(userId, {
            'security.mfaEnabled': true,
            'security.mfaSecret': secret,
        } as any);

        await this.auditService.log({
            userId,
            action: 'MFA_ENABLED',
            category: 'SECURITY',
            status: 'SUCCESS',
        });

        return { success: true };
    }

    // --- Password Change ---

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException('User not found');

        // Validate password strength
        if (newPassword.length < 8) {
            throw new ForbiddenException('Password must be at least 8 characters');
        }

        // Verify currentPassword and hash new one using argon2
        const argon2 = await import('argon2');

        if (user.passwordHash && currentPassword) {
            const isValid = await argon2.verify(user.passwordHash, currentPassword);
            if (!isValid) throw new UnauthorizedException('Current password is incorrect');
        }
        const newHash = await argon2.hash(newPassword);
        await this.usersService.update(userId, { passwordHash: newHash } as any);

        // Invalidate all sessions except current
        await this.invalidateAllSessions(userId);

        await this.auditService.log({
            userId,
            action: 'PASSWORD_CHANGED',
            category: 'SECURITY',
            status: 'SUCCESS',
        });

        return { success: true, message: 'Password changed. All other sessions have been logged out.' };
    }

    // --- Login Activity ---

    async getLoginActivity(userId: string) {
        return this.auditService.findByUser(userId);
    }

    // --- Blocked Users ---

    async getBlockedUsers(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) return [];
        const blockedList: string[] = (user as any).blockedUsers || [];
        return blockedList.map(id => ({ userId: id }));
    }

    async blockUser(userId: string, targetId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException('User not found');

        const current: string[] = (user as any).blockedUsers || [];
        if (!current.includes(targetId)) {
            await this.usersService.update(userId, { blockedUsers: [...current, targetId] } as any);
        }

        await this.auditService.log({
            userId,
            action: 'USER_BLOCKED',
            category: 'SECURITY',
            metadata: { targetId },
        });

        return { success: true };
    }

    async unblockUser(userId: string, targetId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException('User not found');

        const current: string[] = (user as any).blockedUsers || [];
        await this.usersService.update(userId, { blockedUsers: current.filter(id => id !== targetId) } as any);

        return { success: true };
    }

    // --- Privacy Settings ---

    async getPrivacySettings(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException('User not found');
        const privacy = (user as any).privacySettings || {
            profileVisibility: 'public',
            postVisibility: 'public',
            storyVisibility: 'followers',
            activityStatus: true,
            showLastSeen: true,
        };
        return privacy;
    }

    async updatePrivacySettings(userId: string, data: any) {
        await this.usersService.update(userId, { privacySettings: data } as any);

        await this.auditService.log({
            userId,
            action: 'PRIVACY_SETTINGS_UPDATED',
            category: 'SECURITY',
            metadata: data,
        });

        return { success: true, data };
    }

    // --- Account Recovery ---

    async updateAccountRecovery(userId: string, data: { recoveryEmail?: string; recoveryPhone?: string }) {
        await this.usersService.update(userId, { accountRecovery: data } as any);

        await this.auditService.log({
            userId,
            action: 'RECOVERY_INFO_UPDATED',
            category: 'SECURITY',
        });

        return { success: true };
    }

    // --- Threat Detection ---

    async assessRisk(userId: string, context: { ipAddress: string; deviceId: string; userAgent: string }) {
        // Mock risk assessment logic
        // In a real app, this would check against known IPs, geo-location, historical behavior
        let riskScore = 0;

        // Example rules:
        // 1. New IP + 10
        // 2. New Device + 20
        // 3. Distance from last login > X km + 50

        return {
            score: riskScore,
            action: riskScore > 70 ? 'BLOCK' : riskScore > 40 ? 'MFA_REQUIRED' : 'ALLOW',
        };
    }
}
