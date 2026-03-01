import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Flame,
    Radio,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Grid,
    List,
    CheckCircle,
    Upload,
    Search,
    Filter
} from 'lucide-react';
import api from '../lib/api';
import { ReelItem } from '../components/videos/ReelItem';
import { VideoPlayer } from '../components/videos/VideoPlayer';
import { VideoUpload } from '../components/videos/VideoUpload';
import { GoLive } from '../components/videos/GoLive';
import { CommentPanel } from '../components/videos/CommentPanel';
import { PageWrapper } from '../components/common/PageWrapper';
import { useTheme } from '../contexts/ThemeContext';

type VideoTab = 'reels' | 'videos' | 'live';
type VideosView = 'grid' | 'feed';

interface VideoItem {
    id: string;
    type: 'reel' | 'video' | 'live';
    title: string;
    description?: string;
    url: string;
    thumbnailUrl: string;
    duration?: number;
    creator: {
        id: string;
        name: string;
        avatar: string;
        isVerified: boolean;
    };
    metrics: {
        likes: number;
        views: string;
        comments: number;
        shares: number;
    };
    music?: {
        name: string;
        artist: string;
    };
    tags?: string[];
    isLive?: boolean;
    isLiked?: boolean;
    isSaved?: boolean;
    isFollowing?: boolean;
}

