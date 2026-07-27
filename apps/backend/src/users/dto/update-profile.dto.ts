import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    'profile.firstName'?: string;

    @IsOptional()
    @IsString()
    'profile.lastName'?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    'profile.country'?: string;

    @IsOptional()
    @IsString()
    'profile.bio'?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsString()
    'preferences.languageCode'?: string;

    @IsOptional()
    @IsString()
    'preferences.timezone'?: string;
}
