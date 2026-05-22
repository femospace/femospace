import api from '../lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PrivacySettings {
    profileVisibility: 'public' | 'followers' | 'private';
    postVisibility: 'public' | 'followers' | 'private';
    storyVisibility: 'public' | 'followers' | 'private';
    activityStatus: boolean;
    showLastSeen: boolean;
}

export interface NotificationSettings {
    categories: Record<string, boolean>;
    channels: Record<string, string[]>;
    quietHoursEnabled: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    phone?: string;
    country?: string;
    bio?: string;
    website?: string;
}

// ─── Settings Service ─────────────────────────────────────────────────────────

export const settingsService = {

    // ─── Personal Info ──────────────────────────────────────────────────────

    getPersonalInfo: async (): Promise<PersonalInfo> => {
        const { data } = await api.get('/users/me');
        const u = data.user || data;
        return {
            firstName: u.profile?.firstName || u.firstName || '',
            lastName: u.profile?.lastName || u.lastName || '',
            username: u.username || '',
            email: u.email || '',
            phone: u.phone?.number ? `${u.phone.countryCode || ''} ${u.phone.number}` : '',
            country: u.profile?.country || '',
            bio: u.profile?.bio || u.bio || '',
            website: u.website || '',
        };
    },

    updatePersonalInfo: async (data: Partial<PersonalInfo>) => {
        const payload: Record<string, string | undefined> = {};
        if (data.firstName) payload['profile.firstName'] = data.firstName;
        if (data.lastName) payload['profile.lastName'] = data.lastName;
        if (data.username !== undefined) payload['username'] = data.username;
        if (data.country !== undefined) payload['profile.country'] = data.country;
        if (data.bio !== undefined) payload['profile.bio'] = data.bio;
        if (data.website !== undefined) payload['website'] = data.website;
        const res = await api.patch(`/users/me/profile`, payload);
        return res.data;
    },


    // ─── Language & Region ──────────────────────────────────────────────────

    updateLanguage: async (languageCode: string, timezone?: string) => {
        const res = await api.patch('/users/me/profile', {
            'preferences.languageCode': languageCode,
            ...(timezone ? { 'preferences.timezone': timezone } : {}),
        });
        return res.data;
    },

    // ─── Notifications ──────────────────────────────────────────────────────

    getNotificationSettings: async (): Promise<NotificationSettings> => {
        const { data } = await api.get('/notifications/settings');
        return data;
    },

    updateNotificationSettings: async (settings: Partial<NotificationSettings>) => {
        const { data } = await api.post('/notifications/settings', settings);
        return data;
    },

    // ─── Password ───────────────────────────────────────────────────────────

    changePassword: async (currentPassword: string, newPassword: string) => {
        const { data } = await api.post('/security/change-password', {
            currentPassword,
            newPassword,
        });
        return data;
    },

    // ─── Sessions ───────────────────────────────────────────────────────────

    getSessions: async () => {
        const { data } = await api.get('/security/sessions');
        return data;
    },

    revokeSession: async (deviceId: string) => {
        await api.delete(`/security/sessions/${deviceId}`);
    },

    revokeAllSessions: async () => {
        await api.delete('/security/sessions');
    },

    // ─── Login Activity ─────────────────────────────────────────────────────

    getLoginActivity: async () => {
        const { data } = await api.get('/security/login-activity');
        return data;
    },

    // ─── Blocked Users ──────────────────────────────────────────────────────

    getBlockedUsers: async () => {
        const { data } = await api.get('/security/blocked-users');
        return data;
    },

    blockUser: async (targetId: string) => {
        await api.post(`/security/block/${targetId}`);
    },

    unblockUser: async (targetId: string) => {
        await api.delete(`/security/block/${targetId}`);
    },

    // ─── Privacy ────────────────────────────────────────────────────────────

    getPrivacySettings: async (): Promise<PrivacySettings> => {
        const { data } = await api.get('/security/privacy');
        return data;
    },

    updatePrivacySettings: async (settings: Partial<PrivacySettings>) => {
        const { data } = await api.put('/security/privacy', settings);
        return data;
    },

    // ─── Account Recovery ───────────────────────────────────────────────────

    updateAccountRecovery: async (data: { recoveryEmail?: string; recoveryPhone?: string }) => {
        const res = await api.put('/security/account-recovery', data);
        return res.data;
    },

    // ─── MFA ────────────────────────────────────────────────────────────────

    setupMfa: async () => {
        const { data } = await api.post('/security/mfa/setup');
        return data;
    },

    verifyMfa: async (token: string, secret: string) => {
        const { data } = await api.post('/security/mfa/verify', { token, secret });
        return data;
    },
};
