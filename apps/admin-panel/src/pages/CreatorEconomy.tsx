import React from 'react';
import { Star, TrendingUp, Users, DollarSign, Award, CheckCircle, Search, Filter } from 'lucide-react';

export const CreatorEconomy: React.FC = () => {
    const metaStats = [
        { label: 'Total Creators', value: '8,291', sub: 'Verified across all tiers', icon: <Users size={20} className="text-blue-400" /> },
        { label: 'Platform Payouts', value: '$841k', sub: 'Last 30 days', icon: <DollarSign size={20} className="text-emerald-400" /> },
        { label: 'Engaged Viewers', value: '2.4M', sub: 'Monthly active audience', icon: <Star size={20} className="text-amber-400" /> },
        { label: 'Growth Velocity', value: '+24%', sub: 'New creators vs last month', icon: <TrendingUp size={20} className="text-indigo-400" /> },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metaStats.map((stat) => (
                    <div key={stat.label} className="glass-card p-6 flex items-center gap-6 border-b-2 border-transparent hover:border-blue-500/30 transition-all cursor-default">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creator Leaderboard / Directory */}
                <div className="lg:col-span-2 glass-card">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/5 to-transparent">
                        <div>
                            <h3 className="text-xl font-black text-white">Elite Creator Network</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">High-performance management and tiers</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Find creators..."
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/2 border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Profile</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tier</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Earnings</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: 'Nexus Prime', tier: 'PLATINUM', earnings: '$45,290', status: 'ACTIVE' },
                                    { name: 'Solaris Visuals', tier: 'GOLD', earnings: '$28,400', status: 'PENDING PAYOUT' },
                                    { name: 'Byte Master', tier: 'EMERALD', earnings: '$104,800', status: 'ACTIVE' },
                                    { name: 'Cyber Queen', tier: 'SILVER', earnings: '$12,300', status: 'ON REVIEW' },
                                ].map((creator, i) => (
                                    <tr key={i} className="hover:bg-white/2 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5">
                                                    <img src={`https://ui-avatars.com/api/?name=${creator.name}&background=0f172a&color=fff`} className="w-full h-full rounded-full border-2 border-[#1e293b]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase">{creator.name}</p>
                                                    <p className="text-[10px] font-bold text-blue-500 tracking-wider">CREATOR_ID: {1000 + i}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <Award size={14} className={creator.tier === 'EMERALD' ? 'text-emerald-400' : 'text-blue-400'} />
                                                <span className="text-xs font-black text-slate-300">{creator.tier}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-white">{creator.earnings}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${creator.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    creator.status === 'ON REVIEW' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {creator.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-[10px] font-black px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-slate-300">
                                                MANAGE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar: Applications & Alerts */}
                <div className="space-y-8">
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-white mb-6">Certification Queue</h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Application #{298 + i}</p>
                                            <p className="text-[10px] font-bold text-slate-500 italic">Reviewing portfolio...</p>
                                        </div>
                                    </div>
                                    <TrendingUp size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl hover:bg-blue-500 transition-all uppercase tracking-widest shadow-lg shadow-blue-500/20">
                            Open Certification Hub
                        </button>
                    </div>

                    <div className="glass-card p-8 bg-gradient-to-br from-blue-600/10 to-transparent">
                        <div className="flex items-center gap-3 mb-6">
                            <Award className="text-amber-400" size={24} />
                            <h3 className="text-lg font-black text-white italic">Femo Creator Tiers</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-black text-emerald-400 tracking-[0.2em]">EMERALD CLASSIFICATION</p>
                                    <p className="text-xs font-black text-white">42</p>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full">
                                    <div className="w-[42%] h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-black text-blue-400 tracking-[0.2em]">PLATINUM NETWORK</p>
                                    <p className="text-xs font-black text-white">128</p>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full">
                                    <div className="w-[65%] h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
