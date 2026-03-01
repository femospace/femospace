import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type KYCProfileDocument = KYCProfile & Document;

export enum KYCStatus {
    NOT_STARTED = 'NOT_STARTED',
    PENDING = 'PENDING',
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    REQUIRES_RESUBMISSION = 'REQUIRES_RESUBMISSION',
}

export enum KYCLevel {
    LEVEL_1 = 1, // Basic
    LEVEL_2 = 2, // ID Verification
    LEVEL_3 = 3, // Address Verification
    LEVEL_4 = 4, // Enhanced Due Diligence
}

@Schema({ timestamps: true })
export class KYCProfile {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: string;

    @Prop({ type: String, enum: KYCStatus, default: KYCStatus.NOT_STARTED })
    status: KYCStatus;

    @Prop({ type: Number, enum: KYCLevel, default: KYCLevel.LEVEL_1 })
    level: KYCLevel;

    @Prop({ type: Number, default: 0 })
    riskScore: number;

    @Prop({ type: Date })
    approvedAt?: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    reviewedBy?: string;

    @Prop({ type: String })
    rejectionReason?: string;

    @Prop({
        type: {
            fullName: String,
            dob: Date,
            country: String,
            idNumber: String, // Encrypted in logic
            expiryDate: Date,
        }
    })
    extractedData: {
        fullName?: string;
        dob?: Date;
        country?: string;
        idNumber?: string;
        expiryDate?: Date;
    };

    @Prop({
        type: {
            blink: Boolean,
            smile: Boolean,
            headTurn: Boolean,
            faceMatchScore: Number,
        }
    })
    livenessVerification: {
        blink?: boolean;
        smile?: boolean;
        headTurn?: boolean;
        faceMatchScore?: number;
    };

    @Prop({ type: Object })
    amlCheck: {
        lastChecked: Date;
        sanctionsList: boolean;
        pepMatch: boolean;
        watchlistMatch: boolean;
        details?: any;
    };
}

export const KYCProfileSchema = SchemaFactory.createForClass(KYCProfile);
