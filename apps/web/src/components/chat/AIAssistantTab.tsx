import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Copy, RefreshCw, Paperclip, Code, Mic, Trash2, Plus, MessageSquare, Menu, X, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { aiService, AIConversation, AIMessage as ServiceAIMessage } from '../../services/ai.service';
import { format } from 'date-fns';

interface AIMessage extends ServiceAIMessage {
    id?: string;
    isTyping?: boolean;
}

export const AIAssistantTab: React.FC = () => {
    // State
    const [conversations, setConversations] = useState<AIConversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Load
    useEffect(() => {
        loadConversations();

        // Setup Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognizer = new SpeechRecognition();
            recognizer.continuous = false;
            recognizer.interimResults = false;
            recognizer.lang = 'en-US';

            recognizer.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + ' ' + transcript);
                setIsRecording(false);
            };

            recognizer.onerror = () => setIsRecording(false);
            recognizer.onend = () => setIsRecording(false);

            setRecognition(recognizer);
        }
    }, []);

    // Load Conversations
    const loadConversations = async () => {
        try {
            const data = await aiService.getConversations();
            setConversations(data);
            if (data.length > 0 && !currentConversation) {
                selectConversation(data[0]);
            } else if (data.length === 0) {
                createNewConversation(); // Auto create first one
            }
        } catch (err) {
            console.error('Failed to load conversations', err);
        }
    };

    // Select Conversation
    const selectConversation = async (conv: AIConversation) => {
        setCurrentConversation(conv);
        setMessages([]); // Clear current
        try {
            const msgs = await aiService.getMessages(conv._id);
            setMessages(msgs);
            if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close on mobile
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    };

    // Create New Conversation
    const createNewConversation = async () => {
        try {
            const newConv = await aiService.createConversation('New Chat');
            setConversations([newConv, ...conversations]);
            setCurrentConversation(newConv);
            setMessages([]);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
        } catch (err) {
            console.error('Failed to create conversation', err);
        }
    };

    // Delete Conversation
    const deleteConversation = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this conversation?')) return;
        try {
            await aiService.deleteConversation(id);
            const remaining = conversations.filter(c => c._id !== id);
            setConversations(remaining);
            if (currentConversation?._id === id) {
                if (remaining.length > 0) selectConversation(remaining[0]);
                else createNewConversation();
            }
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    // Scroll to Bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Send Message
    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !currentConversation) return;

        const content = input;
        setInput('');
        setIsTyping(true);

        // Optimistic update
        const tempMsg: AIMessage = { role: 'user', content, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const [userMsg, aiMsg] = await aiService.sendMessage(currentConversation._id, content);
            // Replace optimistic with real
            setMessages(prev => [...prev.slice(0, -1), userMsg, aiMsg]);

            // Speak response if enabled (simple logic)
            // speak(aiMsg.content); 
        } catch (err) {
            console.error('Failed to send message', err);
            setIsTyping(false);
        } finally {
            setIsTyping(false);
        }
    };

    // Voice Input
    const toggleRecording = () => {
        if (!recognition) {
            alert('Voice recognition not supported in this browser.');
            return;
        }
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
            setIsRecording(true);
        }
    };

    // Text to Speech
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                return;
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    // File Upload (Mock)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`File selected: ${file.name} (Upload logic waiting for backend impl)`);
            // In real impl: Upload to backend, get URL, send as attachment
        }
    };

    return (
        <div className="flex h-full bg-white dark:bg-[#080d1a] relative overflow-hidden">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="md:hidden absolute inset-0 bg-black/50 z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.div
                className={`absolute md:relative z-30 w-72 h-full bg-gray-50 dark:bg-[#0f172a] border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-72'}`}
                initial={false}
            >
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="font-bold dark:text-white flex items-center gap-2">
                        <Bot className="text-purple-500" /> Femo AI
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-3">
                    <button
                        onClick={createNewConversation}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl transition-all font-medium shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={18} /> New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                    {conversations.map(conv => (
                        <div
                            key={conv._id}
                            onClick={() => selectConversation(conv)}
                            className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${currentConversation?._id === conv._id ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-500'}`}
                        >
                            <MessageSquare size={18} className={currentConversation?._id === conv._id ? 'text-purple-500' : ''} />
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-medium truncate ${currentConversation?._id === conv._id ? 'text-gray-900 dark:text-white' : ''}`}>
                                    {conv.title}
                                </h3>
                                <p className="text-[10px] text-gray-400">
                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={(e) => deleteConversation(e, conv._id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative w-full">
                {/* Header */}
                <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 bg-white dark:bg-[#080d1a]">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-500">
                            <Menu size={20} />
                        </button>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                {currentConversation?.title || 'Femo AI'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-gray-500">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-8">
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                                <Bot size={40} className="text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">How can I help you?</h2>
                            <p className="max-w-md text-sm">I can help you write code, analyze data, or just have a conversation.</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'
                                        }`}>
                                        {msg.role === 'user' ? (
                                            <span className="text-xs text-white font-bold">ME</span>
                                        ) : (
                                            <Bot size={16} className="text-white" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`p-4 rounded-2xl shadow-sm relative group ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-800'
                                        }`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                            {msg.content}
                                        </div>
                                        <div className={`text-[10px] mt-2 opacity-50 flex items-center gap-3 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            <span>{msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : 'Just now'}</span>
                                            {msg.role === 'assistant' && (
                                                <>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(msg.content)}
                                                        className="hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Copy"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => speak(msg.content)}
                                                        className="hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Speak"
                                                    >
                                                        <Volume2 size={12} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[70%] gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 flex items-center gap-1 shadow-sm">
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-purple-500 rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-purple-500 rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-purple-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-[#080d1a] border-t border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto items-end">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple // Support multi-file
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 mb-0.5 text-gray-400 hover:text-purple-500 hover:bg-gray-50 rounded-xl transition-all"
                            title="Attach File"
                        >
                            <Paperclip size={20} />
                        </button>

                        <div className="flex-1 relative bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus-within:border-purple-500/30 transition-all">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Message Femo AI..."
                                className="w-full bg-transparent border-none px-4 py-3 min-h-[50px] max-h-[150px] resize-none focus:ring-0 dark:text-white transition-all outline-none"
                                rows={1}
                            />
                            <div className="absolute right-2 bottom-2 flex items-center gap-1">
                                <button type="button" className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg transition-colors">
                                    <Code size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleRecording}
                                    className={`p-2 rounded-lg transition-all ${isRecording ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-400 hover:text-blue-500'}`}
                                >
                                    <Mic size={18} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="p-3 mb-0.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isTyping ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400">Femo AI can make mistakes. Consider checking important information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
