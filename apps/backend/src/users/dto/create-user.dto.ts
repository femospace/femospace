import { IsEmail, IsString, IsNotEmpty, IsDateString, IsBoolean, MinLength, Matches, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain uppercase, lowercase, number and special character',
    })
    password: string;

    @IsNotEmpty()
    @IsDateString()
    birthday: string;

    @IsNotEmpty()
    @IsEnum(['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'])
    gender: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsBoolean()
    termsAccepted: boolean;

    @IsBoolean()
    privacyAccepted: boolean;
}
