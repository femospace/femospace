import React from 'react';
import { Download, Play, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Message } from '../../services/chat.service';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    onReply?: (message: Message) => void;
    onDelete?: (messageId: string) => void;
    onStar?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {

    // Helper to render content based on type
    const renderContent = () => {
        switch (message.type) {
            case 'text':
                return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;

            case 'image':
                return (
                    <div className="rounded-lg overflow-hidden max-w-[300px] mb-1">
                        <img src={message.metadata?.fileUrl || message.content} alt="Shared image" className="w-full h-auto object-cover" />
                    </div>
                );

            case 'video':
                return (
                    <div className="rounded-lg overflow-hidden max-w-[300px] mb-1">
                        <video controls src={message.metadata?.fileUrl || message.content} className="w-full h-auto" />
                    </div>
                );

            case 'audio':
            case 'voice':
                return (
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
                            <Play size={16} fill="currentColor" />
                        </div>
                        <div className="flex-1 h-1 bg-white/20 rounded-full">
                            <div className="w-1/3 h-full bg-white rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-mono">{message.metadata?.duration ? format(new Date(message.metadata.duration * 1000), 'mm:ss') : '00:00'}</span>
                    </div>
                );

            case 'file':
            case 'document':
                return (
                    <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 max-w-[250px]">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                            <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{message.metadata?.fileName || 'Document'}</p>
                            <p className="text-[10px] opacity-70">{message.metadata?.fileSize ? (message.metadata.fileSize / 1024 / 1024).toFixed(2) + ' MB' : ''}</p>
                        </div>
                        <a href={message.metadata?.fileUrl} download target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/5 rounded-full transition-all">
                            <Download size={16} />
                        </a>
                    </div>
                );

            case 'location':
                // Mock map preview
                return (
                    <div className="rounded-lg overflow-hidden max-w-[250px]">
                        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                            <MapPin className="text-red-500" size={32} fill="currentColor" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                                <p className="text-white text-xs font-bold truncate">Location Shared</p>
                            </div>
                        </div>
                        <button className="w-full p-2 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-center hover:bg-gray-100 transition-all">Open in Maps</button>
                    </div>
                );

            default:
                return <p className="text-sm italic text-red-400">Unsupported message type: {message.type}</p>;
        }
    };

    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                relative max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm group
                ${isMe
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-800'
                }
            `}>
                {/* Content */}
                <div className="mb-1">
                    {renderContent()}
                </div>

                {/* Footer Meta */}
                <div className={`flex items-center gap-1.5 mt-1 select-none ${isMe ? 'justify-end text-blue-100' : 'justify-start text-gray-400'}`}>
                    <span className="text-[10px] font-medium">{format(new Date(message.createdAt), 'HH:mm')}</span>
                    {isMe && (
                        message.status === 'seen'
                            ? <span className="text-blue-200">✓✓</span>
                            : message.status === 'delivered'
                                ? <span className="text-blue-200">✓✓</span>
                                : <span>✓</span>
                    )}
                </div>
            </div>
        </div>
    );
};
