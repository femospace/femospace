import React, { useState } from 'react';
import {
    Layers, Sliders, Play, Square, Video, Mic,
    Monitor, Image as ImageIcon, Globe, Type,
    ShieldAlert, Lock, Unlock, Eye, EyeOff, Settings as SettingsIcon,
    CircleDot, Plus, Trash2, X
} from 'lucide-react';
import { useStudio, SourceType } from '../StudioContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer: React.FC = () => {
    const {
        isStreaming, isRecording, activeSceneId, scenes,
        addSource, updateSource, deleteSource,
        startStream, stopStream, toggleRecord
    } = useStudio();

    const activeScene = scenes.find(s => s.id === activeSceneId);
    const [showSourceMenu, setShowSourceMenu] = useState(false);
    const [showGoLiveModal, setShowGoLiveModal] = useState(false);
    const [streamTitle, setStreamTitle] = useState('My Galactic Stream');
    const [streamVisibility, setStreamVisibility] = useState('public');

    const sourceTypes: { type: SourceType; icon: React.ReactElement; label: string }[] = [
        { type: 'webcam', icon: <Video />, label: 'Webcam' },
        { type: 'screen', icon: <Monitor />, label: 'Screen Share' },
        { type: 'image', icon: <ImageIcon />, label: 'Image' },
        { type: 'text', icon: <Type />, label: 'Text Overlay' },
        { type: 'chat', icon: <Globe />, label: 'Chat Overlay' },
        { type: 'alert', icon: <ShieldAlert />, label: 'Alert Box' },
    ];

    const handleStartStream = async () => {
        try {
            await startStream(streamTitle, streamVisibility);
            setShowGoLiveModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!activeScene) return null;

    return (
        <div className="h-80 bg-neutral-900 border-t border-white/10 flex">
            {/* Go Live Modal */}
            <AnimatePresence>
                {showGoLiveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-white font-black text-lg uppercase tracking-tight">Stream Settings</h3>
                                <button onClick={() => setShowGoLiveModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Broadcast Title</label>
                                    <input
                                        type="text"
                                        value={streamTitle}
                                        onChange={(e) => setStreamTitle(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="What are you streaming today?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Visibility</label>
                                    <div className="flex gap-2">
                                        {['public', 'private', 'unlisted'].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => setStreamVisibility(v)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${streamVisibility === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-black/20">
                                <button
                                    onClick={handleStartStream}
                                    className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all active:scale-[0.98]"
                                >
                                    Confirm & Go Live
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sources List */}
            <div className="w-80 border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h3 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                        <Layers size={14} /> Sources
                    </h3>
                    <div className="relative">
                        <button
                            onClick={() => setShowSourceMenu(!showSourceMenu)}
                            className="p-1 hover:bg-white/10 rounded transition-colors text-white"
                        >
                            <Plus size={16} />
                        </button>
                        {showSourceMenu && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-neutral-800 border border-white/10 rounded-lg shadow-2xl z-50 p-1">
                                {sourceTypes.map((st) => (
                                    <button
                                        key={st.type}
                                        onClick={() => {
                                            addSource(activeSceneId, st.type, st.label);
                                            setShowSourceMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-blue-600 rounded-md transition-all text-xs"
                                    >
                                        {React.cloneElement(st.icon, { size: 14 } as any)}
                                        {st.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {activeScene.sources.slice().reverse().map((source) => (
                        <div key={source.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-neutral-300">
                            <span className="cursor-grab active:cursor-grabbing text-neutral-600">⠿</span>
                            <span className="flex-1 text-xs font-medium truncate">{source.name}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => updateSource(activeSceneId, source.id, { isVisible: !source.isVisible })}
                                    className={`p-1 rounded ${source.isVisible ? 'text-blue-400' : 'text-neutral-600'}`}
                                >
                                    {source.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                                </button>
                                <button
                                    onClick={() => updateSource(activeSceneId, source.id, { isLocked: !source.isLocked })}
                                    className={`p-1 rounded ${source.isLocked ? 'text-yellow-400' : 'text-neutral-600'}`}
                                >
                                    {source.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                                </button>
                                <button
                                    onClick={() => deleteSource(activeSceneId, source.id)}
                                    className="p-1 rounded text-red-400 hover:bg-red-400/20"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audio Mixer */}
            <div className="flex-1 border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/10 bg-black/20">
                    <h3 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                        <Sliders size={14} /> Audio Mixer
                    </h3>
                </div>
                <div className="p-4 grid grid-cols-4 gap-4 overflow-x-auto">
                    {['Desktop Audio', 'Mic/Aux', 'Video Source'].map((name, i) => (
                        <div key={name} className="flex flex-col gap-2 bg-black/20 p-3 rounded-lg border border-white/5 h-fit">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">{name}</span>
                                <CircleDot size={10} className={i === 1 ? 'text-green-500' : 'text-neutral-600'} />
                            </div>
                            <div className="h-32 w-full bg-neutral-950 rounded relative overflow-hidden flex flex-col items-center">
                                {/* Visualizer Mock */}
                                <div className="absolute bottom-0 left-1 right-1 bg-green-500/80 rounded-t" style={{ height: i === 1 ? '40%' : '5%' }} />
                                <div className="absolute bottom-0 left-1 right-1 bg-yellow-400/80 rounded-t" style={{ height: i === 1 ? '70%' : '0%', opacity: 0.5 }} />

                                <input
                                    type="range"
                                    className="h-full w-2 accent-white rotate-180 opacity-0 absolute inset-0 cursor-pointer"
                                    style={{ writingMode: 'bt-lr' as any }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <button className="p-1 text-neutral-400 hover:text-white transition-colors">
                                    <Mic size={14} />
                                </button>
                                <span className="text-[10px] font-mono text-neutral-500">-12.4 dB</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="w-64 p-6 flex flex-col gap-3 items-center justify-center bg-black/40">
                <button
                    onClick={isStreaming ? stopStream : () => setShowGoLiveModal(true)}
                    className={`w-full py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${isStreaming ? 'bg-neutral-800 text-red-500 border-2 border-red-500/20' : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                        }`}
                >
                    {isStreaming ? (
                        <><Square size={20} fill="currentColor" /> END STREAM</>
                    ) : (
                        <><Play size={20} fill="currentColor" /> START STREAM</>
                    )}
                </button>

                <div className="flex gap-3 w-full">
                    <button
                        onClick={toggleRecord}
                        className={`flex-1 p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${isRecording ? 'bg-red-500/10 text-red-500 border-red-500' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <CircleDot size={16} fill={isRecording ? 'currentColor' : 'none'} className={isRecording ? 'animate-pulse' : ''} />
                        {isRecording ? 'STOP REC' : 'RECORD'}
                    </button>
                    <button className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <SettingsIcon size={16} />
                        SETTINGS
                    </button>
                </div>

                <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Live Timer</span>
                    <span className="text-2xl font-mono text-white tracking-widest leading-none">00:00:00</span>
                </div>
            </div>
        </div>
    );
};

