import { IsOptional, IsString } from 'class-validator';

export class CreateAIConversationDto {
    @IsString()
    @IsOptional()
    title?: string;
}
