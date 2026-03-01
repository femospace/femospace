import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LegalController } from './legal.controller';
import { LegalService } from './legal.service';
import { LegalDocument, LegalDocumentSchema } from './schemas/legal-document.schema';
import { UserLegalAcceptance, UserLegalAcceptanceSchema } from './schemas/user-legal-acceptance.schema';

import { LegalSeedService } from './seeds/legal-seed.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LegalDocument.name, schema: LegalDocumentSchema },
            { name: UserLegalAcceptance.name, schema: UserLegalAcceptanceSchema },
        ]),
    ],
    controllers: [LegalController],
    providers: [LegalService, LegalSeedService],
    exports: [LegalService],
})
export class LegalModule { }
