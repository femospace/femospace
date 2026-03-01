import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import { StoryComposer } from './StoryComposer';

interface StoryBarProps {
    onStoryClick: (ownerId: string, storyId?: string) => void;
}

export const StoryBar: React.FC<StoryBarProps> = ({ onStoryClick }) => {
    const [storyGroups, setStoryGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showComposer, setShowComposer] = useState(false);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const { data } = await api.get('/stories/feed');
            console.log('Stories fetched:', data);
            setStoryGroups(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch stories', err);
            setStoryGroups([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
            ))}
        </div>
    );

    return (
        <div className="relative group">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 pb-4 scroll-smooth">
                {/* Create Story */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                        onClick={() => setShowComposer(true)}
                        className="w-16 h-16 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105 group/plus"
                    >
                        <Plus className="text-blue-500 transition-transform group-hover/plus:rotate-90" size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Your Space</span>
                </div>

                {/* Active Stories */}
                {storyGroups.map((group) => {
                    const owner = group.owner;
                    const avatar = owner?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner?.username}`;
                    const name = owner?.profile?.firstName || owner?.username || 'User';

                    return (
                        <motion.div
                            key={owner?._id || Math.random()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                            onClick={() => {
                                console.log('Story clicked:', owner?._id, group.stories?.[0]?._id);
                                if (owner?._id) {
                                    onStoryClick(owner._id, group.stories?.[0]?._id);
                                }
                            }}
                        >
                            <div className={`w-16 h-16 rounded-full p-[3px] transition-all ${group.hasUnseen ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-200 dark:bg-gray-800'}`}>
                                <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
                                    <img src={avatar} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter truncate w-16 text-center">{name}</span>
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {showComposer && (
                    <StoryComposer
                        onClose={() => setShowComposer(false)}
                        onSuccess={() => {
                            setShowComposer(false);
                            fetchStories();
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Scroll Indicators (Modern Touch) */}
            <div className="absolute top-8 left-0 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500">
                    <ChevronLeft size={20} />
                </button>
            </div>
            <div className="absolute top-8 right-0 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
