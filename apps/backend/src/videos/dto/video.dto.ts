import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateVideoDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsEnum(['reel', 'video', 'live'])
    type: string;

    @IsOptional()
    @IsNumber()
    duration?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsEnum(['public', 'private', 'unlisted'])
    visibility?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    music?: {
        name: string;
        artist: string;
    };
}

export class UpdateVideoDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsEnum(['public', 'private', 'unlisted'])
    visibility?: string;

    @IsOptional()
    @IsString()
    category?: string;
}

export class VideoQueryDto {
    @IsOptional()
    @IsEnum(['reel', 'video', 'live'])
    type?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    trending?: boolean;
}
