import React from 'react';
import { ShieldAlert, MessageSquare, Flag, Trash2, UserX, AlertTriangle, Search, Filter, CheckCircle } from 'lucide-react';

export const Reports: React.FC = () => {
    const moderationStats = [
        { label: 'Unresolved Reports', value: '142', sub: 'Action required', color: 'rose' },
        { label: 'Marketplace Disputes', value: '28', sub: 'Escalated cases', color: 'amber' },
        { label: 'Flagged Content', value: '412', sub: 'Last 24 hours', color: 'blue' },
        { label: 'Spam Detection', value: '98.4%', sub: 'Bot filter accuracy', color: 'emerald' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Moderation Command Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {moderationStats.map((stat) => (
                    <div key={stat.label} className="glass-card p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-0.5 bg-${stat.color}-500/10 text-${stat.color}-500 text-[8px] font-black rounded border border-${stat.color}-500/20 uppercase tracking-widest`}>
                                LIVE METRIC
                            </span>
                            <ActivityIcon color={stat.color} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                            <p className="text-[10px] font-bold text-slate-500 italic mt-0.5">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports Queue */}
                <div className="lg:col-span-2 glass-card">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-rose-500/5 to-transparent flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-white italic">Enforcement Queue</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Reviewing user-submitted reports and automated flags</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Filter cases..."
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-rose-500/50 transition-all shadow-lg shadow-black/20"
                                />
                            </div>
                            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-8 hover:bg-white/2 transition-all flex flex-col md:flex-row gap-6 items-start group">
                                <div className="shrink-0">
                                    <div className={`p-4 rounded-2xl border ${i === 1 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                        {i === 1 ? <ShieldAlert size={28} /> : <Flag size={28} />}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-black text-white group-hover:text-rose-400 transition-colors uppercase italic tracking-wider">
                                                {i === 1 ? 'High-Priority: Fraud Suspicion' : 'Content Violation Report'}
                                            </p>
                                            <span className="px-2 py-0.5 bg-white/5 text-slate-500 text-[8px] font-black rounded border border-white/10 uppercase">
                                                ID: RPT-492{i}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-600 font-mono italic">Reported 1{i}m ago</p>
                                    </div>
                                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                        User <span className="text-white font-bold">@nexus_user</span> has been flagged by the automated fraud system for multiple rapid transactions from different geographic locations. Manual review is required before asset freezing.
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black rounded-lg transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest">
                                            SUSPEND USER
                                        </button>
                                        <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black rounded-lg hover:bg-white/10 transition-all uppercase tracking-widest">
                                            DISMISS REPORT
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-lg hover:bg-blue-600/20 transition-all uppercase tracking-widest">
                                            INVESTIGATE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Moderation Tools */}
                <div className="space-y-8">
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-white mb-6 uppercase italic tracking-tight underline decoration-rose-500/50 underline-offset-8">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white/2 border border-white/5 rounded-[2rem] hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group">
                                <UserX size={24} className="text-slate-500 group-hover:text-rose-500 transition-colors" />
                                <span className="text-[8px] font-bold text-slate-500 group-hover:text-rose-400 transition-colors uppercase tracking-widest">Ban User</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white/2 border border-white/5 rounded-[2rem] hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group">
                                <Trash2 size={24} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                                <span className="text-[8px] font-bold text-slate-500 group-hover:text-blue-400 transition-colors uppercase tracking-widest">Delete Content</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white/2 border border-white/5 rounded-[2rem] hover:bg-amber-500/10 hover:border-amber-500/20 transition-all group">
                                <AlertTriangle size={24} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                                <span className="text-[8px] font-bold text-slate-500 group-hover:text-amber-400 transition-colors uppercase tracking-widest">Warn User</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white/2 border border-white/5 rounded-[2rem] hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group">
                                <MessageSquare size={24} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-[8px] font-bold text-slate-500 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">Global Notice</span>
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-r-4 border-emerald-500">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="text-emerald-500" size={24} />
                            <h3 className="text-lg font-black text-white italic">Platform Pulse</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Moderation Latency</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-black text-white italic">14.2m</p>
                                    <p className="text-[10px] font-bold text-slate-400">Avg Response Time</p>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 italic px-2">System healthy. Automated agents have filtered 4,291 bot attempts today.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityIcon = ({ color }: { color: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`text-${color}-500/40`}>
        <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
