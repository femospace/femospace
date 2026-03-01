import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class CreateStep1Dto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDateString()
    birthday: string;

    @IsNotEmpty()
    @IsEnum(['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'])
    gender: string;
}
