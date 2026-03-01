import React, { useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, ArrowLeft, Paperclip, Send, Smile, Mic } from 'lucide-react';
import { Chat, Message, Participant } from '../../services/chat.service';
import { MessageBubble } from './MessageBubble';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMainProps {
    selectedChat: Chat | null;
    messages: Message[];
    typingUser: string | null;
    onBack?: () => void;
    onSendMessage: (text: string, file?: File) => void;
    onCall: (type: 'voice' | 'video') => void;
    onTyping: (isTyping: boolean) => void;
}

export const ChatMain: React.FC<ChatMainProps> = ({
    selectedChat,
    messages,
    typingUser,
    onBack,
    onSendMessage,
    onCall,
    onTyping
}) => {
    const { user } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = React.useState('');
    const [file, setFile] = React.useState<File | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUser]);

    const getOtherParticipant = (chat: Chat) => {
        if (!chat.participants) return {} as Participant;
        return chat.participants.find(p => p._id !== (user?.id || (user as any)._id)) || chat.participants[0];
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !file) return;
        onSendMessage(inputText, file || undefined);
        setInputText('');
        setFile(null);
        onTyping(false);
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        onTyping(true);
        // Debounce handled in parent or here with timer
    };

    if (!selectedChat) {
        return (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50/30 dark:bg-[#080d1a] text-center p-12">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-6">
                    <div className="text-blue-600">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                </div>
                <h2 className="text-2xl font-black dark:text-white mb-2">Connect with Friends</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">Select a conversation or start a new chat to begin messaging.</p>
            </div>
        );
    }

    const other = getOtherParticipant(selectedChat);
    const title = selectedChat.name || `${other?.firstName || ''} ${other?.lastName || ''}`;
    const defaultAvatar = selectedChat.type === 'support'
        ? '/icons/Favicon.png'
        : `https://i.pravatar.cc/150?u=${other?._id || 'unknown'}`;
    const image = selectedChat.avatar || other?.avatarUrl || defaultAvatar;

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50/30 dark:bg-[#080d1a] relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <img src={image} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold dark:text-white leading-tight text-sm md:text-base">{title}</h2>
                        <p className="text-[11px] text-green-500 font-semibold flex items-center gap-1">
                            {typingUser ? <span className="animate-pulse">Typing...</span> : 'Online'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={() => onCall('voice')} className="p-2 md:p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                        <Phone size={20} />
                    </button>
                    <button onClick={() => onCall('video')} className="p-2 md:p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                        <Video size={20} />
                    </button>
                    <button className="p-2 md:p-2.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-xl">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-2 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                        <p className="text-sm">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <MessageBubble
                            key={msg._id || idx}
                            message={msg}
                            isMe={msg.senderId === (user?.id || (user as any)._id)}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSend} className="flex items-center gap-3 md:gap-4 max-w-5xl mx-auto">
                    <button type="button" className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Paperclip size={22} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleTyping}
                            onBlur={() => onTyping(false)}
                            placeholder="Type a message..."
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all text-sm outline-none"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500">
                            <Smile size={20} />
                        </button>
                    </div>
                    {inputText.trim() || file ? (
                        <button type="submit" className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-105">
                            <Send size={20} />
                        </button>
                    ) : (
                        <button type="button" className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl flex items-center justify-center hover:bg-gray-200 hover:text-gray-700 transition-colors">
                            <Mic size={20} />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
