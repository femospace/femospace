import React, { useState, useRef, useEffect } from 'react';
import { X, Radio, Copy, Check, Settings, Users, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

interface GoLiveProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (streamId: string) => void;
}

export const GoLive: React.FC<GoLiveProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState<'setup' | 'streaming' | 'ended'>('setup');
    const [streamKey, setStreamKey] = useState('');
    const [streamId, setStreamId] = useState('');
    const [copied, setCopied] = useState(false);
    const [viewers, setViewers] = useState(0);
    const [chatMessages, setChatMessages] = useState<Array<{ id: string; user: string; message: string }>>([]);
    const [newMessage, setNewMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'public',
        saveAsVideo: true
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (step === 'streaming' && videoRef.current && !localStream) {
            // Start preview camera
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setLocalStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error('Camera access error:', err));
        }

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [step]);

    // Simulate viewer count updates
    useEffect(() => {
        if (step === 'streaming') {
            const interval = setInterval(() => {
                setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 4));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const generateStreamKey = async () => {
        try {
            const { data } = await api.post('/videos/live/start', {
                title: formData.title,
                description: formData.description,
                visibility: formData.visibility,
                saveAsVideo: formData.saveAsVideo
            });

            setStreamKey(data.streamKey);
            setStreamId(data.streamId);
            return data.streamKey;
        } catch (error) {
            console.error('Failed to generate stream key:', error);
            throw error;
        }
    };

    const handleGoLive = async () => {
        try {
            await generateStreamKey();
            setStep('streaming');
            setViewers(1);
            onSuccess?.(streamId);
        } catch (error) {
            alert('Failed to start stream. Please try again.');
        }
    };

    const handleEndStream = async () => {
        try {
            await api.post(`/videos/live/${streamId}/end`);

            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }

            setStep('ended');

            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (error) {
            console.error('Failed to end stream:', error);
        }
    };

    const handleCopyStreamKey = () => {
        navigator.clipboard.writeText(streamKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now().toString(),
            user: 'You',
            message: newMessage
        };

        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const handleClose = () => {
        if (step === 'streaming') {
            if (!confirm('Are you sure you want to end the stream?')) {
                return;
            }
            handleEndStream();
        }

        setStep('setup');
        setStreamKey('');
        setStreamId('');
        setChatMessages([]);
        setFormData({
            title: '',
            description: '',
            visibility: 'public',
            saveAsVideo: true
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={step !== 'streaming' ? handleClose : undefined}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`bg-neutral-900 rounded-2xl w-full max-h-[90vh] overflow-y-auto ${step === 'streaming' ? 'max-w-6xl' : 'max-w-2xl'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${step === 'streaming' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                                <h2 className="text-2xl font-bold text-white">
                                    {step === 'setup' && 'Go Live'}
                                    {step === 'streaming' && 'Live Streaming'}
                                    {step === 'ended' && 'Stream Ended'}
                                </h2>
                                {step === 'streaming' && (
                                    <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        <Radio size={14} />
                                        LIVE
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-all text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Setup Step */}
                        {step === 'setup' && (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">
                                        Stream Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500"
                                        placeholder="What's your stream about?"
                                    />
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500 resize-none"
                                        placeholder="Tell viewers what to expect"
                                    />
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">
                                        Privacy
                                    </label>
                                    <select
                                        value={formData.visibility}
                                        onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                    >
                                        <option value="public">Public - Anyone can watch</option>
                                        <option value="unlisted">Unlisted - Only with link</option>
                                        <option value="private">Private - Only you</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="saveAsVideo"
                                        checked={formData.saveAsVideo}
                                        onChange={(e) => setFormData({ ...formData, saveAsVideo: e.target.checked })}
                                        className="w-5 h-5 accent-red-600"
                                    />
                                    <label htmlFor="saveAsVideo" className="text-white text-sm flex-1">
                                        Save stream as video after ending (recommended)
                                    </label>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                        <Settings size={18} />
                                        Streaming Software Setup
                                    </h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        Use OBS Studio or similar software to stream:
                                    </p>
                                    <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                                        <li>Server: rtmp://stream.femospace.com/live</li>
                                        <li>Stream key will be generated after you start</li>
                                        <li>Recommended: 1080p @ 30fps, 4500 kbps</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleGoLive}
                                    disabled={!formData.title}
                                    className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Radio size={24} />
                                    Go Live
                                </button>
                            </div>
                        )}

                        {/* Streaming Step */}
                        {step === 'streaming' && (
                            <div className="flex flex-col md:flex-row h-[600px]">
                                {/* Video Preview */}
                                <div className="flex-1 bg-black relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-contain"
                                    />

                                    {/* Stream Info Overlay */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg">
                                            <div className="text-white font-bold">{formData.title}</div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {viewers} watching
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleEndStream}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                                        >
                                            End Stream
                                        </button>
                                    </div>

                                    {/* Stream Key */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg">
                                        <div className="text-white text-sm font-semibold mb-2">Stream Key (Keep Private)</div>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 bg-white/10 px-3 py-2 rounded text-white font-mono text-xs">
                                                {streamKey}
                                            </code>
                                            <button
                                                onClick={handleCopyStreamKey}
                                                className="p-2 bg-white/10 hover:bg-white/20 rounded transition-all text-white"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Panel */}
                                <div className="w-full md:w-80 flex flex-col border-l border-white/10">
                                    <div className="p-4 border-b border-white/10">
                                        <h3 className="text-white font-bold flex items-center gap-2">
                                            <MessageCircle size={18} />
                                            Live Chat
                                        </h3>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {chatMessages.map(msg => (
                                            <div key={msg.id} className="text-sm">
                                                <span className="font-semibold text-blue-400">{msg.user}: </span>
                                                <span className="text-white">{msg.message}</span>
                                            </div>
                                        ))}
                                        {chatMessages.length === 0 && (
                                            <p className="text-gray-500 text-center text-sm">No messages yet</p>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-white/10">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Send a message..."
                                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-red-500"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ended Step */}
                        {step === 'ended' && (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check size={48} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Stream Ended</h3>
                                <p className="text-gray-400 mb-4">Total viewers: {viewers}</p>
                                {formData.saveAsVideo && (
                                    <p className="text-gray-400 text-sm">Your stream has been saved as a video</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
