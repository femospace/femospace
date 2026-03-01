import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class Profile {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop()
    avatarUrl: string;

    @Prop({ required: true })
    birthday: Date;

    @Prop({ required: true, enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'] })
    gender: string;

    @Prop({ required: true }) // ISO-3166 country code (e.g., 'US', 'IN', 'GB')
    country: string;
}

@Schema({ _id: false })
export class Preferences {
    @Prop({ default: 'en' }) // ISO-639 language code (e.g., 'en', 'es', 'zh-CN')
    languageCode: string;

    @Prop({ default: 'light', enum: ['light', 'dark', 'auto'] })
    theme: string;

    @Prop({ default: true })
    emailNotifications: boolean;

    @Prop({ default: true })
    pushNotifications: boolean;
}

@Schema({ _id: false })
export class Security {
    @Prop()
    refreshTokenHash: string;

    @Prop()
    lastLoginAt: Date;

    @Prop()
    lastLoginIp: string;

    @Prop()
    passwordChangedAt: Date;

    @Prop({ default: 0 })
    loginAttempts: number;

    @Prop()
    lockoutUntil: Date;

    @Prop({ default: false })
    mfaEnabled: boolean;

    @Prop()
    mfaSecret: string; // For TOTP

    @Prop({ type: [String] })
    backupCodes: string[];

    @Prop({ default: 0 })
    trustScore: number; // AI-assigned risk/trust score (0-100)

    @Prop({ default: false })
    isSuspicious: boolean;

    @Prop({ type: [String], default: [] })
    knownIPs: string[];

    @Prop({ type: [String], default: [] })
    knownDevices: string[];
}

@Schema({ _id: false })
export class PhoneInfo {
    @Prop()
    countryCode: string;

    @Prop()
    number: string;

    @Prop({ default: false })
    verified: boolean;
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    femoId: number; // Auto-generated starting from 1000000

    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string; // Argon2 hash

    @Prop({ required: true })
    username: string; // Auto-generated or user chosen? Let's assume unique handle.

    @Prop({ required: true, unique: true, index: true })
    femoMail: string; // username@femo.com

    @Prop({ type: Profile, required: true })
    profile: Profile;

    @Prop({ type: Preferences, default: () => ({ languageCode: 'en', theme: 'light' }) })
    preferences: Preferences;

    @Prop({ type: Security, default: () => ({}) })
    security: Security;

    @Prop({ type: PhoneInfo })
    phone: PhoneInfo;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop({ default: false })
    isPhoneVerified: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[]; // 'user', 'admin', 'creator', 'vip'

    @Prop({ default: 'active', enum: ['active', 'suspended', 'deleted'] })
    status: string;

    @Prop({ type: [{ deviceId: String, name: String, lastActive: Date }], default: [] })
    deviceList: Record<string, any>[];

    @Prop({ default: false })
    termsAccepted: boolean;

    @Prop({ default: false })
    privacyAccepted: boolean;


    @Prop({ default: false })
    isOnboardingCompleted: boolean;

    // VIP Badge System
    @Prop({ default: false })
    isVip: boolean;

    @Prop()
    vipExpiresAt: Date;

    // Creator Certification Badge System
    @Prop({ default: false })
    isCreatorCertified: boolean;

    @Prop({ default: false })
    isUnder18: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
