import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PostType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    REEL = 'reel'
}

export enum PostVisibility {
    PUBLIC = 'public',
    FRIENDS = 'friends',
    PRIVATE = 'private'
}

export class CreatePostDto {
    @ApiProperty({
        description: 'Type of the content being posted',
        enum: PostType,
        example: PostType.TEXT
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    type: PostType;

    @ApiProperty({
        description: 'The textual content of the post',
        example: 'Hello Femo World!',
        required: false
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({
        description: 'Array of media URLs (Images or Videos)',
        type: [String],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    mediaUrls?: string[];

    @ApiProperty({
        description: 'Who can see this post',
        enum: PostVisibility,
        default: PostVisibility.PUBLIC
    })
    @IsEnum(PostVisibility)
    @IsOptional()
    visibility?: PostVisibility;

    @ApiProperty({
        description: 'List of tags/hashtags',
        type: [String],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
