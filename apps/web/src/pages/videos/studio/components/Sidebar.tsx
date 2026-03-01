import React, { useState } from 'react';
import { Plus, Trash2, MessageSquare, Users } from 'lucide-react';
import { useStudio } from '../StudioContext';

export const SidebarLeft: React.FC = () => {
    const { scenes, activeSceneId, setActiveScene, addScene, deleteScene, renameScene } = useStudio();
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="w-64 bg-neutral-900 border-r border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Scenes</h3>
                <button
                    onClick={() => addScene(`Scene ${scenes.length + 1}`)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <Plus size={16} className="text-white" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {scenes.map((scene) => (
                    <div
                        key={scene.id}
                        onClick={() => setActiveScene(scene.id)}
                        onDoubleClick={() => setEditingId(scene.id)}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${activeSceneId === scene.id ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/5'
                            }`}
                    >
                        {editingId === scene.id ? (
                            <input
                                autoFocus
                                className="bg-black/40 text-white text-sm outline-none w-full rounded px-1"
                                defaultValue={scene.name}
                                onBlur={(e) => {
                                    renameScene(scene.id, e.target.value);
                                    setEditingId(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        renameScene(scene.id, (e.target as HTMLInputElement).value);
                                        setEditingId(null);
                                    }
                                }}
                            />
                        ) : (
                            <span className="text-sm font-medium truncate">{scene.name}</span>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }}
                            className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-black/20 rounded transition-all ${activeSceneId === scene.id ? 'text-white' : 'text-red-400'
                                }`}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SidebarRight: React.FC = () => {
    const { viewerCount, health } = useStudio();

    return (
        <div className="w-80 bg-neutral-900 border-l border-white/5 flex flex-col">
            {/* Health & Stats */}
            <div className="p-4 border-b border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-blue-400" />
                        <span className="text-white font-bold">{viewerCount}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${health.status === 'good' ? 'bg-green-500/20 text-green-500' :
                        health.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${health.status === 'good' ? 'bg-green-500' :
                            health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                        {health.status}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/20 p-2 rounded border border-white/5 text-center">
                        <div className="text-neutral-500 text-[10px] uppercase">Bitrate</div>
                        <div className="text-white font-mono text-xs">{health.bitrate} kbps</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-white/5 text-center">
                        <div className="text-neutral-500 text-[10px] uppercase">FPS</div>
                        <div className="text-white font-mono text-xs">{health.fps}</div>
                    </div>
                </div>
            </div>

            {/* Chat */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={16} /> Chat
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-400">User_{i}</span>
                            <span className="text-[10px] text-neutral-500">12:0{i}</span>
                        </div>
                        <p className="text-sm text-neutral-300">This is a mockup chat message for the studio! 🚀✨</p>
                    </div>
                ))}
            </div>

            {/* Reactions Feed */}
            <div className="h-48 border-t border-white/10 p-4 relative overflow-hidden flex flex-col items-start">
                <h4 className="text-white/40 text-[10px] uppercase font-bold mb-2">Reactions</h4>
                <div className="flex-1 flex flex-wrap gap-2 content-start">
                    {['❤️', '🔥', '✨', '🚀', '👏'].map((emoji, i) => (
                        <div key={i} className="bg-white/5 px-2 py-1 rounded text-lg animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                            {emoji}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
