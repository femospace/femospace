import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export class SendTipDto {
    @IsString()
    toUserId: string;

    @IsNumber()
    @Min(1)
    amount: number;

    @IsOptional()
    @IsString()
    postId?: string;

    @IsOptional()
    @IsString()
    message?: string;
}

export class BuyCoinsDto {
    @IsNumber()
    @Min(1)
    amount: number;

    @IsString()
    paymentMethodId: string;
}

export class WithdrawFundsDto {
    @IsNumber()
    @Min(50) // Minimum payout threshold e.g. $50 or 5000 coins
    amount: number;

    @IsEnum(['bank', 'paypal', 'crypto'])
    method: string;

    @IsOptional()
    methodDetails: any;
}
