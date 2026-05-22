import api from '../lib/api';

export interface UpdateProfileData {
    displayName?: string;
    username?: string;
    bio?: string;
    website?: string;
    location?: string;
    birthday?: string;
    gender?: string;
    privacy?: {
        profileVisibility: 'public' | 'followers' | 'private';
        showFollowersCount: boolean;
        showFollowingCount: boolean;
    };
    publicEmail?: string;
    phone?: string;
    avatarUrl?: string;
    coverUrl?: string;
}

export const profileService = {
    getProfile: async (username: string) => {
        const { data } = await api.get(`/users/profile/${username}`);
        return data;
    },

    updateProfile: async (profileData: UpdateProfileData) => {
        const { data } = await api.patch('/users/me', profileData);
        return data;
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/users/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.url;
    },

    uploadCover: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/users/upload-cover', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.url;
    }
};
