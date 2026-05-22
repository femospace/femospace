export interface User {
    id: string;
    username: string;
    email: string;
    femoId: string;
    avatar?: string;
    bio?: string;
    role: 'user' | 'creator' | 'moderator' | 'admin';
    status: 'active' | 'suspended' | 'verified' | 'vip';
    isOnboardingCompleted: boolean;
    joinedAt: string;
    wallet_balance?: number;
    total_earnings?: number;
}

export interface Post {
    id: string;
    authorId: string;
    authorUsername: string;
    authorAvatar?: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    likes: number;
    comments: number;
    reports: number;
    createdAt: string;
}

export interface ChatThread {
    id: string;
    participants: string[];
    lastMessage?: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    text: string;
    createdAt: string;
}
