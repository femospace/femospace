import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { chatService, Chat as ChatType, Message } from '../services/chat.service';
import Peer from 'simple-peer';
import { MessageSquare, Bot, Camera } from 'lucide-react';

// Components
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMain } from '../components/chat/ChatMain';
import { CallOverlay } from '../components/chat/CallOverlay';
import { AIAssistantTab } from '../components/chat/AIAssistantTab';
import { CameraTab } from '../components/chat/CameraTab';

type TabType = 'messages' | 'ai' | 'camera';

export const Chat = () => {
    const { user } = useAuth();
    const { socket } = useSocket();

    // Tab State
    const [activeTab, setActiveTab] = useState<TabType>('messages');

    // Chat UI State
    const [chats, setChats] = useState<ChatType[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<string, string | null>>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    // Call State
    const [callData, setCallData] = useState<{
        active: boolean;
        incoming: boolean;
        peer?: Peer.Instance;
        stream?: MediaStream;
        remoteStream?: MediaStream;
        type: 'voice' | 'video';
        otherUser?: any;
        isMuted: boolean;
        isVideoOff: boolean;
    }>({
        active: false,
        incoming: false,
        type: 'voice',
        isMuted: false,
        isVideoOff: false
    });

    // Routing Logic
    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/chat/ai')) setActiveTab('ai');
        else if (path.includes('/chat/camera')) setActiveTab('camera');
        else setActiveTab('messages');
    }, []);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        const url = tab === 'messages' ? '/chat' : `/chat/${tab}`;
        window.history.pushState({}, '', url);
    };

    const initializeSupportChat = async () => {
        try {
            const supportChat = await chatService.createSupportChat();
            if (supportChat) {
                setChats(prev => {
                    const exists = prev.find(c => c._id === supportChat._id);
                    if (exists) return prev;
                    return [supportChat, ...prev];
                });
                setSelectedChat(supportChat);
                // Clear the URL parameter so it doesn't re-trigger
                window.history.replaceState({}, '', '/chat');
            }
        } catch (err) {
            console.error('Failed to initialize support chat:', err);
        }
    };

    // --- Chat Logic (Preserved) ---
    useEffect(() => {
        fetchChats().then(() => {
            const queryParams = new URLSearchParams(window.location.search);
            if (queryParams.get('support') === 'true') {
                initializeSupportChat();
            }
        });
    }, []);

    useEffect(() => {
        if (socket && chats.length > 0) {
            chats.forEach(chat => {
                socket.emit('join_chat', { chatId: chat._id });
            });
        }
    }, [socket, chats]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat._id);
            socket?.emit('join_chat', { chatId: selectedChat._id });
            chatService.markAsSeen(selectedChat._id);
        }
    }, [selectedChat, socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_message', (message: Message) => {
            if (selectedChat && message.chatId === selectedChat._id) {
                setMessages(prev => [...prev, message]);
                chatService.markAsSeen(selectedChat._id);
            } else {
                updateChatLastMessage(message);
            }
        });

        socket.on('user_typing', (data: { chatId: string, userId: string, isTyping: boolean }) => {
            setTypingUsers(prev => ({
                ...prev,
                [data.chatId]: data.isTyping ? data.userId : null
            }));
        });

        socket.on('presence_update', (data: { userId: string, status: string }) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                if (data.status === 'online') newSet.add(data.userId);
                else newSet.delete(data.userId);
                return newSet;
            });
        });

        socket.on('incoming_call', (data: { fromUserId: string, signal: any, type: 'voice' | 'video' }) => {
            const sender = chats.flatMap(c => c.participants).find(p => p._id === data.fromUserId);

            setCallData({
                active: true,
                incoming: true,
                type: data.type,
                otherUser: sender || { _id: data.fromUserId, firstName: 'Unknown', lastName: 'Caller', avatarUrl: '' },
                isMuted: false,
                isVideoOff: false
            });
            (window as any).incomingSignal = data.signal;
        });

        socket.on('call_accepted', (data: { signal: any }) => {
            callData.peer?.signal(data.signal);
        });

        socket.on('call_ended', () => {
            endCallCleanup();
        });

        return () => {
            socket.off('new_message');
            socket.off('user_typing');
            socket.off('presence_update');
            socket.off('incoming_call');
            socket.off('call_accepted');
            socket.off('call_ended');
        };
    }, [socket, selectedChat, chats, callData.peer]);

    const updateChatLastMessage = (message: Message) => {
        setChats(prev => prev.map(c =>
            c._id === message.chatId
                ? {
                    ...c,
                    lastMessage: {
                        text: message.content,
                        senderId: message.senderId,
                        type: message.type,
                        createdAt: message.createdAt
                    },
                    unreadCounts: {
                        ...c.unreadCounts,
                        [user?.id || (user as any)._id]: (c.unreadCounts[user?.id || (user as any)._id] || 0) + 1
                    }
                }
                : c
        ).sort((a, b) => new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime()));
    };

    const fetchChats = async () => {
        try {
            const data = await chatService.getChats();
            setChats(data || []);
        } catch (err) {
            console.error('Fetch Chats Error:', err);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const data = await chatService.getMessages(chatId);
            setMessages((data || []).reverse());
        } catch (err) {
            console.error('Fetch Messages Error:', err);
        }
    };

    const handleSendMessage = async (text: string, file?: File) => {
        if (!selectedChat) return;

        try {
            let metadata = {};
            let type = 'text';

            if (file) {
                const uploadRes = await chatService.uploadFile(file);
                metadata = {
                    fileName: uploadRes.fileName,
                    fileUrl: uploadRes.url,
                    fileSize: uploadRes.size,
                    mimeType: uploadRes.mimetype
                };
                type = file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' :
                        file.type.startsWith('audio/') ? 'audio' : 'file';
            }

            const msgData = {
                chatId: selectedChat._id,
                senderId: user?.id || (user as any)._id,
                content: text || (file ? `Sent a ${type}` : ''),
                type,
                metadata
            };

            socket?.emit('send_message', msgData);
        } catch (error) {
            console.error('Send message failed', error);
        }
    };

    const handleTyping = (isTyping: boolean) => {
        if (!selectedChat) return;
        socket?.emit('typing', {
            chatId: selectedChat._id,
            userId: user?.id || (user as any)._id,
            isTyping
        });
    };

    // --- Call Logic ---

    const initiateCall = async (type: 'voice' | 'video') => {
        if (!selectedChat) return;
        const otherParticipant = selectedChat.participants.find(p => p._id !== (user?.id || (user as any)._id));
        if (!otherParticipant) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream
            });

            peer.on('signal', signal => {
                socket?.emit('call_user', {
                    toUserId: otherParticipant._id,
                    fromUserId: user?.id || (user as any)._id,
                    chatId: selectedChat._id,
                    type,
                    signal
                });
            });

            peer.on('stream', remoteStream => {
                setCallData(prev => ({ ...prev, remoteStream }));
            });

            setCallData({
                active: true,
                incoming: false,
                peer,
                stream,
                type,
                otherUser: otherParticipant,
                isMuted: false,
                isVideoOff: false
            });
        } catch (err) {
            console.error('Failed to access media devices', err);
            alert('Could not access camera/microphone');
        }
    };

    const answerCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: callData.type === 'video' });

            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream
            });

            peer.on('signal', signal => {
                socket?.emit('answer_call', {
                    toUserId: callData.otherUser._id || callData.otherUser,
                    signal
                });
            });

            peer.on('stream', remoteStream => {
                setCallData(prev => ({ ...prev, remoteStream }));
            });

            peer.signal((window as any).incomingSignal);
            setCallData(prev => ({ ...prev, incoming: false, peer, stream }));
        } catch (err) {
            console.error('Error answering call', err);
        }
    };

    const endCallCleanup = () => {
        callData.peer?.destroy();
        callData.stream?.getTracks().forEach(track => track.stop());
        setCallData(prev => ({ ...prev, active: false, incoming: false, stream: undefined, remoteStream: undefined, peer: undefined }));
    };

    const endCall = () => {
        socket?.emit('end_call', { chatId: selectedChat?._id, toUserId: callData.otherUser._id || callData.otherUser });
        endCallCleanup();
    };

    const toggleMute = () => {
        if (callData.stream) {
            callData.stream.getAudioTracks().forEach(track => track.enabled = !callData.isMuted);
            setCallData(prev => ({ ...prev, isMuted: !prev.isMuted }));
        }
    };

    const toggleVideo = () => {
        if (callData.stream) {
            callData.stream.getVideoTracks().forEach(track => track.enabled = !callData.isVideoOff);
            setCallData(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
        }
    };

    const handleCreateGroup = async () => {
        const name = prompt("Enter group name:");
        if (name) {
            try {
                await chatService.createGroup({ name, participants: [] });
                fetchChats();
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-[#0f172a] overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f172a] shrink-0">
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button
                        onClick={() => handleTabChange('messages')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'messages' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'
                            }`}
                    >
                        <MessageSquare size={16} />
                        <span className="hidden md:inline">Messages</span>
                    </button>
                    <button
                        onClick={() => handleTabChange('ai')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'ai' ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600' : 'text-gray-500'
                            }`}
                    >
                        <Bot size={16} />
                        <span className="hidden md:inline">AI Assistant</span>
                    </button>
                    <button
                        onClick={() => handleTabChange('camera')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'camera' ? 'bg-white dark:bg-gray-700 shadow-sm text-yellow-500' : 'text-gray-500'
                            }`}
                    >
                        <Camera size={16} />
                        <span className="hidden md:inline">Camera</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {/* Messages Tab (Always Mounted but Hidden) */}
                <div
                    className="absolute inset-0 flex"
                    style={{
                        visibility: activeTab === 'messages' ? 'visible' : 'hidden',
                        opacity: activeTab === 'messages' ? 1 : 0,
                        zIndex: activeTab === 'messages' ? 10 : 0
                    }}
                >
                    <ChatSidebar
                        chats={chats}
                        selectedChatId={selectedChat?._id || null}
                        onSelectChat={setSelectedChat}
                        typingUsers={typingUsers}
                        onlineUsers={onlineUsers}
                        onCreateGroup={handleCreateGroup}
                    />
                    <div className={`flex-1 flex overflow-hidden ${!selectedChat ? 'hidden md:flex' : 'flex z-20 absolute inset-0 md:static bg-white'}`}>
                        <ChatMain
                            selectedChat={selectedChat}
                            messages={messages}
                            typingUser={selectedChat ? typingUsers[selectedChat._id] : null}
                            onBack={() => setSelectedChat(null)}
                            onSendMessage={handleSendMessage}
                            onCall={initiateCall}
                            onTyping={handleTyping}
                        />
                    </div>
                </div>

                {/* AI Tab (Lazy Load / Conditional) */}
                {activeTab === 'ai' && (
                    <div className="absolute inset-0 z-20 bg-white dark:bg-[#0f172a]">
                        <AIAssistantTab />
                    </div>
                )}

                {/* Camera Tab (Lazy Load / Conditional) */}
                {activeTab === 'camera' && (
                    <div className="absolute inset-0 z-30 bg-black">
                        <CameraTab />
                    </div>
                )}
            </div>

            {/* Call Overlay (Global) */}
            <CallOverlay
                isActive={callData.active}
                isIncoming={callData.incoming}
                type={callData.type}
                callerName={callData.otherUser?.firstName || 'Unknown'}
                callerImage={callData.otherUser?.avatarUrl || ''}
                localStream={callData.stream}
                remoteStream={callData.remoteStream}
                onAnswer={answerCall}
                onReject={endCall}
                onEnd={endCall}
                onToggleMute={toggleMute}
                onToggleVideo={toggleVideo}
                isMuted={callData.isMuted}
                isVideoOff={callData.isVideoOff}
            />
        </div>
    );
};
