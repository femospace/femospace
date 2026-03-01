import React, { useState } from 'react';
import { Radio, ShieldCheck, Maximize2, X } from 'lucide-react';
import { useStudio } from '../StudioContext';
import { useNavigate } from 'react-router-dom';

export const StudioHeader: React.FC = () => {
    const { isStreaming, saveChanges } = useStudio();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveChanges();
            setTimeout(() => setIsSaving(false), 1000);
        } catch (error) {
            console.error(error);
            setIsSaving(false);
        }
    };

    return (
        <div className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-6 select-none shadow-2xl z-50">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                        <Radio size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-xs uppercase tracking-tighter">Femo Studio <span className="text-red-600 font-bold ml-1">PRO</span></h1>
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-0.5">Control Center</p>
                    </div>
                </div>

                {isStreaming && (
                    <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">Live</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isSaving ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                        }`}
                >
                    <div className={isSaving ? 'animate-spin' : ''}>
                        <Radio size={12} className={isSaving ? 'text-green-500' : 'text-neutral-500'} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{isSaving ? 'Saving...' : 'Save Layout'}</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span className="text-blue-500 text-[10px] font-black uppercase">Verified Broadcaster</span>
                </div>

                <div className="flex items-center gap-1 border-l border-white/10 ml-2 pl-4">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-neutral-500 hover:text-white transition-all">
                        <Maximize2 size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/videos')}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-500 hover:text-red-500 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
