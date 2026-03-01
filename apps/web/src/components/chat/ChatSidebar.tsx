import React, { useState } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import { Chat } from '../../services/chat.service';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface ChatSidebarProps {
    chats: Chat[];
    selectedChatId: string | null;
    onSelectChat: (chat: Chat) => void;
    typingUsers: Record<string, string | null>;
    onlineUsers: Set<string>;
    onCreateGroup: () => void;
}

type FilterType = 'all' | 'unread' | 'groups' | 'channels';

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    selectedChatId,
    onSelectChat,
    typingUsers,
    onlineUsers,
    onCreateGroup
}) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const getOtherParticipant = (chat: Chat) => {
        if (!chat.participants) return null;
        // Logic to find other participant in 1:1 chat
        // Assuming current user is in participants, find the one that isn't me
        const currentUserId = user?.id || (user as any)._id;
        return chat.participants.find(p => p._id !== currentUserId) || chat.participants[0];
    };

    const getChatName = (chat: Chat) => {
        if (chat.name) return chat.name;
        const other = getOtherParticipant(chat);
        return other ? `${other.firstName} ${other.lastName}` : 'Unknown Chat';
    };

    const getChatImage = (chat: Chat) => {
        if (chat.avatar) return chat.avatar;
        const other = getOtherParticipant(chat);
        return other?.avatarUrl || `https://i.pravatar.cc/150?u=${other?._id}`;
    };

    const filteredChats = chats.filter(chat => {
        // Search Filter
        const name = getChatName(chat).toLowerCase();
        const matchesSearch = name.includes(searchTerm.toLowerCase());

        // Type Filter
        if (!matchesSearch) return false;

        switch (activeFilter) {
            case 'unread':
                return (chat.unreadCounts?.[user?.id || (user as any)._id] || 0) > 0;
            case 'groups':
                return chat.type === 'group';
            case 'channels':
                return chat.type === 'channel';
            default:
                return true;
        }
    });

    return (
        <div className={`w-full md:w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-white dark:bg-[#0f172a] ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 pt-6">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h1 className="text-2xl font-black dark:text-white">Messages</h1>
                    <button
                        onClick={onCreateGroup}
                        className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                        title="Create New Group"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search chats..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all outline-none"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'unread', label: 'Unread' },
                        { id: 'groups', label: 'Groups' },
                        { id: 'channels', label: 'Channels' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id as FilterType)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeFilter === f.id
                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2 pb-20">
                {filteredChats.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-sm">No conversations found</p>
                    </div>
                ) : (
                    filteredChats.map(chat => {
                        const other = getOtherParticipant(chat);
                        const isTyping = typingUsers[chat._id];
                        const isOnline = other && onlineUsers.has(other._id);
                        const unread = chat.unreadCounts?.[user?.id || (user as any)._id] || 0;

                        return (
                            <div
                                key={chat._id}
                                onClick={() => onSelectChat(chat)}
                                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all mb-1 ${selectedChatId === chat._id
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                                    }`}
                            >
                                <div className="relative">
                                    <img src={getChatImage(chat)} className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                                    {chat.type === 'direct' && isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                                    )}
                                    {chat.type === 'group' && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                                            <Users size={10} className="text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm">
                                            {getChatName(chat)}
                                        </h3>
                                        <span className={`text-[10px] font-medium ${unread > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {chat.lastMessage ? format(new Date(chat.lastMessage.createdAt), 'HH:mm') : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                                        {isTyping ? (
                                            <span className="text-blue-500 italic font-medium">Typing...</span>
                                        ) : (
                                            <>
                                                {chat.lastMessage?.senderId === (user?.id || (user as any)._id) && <span className="opacity-70">You: </span>}
                                                {chat.lastMessage?.text || (chat.lastMessage ? `Sent a ${chat.lastMessage.type}` : 'No messages yet')}
                                            </>
                                        )}
                                    </p>
                                </div>
                                {unread > 0 && (
                                    <div className="min-w-[20px] h-5 px-1.5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-blue-500/30">
                                        {unread > 99 ? '99+' : unread}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
