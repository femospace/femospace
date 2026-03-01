import React, { useRef, useEffect } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallOverlayProps {
    isActive: boolean;
    isIncoming: boolean;
    type: 'voice' | 'video';
    callerName: string;
    callerImage: string;
    localStream?: MediaStream;
    remoteStream?: MediaStream;
    onAnswer: () => void;
    onReject: () => void;
    onEnd: () => void;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    isMuted: boolean;
    isVideoOff: boolean;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
    isActive,
    isIncoming,
    type,
    callerName,
    callerImage,
    localStream,
    remoteStream,
    onAnswer,
    onReject,
    onEnd,
    onToggleMute,
    onToggleVideo,
    isMuted,
    isVideoOff
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (!isActive) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-white"
            >
                {/* Caller Info (only if not video, or if video and incoming) */}
                {(type === 'voice' || isIncoming) && (
                    <div className="absolute top-12 flex flex-col items-center text-center z-10">
                        <div className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 mb-6 shadow-2xl shadow-blue-500/20">
                            <img src={callerImage} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <h2 className="text-3xl font-black mb-2">{isIncoming ? 'Incoming Call...' : callerName}</h2>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{type === 'video' ? 'Video Call' : 'Voice Call'}</p>
                        {!isIncoming && <p className="text-gray-400 mt-2 animate-pulse">Calling...</p>}
                    </div>
                )}

                {/* Video Area */}
                {type === 'video' && !isIncoming && (
                    <div className="w-full h-full max-w-5xl relative flex items-center justify-center px-4 py-12">
                        {/* Remote Video (Main) */}
                        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black border border-white/10 shadow-2xl">
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            {!remoteStream && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500">
                                    <p>Waiting for video...</p>
                                </div>
                            )}
                        </div>

                        {/* Local Video (Picture-in-Picture) */}
                        <div className="absolute bottom-32 right-8 w-48 h-64 bg-gray-800 rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl z-20">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                            />
                            {isVideoOff && (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                    <VideoOff size={32} className="text-gray-500" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-12 flex gap-8 items-center z-30">
                    {isIncoming ? (
                        <>
                            <button
                                onClick={onAnswer}
                                className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:bg-green-600 transition-all transform hover:scale-110"
                            >
                                <Phone size={32} />
                            </button>
                            <button
                                onClick={onReject}
                                className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all transform hover:scale-110 rotate-[135deg]"
                            >
                                <Phone size={32} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onToggleMute}
                                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-800/50 text-white hover:bg-gray-800'}`}
                            >
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>

                            <button
                                onClick={onEnd}
                                className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all transform hover:scale-110 rotate-[135deg]"
                            >
                                <Phone size={36} />
                            </button>

                            {type === 'video' && (
                                <button
                                    onClick={onToggleVideo}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isVideoOff ? 'bg-white text-gray-900' : 'bg-gray-800/50 text-white hover:bg-gray-800'}`}
                                >
                                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
