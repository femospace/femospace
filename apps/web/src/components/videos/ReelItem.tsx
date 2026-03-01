import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Volume2, VolumeX, CheckCircle, UserPlus } from 'lucide-react';

interface ReelProps {
    id: string;
    url: string;
    thumbnailUrl: string;
    creator: {
        name: string;
        avatar: string;
        isVerified: boolean;
        id: string;
    };
    title: string;
    description?: string;
    music?: {
        name: string;
        artist: string;
    };
    metrics: {
        likes: number;
        comments: number;
        shares: number;
        views: string;
    };
    isLiked?: boolean;
    isSaved?: boolean;
    isFollowing?: boolean;
}

interface ReelItemProps {
    reel: ReelProps;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    onLike?: (id: string) => void;
    onComment?: (id: string) => void;
    onShare?: (id: string) => void;
    onSave?: (id: string) => void;
    onFollow?: (userId: string) => void;
}

export const ReelItem: React.FC<ReelItemProps> = ({
    reel,
    isActive,
    isMuted,
    onToggleMute,
    onLike,
    onComment,
    onShare,
    onSave,
    onFollow
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [liked, setLiked] = useState(reel.isLiked || false);
    const [saved, setSaved] = useState(reel.isSaved || false);
    const [hasError, setHasError] = useState(false);

    const reloadVideo = () => {
        if (videoRef.current) {
            setHasError(false);
            videoRef.current.load();
            if (isActive) {
                videoRef.current.play().catch(err => console.error('Play error on reload:', err));
            }
        }
    };

    // Auto-play/pause based on active state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            video.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error('Play error:', err);
                // Handle autoplay block or load error
            });
        } else {
            video.pause();
            setIsPlaying(false);
        }

        const handleError = () => setHasError(true);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('error', handleError);
        };
    }, [isActive]);

    // Update progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const progress = (video.currentTime / video.duration) * 100;
            setProgress(progress);
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => video.removeEventListener('timeupdate', updateProgress);
    }, []);

    const handleDoubleTap = (e: React.MouseEvent) => {
        // Double tap to like
        if (!liked) {
            setLiked(true);
            onLike?.(reel.id);

            // Animate heart
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: absolute;
                font-size: 100px;
                left: ${e.clientX - 50}px;
                top: ${e.clientY - 50}px;
                pointer-events: none;
                animation: heartPop 1s ease-out forwards;
                z-index: 100;
            `;
            e.currentTarget.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }
    };

    const handleTogglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="h-full w-full snap-start relative bg-black overflow-hidden">
            {/* Video */}
            <video
                ref={videoRef}
                src={reel.url}
                poster={reel.thumbnailUrl}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onClick={handleTogglePlay}
                onDoubleClick={handleDoubleTap}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 z-30">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <VolumeX size={40} className="text-white/60" />
                    </div>
                    <p className="text-white font-bold mb-6">Video failed to load</p>
                    <button
                        onClick={reloadVideo}
                        className="bg-white text-black px-8 py-2 rounded-full font-bold active:scale-95 transition-all"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Mute Toggle */}
            <button
                onClick={onToggleMute}
                className="absolute top-24 right-4 bg-black/40 backdrop-blur-md p-3 rounded-full text-white z-20 hover:bg-black/60 transition-all"
            >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>

            {/* Action Buttons (Right Side) */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-5 items-center z-20">
                {/* Creator Avatar */}
                <div className="relative">
                    <img
                        src={reel.creator.avatar}
                        alt={reel.creator.name}
                        className="w-14 h-14 rounded-full border-2 border-white object-cover cursor-pointer"
                    />
                    {!reel.isFollowing && (
                        <button
                            onClick={() => onFollow?.(reel.creator.id)}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg"
                        >
                            <UserPlus size={14} strokeWidth={3} />
                        </button>
                    )}
                </div>

                {/* Like */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => {
                            setLiked(!liked);
                            onLike?.(reel.id);
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${liked ? 'bg-red-500 text-white scale-110' : 'bg-black/30 text-white hover:bg-black/50'
                            }`}
                    >
                        <Heart size={26} fill={liked ? 'white' : 'none'} />
                    </button>
                    <span className="text-white text-xs font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {liked ? reel.metrics.likes + 1 : reel.metrics.likes}
                    </span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => onComment?.(reel.id)}
                        className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all"
                    >
                        <MessageCircle size={26} />
                    </button>
                    <span className="text-white text-xs font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {reel.metrics.comments}
                    </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => onShare?.(reel.id)}
                        className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all"
                    >
                        <Share2 size={26} />
                    </button>
                    <span className="text-white text-xs font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {reel.metrics.shares}
                    </span>
                </div>

                {/* Save */}
                <button
                    onClick={() => {
                        setSaved(!saved);
                        onSave?.(reel.id);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${saved ? 'bg-yellow-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                        }`}
                >
                    <Bookmark size={26} fill={saved ? 'white' : 'none'} />
                </button>

                {/* More */}
                <button className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all">
                    <MoreVertical size={24} />
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute left-4 bottom-20 right-20 text-white z-20">
                <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-base">{reel.creator.name}</span>
                    {reel.creator.isVerified && (
                        <CheckCircle size={16} className="text-blue-400 fill-blue-400" />
                    )}
                </div>

                <p className="text-sm mb-2 line-clamp-2">{reel.description || reel.title}</p>

                {reel.music && (
                    <div className="flex items-center gap-2 text-xs">
                        <span>🎵</span>
                        <span className="truncate">{reel.music.name} • {reel.music.artist}</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-white/20 z-20">
                <motion.div
                    className="h-full bg-white"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Play/Pause Indicator */}
            {!isPlaying && isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
};

// Add animation keyframes to global CSS or inline
const style = document.createElement('style');
style.textContent = `
    @keyframes heartPop {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotate(10deg);
        }
        100% {
            transform: scale(0.8) translateY(-100px) rotate(-10deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
