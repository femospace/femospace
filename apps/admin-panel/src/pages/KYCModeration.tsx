import React from 'react';
import { ShieldCheck, User, Scan, CheckCircle, XCircle, AlertTriangle, Eye, Search, Filter } from 'lucide-react';

export const KYCModeration: React.FC = () => {
    const kycStats = [
        { label: 'Pending Reviews', value: '42', sub: 'High Priority', icon: <Scan className="text-amber-400" /> },
        { label: 'Approved Today', value: '128', sub: '+12% from yesterday', icon: <CheckCircle className="text-emerald-400" /> },
        { label: 'Rejected / Fraud', value: '14', sub: '-5% risk reduction', icon: <XCircle className="text-rose-400" /> },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kycStats.map((stat, i) => (
                    <div key={i} className="glass-card p-8 border-l-4 border-transparent hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">{stat.icon}</div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500 italic mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* KYC Queue */}
                <div className="xl:col-span-2 glass-card">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Identity Verification Queue</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Manual document review and AI fraud scoring</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Filter by name, ID..."
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-8 hover:bg-white/2 transition-all flex flex-col md:flex-row gap-8 group">
                                <div className="shrink-0 space-y-4">
                                    <div className="w-48 h-32 bg-slate-800 rounded-2xl border border-white/10 overflow-hidden relative group/img">
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                            <Eye className="text-white" size={24} />
                                        </div>
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">ID_FRONT_IMG_{i}</div>
                                    </div>
                                    <div className="w-48 h-32 bg-slate-800 rounded-2xl border border-white/10 overflow-hidden relative group/img">
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                            <Eye className="text-white" size={24} />
                                        </div>
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">ID_BACK_IMG_{i}</div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h4 className="text-lg font-black text-white italic uppercase tracking-tight">Johnathan Reux_{i}</h4>
                                            <p className="text-xs font-bold text-slate-400">DOB: 12/05/199{i} • Country: {i % 2 === 0 ? 'GE' : 'US'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Fraud Score</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${i === 2 ? 'bg-rose-500 w-[82%]' : 'bg-emerald-500 w-[12%]'}`} />
                                                </div>
                                                <span className={`text-xs font-black ${i === 2 ? 'text-rose-400' : 'text-emerald-400'}`}>{i === 2 ? '82%' : '12%'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-400">
                                        <div className="p-3 bg-white/2 rounded-xl border border-white/5">
                                            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Address Match</p>
                                            <p className="text-sm font-bold text-white italic">SUCCESSFUL</p>
                                        </div>
                                        <div className="p-3 bg-white/2 rounded-xl border border-white/5">
                                            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Face Recognition</p>
                                            <p className="text-sm font-bold text-emerald-400 uppercase italic">99.2% Match</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-white/5">
                                        <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-emerald-600/10 uppercase tracking-[0.2em]">
                                            APPROVE IDENTITY
                                        </button>
                                        <button className="flex-1 py-3 bg-rose-600/10 border border-rose-600/20 text-rose-500 text-[10px] font-black rounded-xl hover:bg-rose-600/20 transition-all uppercase tracking-[0.2em]">
                                            REJECT / FRAUD
                                        </button>
                                        <button className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: System Checks */}
                <div className="space-y-8">
                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-blue-400" size={24} />
                            <h3 className="text-lg font-black text-white italic uppercase">Security Protocols</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <User className="text-slate-500" size={18} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duplicate Check</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400">CLEAN</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between font-mono">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic italic">OCR_CONFIDENCE</span>
                                <span className="text-xs font-black text-white">0.9928</span>
                            </div>
                            <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-[0.2em]">
                                Verification Settings
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-r-4 border-amber-500">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-amber-500" size={24} />
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Fraud Pulse</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                                4 identity profiles flagged for manual investigation due to conflicting geographic coordinates and document metadata.
                            </p>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[14%] h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mt-2 italic">
                                <span>Threat Intelligence</span>
                                <span className="text-amber-400">Low Risk</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
