import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStep3Dto {
    @IsNotEmpty()
    @IsString()
    femoMailName: string;

    @IsOptional()
    @IsString()
    phoneCountryCode?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}
