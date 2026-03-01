import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import api from '../lib/api';
import { PostComposer } from '../components/posts/PostComposer';
import { PostCard } from '../components/posts/PostCard';
import { StoryBar } from '../components/stories/StoryBar';
import { StoryViewer } from '../components/stories/StoryViewer';
import { FollowButton } from '../components/common/FollowButton';

export const Home = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('foryou');
  const [viewingStory, setViewingStory] = useState<{ ownerId: string; storyId?: string } | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async (reset = false) => {
    if (reset) setLoading(true);
    try {
      const pageToFetch = reset ? 1 : page;
      const { data } = await api.get(`/posts/feed`, { params: { page: pageToFetch, limit: 10 } });

      const newPosts = Array.isArray(data) ? data : [];
      if (reset) {
        setFeed(newPosts);
        setPage(2);
      } else {
        setFeed(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }

      if (newPosts.length < 10) setHasMore(false);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      if (reset) setFeed([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(true);
  }, [activeTab]); // Refetch when tab changes

  // Infinite Scroll Observer
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) return;
      fetchFeed(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleStoryClick = (ownerId: string, storyId?: string) => {
    console.log('Opening story:', { ownerId, storyId });
    setViewingStory({ ownerId, storyId });
  };

  const handleCloseStory = () => {
    console.log('Closing story viewer');
    setViewingStory(null);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {viewingStory && (
          <StoryViewer
            ownerId={viewingStory.ownerId}
            initialStoryId={viewingStory.storyId}
            onClose={handleCloseStory}
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar - Navigation & Trends (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Space</h3>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('foryou')}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${activeTab === 'foryou' ? 'bg-blue-500/10 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Sparkles size={20} /> For You
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${activeTab === 'following' ? 'bg-blue-500/10 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Users size={20} /> Following
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${activeTab === 'trending' ? 'bg-blue-500/10 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <TrendingUp size={20} /> Trending
              </button>
            </nav>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Popular Spaces</h3>
            <div className="space-y-4">
              {['#FemoArt', '#WorldCup2026', '#AIRevolution', '#SustainableLiving'].map(tag => (
                <div
                  key={tag}
                  onClick={() => window.location.href = `/search?q=${encodeURIComponent(tag)}`}
                  className="flex flex-col cursor-pointer group"
                >
                  <span className="font-bold dark:text-gray-200 group-hover:text-blue-500 transition-colors uppercase text-xs tracking-tight">{tag}</span>
                  <span className="text-[10px] text-gray-500">2.4k posts this hour</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <main className="w-full max-w-2xl px-4 py-4 space-y-6">
        <StoryBar onStoryClick={handleStoryClick} />

        <PostComposer onSuccess={() => fetchFeed(true)} />

        {/* Feed Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-100 dark:border-gray-800 px-2">
          {['foryou', 'following'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-gray-400'}`}
            >
              {tab.replace('foryou', 'For You')}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Feed Content */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Personalizing your feed...</p>
            </div>
          ) : feed.length > 0 ? (
            feed.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchFeed} />
            ))
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-50 dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-blue-500" size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Welcome to your new space!</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">This is where your universe lives. Post something above to see it saved here forever.</p>
                <button
                  onClick={() => {
                    const el = document.querySelector('textarea');
                    if (el) el.focus();
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Start Posting
                </button>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h4 className="font-bold text-lg mb-2">Pro Tip: 🚀</h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  You can share photos, videos, and even AI-generated thoughts. Everything you post is securely saved to your FEMO SPACE account.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Suggestions & News (Hidden on medium/large) */}
      <div className="hidden xl:flex flex-col w-80 p-4 sticky top-0 h-screen overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Who to follow</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=friend${i}`} className="w-10 h-10 rounded-full" alt="Suggested" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold dark:text-white">TrendSetter {i}</span>
                      <span className="text-[10px] text-gray-500">Suggested for you</span>
                    </div>
                  </div>
                  {/* Using a mock ID here for demo - in production use real user IDs */}
                  <FollowButton
                    userId={`mock_user_${i}`}
                    className="px-3 py-1.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