export const Videos = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState<VideoTab>('reels');
    const [videosView, setVideosView] = useState<VideosView>('grid');
    const [isMuted, setIsMuted] = useState(true);
    const [items, setItems] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [activeReelIndex, setActiveReelIndex] = useState(0);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
    const [commentPanelState, setCommentPanelState] = useState<{ isOpen: boolean; videoId: string; count: number }>({
        isOpen: false,
        videoId: '',
        count: 0
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Fetch content
    const fetchContent = useCallback(async (tab: VideoTab, pageNum: number = 1) => {
        setLoading(true);
        try {
            const endpoint = tab === 'reels' ? '/videos/reels' : tab === 'live' ? '/videos/live' : '/videos';
            const { data: result } = await api.get(`${endpoint}?page=${pageNum}&limit=20`);

            const transformed = result.data.map((item: any) => ({
                id: item._id,
                type: item.type,
                title: item.title,
                description: item.description,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                duration: item.duration,
                creator: {
                    id: item.creatorId,
                    name: 'Creator ' + item.creatorId.substring(0, 4),
                    avatar: `https://i.pravatar.cc/150?u=${item.creatorId}`,
                    isVerified: Math.random() > 0.5
                },
                metrics: {
                    likes: item.metrics.likes,
                    views: item.metrics.views >= 1000000
                        ? (item.metrics.views / 1000000).toFixed(1) + 'M'
                        : item.metrics.views >= 1000
                            ? (item.metrics.views / 1000).toFixed(0) + 'K'
                            : item.metrics.views.toString(),
                    comments: item.metrics.comments,
                    shares: item.metrics.shares || 0
                },
                music: item.type === 'reel' ? {
                    name: 'Original Audio',
                    artist: 'Creator ' + item.creatorId.substring(0, 4)
                } : undefined,
                tags: item.tags || [],
                isLive: item.isLive,
                isLiked: false,
                isSaved: false,
                isFollowing: false
            }));

            if (pageNum === 1) {
                setItems(transformed);
            } else {
                setItems(prev => [...prev, ...transformed]);
            }

            setHasMore(transformed.length === 20);
        } catch (error) {
            console.error('Failed to fetch video content:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setPage(1);
        fetchContent(activeTab, 1);
    }, [activeTab, fetchContent]);

    // Infinite scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchContent(activeTab, nextPage);
                }
            },
            { threshold: 0.1 }
        );

        const sentinel = document.getElementById('scroll-sentinel');
        if (sentinel) {
            observerRef.current.observe(sentinel);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [activeTab, page, hasMore, loading, fetchContent]);

    // Thumbnail preloading
    useEffect(() => {
        if (items.length === 0) return;

        // Preload next 3 items
        const startIndex = activeTab === 'reels' ? activeReelIndex + 1 : 0;
        const toPreload = items.slice(startIndex, startIndex + 5);

        toPreload.forEach(item => {
            if (item.thumbnailUrl) {
                const img = new Image();
                img.src = item.thumbnailUrl;
            }
        });
    }, [items, activeTab, activeReelIndex]);

    // Reel scroll detection
    useEffect(() => {
        if (activeTab !== 'reels' || !containerRef.current) return;

        const container = containerRef.current;
        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const reelHeight = window.innerHeight;
            const index = Math.round(scrollTop / reelHeight);

            if (index !== activeReelIndex) {
                setActiveReelIndex(index);
                if (commentPanelState.isOpen) {
                    setCommentPanelState(prev => ({ ...prev, isOpen: false }));
                }
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeTab, activeReelIndex, commentPanelState.isOpen]);

    // Action handlers
    const handleLike = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, isLiked: !item.isLiked } : item
        ));
    };

    const handleSave = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, isSaved: !item.isSaved } : item
        ));
    };

    const handleFollow = (userId: string) => {
        setItems(prev => prev.map(item =>
            item.creator.id === userId ? { ...item, isFollowing: !item.isFollowing } : item
        ));
    };

    const handleComment = (id: string) => {
        const item = items.find(i => i.id === id);
        if (item) {
            setCommentPanelState({
                isOpen: true,
                videoId: id,
                count: item.metrics.comments
            });
        }
    };

    const handleShare = (id: string) => {
        console.log('Share:', id);
    };

    return (
        <PageWrapper className="flex flex-col h-screen overflow-hidden relative" animate={activeTab !== 'reels'}>
            {/* Header with Tabs - Always visible */}
            <div className={`absolute top-0 left-0 right-0 z-50 ${isDark ? 'bg-gradient-to-b from-black/90 via-black/70 to-transparent' : 'bg-gradient-to-b from-white/90 via-white/70 to-transparent'} backdrop-blur-sm`}>
                <div className="max-w-7xl mx-auto px-4 py-4 pt-6 flex justify-between items-center">
                    {/* Tab Buttons */}
                    <div className="flex gap-1 bg-black/20 dark:bg-white/10 p-1 rounded-2xl backdrop-blur-md relative">
                        {[
                            { id: 'reels', icon: <Flame size={18} />, label: 'Reels' },
                            { id: 'videos', icon: <Play size={18} />, label: 'Videos' },
                            { id: 'live', icon: <Radio size={18} />, label: 'Live' }
                        ].map(tab => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as VideoTab)}
                                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 z-10 ${active
                                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                                        : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeTabBg"
                                            className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-lg"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-20 flex items-center gap-2">
                                        {tab.icon}
                                        {tab.label}
                                    </span>
                                    {active && (
                                        <motion.div
                                            layoutId="activeUnderline"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {activeTab === 'videos' && (
                            <div className="flex bg-white/10 rounded-full p-1">
                                <button
                                    onClick={() => setVideosView('grid')}
                                    className={`p-2 rounded-full transition-all ${videosView === 'grid' ? 'bg-white/20 text-white' : 'text-white/60'
                                        }`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setVideosView('feed')}
                                    className={`p-2 rounded-full transition-all ${videosView === 'feed' ? 'bg-white/20 text-white' : 'text-white/60'
                                        }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        )}
                        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                            <Search size={20} />
                        </button>
                        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                            <Filter size={20} />
                        </button>
                        {activeTab === 'live' && (
                            <button
                                onClick={() => setIsGoLiveOpen(true)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition-all"
                            >
                                <Radio size={18} />
                                <span>Go Live</span>
                            </button>
                        )}
                        {activeTab !== 'live' && (
                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition-all"
                            >
                                <Upload size={18} />
                                <span>Upload</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div
                ref={containerRef}
                className={`flex-1 relative ${activeTab === 'reels'
                    ? 'overflow-y-auto snap-y snap-mandatory scrollbar-hide'
                    : 'overflow-y-auto'
                    }`}
            >
                {loading && page === 1 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* REELS TAB */}
                        {activeTab === 'reels' && (
                            <motion.div
                                key="reels"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                            >
                                {items.map((reel, index) => (
                                    <div key={reel.id} className="h-screen snap-start">
                                        <ReelItem
                                            reel={reel}
                                            isActive={index === activeReelIndex}
                                            isMuted={isMuted}
                                            onToggleMute={() => setIsMuted(!isMuted)}
                                            onLike={handleLike}
                                            onComment={handleComment}
                                            onShare={handleShare}
                                            onSave={handleSave}
                                            onFollow={handleFollow}
                                        />
                                    </div>
                                ))}
                                <div id="scroll-sentinel" className="h-2" />
                            </motion.div>
                        )}

                        {/* VIDEOS TAB */}
                        {activeTab === 'videos' && (
                            <motion.div
                                key="videos"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="pt-24 pb-8 px-4"
                            >
                                <div className="max-w-7xl mx-auto">
                                    {videosView === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {items.map(video => (
                                                <VideoCard key={video.id} video={video} onClick={handleLike} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="max-w-4xl mx-auto space-y-6">
                                            {items.map(video => (
                                                <VideoFeedItem key={video.id} video={video} onLike={handleLike} />
                                            ))}
                                        </div>
                                    )}
                                    <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
                                        {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* LIVE TAB */}
                        {activeTab === 'live' && (
                            <motion.div
                                key="live"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="pt-24 pb-8 px-4"
                            >
                                <div className="max-w-6xl mx-auto space-y-6">
                                    {items.map(live => (
                                        <LiveStreamCard key={live.id} live={live} />
                                    ))}
                                    <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
                                        {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {!loading && items.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-white/50 p-8 text-center pt-32">
                                <p className="text-xl font-bold mb-2">No content found</p>
                                <p className="text-sm">We couldn't find any {activeTab} at the moment.</p>
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Modals */}
            <VideoUpload
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={() => {
                    setIsUploadOpen(false);
                    fetchContent(activeTab, 1);
                }}
                defaultType={activeTab === 'reels' ? 'reel' : 'video'}
            />

            <GoLive
                isOpen={isGoLiveOpen}
                onClose={() => setIsGoLiveOpen(false)}
                onSuccess={() => {
                    setIsGoLiveOpen(false);
                    setActiveTab('live');
                    fetchContent('live', 1);
                }}
            />
            <CommentPanel
                isOpen={commentPanelState.isOpen}
                onClose={() => setCommentPanelState(prev => ({ ...prev, isOpen: false }))}
                videoId={commentPanelState.videoId}
                commentCount={commentPanelState.count}
            />
        </PageWrapper>
    );
};

// Video Card Component (Grid View)
const VideoCard = ({ video, onClick }: { video: VideoItem; onClick: (id: string) => void }) => {
    return (
        <div
            onClick={() => onClick(video.id)}
            className="bg-neutral-900 rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-semibold">
                    {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                        <Play fill="white" size={24} />
                    </div>
                </div>
            </div>
            <div className="p-3 flex gap-3">
                <img src={video.creator.avatar} alt={video.creator.name} className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {video.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <span>{video.creator.name}</span>
                        {video.creator.isVerified && <CheckCircle size={12} className="text-blue-400 fill-blue-400" />}
                    </div>
                    <p className="text-gray-500 text-xs">{video.metrics.views} views</p>
                </div>
            </div>
        </div>
    );
};

// Video Feed Item (List View)
const VideoFeedItem = ({ video, onLike }: { video: VideoItem; onLike: (id: string) => void }) => {
    const [isLiked, setIsLiked] = useState(video.isLiked);

    return (
        <div className="bg-neutral-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group">
            <div className="aspect-video relative">
                <VideoPlayer src={video.url} poster={video.thumbnailUrl} videoId={video.id} />
            </div>
            <div className="p-6">
                <div className="flex gap-4 mb-6">
                    <div className="relative">
                        <img src={video.creator.avatar} alt={video.creator.name} className="w-14 h-14 rounded-full border-2 border-blue-500/30 p-0.5" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                            <CheckCircle size={10} className="text-white fill-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-white font-black text-xl mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{video.title}</h2>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <span className="hover:text-white cursor-pointer transition-colors">{video.creator.name}</span>
                            <span>•</span>
                            <span>{video.metrics.views} views</span>
                        </div>
                    </div>
                    <button className="bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                        Follow
                    </button>
                </div>

                <div className="flex items-center gap-2 text-white border-t border-white/5 pt-6">
                    <button
                        onClick={() => {
                            setIsLiked(!isLiked);
                            onLike(video.id);
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} />
                        <span className="text-sm font-bold">{isLiked ? parseInt(video.metrics.likes.toString()) + 1 : video.metrics.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl transition-all">
                        <MessageCircle size={20} />
                        <span className="text-sm font-bold">{video.metrics.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl transition-all">
                        <Share2 size={20} />
                        <span className="text-sm font-bold text-white/60">Share</span>
                    </button>
                    <button className="ml-auto p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Live Stream Card
const LiveStreamCard = ({ live }: { live: VideoItem }) => {
    return (
        <div className="bg-neutral-900 rounded-3xl overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-red-500 transition-all">
            <div className="relative aspect-video lg:aspect-[21/9]">
                <img src={live.thumbnailUrl} alt={live.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full animate-pulse flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-white rounded-full" /> LIVE
                    </div>
                    <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        👥 {live.metrics.views} watching
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={live.creator.avatar} alt={live.creator.name} className="w-14 h-14 rounded-full border-2 border-red-500 p-0.5" />
                        <div>
                            <h2 className="text-2xl font-black text-white mb-1">{live.title}</h2>
                            <div className="flex items-center gap-2 text-gray-200">
                                <span className="font-semibold">{live.creator.name}</span>
                                {live.creator.isVerified && <CheckCircle size={16} className="text-blue-400 fill-blue-400" />}
                            </div>
                        </div>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg">
                        Join Stream
                    </button>
                </div>
            </div>
        </div>
    );
};
