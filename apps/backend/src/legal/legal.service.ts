import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LegalDocument } from './schemas/legal-document.schema';
import { UserLegalAcceptance } from './schemas/user-legal-acceptance.schema';

@Injectable()
export class LegalService {
    constructor(
        @InjectModel(LegalDocument.name)
        private legalDocumentModel: Model<LegalDocument>,
        @InjectModel(UserLegalAcceptance.name)
        private userLegalAcceptanceModel: Model<UserLegalAcceptance>,
    ) { }

    async getLatestDocument(type: 'terms' | 'privacy', lang: string) {
        // Try to find the document in the requested language
        let doc = await this.legalDocumentModel
            .findOne({ type, language: lang, isActive: true })
            .sort({ version: -1 })
            .exec();

        // Fallback to English if not found
        if (!doc && lang !== 'en') {
            doc = await this.legalDocumentModel
                .findOne({ type, language: 'en', isActive: true })
                .sort({ version: -1 })
                .exec();
        }

        if (!doc) {
            throw new NotFoundException(`Document ${type} not found`);
        }

        return doc;
    }

    async acceptLegal(data: {
        userId: string;
        termsVersion: string;
        privacyVersion: string;
        language: string;
        ip: string;
        device: string;
    }) {
        const acceptance = new this.userLegalAcceptanceModel({
            ...data,
            acceptedAt: new Date(),
        });
        return acceptance.save();
    }

    async checkAcceptance(userId: string, currentTermsVersion: string, currentPrivacyVersion: string) {
        const lastAcceptance = await this.userLegalAcceptanceModel
            .findOne({ userId })
            .sort({ acceptedAt: -1 })
            .exec();

        if (!lastAcceptance) return false;

        return (
            lastAcceptance.termsVersion === currentTermsVersion &&
            lastAcceptance.privacyVersion === currentPrivacyVersion
        );
    }
}
