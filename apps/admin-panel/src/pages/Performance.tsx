import React from 'react';
import { Clock, CheckCircle, MessageSquare, Star, Zap } from 'lucide-react';

export const EmployeePerformance: React.FC = () => {
    const performances = [
        { name: 'Shan S.', role: 'SUPER_ADMIN', tasks: 142, response: '2m', rating: 4.9, resolution: '98%', status: 'Active' },
        { name: 'Marcus L.', role: 'MANAGER', tasks: 84, response: '12m', rating: 4.7, resolution: '92%', status: 'Active' },
        { name: 'Aria V.', role: 'COMPLAINT_SPECIALIST', tasks: 112, response: '15m', rating: 4.8, resolution: '95%', status: 'Escalated' },
        { name: 'Julian D.', role: 'SUPPORT_AGENT', tasks: 215, response: '8m', rating: 4.5, resolution: '89%', status: 'Busy' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex justify-between items-center bg-white/5 p-8 rounded-[40px] border border-white/10">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Personnel Efficiency Chart</h2>
                    <p className="text-slate-500 font-medium mt-1 italic font-sans uppercase text-[10px] tracking-widest">Real-time performance analytics and node status</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest italic outline-none">Download JSON Audit</button>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest italic outline-none shadow-lg shadow-blue-600/20">Refersh Intelligence</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg. Resolution Time', value: '14m 28s', sub: '-12% improvement', icon: <Clock className="text-blue-400" /> },
                    { label: 'Global Confidence', value: '4.82', sub: 'Based on 1.2K reviews', icon: <Star className="text-amber-400" /> },
                    { label: 'Tasks Completed', value: '2,842', sub: '+18% this month', icon: <CheckCircle className="text-emerald-400" /> },
                    { label: 'Escalation Rate', value: '4.2%', sub: 'Target: < 5.0%', icon: <Zap className="text-rose-400" /> },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-t-2 border-transparent hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">{stat.icon}</div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                        <p className={`text-[10px] font-bold mt-1 ${stat.sub.startsWith('-') ? 'text-emerald-500' : 'text-slate-500'} italic font-mono`}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-8 border-b border-white/5 flex gap-4 bg-gradient-to-r from-blue-600/5 to-transparent flex-col md:flex-row justify-between items-center">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Performance Leaderboard</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 hover:text-white transition-all cursor-pointer border border-white/5 uppercase">Top Performing</span>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 hover:text-white transition-all cursor-pointer border border-white/5 uppercase">Low Engagement</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/2 border-b border-white/5">
                                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Node Entity</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Engagement</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Intelligence</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-center">Stability</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-right">Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {performances.map((perf, i) => (
                                <tr key={i} className="hover:bg-white/2 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-slate-500">
                                                {perf.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-wider italic">{perf.name}</p>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter italic">{perf.role.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-white italic tracking-tighter">{perf.tasks} Active Cycles</p>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest italic italic">Avg Resp: {perf.response}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 shadow-lg" style={{ width: `${perf.rating * 20}%` }} />
                                            </div>
                                            <span className="text-xs font-black text-blue-400 italic font-mono">{perf.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest italic border ${perf.resolution.startsWith('9') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {perf.resolution} MATCH RATE
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 bg-white/5 text-slate-600 hover:text-blue-500 hover:bg-blue-600/10 rounded-xl transition-all border border-white/5 outline-none">
                                            <MessageSquare size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
