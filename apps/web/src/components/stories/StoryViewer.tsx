import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

interface StoryViewerProps {
    ownerId: string;
    initialStoryId?: string;
    onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ ownerId, initialStoryId, onClose }) => {
    const navigate = useNavigate();
    const [stories, setStories] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [audioPlaying, setAudioPlaying] = useState(true);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchStories();
    }, [ownerId]);

    useEffect(() => {
        if (stories.length > 0) {
            const currentStory = stories[currentIndex];
            const duration = currentStory?.media?.duration || 5;

            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + (100 / (duration * 10));
                });
            }, 100);

            return () => clearInterval(timer);
        }
    }, [currentIndex, stories]);

    // Handle music playback
    useEffect(() => {
        if (stories.length > 0 && currentIndex < stories.length) {
            const currentStory = stories[currentIndex];

            // Stop previous audio
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
            }

            // Play new audio if exists
            if (currentStory.music?.url) {
                const audio = new Audio(currentStory.music.url);
                audio.volume = currentStory.music.volume || 0.7;
                audio.currentTime = currentStory.music.startAt || 0;

                if (audioPlaying) {
                    audio.play().catch(err => console.error('Audio play failed:', err));
                }

                setAudioElement(audio);

                return () => {
                    audio.pause();
                    audio.currentTime = 0;
                };
            }
        }
    }, [currentIndex, stories]);

    useEffect(() => {
        if (audioElement) {
            if (audioPlaying) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }
    }, [audioPlaying, audioElement]);

    const fetchStories = async () => {
        try {
            const { data } = await api.get(`/stories/feed`);
            const group = data.find((g: any) => String(g.owner._id) === String(ownerId));

            if (group && group.stories?.length > 0) {
                setStories(group.stories);

                // Find initial story index if provided
                if (initialStoryId) {
                    const idx = group.stories.findIndex((s: any) => s._id === initialStoryId);
                    if (idx !== -1) setCurrentIndex(idx);
                }

                // Mark first story as viewed
                if (group.stories[0]?._id) {
                    markAsViewed(group.stories[0]._id);
                }
            } else {
                console.warn('No stories found for owner:', ownerId);
                onClose();
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch stories:', err);
            onClose();
        }
    };

    const markAsViewed = async (storyId: string) => {
        try {
            await api.post(`/stories/${storyId}/view`);
        } catch (err) {
            console.error('Failed to mark story as viewed:', err);
        }
    };

    const handleNext = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
            markAsViewed(stories[currentIndex + 1]._id);
        } else {
            onClose();
        }
    }, [currentIndex, stories, onClose]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    }, [currentIndex]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') onClose();
        if (e.key === ' ') {
            e.preventDefault();
            setProgress(prev => prev);
        }
    }, [handleNext, handlePrev, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    if (loading || stories.length === 0) return null;

    const EFFECTS_MAP: Record<string, string> = {
        none: 'none',
        sepia: 'sepia(0.8)',
        grayscale: 'grayscale(1)',
        warm: 'saturate(1.5) sepia(0.2)',
        cool: 'hue-rotate(180deg) saturate(0.8)',
        soft: 'brightness(1.1) contrast(0.9) blur(0.5px)',
    };

    const currentStory = stories[currentIndex];
    const owner = currentStory.ownerId;
    const overlays = currentStory.content?.overlays || [];
    const filter = EFFECTS_MAP[currentStory.content?.effect || 'none'] || 'none';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-[450px] aspect-[9/16] bg-gray-900 overflow-hidden sm:rounded-2xl">
                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                    {stories.map((_, i) => (
                        <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{
                                    width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%'
                                }}
                                transition={{ duration: 0 }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => {
                            onClose();
                            navigate(`/profile/${owner?.username}`);
                        }}
                    >
                        <img
                            src={owner?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner?.username}`}
                            className="w-10 h-10 rounded-full border border-white/20"
                            alt="Avatar"
                        />
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{owner?.username || 'Femo User'}</span>
                            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">
                                Active now
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentStory.music?.url && (
                            <button
                                onClick={() => setAudioPlaying(!audioPlaying)}
                                className="p-2 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full"
                            >
                                {audioPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-white/80 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Media */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {currentStory.media.type === 'video' ? (
                        <video
                            src={currentStory.media.url}
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                            style={{ filter }}
                        />
                    ) : (
                        <img
                            src={currentStory.media.url}
                            className="w-full h-full object-cover"
                            alt="Story"
                            style={{ filter }}
                        />
                    )}

                    {/* Overlays Rendering */}
                    {overlays.map((ov: any) => (
                        <div
                            key={ov.id}
                            className="absolute pointer-events-none select-none z-10"
                            style={{
                                left: `${ov.x}%`,
                                top: `${ov.y}%`,
                                transform: 'translate(-50%, -50%)',
                                ...ov.style
                            }}
                        >
                            {ov.value}
                        </div>
                    ))}
                </div>

                {/* Music Info */}
                {currentStory.music?.title && (
                    <div className="absolute bottom-20 left-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Volume2 size={20} className="text-white" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-white font-bold text-sm truncate">{currentStory.music.title}</div>
                            <div className="text-white/60 text-xs truncate">{currentStory.music.artist || 'Unknown Artist'}</div>
                        </div>
                    </div>
                )}

                {/* Tap Targets */}
                <div className="absolute inset-0 flex">
                    <div className="flex-1 cursor-pointer" onClick={handlePrev} />
                    <div className="flex-1 cursor-pointer" onClick={handleNext} />
                </div>

                {/* Footer Interaction */}
                <div className="absolute bottom-6 left-4 right-4 z-20 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-3 px-6 text-white placeholder-white/60 text-sm focus:ring-1 focus:ring-white/40 outline-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="absolute right-2 top-1.5 p-1.5 text-white/80 hover:text-white">
                            <Send size={18} />
                        </button>
                    </div>
                    <button className="text-white hover:scale-110 transition-transform">
                        <Heart size={28} />
                    </button>
                    <button className="text-white">
                        <MoreHorizontal size={28} />
                    </button>
                </div>
            </div>

            {/* Side Navigation for Desktop */}
            <button
                onClick={handlePrev}
                className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md items-center justify-center text-white transition-all disabled:opacity-0"
                disabled={currentIndex === 0}
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={handleNext}
                className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md items-center justify-center text-white transition-all"
            >
                <ChevronRight size={32} />
            </button>
        </motion.div>
    );
};
