import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KYCProfile, KYCProfileSchema } from './schemas/kyc-profile.schema';
import { KYCDocument, KYCDocumentSchema } from './schemas/kyc-document.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: KYCProfile.name, schema: KYCProfileSchema },
            { name: KYCDocument.name, schema: KYCDocumentSchema },
        ]),
    ],
    controllers: [KycController],
    providers: [KycService],
    exports: [KycService],
})
export class KycModule { }
