import React from 'react';
import { Megaphone, Activity, XCircle, Search, Eye, Target, Play, Image as ImageIcon } from 'lucide-react';

export const AdModeration: React.FC = () => {
    const adStats = [
        { label: 'Pending Approval', value: '34', icon: <Megaphone size={20} className="text-blue-400" /> },
        { label: 'Running Campaigns', value: '182', icon: <Activity size={20} className="text-emerald-400" /> },
        { label: 'Rejected (Policy)', value: '12', icon: <XCircle size={20} className="text-rose-400" /> },
        { label: 'Platform Rev Share', value: '$8.2K', icon: <Target size={20} className="text-indigo-400" /> },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20 font-sans">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adStats.map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex items-start justify-between border-t-2 border-transparent hover:border-blue-500 transition-all">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-white mt-2 italic tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Ad Approval Queue */}
                <div className="xl:col-span-2 glass-card h-fit">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Advertising Review Board</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Reviewing creatives and targeting parameters for policy compliance</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input placeholder="Filter campaigns..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all shadow-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {[1, 2, 3].map((idx) => (
                            <div key={idx} className="p-8 hover:bg-white/2 transition-all group">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Creative Preview */}
                                    <div className="shrink-0 w-full md:w-64 aspect-video bg-slate-800 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center group flex-col">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] font-black text-white uppercase italic mb-1 tracking-widest">Preview Scale: 100%</p>
                                        </div>
                                        {idx % 2 === 0 ? <Play className="text-blue-500" size={48} /> : <ImageIcon className="text-slate-600" size={48} />}
                                        <span className="text-[8px] font-black text-slate-700 bg-white/5 px-2 py-0.5 rounded mt-2 uppercase tracking-widest">AD_ASSET_{idx}92</span>
                                    </div>

                                    {/* Ad Details */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-lg font-black text-white italic uppercase tracking-tight">Campaign_Nexus_Launch_{idx}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black italic tracking-widest border ${idx === 1 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                        {idx === 1 ? 'CAROUSEL' : 'VIDEO AD'}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Advertiser: <span className="text-white italic">Nexus_Corporate_Entity_{idx}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Proposed Budget</p>
                                                <p className="text-xl font-black text-emerald-400 tracking-tighter italic">${(idx * 500).toLocaleString()}.00</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="p-3 bg-white/2 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Objective</p>
                                                <p className="text-[10px] font-black text-white italic">WEBSITE_TRAFFIC</p>
                                            </div>
                                            <div className="p-3 bg-white/2 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Audience</p>
                                                <p className="text-[10px] font-black text-white italic">US-UK | 18-34 | TECH</p>
                                            </div>
                                            <div className="p-3 bg-white/2 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Bid Strategy</p>
                                                <p className="text-[10px] font-black text-white italic">MODERATE_CPC</p>
                                            </div>
                                            <div className="p-3 bg-white/2 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Run Time</p>
                                                <p className="text-[10px] font-black text-white italic">7 DAYS</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4 border-t border-white/5">
                                            <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 uppercase tracking-[0.2em] italic">
                                                CONFIRM & DEPLOY
                                            </button>
                                            <button className="flex-1 py-3 bg-rose-600/10 border border-rose-600/20 text-rose-500 text-[10px] font-black rounded-xl hover:bg-rose-600/20 transition-all uppercase tracking-[0.2em] italic">
                                                REJECT CONTENT
                                            </button>
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance & Marketplace Stats */}
                <div className="space-y-8">
                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <div className="flex items-center gap-3 mb-8">
                            <Target className="text-indigo-400" size={24} />
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">System Intelligence</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Average CTR', val: '2.48%', trend: '+0.12%' },
                                { label: 'Revenue/Impression', val: '$0.042', trend: '+14%' },
                                { label: 'Ad Load Ratio', val: '12%', trend: 'Optimal' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/2 p-4 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white italic tracking-tighter">{item.val}</p>
                                        <p className="text-[8px] font-bold text-emerald-400">{item.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-[0.2em] italic">
                            Full Analytics Hub
                        </button>
                    </div>

                    <div className="glass-card p-8 border-l-4 border-indigo-500">
                        <h3 className="text-lg font-black text-white mb-6 uppercase italic tracking-tighter">Policy Enforcement</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4 italic">Global Sensitivity Threshold</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[82%] h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    </div>
                                    <span className="text-xs font-black text-white italic">0.82</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 italic px-2">
                                AI moderation active across 32 creative inspection threads. Latency: 42ms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
