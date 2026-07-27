import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Heart,
    MessageCircle,
    Share2,
    Music,
    Play,
    Pause,
    ChevronDown,
    Filter,
    Search,
    Video as VideoIcon,
    Radio,
    Upload,
    MoreVertical,
    Volume2,
    VolumeX,
    Maximize,
    Flame,
    Clock,
    UserPlus,
    CheckCircle2,
    Bookmark,
    Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

interface Video {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    type: 'reel' | 'video' | 'live';
    creator: {
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        isVerified?: boolean;
    };
    likes: string[];
    commentsCount: number;
    sharesCount: number;
    views: number;
    musicName?: string;
    isLive?: boolean;
    viewerCount?: number;
    createdAt: string;
}

export const Videos = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState<'reels' | 'videos' | 'live'>('reels');
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

    useEffect(() => {
        fetchVideos(activeTab);
    }, [activeTab]);

    const fetchVideos = async (type: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/videos?type=${type}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setVideos(data);
            }
        } catch (err) {
            console.error('Fetch videos error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (videoId: string) => {
        try {
            await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVideos(prev => prev.map(v => {
                if (v._id === videoId) {
                    const liked = v.likes.includes(user?.id || '');
                    return {
                        ...v,
                        likes: liked
                            ? v.likes.filter(id => id !== user?.id)
                            : [...v.likes, user?.id || '']
                    };
                }
                return v;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const tabs = [
        { id: 'reels', label: t('video.reels', 'Reels'), icon: Play },
        { id: 'videos', label: t('video.videos', 'Videos'), icon: VideoIcon },
        { id: 'live', label: t('video.live', 'Live'), icon: Radio },
    ];

    return (
        <div className="flex flex-col h-screen bg-[#000] overflow-hidden">
            {/* Navigation Header */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg animate-pulse">
                            <Radio size={18} />
                            <span>{t('video.goLive', 'Go Live')}</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-md border border-white/10 transition-all">
                            <Upload size={18} />
                            <span>{t('video.upload', 'Upload')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {activeTab === 'reels' ? (
                    <div className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
                        {loading && videos.length === 0 ? (
                            <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
                                <div className="space-y-4 text-center">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">{t('auth.common.loading', 'Loading...')}</p>
                                </div>
                            </div>
                        ) : (
                            videos.map((video, index) => (
                                <ReelItem
                                    key={video._id}
                                    video={video}
                                    isMuted={muted}
                                    onToggleMute={() => setMuted(!muted)}
                                    onLike={() => toggleLike(video._id)}
                                    isLiked={video.likes.includes(user?.id || '')}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto bg-[#0a0f1a] p-4 md:p-8 pt-24">
                        <div className="max-w-7xl mx-auto space-y-10">
                            {/* Featured Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {activeTab === 'videos' ? t('video.videos', 'Videos') : t('video.live', 'Live')}
                                    </h2>
                                    <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><Filter size={20} /></button>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder={t('marketplace.searchPlaceholder', 'Search...')}
                                            className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white w-full md:w-64"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Grid Layout */}
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
                                    ))}
                                </div>
                            ) : videos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {videos.map(video => (
                                        <VideoCard key={video._id} video={video} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 text-center space-y-6">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                                        <VideoIcon size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-bold text-white uppercase tracking-wider">{t('video.noContent', 'No content found')}</p>
                                        <p className="text-gray-500 max-w-xs mx-auto">{t('video.noContentSubtitle', { type: activeTab === 'videos' ? 'videos' : 'live streams' })}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ReelItem = ({ video, isMuted, onToggleMute, onLike, isLiked }: any) => {
    const { t } = useTranslation();
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Autoplay when reel is visible in viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().then(() => setPlaying(true)).catch(() => {});
                } else {
                    videoRef.current?.pause();
                    setPlaying(false);
                }
            },
            { threshold: 0.6 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
    };

    return (
        <div ref={containerRef} className="h-full w-full snap-start relative bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                src={video.videoUrl}
                className="h-full w-full object-contain"
                loop
                muted={isMuted}
                onClick={togglePlay}
                playsInline
            />

            {/* Interaction Overlay */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={onLike}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20'}`}
                    >
                        <Heart size={28} className={isLiked ? 'fill-white' : ''} />
                    </button>
                    <span className="text-xs font-bold text-white shadow-sm">{video.likes.length}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        <MessageCircle size={28} />
                    </button>
                    <span className="text-xs font-bold text-white">{video.commentsCount}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        <Share2 size={28} />
                    </button>
                    <span className="text-xs font-bold text-white">{video.sharesCount}</span>
                </div>

                <button
                    onClick={onToggleMute}
                    className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                </button>
            </div>

            {/* Creator Info Overlay */}
            <div className="absolute left-0 right-16 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                        <img
                            src={video.creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator.username}`}
                            className="w-12 h-12 rounded-2xl border-2 border-white/20 object-cover"
                            alt={video.creator.username}
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 bg-blue-500 rounded-full border-2 border-black">
                            <CheckCircle2 size={10} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-black text-lg flex items-center gap-1">
                            @{video.creator.username}
                            <button className="ml-2 px-4 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg text-xs font-black transition-all border border-white/20">
                                {t('video.follow', 'Follow')}
                            </button>
                        </h3>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-white text-sm line-clamp-2 opacity-90 leading-relaxed font-medium">
                        {video.description || video.title}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                            <Music size={14} className="text-blue-400 rotate-12" />
                            <span className="text-xs text-white uppercase font-black tracking-tighter truncate max-w-[150px]">
                                {video.musicName || t('video.originalAudio', 'Original Audio')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-red-600/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/30">
                            <Eye size={14} className="text-red-500" />
                            <span className="text-xs text-red-500 font-black">{video.views} {t('video.views', 'views')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Play/Pause Large Indicator Overlay */}
            <AnimatePresence>
                {!playing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="w-24 h-24 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                            <Play size={40} className="text-white fill-white ml-2" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const VideoCard = ({ video }: { video: Video }) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);

    // IntersectionObserver: track if card is in the viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Autoplay preview when hovered AND in view
    useEffect(() => {
        if (!videoRef.current) return;
        if (isHovered && isInView) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered, isInView]);

    return (
        <motion.div
            ref={containerRef}
            whileHover={{ y: -10 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative bg-[#1a2133]/40 backdrop-blur-md rounded-[40px] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer shadow-2xl"
        >
            <div className="relative aspect-video">
                {/* Thumbnail shown when not hovered */}
                <img
                    src={video.thumbnailUrl || (video.type === 'live' ? 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80')}
                    alt={video.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-0 scale-105' : 'grayscale-[20%] group-hover:grayscale-0'}`}
                />
                {/* Autoplay video preview on hover */}
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {video.isLive ? (
                        <div className="bg-red-600 px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-2xl">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('video.live', 'Live')}</span>
                        </div>
                    ) : (
                        <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{video.type}</span>
                        </div>
                    )}
                </div>

                {/* Viewer Count Overlay */}
                {video.isLive && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                        <Eye size={14} className="text-white" />
                        <span className="text-[10px] font-black text-white">{video.viewerCount} {t('video.watching', 'watching')}</span>
                    </div>
                )}

                {/* Play Button Overlay — shown when not hovered */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all ${isHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 scale-110">
                        <Play size={24} className="text-white fill-white ml-1" />
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex gap-4">
                    <img
                        src={video.creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator.username}`}
                        className="w-12 h-12 rounded-2xl border-2 border-white/10 object-cover shrink-0"
                        alt={video.creator.username}
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-black text-lg truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                            {video.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-bold flex items-center gap-1">
                            {video.creator.firstName} {video.creator.lastName}
                            {video.creator.isVerified && <CheckCircle2 size={12} className="text-blue-500" />}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-6 text-gray-500">
                        <span className="flex items-center gap-2 text-xs font-black">
                            <Eye size={14} /> {video.views}
                        </span>
                        <span className="flex items-center gap-2 text-xs font-black">
                            <Clock size={14} /> {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    {video.isLive && (
                        <button className="px-6 py-2 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-xl text-xs font-black transition-all shadow-lg uppercase tracking-widest">
                            {t('video.joinStream', 'Join Stream')}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
