import React from 'react';
import { AlertCircle, Shield, MessageSquare, ArrowUpRight, CheckCircle2, MoreVertical, Search, Filter, Zap } from 'lucide-react';

export const ComplaintsEscalation: React.FC = () => {
    const complaints = [
        { id: '1', user: 'X_Matrix', msg: 'Fraudulent transaction in Marketplace node 4.', level: 'CRITICAL', status: 'ESCALATED', type: 'FRAUD', date: '4m ago' },
        { id: '2', user: 'Crypto_Zen', msg: 'Unable to withdraw pending balance after verification.', level: 'HIGH', status: 'PENDING', type: 'WALLET', date: '12m ago' },
        { id: '3', user: 'Femo_User_88', msg: 'Terms of service violation on profile @x_nexus.', level: 'MEDIUM', status: 'RESOLVED', type: 'CONTENT', date: '1h ago' },
        { id: '4', user: 'Digital_Flow', msg: 'App login latency exceeding 400ms in Tokyo region.', level: 'LOW', status: 'PROCESSING', type: 'NETWORK', date: '2h ago' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Complaints', value: '184', icon: <AlertCircle size={20} className="text-amber-400" /> },
                    { label: 'Escalated Cases', value: '12', icon: <ArrowUpRight size={20} className="text-rose-400" /> },
                    { label: 'Avg. Resolution', value: '42m', icon: <Zap size={20} className="text-blue-400" /> },
                    { label: 'Resolved Today', value: '84', icon: <CheckCircle2 size={20} className="text-emerald-400" /> },
                ].map((item, i) => (
                    <div key={i} className="glass-card p-6 border-l-4 border-transparent hover:border-blue-500 transition-all flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                            <h3 className="text-3xl font-black text-white italic tracking-tighter mt-2">{item.value}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">{item.icon}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Complaint Flow Queue */}
                <div className="xl:col-span-2 glass-card">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Incident Response Board</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Multi-tier escalation and dispute resolution matrix</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input placeholder="Filter incidents..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-blue-500 transition-all shadow-lg" />
                            </div>
                            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Filter size={16} /></button>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5 font-sans">
                        {complaints.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-white/2 transition-all flex flex-col md:flex-row gap-6 relative">
                                <div className={`w-1 h-12 rounded-full absolute left-0 top-1/2 -translate-y-1/2 ${item.level === 'CRITICAL' ? 'bg-rose-500' : item.level === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />

                                <div className="shrink-0">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-slate-500 shadow-xl">
                                        <Shield size={24} className={item.id === '1' ? 'text-rose-500' : 'text-slate-600'} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mt-3 font-mono">{item.date}</p>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-sm font-black text-white uppercase italic tracking-wider">@{item.user}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black italic tracking-widest border ${item.status === 'ESCALATED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    item.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 italic">Type: <span className="text-white">{item.type}</span> • Level: <span className={item.level === 'CRITICAL' ? 'text-rose-400' : 'text-slate-300'}>{item.level}</span></p>
                                        </div>
                                        <button className="p-2 text-slate-600 hover:text-white transition-all"><MoreVertical size={18} /></button>
                                    </div>
                                    <p className="text-sm font-medium text-slate-400 leading-relaxed italic pr-12">"{item.msg}"</p>
                                    <div className="flex gap-4 pt-4">
                                        <button className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-[0.2em] italic">Assign Staff</button>
                                        <button className="flex-1 py-3 bg-rose-600/10 border border-rose-600/20 text-rose-500 text-[10px] font-black rounded-xl hover:bg-rose-600/20 transition-all uppercase tracking-[0.2em] italic">Escalate Case</button>
                                        <button className="p-3 bg-blue-600/10 border border-blue-600/20 text-blue-500 rounded-xl hover:bg-blue-600/20 transition-all"><MessageSquare size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Escalation Context */}
                <div className="space-y-8">
                    <div className="glass-card p-8 bg-gradient-to-br from-rose-600/10 to-transparent">
                        <div className="flex items-center gap-3 mb-8">
                            <Zap className="text-rose-400" size={24} />
                            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">High-Priority Matrix</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'Dispute Resolution Rate', val: '92%', change: '+4%', shadow: 'shadow-blue-500/20' },
                                { title: 'Avg Escalation Delay', val: '8m 42s', change: '-12%', shadow: 'shadow-emerald-500/20' },
                                { title: 'User Satisfaction', val: '4.8', change: 'Optimal', shadow: 'shadow-amber-500/20' },
                            ].map((stat, i) => (
                                <div key={i} className={`bg-white/5 border border-white/10 p-5 rounded-2xl ${stat.shadow} shadow-lg group hover:scale-[1.02] transition-transform cursor-pointer`}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.title}</p>
                                    <div className="flex items-baseline gap-3 mt-2">
                                        <h5 className="text-2xl font-black text-white italic tracking-tighter">{stat.val}</h5>
                                        <span className={`text-[10px] font-black italic ${stat.change.startsWith('+') ? 'text-emerald-400' : stat.change.startsWith('-') ? 'text-blue-400' : 'text-amber-400'}`}>{stat.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 border-l-4 border-blue-500">
                        <h4 className="text-sm font-black text-white uppercase italic tracking-widest mb-4">Escalation Protocol</h4>
                        <p className="text-[11px] font-medium text-slate-400 italic leading-relaxed font-sans">
                            Incidents identified as 'CRITICAL' or containing 'FRAUD' signatures are automatically routed to the Complaint Specialists node. Manual escalation is restricted to General Staff oversight level.
                        </p>
                        <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black rounded-xl hover:text-white transition-all uppercase tracking-[0.2em] italic">View Global Audit Logs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
