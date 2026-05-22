import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    private readonly stripePublicKey: string;
    private readonly stripeSecretKey: string;
    private readonly stripe: Stripe;

    constructor(
        private readonly walletService: WalletService,
        private readonly configService: ConfigService
    ) {
        this.stripePublicKey = this.configService.get<string>('STRIPE_PUBLISHABLE_KEY') || '';
        this.stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || '';
        this.stripe = new Stripe(this.stripeSecretKey, {
            apiVersion: '2025-02-24-preview' as any,
        });
    }

    // Real bank details for users
    getBankDetails() {
        return {
            bankName: 'Femo Global Bank',
            accountName: 'FemoSpace Operations Ltd',
            accountNumber: '880011223344',
            branch: 'Main HQ',
            swiftCode: 'FEMOGBLX',
            instructions: 'Please include your User ID in the reference field for instant tracking.',
        };
    }

    /**
     * Stripe Checkout Session creation structure.
     */
    async createStripeSession(userId: string, amount: number) {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Femo Wallet Deposit',
                                description: `Funding account for user ${userId}`,
                            },
                            unit_amount: Math.round(amount * 100), // Stripe uses cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${this.configService.get('FRONTEND_URL')}/wallet?deposit=success`,
                cancel_url: `${this.configService.get('FRONTEND_URL')}/wallet?deposit=cancelled`,
                metadata: {
                    userId,
                    amount: amount.toString(),
                    type: 'wallet_deposit',
                },
            });

            return {
                url: session.url,
                sessionId: session.id,
            };
        } catch (error) {
            throw new InternalServerErrorException(`Stripe Session Error: ${error.message}`);
        }
    }

    /**
     * PayPal Order creation.
     */
    async createPayPalOrder(userId: string, amount: number) {
        return {
            id: 'PP-MOCK-ORDER-ID',
            status: 'CREATED',
            links: [{ href: 'https://www.paypal.com/mock-checkout', rel: 'approve' }]
        };
    }

    /**
     * Binance Pay Order creation.
     */
    async createBinanceOrder(userId: string, amount: number) {
        return {
            prepayId: 'BINANCE-MOCK-ID',
            checkoutUrl: 'https://pay.binance.com/mock-checkout',
        };
    }

    /**
     * Handle Webhooks (Stripe/PayPal/Binance)
     * This is where funds are actually added to the wallet once payment is verified.
     */
    async handleWebhook(provider: string, payload: any) {
        // 1. Verify Signature
        // 2. Extract UserId and Amount
        // 3. await this.walletService.deposit(userId, amount, provider as any, refId);
        return { received: true };
    }
}
