import { Controller, Get, Post, Body, Req, UseGuards, Param, Query, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get('bank-details')
    @UseGuards(JwtAuthGuard)
    async getBankDetails() {
        return this.paymentService.getBankDetails();
    }

    @Get('methods')
    async getSupportedMethods() {
        return [
            { id: 'paypal', name: 'PayPal', icon: 'paypal', enabled: true },
            { id: 'binance', name: 'Binance Crypto', icon: 'bitcoin', enabled: true },
            { id: 'stripe', name: 'Visa / Mastercard', icon: 'credit-card', enabled: true },
            { id: 'skrill', name: 'Skrill', icon: 'wallet', enabled: true },
            { id: 'bank-transfer', name: 'Direct Bank Transfer', icon: 'bank', enabled: true },
            { id: 'payoneer', name: 'Payoneer', icon: 'check-circle', enabled: true },
        ];
    }

    @Post('create-session/:provider')
    @UseGuards(JwtAuthGuard)
    async createPaymentSession(@Req() req: any, @Param('provider') provider: string, @Body() body: { amount: number }) {
        if (provider === 'stripe') {
            return this.paymentService.createStripeSession(req.user.userId, body.amount);
        } else if (provider === 'paypal') {
            return this.paymentService.createPayPalOrder(req.user.userId, body.amount);
        } else if (provider === 'binance') {
            return this.paymentService.createBinanceOrder(req.user.userId, body.amount);
        }
        throw new BadRequestException('Unsupported payment provider');
    }

    /**
     * Unified Webhook endpoint for all providers.
     * In a real system, you'd use raw body for signature verification.
     */
    @Post('webhook/:provider')
    async handleProviderWebhook(@Param('provider') provider: string, @Body() payload: any) {
        return this.paymentService.handleWebhook(provider, payload);
    }
}
