import api from '../lib/api';

export interface Mail {
    _id: string;
    fromUserId: any;
    toUserIds: any[];
    ccUserIds?: any[];
    bccUserIds?: any[];
    subject: string;
    body: string;
    attachments: string[];
    readBy: Record<string, boolean>;
    deletedBy: Record<string, boolean>;
    isDraft: boolean;
    createdAt: string;
    updatedAt: string;
}

export const mailService = {
    sendMail: async (data: {
        to: string[];
        cc?: string[];
        bcc?: string[];
        subject: string;
        body: string;
        attachments?: string[];
        isDraft?: boolean;
    }) => {
        const response = await api.post('/mail/send', data);
        return response.data;
    },

    getInbox: async (): Promise<Mail[]> => {
        const response = await api.get('/mail/inbox');
        return response.data;
    },

    getSent: async (): Promise<Mail[]> => {
        const response = await api.get('/mail/sent');
        return response.data;
    },

    getDrafts: async (): Promise<Mail[]> => {
        const response = await api.get('/mail/drafts');
        return response.data;
    },

    getTrash: async (): Promise<Mail[]> => {
        const response = await api.get('/mail/trash');
        return response.data;
    },

    getMailDetails: async (id: string): Promise<Mail> => {
        const response = await api.get(`/mail/${id}`);
        return response.data;
    },

    markAsRead: async (id: string) => {
        await api.put(`/mail/${id}/read`);
    },

    deleteMail: async (id: string) => {
        await api.delete(`/mail/${id}`);
    }
};
