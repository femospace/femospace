import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LegalModule } from './legal/legal.module';
import { FeedModule } from './feed/feed.module';
import { VideosModule } from './videos/videos.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuditModule } from './audit/audit.module';
import { SecurityModule } from './security/security.module';
import { PostsModule } from './posts/posts.module';
import { StoriesModule } from './stories/stories.module';
import { StorageModule } from './storage/storage.module';
import { AudioModule } from './audio/audio.module';
import { FollowsModule } from './follows/follows.module';
import { MailModule } from './mail/mail.module';
import { MonetizationModule } from './monetization/monetization.module';
import { AIModule } from './ai/ai.module';
import { KycModule } from './kyc/kyc.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payments/payment.module';
import { SupabaseModule } from './common/supabase.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { I18nMiddleware } from './common/middleware/i18n.middleware';
import { I18nService } from './common/services/i18n.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://127.0.0.1:27017/femo-space',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    LegalModule,
    FeedModule,
    VideosModule,
    ChatModule,
    NotificationsModule,
    SearchModule,
    ProfilesModule,
    AuditModule,
    SecurityModule,
    PostsModule,
    StoriesModule,
    StorageModule,
    AudioModule,
    FollowsModule,
    MailModule,
    MonetizationModule,
    AIModule,
    KycModule,
    MarketplaceModule,
    WalletModule,
    PaymentModule,
    SupabaseModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    I18nService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(I18nMiddleware)
      .forRoutes('*');
  }
}
