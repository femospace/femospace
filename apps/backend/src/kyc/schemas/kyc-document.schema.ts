import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type KYCDocumentDocument = KYCDocument & Document;

export enum KYCDocumentType {
    ID_FRONT = 'ID_FRONT',
    ID_BACK = 'ID_BACK',
    SELFIE = 'SELFIE',
    UTILITY_BILL = 'UTILITY_BILL',
    BANK_STATEMENT = 'BANK_STATEMENT',
    SOURCE_OF_INCOME = 'SOURCE_OF_INCOME',
}

export enum KYCDocumentStatus {
    PENDING = 'PENDING',
    VALID = 'VALID',
    INVALID = 'INVALID',
    EXPIRED = 'EXPIRED',
}

@Schema({ timestamps: true })
export class KYCDocument {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: String, enum: KYCDocumentType, required: true })
    type: KYCDocumentType;

    @Prop({ required: true })
    filePathEncrypted: string;

    @Prop({ type: String, enum: KYCDocumentStatus, default: KYCDocumentStatus.PENDING })
    status: KYCDocumentStatus;

    @Prop({ type: Object })
    ocrData?: any;

    @Prop({ type: Date })
    uploadedAt: Date;
}

export const KYCDocumentSchema = SchemaFactory.createForClass(KYCDocument);
