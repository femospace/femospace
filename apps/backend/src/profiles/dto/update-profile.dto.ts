import { IsString, IsOptional, IsEnum, IsObject, IsArray, IsHexColor } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    displayName?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsEnum(['personal', 'creator', 'business', 'verified', 'vip'])
    @IsOptional()
    type?: string;

    @IsObject()
    @IsOptional()
    location?: {
        country?: string;
        city?: string;
    };

    @IsString()
    @IsOptional()
    language?: string;

    @IsString()
    @IsOptional()
    layoutStyle?: string;

    @IsHexColor()
    @IsOptional()
    themeColor?: string;

    @IsObject()
    @IsOptional()
    privacySettings?: {
        viewProfile?: string;
        sendMessage?: string;
        tagMe?: string;
        commentOnPosts?: string;
    };
}
