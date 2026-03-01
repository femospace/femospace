import api from '../lib/api';

export enum KYCStatus {
    NOT_STARTED = 'NOT_STARTED',
    PENDING = 'PENDING',
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    REQUIRES_RESUBMISSION = 'REQUIRES_RESUBMISSION',
}

export enum KYCLevel {
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3,
    LEVEL_4 = 4,
}

export interface KYCProfile {
    status: KYCStatus;
    level: KYCLevel;
    riskScore: number;
    rejectionReason?: string;
    extractedData?: {
        fullName?: string;
        dob?: string;
        country?: string;
    };
}

export const kycService = {
    getProfile: async (): Promise<KYCProfile> => {
        const response = await api.get('/kyc/profile');
        return response.data;
    },

    submitLevel1: async (data: { fullName: string; dob: string; country: string }) => {
        const response = await api.post('/kyc/level1', data);
        return response.data;
    },

    uploadDocument: async (type: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/kyc/document/${type}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    submitLiveness: async (data: { blink: boolean; smile: boolean; headTurn: boolean; faceMatchScore: number }) => {
        const response = await api.post('/kyc/liveness', data);
        return response.data;
    },
};
