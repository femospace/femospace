import api from '../lib/api';

export interface Transaction {
    _id: string;
    fromUserId: {
        _id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    toUserId?: {
        _id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    } | string;
    amount: number;
    type: string;
    status: string;
    description: string;
    createdAt: string;
}


export interface Payout {
    _id: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
}

export interface MonetizationStats {
    isEnabled: boolean;
    isApproved: boolean;
    totalEarnings: number;
    adRevenue: number;
    fanSupportRevenue: number;
    subscriptionRevenue: number;
}

export interface Wallet {
    coinBalance: number;
    cashBalance: number;
    currency: string;
    totalEarned: number;
    totalSpent: number;
}

export interface Gift {
    _id: string;
    name: string;
    coinValue: number;
    imageUrl: string;
    animationUrl: string;
}

export interface SubscriptionTier {
    _id: string;
    name: string;
    price: number;
    benefits: string[];
}

export interface EarningsBreakdown {
    totalEarnings: number;
    currentBalance: number;
    withdrawableBalance: number;
    breakdown: Array<{ _id: string, total: number }>;
    profileStatus: boolean;
}

export const monetizationService = {
    getStats: async (): Promise<MonetizationStats> => {
        const response = await api.get('/monetization/stats');
        return response.data;
    },

    getWallet: async (): Promise<Wallet> => {
        const response = await api.get('/monetization/wallet');
        return response.data;
    },

    enable: async () => {
        const response = await api.post('/monetization/enable');
        return response.data;
    },

    buyCoins: async (amount: number, paymentMethodId: string) => {
        const response = await api.post('/monetization/buy-coins', { amount, paymentMethodId });
        return response.data;
    },

    getGifts: async (): Promise<Gift[]> => {
        const response = await api.get('/monetization/gifts');
        return response.data;
    },

    sendGift: async (data: { giftId: string; creatorId: string; liveStreamId?: string }) => {
        const response = await api.post('/monetization/gift/send', data);
        return response.data;
    },

    createTier: async (data: Partial<SubscriptionTier>) => {
        const response = await api.post('/monetization/tiers', data);
        return response.data;
    },


    getCreatorTiers: async (creatorId: string): Promise<SubscriptionTier[]> => {
        const response = await api.get(`/monetization/creator/tiers/${creatorId}`);
        return response.data;
    },

    subscribe: async (tierId: string) => {
        const response = await api.post('/monetization/subscribe', { tierId });
        return response.data;
    },

    getEarningsBreakdown: async (): Promise<EarningsBreakdown> => {
        const response = await api.get('/monetization/earnings/breakdown');
        return response.data;
    },

    withdraw: async (data: { amount: number; method: string; methodDetails: Record<string, any> }) => {
        const response = await api.post('/monetization/withdraw', data);
        return response.data;
    },


    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get('/monetization/transactions');
        return response.data;
    },

    getPayouts: async (): Promise<Payout[]> => {
        const response = await api.get('/monetization/payouts');
        return response.data;
    }
};
