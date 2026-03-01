import { IsNotEmpty, IsString, ValidateIf, IsEmail, Matches } from 'class-validator';

/**
 * Login DTO for Femo Space
 * Accepts EITHER femoId (numeric) OR femoMail
 */
export class LoginIdentifierDto {
    @IsNotEmpty({ message: 'Identifier is required' })
    @IsString({ message: 'Identifier must be a string' })
    identifier: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;

    // Legacy support: keeping email field for backward compatibility
    @ValidateIf((o) => !o.identifier)
    @IsEmail()
    email?: string;
}
