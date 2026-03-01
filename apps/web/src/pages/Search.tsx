import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search as SearchIcon,
    User,
    Play,
    Flame,
    FileText,
    Users,
    CheckCircle,
    TrendingUp,
    History,
    X,
    ArrowLeft,
    ChevronRight,
    Filter,
    Mic,
    Camera as CameraIcon
} from 'lucide-react';
import { UserBadge } from '../components/common/UserBadge';
import { API_BASE_URL } from '../config';


type SearchType = 'top' | 'users' | 'videos' | 'reels' | 'posts' | 'pages';

interface SearchResults {
    users: any[];
    videos: any[];
    reels: any[];
    posts: any[];
    aiNote?: string;
}

export const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<SearchType>('top');
    const [results, setResults] = useState<SearchResults>({ users: [], videos: [], reels: [], posts: [] });
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTrending = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/search/trending`);
            if (resp.ok) setTrending(await resp.json());
        } catch (err) {
            console.error(err);
        }
    };

    const performSearch = async (q: string, type: string) => {
        if (!q) return;
        setLoading(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(q)}&type=${type}`);
            if (resp.ok) setResults(await resp.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrending();
    }, []);

    useEffect(() => {
        if (query) {
            performSearch(query, activeTab);
        } else {
            setResults({ users: [], videos: [], reels: [], posts: [] });
        }
    }, [query, activeTab]);

    const tabs = [
        { id: 'top', label: 'Top', icon: <SearchIcon size={14} /> },
        { id: 'users', label: 'Users', icon: <User size={14} /> },
        { id: 'videos', label: 'Videos', icon: <Play size={14} /> },
        { id: 'reels', label: 'Reels', icon: <Flame size={14} /> },
        { id: 'posts', label: 'Posts', icon: <FileText size={14} /> },
        { id: 'pages', label: 'Pages', icon: <Users size={14} /> }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
            {/* Search Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-gray-400">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setSearchParams({ q: e.target.value })}
                            placeholder="Search Femo Space..."
                            className="w-full bg-gray-100 dark:bg-gray-800/50 border-none rounded-2xl pl-12 pr-28 py-3 focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {query && (
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                            <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Mic size={18} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><CameraIcon size={18} /></button>
                        </div>
                    </div>
                    <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-blue-500 transition-all">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Tab Bar */}
                {query && (
                    <div className="max-w-4xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SearchType)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-6">
                {!query ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Trending Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">
                                <TrendingUp className="text-red-500" size={22} /> Trending Now
                            </h2>
                            <div className="flex flex-col gap-2">
                                {trending.map((t, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSearchParams({ q: t.query })}
                                        className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-all flex justify-between items-center group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-gray-200 dark:text-gray-700 italic group-hover:text-blue-500 transition-colors">#{i + 1}</span>
                                            <div>
                                                <p className="font-bold dark:text-white">{t.query}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{t.status}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Searches */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black dark:text-white flex items-center gap-2">
                                    <History className="text-blue-500" size={22} /> Recent
                                </h2>
                                <button className="text-xs font-bold text-blue-500 hover:underline">Clear all</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Next.js Guide', 'Tokyo Travel', 'AI 2026', 'Femo Space App'].map(s => (
                                    <div
                                        key={s}
                                        onClick={() => setSearchParams({ q: s })}
                                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-sm font-medium dark:text-gray-300 hover:border-blue-500 cursor-pointer"
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 pb-20">
                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab + query}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    {/* AI Insight */}
                                    {results.aiNote && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex gap-3 items-center">
                                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                                                <SearchIcon size={16} />
                                            </div>
                                            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 italic">"{results.aiNote}"</p>
                                        </div>
                                    )}

                                    {/* Users Section */}
                                    {(activeTab === 'top' || activeTab === 'users') && results.users.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-black dark:text-white px-2">People</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {results.users.map(u => (
                                                    <div key={u.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all group">
                                                        <img src={u.avatar} className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-700" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="flex items-center gap-1">
                                                                    {u.isVip && <UserBadge type="vip" size={14} />}
                                                                    {u.isCreatorCertified && <UserBadge type="creator" size={14} />}
                                                                </div>
                                                                <h4 className="font-bold dark:text-white truncate">{u.name}</h4>
                                                                {u.verified && <CheckCircle size={14} className="text-blue-500 fill-blue-500 text-white shrink-0" />}
                                                            </div>
                                                            <p className="text-xs text-gray-500 truncate">{u.handle}</p>
                                                        </div>
                                                        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all">Follow</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Videos Section */}
                                    {(activeTab === 'top' || activeTab === 'videos') && results.videos.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-black dark:text-white px-2">Long-form Videos</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {results.videos.map(v => (
                                                    <div key={v._id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden group cursor-pointer border border-transparent hover:border-blue-500 transition-all">
                                                        <div className="aspect-video relative">
                                                            <img src={v.thumbnailUrl} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <Play fill="white" className="text-white" size={32} />
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <h4 className="font-bold dark:text-white truncate mb-1">{v.title}</h4>
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{v.metrics.views} views</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reels Section */}
                                    {(activeTab === 'top' || activeTab === 'reels') && results.reels.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-black dark:text-white px-2 flex items-center gap-2">
                                                Reels <Flame size={18} className="text-orange-500" />
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {results.reels.map(r => (
                                                    <div key={r._id} className="aspect-[9/16] bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all">
                                                        <img src={r.thumbnailUrl} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                                                            <h4 className="text-white text-xs font-bold truncate">{r.title}</h4>
                                                            <p className="text-white/60 text-[10px] font-bold">{r.metrics.likes} likes</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pages / Groups / Channels Section */}
                                    {(activeTab === 'top' || activeTab === 'pages') && results.posts.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-black dark:text-white px-2">Pages & Channels</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { id: 'p1', name: 'Femo Official', avatar: '/icons/logo_512.png', type: 'Page', isCreatorCertified: true },
                                                    { id: 'p2', name: 'Tech News Group', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=tech', type: 'Group', isCreatorCertified: false }
                                                ].map(p => (
                                                    <div key={p.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all group">
                                                        <img src={p.avatar} className="w-14 h-14 rounded-xl object-cover" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="flex items-center gap-1">
                                                                    {p.isCreatorCertified && <UserBadge type="creator" size={14} />}
                                                                </div>
                                                                <h4 className="font-bold dark:text-white truncate">{p.name}</h4>
                                                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 uppercase">{p.type}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 truncate">Official {p.type} for the Femo community.</p>
                                                        </div>
                                                        <button className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold rounded-xl transition-all">Join</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty State */}
                                    {results.users.length === 0 && results.videos.length === 0 && results.reels.length === 0 && (
                                        <div className="py-20 flex flex-col items-center text-center">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                                                <SearchIcon size={40} className="text-gray-400" />
                                            </div>
                                            <h3 className="text-xl font-bold dark:text-white mb-2">No results for "{query}"</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Try checking your spelling or using more general keywords.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
