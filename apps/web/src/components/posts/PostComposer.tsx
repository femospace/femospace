import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Image as ImageIcon,
    BarChart2, MapPin, Globe,
    ChevronDown, Send, Sparkles,
    Camera, Lock, Users, Flag, Tv
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

interface PostComposerProps {
    onSuccess: () => void;
}

const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public', icon: <Globe size={14} />, desc: 'Anyone on Femo Space' },
    { value: 'friends', label: 'Only Friends', icon: <Users size={14} />, desc: 'Your confirmed friends' },
    { value: 'private', label: 'Only Me', icon: <Lock size={14} />, desc: 'Only you can see this' },
    { value: 'members', label: 'Groups', icon: <Users size={14} />, desc: 'Share to your active groups' },
    { value: 'followers', label: 'Pages', icon: <Flag size={14} />, desc: 'Post to your managed pages' },
    { value: 'subscribers', label: 'Channels', icon: <Tv size={14} />, desc: 'Broadcast to your subscribers' },
];

export const PostComposer: React.FC<PostComposerProps> = ({ onSuccess }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<any[]>([]);
    const [type, setType] = useState('text');
    const [visibility, setVisibility] = useState('public');
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [pollOptions, setPollOptions] = useState([{ text: '' }, { text: '' }]);
    const [showPoll, setShowPoll] = useState(false);
    const [locationName, setLocationName] = useState('');
    const [showLocation, setShowLocation] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateAICaption = () => {
        const captions = [
            "Just vibing in my Femo Space! ✨ #FemoLife",
            "Creating memories that last forever. 📸 #DailyVibe",
            "What a time to be alive! 🚀 #FutureIsNow",
            "Coding the future, one line at a time. 💻 #DevLife"
        ];
        setContent(prev => prev + (prev ? "\n" : "") + captions[Math.floor(Math.random() * captions.length)]);
    };

    const addPollOption = () => {
        if (pollOptions.length < 4) setPollOptions([...pollOptions, { text: '' }]);
    };

    const handlePollChange = (idx: number, val: string) => {
        const newOptions = [...pollOptions];
        newOptions[idx].text = val;
        setPollOptions(newOptions);
    };

    const handleSubmit = async () => {
        const postContent = content.trim();
        if (!postContent && media.length === 0) {
            alert('Please add some content or media to your post!');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Upload media files first if any
            const uploadedMedia = [];
            for (const item of media) {
                if (item.file) {
                    const formData = new FormData();
                    formData.append('file', item.file);
                    const { data } = await api.post('/upload/file', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    uploadedMedia.push({
                        url: data.url,
                        type: item.type
                    });
                }
            }

            // 2. Create post
            const payload = {
                ownerType: 'user',
                ownerId: (user as any)?.id || (user as any)?.['_id'], // Robust owner ID check
                type: showPoll ? 'poll' : (uploadedMedia.length > 0 ? (type === 'video' ? 'video' : 'image') : 'text'),
                content: postContent,
                visibility,
                media: uploadedMedia.map(m => ({ url: m.url, type: m.type })),
                pollOptions: showPoll ? pollOptions.filter(o => o.text.trim()) : undefined,
                location: showLocation && locationName ? { name: locationName, coordinates: [0, 0] } : undefined,
                status: 'published'
            };

            await api.post('/posts', payload);

            // Clear state
            setContent('');
            setMedia([]);
            setType('text');
            setIsExpanded(false);
            setShowPoll(false);
            setShowLocation(false);
            setPollOptions([{ text: '' }, { text: '' }]);
            setLocationName('');
            setShowVisibilityMenu(false);
            if (onSuccess) onSuccess();

            console.log('Post created successfully');
        } catch (err: any) {
            console.error('Failed to create post', err);
            alert(`Error: ${err.response?.data?.message || 'Failed to save post. Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newMedia = Array.from(files).map(file => ({
            url: URL.createObjectURL(file), // Create new URL
            type: file.type.startsWith('video') ? 'video' : 'image',
            file
        }));

        setMedia(prev => [...prev, ...newMedia]);

        // Auto-set type based on content
        if (newMedia.some(m => m.type === 'video')) setType('video');
        else if (newMedia.length > 0 && type === 'text') setType('image');

        setIsExpanded(true);

        // Reset input to allow selecting same file again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            media.forEach(m => {
                if (m.url && m.url.startsWith('blob:')) {
                    URL.revokeObjectURL(m.url);
                }
            });
        };
    }, [media]);

    const removeMedia = (index: number) => {
        const updated = [...media];
        updated.splice(index, 1);
        setMedia(updated);
        if (updated.length === 0) setType('text');
    };

    const selectedVisibility = VISIBILITY_OPTIONS.find(opt => opt.value === visibility) || VISIBILITY_OPTIONS[0];

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 transition-all duration-300">
            <div className="flex gap-3">
                <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                    className="w-12 h-12 rounded-full border-2 border-blue-500/20 p-0.5"
                    alt="User"
                />

                <div className="flex-1 space-y-3">
                    <div
                        className={`min-h-[60px] p-3 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-transparent focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all cursor-text`}
                        onClick={() => !isExpanded && setIsExpanded(true)}
                    >
                        <textarea
                            className="w-full bg-transparent border-none focus:ring-0 resize-none dark:text-white placeholder-gray-500 text-lg leading-relaxed font-medium"
                            placeholder={`What's happening in your space, ${user?.firstName}?`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={isExpanded ? 4 : 1}
                        />

                        <AnimatePresence>
                            {media.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="grid grid-cols-2 gap-2 mt-3"
                                >
                                    {media.map((m, i) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-gray-100 dark:border-gray-800 shadow-sm">
                                            {m.type === 'video' ? (
                                                <video src={m.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={m.url} className="w-full h-full object-cover" alt="Media" />
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeMedia(i); }}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Poll Composer UI */}
                            {showPoll && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
                                    {pollOptions.map((opt, idx) => (
                                        <input
                                            key={idx}
                                            value={opt.text}
                                            onChange={(e) => handlePollChange(idx, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm"
                                        />
                                    ))}
                                    {pollOptions.length < 4 && (
                                        <button onClick={addPollOption} className="text-xs text-blue-500 font-bold hover:underline">+ Add Option</button>
                                    )}
                                </motion.div>
                            )}

                            {/* Location UI */}
                            {showLocation && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
                                        <MapPin size={16} className="text-gray-500" />
                                        <input
                                            value={locationName}
                                            onChange={(e) => setLocationName(e.target.value)}
                                            placeholder="Where are you?"
                                            className="bg-transparent w-full text-sm border-none focus:ring-0 p-0"
                                            autoFocus
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110"
                                    title="Photo/Video"
                                >
                                    <ImageIcon size={22} />
                                </button>
                                <button className="p-2.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-all hover:scale-110" title="Reel" onClick={() => { setType('video'); setIsExpanded(true); fileInputRef.current?.click(); }}>
                                    <Camera size={22} />
                                </button>
                                <button className="p-2.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all hover:scale-110" title="Poll" onClick={() => { setShowPoll(!showPoll); setIsExpanded(true); }}>
                                    <BarChart2 size={22} />
                                </button>
                                <button className="p-2.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl transition-all hover:scale-110" title="Location" onClick={() => { setShowLocation(!showLocation); setIsExpanded(true); }}>
                                    <MapPin size={22} />
                                </button>
                                <button className="hidden sm:flex p-2.5 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-xl transition-all hover:scale-110" title="AI Assistant" onClick={generateAICaption}>
                                    <Sparkles size={22} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 relative">
                                {/* Visibility Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                    >
                                        {selectedVisibility.icon}
                                        <span>{selectedVisibility.label}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${showVisibilityMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showVisibilityMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 p-2"
                                            >
                                                {VISIBILITY_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => {
                                                            setVisibility(opt.value);
                                                            setShowVisibilityMenu(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${visibility === opt.value ? 'bg-blue-500/10 text-blue-600 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        <div className={`p-2 rounded-lg ${visibility === opt.value ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                            {opt.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold">{opt.label}</span>
                                                            <span className="text-[10px] opacity-70">{opt.desc}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || (!content.trim() && media.length === 0)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:scale-95 text-white px-7 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Post</span>
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
            />
        </div>
    );
};
