import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsEnum(['personal', 'creator', 'business', 'verified', 'vip'])
    @IsOptional()
    type?: string;
}
