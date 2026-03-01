import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateMailDto {
    @IsArray()
    @IsString({ each: true })
    to: string[]; // Femo IDs or Femo Mails

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    cc?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    bcc?: string[];

    @IsString()
    subject: string;

    @IsString()
    body: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    @IsOptional()
    @IsBoolean()
    isDraft?: boolean;
}
