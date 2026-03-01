import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    SecurityModule,
    AuditModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' }, // Short-lived access token
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, RegistrationController],
  providers: [AuthService, RegistrationService, JwtStrategy],
  exports: [AuthService, RegistrationService],
})
export class AuthModule { }
