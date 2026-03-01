import { IsEmail, IsString, IsNotEmpty, IsBoolean, MinLength, Matches } from 'class-validator';

export class CreateStep2Dto {
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
    @IsString()
    confirmPassword: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsBoolean()
    termsAccepted: boolean;

    @IsNotEmpty()
    @IsBoolean()
    privacyAccepted: boolean;
}
