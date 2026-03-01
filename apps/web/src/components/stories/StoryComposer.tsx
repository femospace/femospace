import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Music, Smile, Type,
    Camera, Send, Loader2, Check, Play, Pause, Search
} from 'lucide-react';
import { Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface StoryComposerProps {
    onClose: () => void;
    onSuccess: () => void;
}

const EFFECTS = [
    { id: 'none', label: 'Original', filter: 'none' },
    { id: 'sepia', label: 'Vintage', filter: 'sepia(0.8)' },
    { id: 'grayscale', label: 'B&W', filter: 'grayscale(1)' },
    { id: 'warm', label: 'Warm', filter: 'saturate(1.5) sepia(0.2)' },
    { id: 'cool', label: 'Frost', filter: 'hue-rotate(180deg) saturate(0.8)' },
    { id: 'soft', label: 'Dreamy', filter: 'brightness(1.1) contrast(0.9) blur(0.5px)' },
];

const EMOJIS = ['😊', '🔥', '❤️', '✨', '🚀', '🙌', '😂', '😍', '🤔', '💯'];

export const StoryComposer: React.FC<StoryComposerProps> = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [type, setType] = useState<'image' | 'video'>('image');
    const [isLoading, setIsLoading] = useState(false);

    // Tools State
    const [overlays, setOverlays] = useState<any[]>([]);
    const [currentText, setCurrentText] = useState('');
    const [selectedEffect, setSelectedEffect] = useState(EFFECTS[0]);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    // Music State
    const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
    const [musicVolume, setMusicVolume] = useState(0.7);
    const [musicStartAt, setMusicStartAt] = useState(0);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const [musicSearch, setMusicSearch] = useState('');
    const [musicTab, setMusicTab] = useState<'music' | 'sfx'>('music');
    const [musicList, setMusicList] = useState<any[]>([]);
    const [uploadingMusic, setUploadingMusic] = useState(false);
    const musicInputRef = useRef<HTMLInputElement>(null);
    const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

    // Fetch music when opening tool
    useEffect(() => {
        if (activeTool === 'music') {
            api.get('/audio-tracks/search?type=music&limit=20')
                .then(res => setMusicList(res.data.data))
                .catch(err => console.error('Failed to load music', err));
        }
    }, [activeTool]);

    const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingMusic(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'music');
        formData.append('title', file.name.replace(/\.[^/.]+$/, ""));
        formData.append('durationSec', '30');

        try {
            const { data } = await api.post('/audio-tracks/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMusicList(prev => [data.data, ...prev]);
            setSelectedMusic(data.data);
            setActiveTool(null);
        } catch (error) {
            console.error('Music upload failed', error);
            alert('Failed to upload music');
        } finally {
            setUploadingMusic(false);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        // Revoke old preview if exists
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setType(selected.type.startsWith('video') ? 'video' : 'image');

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Cleanup preview on unmount
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const addTextOverlay = () => {
        if (!currentText.trim()) return;

        const newOverlay = {
            id: Date.now(),
            type: 'text',
            value: currentText,
            x: 50,
            y: 50,
            style: {
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.5)',
                fontSize: '24px',
                padding: '8px 16px',
                borderRadius: '12px',
            }
        };
        setOverlays([...overlays, newOverlay]);
        setCurrentText('');
        setActiveTool(null);
    };

    const addEmojiOverlay = (emoji: string) => {
        const newOverlay = {
            id: Date.now(),
            type: 'emoji',
            value: emoji,
            x: 50,
            y: 40,
            style: {
                fontSize: '64px',
            }
        };
        setOverlays([...overlays, newOverlay]);
        setActiveTool(null);
    };

    const removeOverlay = (id: number) => {
        setOverlays(overlays.filter(o => o.id !== id));
    };

    const handleMusicSelect = (music: any) => {
        setSelectedMusic(music);
        setActiveTool(null);

        // Stop any playing preview
        if (audioPreviewRef.current) {
            audioPreviewRef.current.pause();
            audioPreviewRef.current.currentTime = 0;
        }
        setIsPreviewPlaying(false);
    };

    const toggleMusicPreview = () => {
        if (!selectedMusic) return;

        if (!audioPreviewRef.current) {
            audioPreviewRef.current = new Audio(selectedMusic.url);
            audioPreviewRef.current.volume = musicVolume;
        }

        if (isPreviewPlaying) {
            audioPreviewRef.current.pause();
            setIsPreviewPlaying(false);
        } else {
            audioPreviewRef.current.currentTime = musicStartAt;
            audioPreviewRef.current.play();
            setIsPreviewPlaying(true);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        try {
            // 1. Upload file
            const formData = new FormData();
            formData.append('file', file);
            const { data: uploadData } = await api.post('/upload/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (!uploadData?.url) throw new Error('Upload failed');

            // 2. Create story with music
            const payload = {
                ownerType: 'user',
                ownerId: user?.id || (user as any)?._id,
                type,
                media: {
                    url: uploadData.url,
                    type: type,
                    duration: type === 'video' ? 15 : 5,
                },
                content: {
                    overlays,
                    effect: selectedEffect.id,
                },
                music: selectedMusic ? {
                    trackId: selectedMusic.id,
                    title: selectedMusic.title,
                    artist: selectedMusic.artist,
                    url: selectedMusic.url,
                    startAt: musicStartAt,
                    volume: musicVolume,
                    type: selectedMusic.type
                } : undefined,
                audience: 'public'
            };

            await api.post('/stories', payload);

            // Stop preview audio
            if (audioPreviewRef.current) {
                audioPreviewRef.current.pause();
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to create story', err);
            alert('Failed topost story. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMusic = musicList.filter(m =>
        m.title.toLowerCase().includes(musicSearch.toLowerCase()) ||
        (m.artist && m.artist.toLowerCase().includes(musicSearch.toLowerCase()))
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md"
        >
            <div className="relative w-full max-w-lg aspect-[9/16] bg-[#0f172a] sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">

                {/* Header Actions */}
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/60 to-transparent">
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all backdrop-blur-md">
                        <X size={24} />
                    </button>
                    <div className="flex gap-2">
                        {preview && (
                            <>
                                <button
                                    onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
                                    className={clsx("p-2 rounded-full transition-all backdrop-blur-md", activeTool === 'text' ? 'bg-blue-500 text-white' : 'bg-black/20 text-white')}
                                >
                                    <Type size={22} />
                                </button>
                                <button
                                    onClick={() => setActiveTool(activeTool === 'emoji' ? null : 'emoji')}
                                    className={clsx("p-2 rounded-full transition-all backdrop-blur-md", activeTool === 'emoji' ? 'bg-blue-500 text-white' : 'bg-black/20 text-white')}
                                >
                                    <Smile size={22} />
                                </button>
                                <button
                                    onClick={() => setActiveTool(activeTool === 'effects' ? null : 'effects')}
                                    className={clsx("p-2 rounded-full transition-all backdrop-blur-md", activeTool === 'effects' ? 'bg-blue-500 text-white' : 'bg-black/20 text-white')}
                                >
                                    <Sparkles size={22} />
                                </button>
                                <button
                                    onClick={() => setActiveTool(activeTool === 'music' ? null : 'music')}
                                    className={clsx("p-2 rounded-full transition-all backdrop-blur-md", activeTool === 'music' || selectedMusic ? 'bg-purple-500 text-white' : 'bg-black/20 text-white')}
                                >
                                    <Music size={22} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="relative flex-1 bg-gray-900 group">
                    {preview ? (
                        <div className="relative w-full h-full">
                            {type === 'video' ? (
                                <video
                                    src={preview}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    style={{ filter: selectedEffect.filter }}
                                />
                            ) : (
                                <img
                                    src={preview}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                    style={{ filter: selectedEffect.filter }}
                                />
                            )}

                            {/* Overlays Render */}
                            {overlays.map((ov) => (
                                <motion.div
                                    key={ov.id}
                                    drag
                                    dragMomentum={false}
                                    className="absolute cursor-move select-none z-30 group/ov"
                                    style={{
                                        left: `${ov.x}%`,
                                        top: `${ov.y}%`,
                                        ...ov.style
                                    }}
                                >
                                    {ov.value}
                                    <button
                                        onClick={() => removeOverlay(ov.id)}
                                        className="absolute -top-6 -right-6 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/ov:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.div>
                            ))}

                            {/* Selected Music Indicator */}
                            {selectedMusic && (
                                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 z-30">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <Music size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-white font-bold text-sm truncate">{selectedMusic.title}</div>
                                        <div className="text-white/60 text-xs truncate">{selectedMusic.artist}</div>
                                    </div>
                                    <button
                                        onClick={toggleMusicPreview}
                                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                                    >
                                        {isPreviewPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedMusic(null);
                                            if (audioPreviewRef.current) {
                                                audioPreviewRef.current.pause();
                                            }
                                            setIsPreviewPlaying(false);
                                        }}
                                        className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-all"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-8">
                            <div className="w-24 h-24 rounded-3xl bg-blue-600 shadow-xl shadow-blue-500/20 flex items-center justify-center text-white transform -rotate-6">
                                <Camera size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Your Moments</h3>
                                <p className="text-gray-400 text-sm max-w-[200px]">Add photos, videos, music, emojis, and cool effects to your space.</p>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 px-10 py-4 bg-white text-black rounded-2xl font-black transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                CHOOSE MEDIA
                            </button>
                        </div>
                    )}

                    {/* Tool Overlays (Floating Menus) */}
                    <AnimatePresence>
                        {activeTool === 'text' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-0 bottom-32 px-6 z-50"
                            >
                                <div className="bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 flex flex-col gap-3">
                                    <input
                                        autoFocus
                                        value={currentText}
                                        onChange={(e) => setCurrentText(e.target.value)}
                                        placeholder="Type something..."
                                        className="bg-transparent text-white text-xl font-bold border-none focus:ring-0 w-full text-center"
                                        onKeyDown={(e) => e.key === 'Enter' && addTextOverlay()}
                                    />
                                    <button
                                        onClick={addTextOverlay}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                    >
                                        Add Text <Check size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTool === 'emoji' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-0 bottom-32 px-6 z-50"
                            >
                                <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 grid grid-cols-5 gap-4">
                                    {EMOJIS.map(e => (
                                        <button
                                            key={e}
                                            onClick={() => addEmojiOverlay(e)}
                                            className="text-4xl hover:scale-125 transition-transform"
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTool === 'effects' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-0 bottom-32 px-4 z-50"
                            >
                                <div className="bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 flex gap-4 overflow-x-auto no-scrollbar">
                                    {EFFECTS.map(effect => (
                                        <button
                                            key={effect.id}
                                            onClick={() => setSelectedEffect(effect)}
                                            className={clsx(
                                                "shrink-0 flex flex-col items-center gap-2 transition-all",
                                                selectedEffect.id === effect.id ? 'opacity-100 scale-110' : 'opacity-60'
                                            )}
                                        >
                                            <div className="w-16 h-16 rounded-xl border-2 border-white/20 bg-gray-800 overflow-hidden">
                                                <div className="w-full h-full bg-blue-500" style={{ filter: effect.filter }} />
                                            </div>
                                            <span className="text-[10px] text-white font-bold uppercase">{effect.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTool === 'music' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-0 bottom-32 px-4 z-50 max-h-[60vh] overflow-hidden"
                            >
                                <div className="bg-black/80 backdrop-blur-xl p-4 rounded-3xl border border-white/20 flex flex-col gap-3">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 text-white/40" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search music..."
                                            value={musicSearch}
                                            onChange={(e) => setMusicSearch(e.target.value)}
                                            className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-xl border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>

                                    {/* Upload & Tabs */}
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                className="hidden"
                                                ref={musicInputRef}
                                                onChange={handleMusicUpload}
                                            />
                                            <button
                                                onClick={() => musicInputRef.current?.click()}
                                                disabled={uploadingMusic}
                                                className="h-full px-3 bg-blue-600 rounded-lg text-white font-bold text-xs"
                                            >
                                                {uploadingMusic ? '...' : '+ Upload'}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setMusicTab('music')}
                                            className={`flex-1 py-2 rounded-lg font-bold text-sm ${musicTab === 'music' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'}`}
                                        >
                                            Trending
                                        </button>
                                        <button
                                            onClick={() => setMusicTab('sfx')}
                                            className={`flex-1 py-2 rounded-lg font-bold text-sm ${musicTab === 'sfx' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'}`}
                                        >
                                            Sound FX
                                        </button>
                                    </div>

                                    {/* Music List */}
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {filteredMusic.map(music => (
                                            <button
                                                key={music.id}
                                                onClick={() => handleMusicSelect(music)}
                                                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
                                                    <Music size={20} className="text-white" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-white font-bold text-sm truncate">{music.title}</div>
                                                    <div className="text-white/60 text-xs truncate">{music.artist}</div>
                                                </div>
                                                {selectedMusic?.id === music.id && (
                                                    <Check size={20} className="text-purple-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Volume & Start Time */}
                                    {selectedMusic && (
                                        <div className="space-y-3 pt-3 border-t border-white/10">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white text-xs font-bold">Volume</span>
                                                    <span className="text-white/60 text-xs">{Math.round(musicVolume * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={musicVolume}
                                                    onChange={(e) => {
                                                        setMusicVolume(parseFloat(e.target.value));
                                                        if (audioPreviewRef.current) {
                                                            audioPreviewRef.current.volume = parseFloat(e.target.value);
                                                        }
                                                    }}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white text-xs font-bold">Start At</span>
                                                    <span className="text-white/60 text-xs">{musicStartAt}s</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="30"
                                                    step="1"
                                                    value={musicStartAt}
                                                    onChange={(e) => setMusicStartAt(parseInt(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                {preview && (
                    <div className="p-6 bg-black flex gap-3 z-50">
                        <button
                            onClick={() => {
                                setFile(null);
                                setPreview(null);
                                setOverlays([]);
                                setSelectedMusic(null);
                                if (audioPreviewRef.current) {
                                    audioPreviewRef.current.pause();
                                }
                                setIsPreviewPlaying(false);
                            }}
                            className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <><span>Post to Space</span> <Send size={20} /></>}
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                />
            </div>
        </motion.div>
    );
};
