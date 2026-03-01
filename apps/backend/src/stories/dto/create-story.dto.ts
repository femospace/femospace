import { IsString, IsEnum, IsOptional, IsObject, IsNumber, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class StoryMediaDto {
    @IsString()
    url: string;

    @IsEnum(['image', 'video'])
    type: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsNumber()
    duration?: number;
}

export class CreateStoryDto {
    @IsEnum(['user', 'page', 'group', 'channel', 'business'])
    ownerType: string;

    @IsString()
    ownerId: string;

    @ValidateNested()
    @Type(() => StoryMediaDto)
    media: StoryMediaDto;

    @IsOptional()
    @IsEnum(['image', 'video', 'text', 'poll', 'quiz', 'link', 'product', 'live', 'ai'])
    type?: string;

    @IsOptional()
    @IsEnum(['public', 'followers', 'friends', 'members', 'subscribers', 'private', 'custom'])
    audience?: string;

    @IsOptional()
    @IsObject()
    content?: Record<string, any>;

    @IsOptional()
    @IsDateString()
    expiresAt?: Date;

    @IsOptional()
    @IsObject()
    aiMetadata?: {
        caption?: string;
        tags?: string[];
    };
}
