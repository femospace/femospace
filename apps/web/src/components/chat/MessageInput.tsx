import React, { useRef, useState } from 'react';
import { Paperclip, Send, Mic, Smile, X } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (text: string, file?: File) => void;
    onTyping: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !file) return;

        onSendMessage(text, file || undefined);
        setText('');
        setFile(null);
        onTyping(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        onTyping(true);

        // Debounce stop typing (handled in parent usually, but emit true here)
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-gray-100 dark:border-gray-800">
            {/* File Preview */}
            {file && (
                <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                    <span className="text-sm truncate max-w-[200px] text-blue-600 font-medium">{file.name}</span>
                    <button onClick={() => setFile(null)} className="p-1 hover:bg-blue-100 rounded-full text-blue-500">
                        <X size={14} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-5xl mx-auto">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-50 rounded-xl transition-all"
                >
                    <Paperclip size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={text}
                        onChange={handleChange}
                        onBlur={() => onTyping(false)}
                        placeholder="Type a message..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all text-sm outline-none"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500">
                        <Smile size={20} />
                    </button>
                </div>

                {text || file ? (
                    <button
                        type="submit"
                        className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                        <Send size={20} />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl flex items-center justify-center hover:bg-gray-200"
                    >
                        <Mic size={20} />
                    </button>
                )}
            </form>
        </div>
    );
};
