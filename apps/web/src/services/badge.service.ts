import api from '../lib/api';

export const vipService = {
    getPricing: async () => {
        const { data } = await api.get('/vip/pricing');
        return data.data;
    },
    buyVip: async (durationMonths: number, paymentMethod: string) => {
        const { data } = await api.post('/vip/buy', { durationMonths, paymentMethod });
        return data;
    },
    getStatus: async () => {
        const { data } = await api.get('/vip/status');
        return data.data;
    }
};

export const creatorService = {
    apply: async (formData: any) => {
        const { data } = await api.post('/creator/apply', formData);
        return data;
    },
    getMyApplication: async () => {
        const { data } = await api.get('/creator/my-application');
        return data.data;
    },
    // Admin methods
    getAllApplications: async (status?: string) => {
        const { data } = await api.get(`/creator/admin/applications${status ? `?status=${status}` : ''}`);
        return data.data;
    },
    approveApplication: async (id: string) => {
        const { data } = await api.post(`/creator/admin/approve/${id}`);
        return data;
    },
    rejectApplication: async (id: string, reason?: string) => {
        const { data } = await api.post(`/creator/admin/reject/${id}`, { reason });
        return data;
    }
};
