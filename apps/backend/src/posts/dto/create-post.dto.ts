import { IsString, IsEnum, IsOptional, IsArray, IsBoolean, IsDateString, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class MediaDto {
    @IsString()
    url: string;

    @IsEnum(['image', 'video', 'audio', 'document'])
    type: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
}

export class CreatePostDto {
    @IsEnum(['user', 'page', 'group', 'channel', 'business'])
    ownerType: string;

    @IsString()
    ownerId: string;

    @IsEnum(['text', 'image', 'video', 'reel', 'poll', 'event', 'product', 'story', 'link', 'audio', 'document', 'ai'])
    type: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    media?: MediaDto[];

    @IsOptional()
    @IsEnum(['public', 'followers', 'friends', 'members', 'subscribers', 'private', 'custom'])
    visibility?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hashtags?: string[];

    @IsOptional()
    @IsObject()
    location?: {
        name: string;
        coordinates: [number, number];
        city?: string;
        country?: string;
    };

    @IsOptional()
    @IsBoolean()
    isMonetized?: boolean;

    @IsOptional()
    @IsEnum(['draft', 'scheduled', 'published'])
    status?: string;

    @IsOptional()
    @IsDateString()
    scheduledAt?: Date;

    @IsOptional()
    @IsString()
    parentId?: string;
}
