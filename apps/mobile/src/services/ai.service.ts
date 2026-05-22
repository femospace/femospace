import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/ai`;


const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export interface AIConversation {
    _id: string;
    title: string;
    updatedAt: string;
}

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    attachments?: Array<{ type: string; url: string }>;
    createdAt?: string;
}


export const aiService = {
    createConversation: async (title?: string) => {
        const res = await axios.post(`${API_URL}/conversations`, { title }, { headers: getAuthHeader() });
        return res.data;
    },

    getConversations: async () => {
        const res = await axios.get(`${API_URL}/conversations`, { headers: getAuthHeader() });
        return res.data;
    },

    getMessages: async (conversationId: string) => {
        const res = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, { headers: getAuthHeader() });
        return res.data;
    },

    sendMessage: async (conversationId: string, content: string, attachments: Array<{ type: string; url: string }> = []) => {
        const res = await axios.post(`${API_URL}/message`, { conversationId, content, attachments }, { headers: getAuthHeader() });
        return res.data; // Returns array [userMsg, aiMsg]
    },


    deleteConversation: async (conversationId: string) => {
        await axios.delete(`${API_URL}/conversations/${conversationId}`, { headers: getAuthHeader() });
    }
};
