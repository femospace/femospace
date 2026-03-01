import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendAIMessageDto {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @IsOptional()
    attachments?: any[]; // Simplified for now
}
