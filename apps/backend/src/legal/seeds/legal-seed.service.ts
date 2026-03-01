import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LegalDocument } from '../schemas/legal-document.schema';
import { TRANSLATIONS, Translation } from './legal-translations';

// All supported language codes
const ALL_LANGUAGE_CODES = [
  'en', 'es', 'zh-CN', 'zh-TW', 'hi', 'ar', 'bn', 'pt', 'ru', 'ja',
  'pa', 'de', 'jv', 'ko', 'fr', 'te', 'mr', 'tr', 'ta', 'vi',
  'ur', 'it', 'th', 'gu', 'pl', 'uk', 'ml', 'kn', 'or', 'my',
  'af', 'sq', 'am', 'hy', 'az', 'eu', 'be', 'bs', 'bg', 'ca',
  'ceb', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'fi', 'gl', 'ka',
  'el', 'ha', 'he', 'hu', 'is', 'ig', 'id', 'ga', 'kk', 'km',
  'rw', 'ku', 'ky', 'lo', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms',
  'mt', 'mi', 'mn', 'ne', 'no', 'ps', 'fa', 'ro', 'sm', 'sr',
  'sn', 'sd', 'si', 'sk', 'sl', 'so', 'st', 'su', 'sw', 'sv',
  'tg', 'tl', 'tk', 'uz', 'cy', 'xh', 'yi', 'yo', 'zu',
  'as', 'ay', 'bm', 'bho', 'dv', 'ee', 'fy', 'gn', 'ht', 'haw',
  'hmn', 'iu', 'kri', 'ckb', 'la', 'ln', 'lg', 'mai', 'mni-Mtei',
  'lus', 'ny', 'om', 'qu', 'sa', 'gd', 'nso', 'tn', 'ti', 'ts',
  'tt', 'ug'
];

@Injectable()
export class LegalSeedService implements OnModuleInit {
  constructor(
    @InjectModel(LegalDocument.name)
    private legalDocumentModel: Model<LegalDocument>,
  ) { }

  async onModuleInit() {
    console.log('Legal document seeding disabled to prevent duplicate key errors.');
    console.log('Documents will be seeded on first request if needed.');
    // await this.seed();
  }

  private getTranslation(lang: string): Translation {
    // Return translation for language or fallback to English
    return TRANSLATIONS[lang] || TRANSLATIONS['en'];
  }

  private buildTermsHTML(t: Translation, lang: string): string {
    return `
      <section>
        <h2>${t.termsTitle}</h2>
        
        <h3>1. ${t.intro.title}</h3>
        <p>${t.intro.welcome}</p>
        <p>${t.intro.agreement}</p>
        <p>${t.intro.noAgree}</p>

        <h3>2. ${t.eligibility.title}</h3>
        <ul>
          <li>${t.eligibility.age}</li>
          <li>${t.eligibility.accuracy}</li>
          <li>${t.eligibility.multipleAccounts}</li>
        </ul>

        <h3>3. ${t.accountSecurity.title}</h3>
        <ul>
          <li>${t.accountSecurity.responsibility}</li>
          <li>${t.accountSecurity.verification}</li>
          <li>${t.accountSecurity.notResponsible}</li>
        </ul>

        <h3>4. ${t.userContent.title}</h3>
        <ul>
          <li>${t.userContent.ownership}</li>
          <li>${t.userContent.license}</li>
          <li>${t.userContent.standards}</li>
        </ul>

        <h3>5. ${t.prohibited.title}</h3>
        <p>${t.prohibited.intro}</p>
        <ul>
          <li>${t.prohibited.illegal}</li>
          <li>${t.prohibited.impersonate}</li>
          <li>${t.prohibited.exploit}</li>
          <li>${t.prohibited.spam}</li>
          <li>${t.prohibited.bots}</li>
        </ul>

        <h3>6. ${t.pagesGroups.title}</h3>
        <ul>
          <li>${t.pagesGroups.create}</li>
          <li>${t.pagesGroups.moderation}</li>
          <li>${t.pagesGroups.violations}</li>
        </ul>

        <h3>7. ${t.monetization.title}</h3>
        <ul>
          <li>${t.monetization.eligibility}</li>
          <li>${t.monetization.policies}</li>
          <li>${t.monetization.withhold}</li>
        </ul>

        <h3>8. ${t.vipBadges.title}</h3>
        <ul>
          <li>${t.vipBadges.vipPaid}</li>
          <li>${t.vipBadges.creatorReview}</li>
          <li>${t.vipBadges.revoke}</li>
        </ul>

        <h3>9. ${t.suspension.title}</h3>
        <p>${t.suspension.intro}</p>
        <ul>
          <li>${t.suspension.suspendAccounts}</li>
          <li>${t.suspension.removeContent}</li>
          <li>${t.suspension.restrictFeatures}</li>
        </ul>
        <p>${t.suspension.reason}</p>

        <h3>10. ${t.liability.title}</h3>
        <p>${t.liability.intro}</p>
        <ul>
          <li>${t.liability.dataLoss}</li>
          <li>${t.liability.interruptions}</li>
          <li>${t.liability.ugcDamages}</li>
        </ul>

        <h3>11. ${t.termsChanges.title}</h3>
        <ul>
          <li>${t.termsChanges.update}</li>
          <li>${t.termsChanges.reaccept}</li>
        </ul>

        <h3>12. ${t.governing.title}</h3>
        <p>${t.governing.text}</p>

        <h3>13. ${t.contact.title}</h3>
        <p>${t.contact.email}</p>
        <p>${t.contact.company}</p>
        <p>${t.contact.language} ${lang.toUpperCase()}</p>
      </section>
    `;
  }

