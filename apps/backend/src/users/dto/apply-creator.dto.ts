import { IsString, IsArray, IsNotEmpty, MinLength, ArrayMinSize } from 'class-validator';

export class ApplyCreatorDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    fullName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    reason: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    portfolioLinks: string[];

    @IsString()
    @IsNotEmpty()
    femoEmailOrId: string;

    @IsString()
    @IsNotEmpty()
    mobileNumber: string;

    @IsString()
    @IsNotEmpty()
    creatorAccountName: string;

    @IsString()
    @IsNotEmpty()
    accountType: string;

    @IsString()
    @IsNotEmpty()
    creationDate: string;

    @IsString()
    @IsNotEmpty()
    currentStatus: string;
}
