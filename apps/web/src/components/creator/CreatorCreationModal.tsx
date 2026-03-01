import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    FileText,
    Video,
    Play,
    Layout,
    Users,
    Radio,
    ChevronRight,
    ArrowLeft,
    Upload,
    Globe,
    Lock
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CountrySelector } from '../common/CountrySelector';
import clsx from 'clsx';

interface CreatorCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type CreationType = 'post' | 'video' | 'reel' | 'page' | 'group' | 'channel' | null;

export const CreatorCreationModal: React.FC<CreatorCreationModalProps> = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [selectedType, setSelectedType] = useState<CreationType>(null);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        country: '',
        visibility: 'public' as 'public' | 'private' | 'restricted',
    });

    const resetForm = () => {
        setStep('select');
        setSelectedType(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            country: '',
            visibility: 'public',
        });
    };

    const handleTypeSelect = (type: CreationType) => {
        setSelectedType(type);
        setStep('form');
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetForm, 300);
    };

    const options = [
        { id: 'post', label: 'Feed Post', icon: FileText, desc: 'Share updates, photos, or thoughts', color: 'bg-blue-500' },
        { id: 'video', label: 'Long Video', icon: Video, desc: 'Upload high-quality long-form content', color: 'bg-indigo-500' },
        { id: 'reel', label: 'Short Reel', icon: Play, desc: 'Create viral short videos with music', color: 'bg-pink-500' },
        { id: 'page', label: 'Official Page', icon: Layout, desc: 'Build your professional brand presence', color: 'bg-orange-500', needsCountry: true },
        { id: 'group', label: 'Community Group', icon: Users, desc: 'Host discussions and build community', color: 'bg-green-500', needsCountry: true },
        { id: 'channel', label: 'Broadcast Channel', icon: Radio, desc: 'One-to-many updates for your audience', color: 'bg-purple-500', needsCountry: true },
    ];

    const currentOption = options.find(o => o.id === selectedType);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={clsx(
                            "relative w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl border",
                            isDark ? "bg-[#0f172a] border-white/10" : "bg-white border-slate-200"
                        )}
                    >
                        {/* Header */}
                        <div className={clsx(
                            "px-10 py-8 flex items-center justify-between border-b",
                            isDark ? "border-white/5" : "border-slate-100"
                        )}>
                            <div className="flex items-center gap-4">
                                {step === 'form' && (
                                    <button
                                        onClick={() => setStep('select')}
                                        className={clsx(
                                            "p-2 rounded-full transition-all",
                                            isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
                                        )}
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div>
                                    <h2 className={clsx("text-xl font-black uppercase tracking-widest", isDark ? "text-white" : "text-slate-900")}>
                                        {step === 'select' ? 'Create Something New' : `Create ${currentOption?.label}`}
                                    </h2>
                                    <p className={clsx("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-white/40" : "text-slate-400")}>
                                        {step === 'select' ? 'Select your content type' : currentOption?.desc}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className={clsx(
                                    "p-3 rounded-2xl transition-all",
                                    isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                                )}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 max-h-[70vh] overflow-y-auto remove-scrollbar">
                            {step === 'select' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {options.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleTypeSelect(opt.id as CreationType)}
                                            className={clsx(
                                                "group flex flex-col items-start text-left p-6 rounded-[32px] border transition-all duration-300",
                                                isDark
                                                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/50"
                                                    : "bg-slate-50 border-slate-100 hover:bg-blue-50/50 hover:border-blue-200"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110",
                                                opt.color,
                                                "text-white"
                                            )}>
                                                <opt.icon size={24} />
                                            </div>
                                            <h3 className={clsx("font-black text-sm uppercase tracking-widest mb-2", isDark ? "text-white" : "text-slate-900")}>
                                                {opt.label}
                                            </h3>
                                            <p className={clsx("text-xs leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>
                                                {opt.desc}
                                            </p>
                                            <div className="mt-6 flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                Start Creating <ChevronRight size={14} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Common Form Fields */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className={clsx("block text-[10px] font-black uppercase tracking-widest mb-2 pl-2", isDark ? "text-white/40" : "text-slate-400")}>
                                                Title / Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`Enter ${selectedType} title...`}
                                                className={clsx(
                                                    "w-full px-6 py-4 rounded-2xl border transition-all outline-none",
                                                    isDark
                                                        ? "bg-white/5 border-white/10 text-white focus:border-blue-500"
                                                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                                )}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className={clsx("block text-[10px] font-black uppercase tracking-widest mb-2 pl-2", isDark ? "text-white/40" : "text-slate-400")}>
                                                Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                placeholder={`What's your ${selectedType} about?`}
                                                className={clsx(
                                                    "w-full px-6 py-4 rounded-2xl border transition-all outline-none resize-none",
                                                    isDark
                                                        ? "bg-white/5 border-white/10 text-white focus:border-blue-500"
                                                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                                )}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        {/* Country Selector for Pages/Groups/Channels */}
                                        {currentOption?.needsCountry && (
                                            <CountrySelector
                                                label="Target Region / Country"
                                                value={formData.country}
                                                onChange={(c) => setFormData({ ...formData, country: c.code })}
                                            />
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <label className={clsx("block text-[10px] font-black uppercase tracking-widest mb-2 pl-2", isDark ? "text-white/40" : "text-slate-400")}>
                                                    Visibility
                                                </label>
                                                <div className="flex gap-2">
                                                    {(['public', 'private'] as const).map((v) => (
                                                        <button
                                                            key={v}
                                                            onClick={() => setFormData({ ...formData, visibility: v })}
                                                            className={clsx(
                                                                "flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                                formData.visibility === v
                                                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                                    : isDark
                                                                        ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                                                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                                                            )}
                                                        >
                                                            {v === 'public' ? <div className="flex items-center justify-center gap-2"><Globe size={11} /> Public</div> : <div className="flex items-center justify-center gap-2"><Lock size={11} /> Private</div>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className={clsx("block text-[10px] font-black uppercase tracking-widest mb-2 pl-2", isDark ? "text-white/40" : "text-slate-400")}>
                                                    Upload Cover
                                                </label>
                                                <button className={clsx(
                                                    "w-full py-3 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                                    isDark
                                                        ? "bg-white/5 border-white/20 text-white/40 hover:bg-white/10 hover:border-blue-500/50"
                                                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-blue-500/50"
                                                )}>
                                                    <Upload size={14} /> Media File
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-sm rounded-[24px] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                            Publish {selectedType} <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
