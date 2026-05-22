import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    Flame,
    Users,
    TrendingUp as TrendingIcon,
    Search,
    ChevronRight,
    Sparkles,
    Trophy,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { LanguageSelector } from '../components/LanguageSelector'; // Already imported from standard components if needed
import { PostCard } from '../components/posts/PostCard';
import { PostComposer } from '../components/posts/PostComposer';
import api from '../lib/api';

export const Home = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [feedType, setFeedType] = useState<'foryou' | 'following' | 'trending'>('foryou');
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const endpoint = feedType === 'trending' ? '/posts/trending' : (feedType === 'following' ? '/posts/following' : '/posts');
            const { data } = await api.get(endpoint);
            setPosts(data || []);
        } catch (err) {
            console.error('Failed to fetch posts', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [feedType]);

    const tabs = [
        { id: 'foryou', label: t('home.forYou', 'For You'), icon: Sparkles },
        { id: 'following', label: t('home.following', 'Following'), icon: Users },
        { id: 'trending', label: t('home.trending', 'Trending'), icon: Flame },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            {/* Main Content */}
            <main className="flex-1 max-w-2xl mx-auto px-4 py-6 pb-32 space-y-6">
                
                {/* Modern Tab Switcher */}
                <div className="sticky top-0 z-30 bg-[#f8fafc]/80 dark:bg-[#0f172a]/80 backdrop-blur-xl py-2 mb-4">
                    <div className="flex p-1.5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFeedType(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    feedType === tab.id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Create Post Area */}
                <PostComposer onSuccess={fetchPosts} />

                {/* Feed Rendering */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 font-bold text-sm animate-pulse uppercase tracking-widest">{t('home.personalizing', 'Personalizing your feed...')}</p>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
                                ))
                            ) : (
                                /* Empty State / Welcome for new users */
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800/50 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 text-center space-y-6 shadow-sm overflow-hidden relative group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Sparkles size={40} className="text-blue-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black dark:text-white">{t('home.welcomeNewSpace', 'Welcome to your new space!')}</h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto font-medium">
                                            {t('home.newSpaceSubtitle', 'This is where your universe lives. Post something above to see it saved here forever.')}
                                        </p>
                                    </div>
                                    <button onClick={() => setFeedType('trending')} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                                        {t('home.startPosting', 'Explore Trending')}
                                    </button>
                                    
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-6 text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-yellow-400 rounded-lg flex items-center justify-center">
                                                <Trophy size={14} className="text-white" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">{t('home.proTip', 'Pro Tip: 🚀')}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                            {t('home.proTipDesc', 'You can share photos, videos, and even AI-generated thoughts. Everything you post is securely saved to your FEMO SPACE account.')}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>

            {/* Right Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-80 p-6 space-y-6 sticky top-0 h-screen overflow-y-auto no-scrollbar border-l border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder={t('selector.searchPlaceholder', 'Search...')}
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white"
                    />
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
                         {t('home.whoToFollow', 'Who to follow')}
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                    <div>
                                        <p className="text-xs font-bold dark:text-white">TrendSetter_{i}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">@creator_{i}</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Plus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 text-xs font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                        Show more
                    </button>
                </div>
            </aside>
        </div>
    );
};