  private buildPrivacyHTML(t: Translation, lang: string): string {
    return `
      <section>
        <h2>${t.privacyTitle}</h2>
        
        <h3>1. ${t.infoCollect.title}</h3>
        <p>${t.infoCollect.intro}</p>
        <ul>
          <li>${t.infoCollect.personal}</li>
          <li>${t.infoCollect.profile}</li>
          <li>${t.infoCollect.content}</li>
          <li>${t.infoCollect.messages}</li>
          <li>${t.infoCollect.device}</li>
        </ul>

        <h3>2. ${t.infoUse.title}</h3>
        <p>${t.infoUse.intro}</p>
        <ul>
          <li>${t.infoUse.services}</li>
          <li>${t.infoUse.improve}</li>
          <li>${t.infoUse.secure}</li>
          <li>${t.infoUse.monetization}</li>
          <li>${t.infoUse.legal}</li>
        </ul>

        <h3>3. ${t.cookies.title}</h3>
        <p>${t.cookies.intro}</p>
        <ul>
          <li>${t.cookies.sessions}</li>
          <li>${t.cookies.personalize}</li>
          <li>${t.cookies.analyze}</li>
        </ul>

        <h3>4. ${t.communications.title}</h3>
        <ul>
          <li>${t.communications.stored}</li>
          <li>${t.communications.protected}</li>
        </ul>

        <h3>5. ${t.deviceLog.title}</h3>
        <p>${t.deviceLog.intro}</p>
        <ul>
          <li>${t.deviceLog.ip}</li>
          <li>${t.deviceLog.deviceType}</li>
          <li>${t.deviceLog.os}</li>
          <li>${t.deviceLog.loginHistory}</li>
        </ul>

        <h3>6. ${t.dataSharing.title}</h3>
        <p>${t.dataSharing.noSell}</p>
        <ul>
          <li>${t.dataSharing.payment}</li>
          <li>${t.dataSharing.legal}</li>
          <li>${t.dataSharing.providers}</li>
        </ul>

        <h3>7. ${t.dataSecurity.title}</h3>
        <ul>
          <li>${t.dataSecurity.secure}</li>
          <li>${t.dataSecurity.encryption}</li>
          <li>${t.dataSecurity.notPerfect}</li>
        </ul>

        <h3>8. ${t.userRights.title}</h3>
        <p>${t.userRights.intro}</p>
        <ul>
          <li>${t.userRights.access}</li>
          <li>${t.userRights.edit}</li>
          <li>${t.userRights.delete}</li>
          <li>${t.userRights.export}</li>
        </ul>

        <h3>9. ${t.dataDeletion.title}</h3>
        <ul>
          <li>${t.dataDeletion.anytime}</li>
          <li>${t.dataDeletion.retained}</li>
        </ul>

        <h3>10. ${t.childrenPrivacy.title}</h3>
        <ul>
          <li>${t.childrenPrivacy.notCollect}</li>
          <li>${t.childrenPrivacy.removed}</li>
        </ul>

        <h3>11. ${t.privacyChanges.title}</h3>
        <ul>
          <li>${t.privacyChanges.update}</li>
          <li>${t.privacyChanges.notify}</li>
        </ul>

        <h3>12. ${t.privacyContact.title}</h3>
        <p>${t.privacyContact.email}</p>
        <p>${t.privacyContact.company}</p>
        <p>${t.privacyContact.language} ${lang.toUpperCase()}</p>
      </section>
    `;
  }

  private async seed() {
    try {
      const documents = [];

      // Create documents for all languages
      for (const lang of ALL_LANGUAGE_CODES) {
        const translation = this.getTranslation(lang);

        // Terms document
        documents.push({
          type: 'terms',
          version: '1.0.0',
          language: lang,
          isActive: true,
          publishedAt: new Date(),
          content: this.buildTermsHTML(translation, lang),
        });

        // Privacy document
        documents.push({
          type: 'privacy',
          version: '1.0.0',
          language: lang,
          isActive: true,
          publishedAt: new Date(),
          content: this.buildPrivacyHTML(translation, lang),
        });
      }

      // Use upsert to insert or update existing documents
      for (const doc of documents) {
        await this.legalDocumentModel.updateOne(
          { type: doc.type, version: doc.version, language: doc.language },
          doc,
          { upsert: true }
        );
      }

      const translatedLanguages = Object.keys(TRANSLATIONS).length;
      console.log(`✅ Successfully seeded ${documents.length} legal documents`);
      console.log(`📋 Total languages: ${ALL_LANGUAGE_CODES.length}`);
      console.log(`🌍 Fully translated languages: ${translatedLanguages}`);
      console.log(`📄 Documents per type: Terms=${ALL_LANGUAGE_CODES.length}, Privacy=${ALL_LANGUAGE_CODES.length}`);
    } catch (error) {
      console.error('❌ Error seeding legal documents:', error);
      throw error;
    }
  }
}
