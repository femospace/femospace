import api from '../lib/api';

export interface Participant {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    femoId?: string;
}

export interface Chat {
    _id: string;
    participants: Participant[];
    type: 'direct' | 'group' | 'channel' | 'page' | 'business' | 'ai' | 'support';
    name?: string;
    avatar?: string;
    description?: string;
    lastMessage?: {
        text: string;
        senderId: string;
        type: string;
        createdAt: string;
    };
    unreadCounts: Record<string, number>;
    updatedAt: string;
}

export interface Message {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: string;
    metadata: any;
    status: string;
    createdAt: string;
    seenBy: string[];
}

export const chatService = {
    getChats: async (): Promise<Chat[]> => {
        const response = await api.get('/chat');
        return response.data;
    },

    getMessages: async (chatId: string): Promise<Message[]> => {
        const response = await api.get(`/chat/${chatId}/messages`);
        return response.data;
    },

    createChat: async (data: { participants: string[]; type?: string; name?: string }): Promise<Chat> => {
        const response = await api.post('/chat', data);
        return response.data;
    },

    markAsSeen: async (chatId: string): Promise<void> => {
        await api.post(`/chat/${chatId}/seen`);
    },

    createSupportChat: async (): Promise<Chat> => {
        const response = await api.post('/chat/support');
        return response.data;
    },

    createGroup: async (data: { name: string; participants: string[]; description?: string }): Promise<Chat> => {
        const response = await api.post('/chat/group', data);
        return response.data;
    },

    leaveChat: async (chatId: string): Promise<void> => {
        await api.put(`/chat/${chatId}/leave`);
    },

    addParticipant: async (chatId: string, userId: string): Promise<Chat> => {
        const response = await api.put(`/chat/${chatId}/participants`, { userId });
        return response.data;
    },

    removeParticipant: async (chatId: string, participantId: string): Promise<Chat> => {
        const response = await api.delete(`/chat/${chatId}/participants/${participantId}`);
        return response.data;
    },

    deleteMessage: async (messageId: string): Promise<void> => {
        await api.delete(`/chat/message/${messageId}`);
    },

    starMessage: async (messageId: string): Promise<Message> => {
        const response = await api.post(`/chat/message/${messageId}/star`);
        return response.data;
    },

    uploadFile: async (file: File): Promise<{ url: string; fileName: string; size: number; mimetype: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/chat/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
