import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class SubmitLevel1Dto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsDateString()
    @IsNotEmpty()
    dob: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}

export class SubmitLivenessDto {
    @IsOptional()
    blink: boolean;

    @IsOptional()
    smile: boolean;

    @IsOptional()
    headTurn: boolean;

    @IsOptional()
    faceMatchScore: number;
}
