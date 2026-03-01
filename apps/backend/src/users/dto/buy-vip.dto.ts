import { IsNotEmpty, IsNumber, IsEnum, IsString, Min, Max } from 'class-validator';

export class BuyVipDto {
    @IsNotEmpty()
    @IsEnum(['card', 'paypal', 'crypto', 'wallet'])
    paymentMethod: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(12)
    durationMonths: number; // 1, 3, 6, or 12 months

    @IsString()
    transactionId?: string;
}
