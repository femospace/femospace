import React from 'react';
import { Shield, Eye, Lock, Globe, AlertOctagon, Terminal, Search, UserCheck } from 'lucide-react';

export const Security: React.FC = () => {
    const alerts = [
        { id: '1', level: 'CRITICAL', msg: 'Brute force attempt detected on Admin Node 4', time: '2m ago', type: 'AUTH' },
        { id: '2', level: 'HIGH', msg: 'Multiple rapid wallet withdrawals: User @x_nexus', time: '14m ago', type: 'FINANCE' },
        { id: '3', level: 'MEDIUM', msg: 'Unusual traffic volume from cloud provider subnet', time: '45m ago', type: 'NETWORK' },
    ];

    return (
        <div className="space-y-10 animate-fade-in font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Security Score', value: '94/100', sub: 'Optimal Clearance', icon: <Shield className="text-emerald-400" /> },
                    { label: 'Active Threats', value: '03', sub: 'Requiring Investigation', icon: <AlertOctagon className="text-rose-400" /> },
                    { label: 'IP Bans', value: '1,284', sub: 'Global Blacklist', icon: <Globe className="text-amber-400" /> },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-8 border-t-4 border-transparent hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">{stat.icon}</div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
                        </div>
                        <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500 italic mt-2">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Threat Monitoring */}
                <div className="glass-card overflow-hidden h-fit">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Sentinel Oversight</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Real-time threat detection and mitigation</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-xl ${alert.level === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' :
                                            alert.level === 'HIGH' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">[{alert.level}] - {alert.type}</p>
                                            <span className="text-[10px] font-bold text-slate-600">{alert.time}</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-400 mt-1">{alert.msg}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                    <Terminal size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-5 bg-white/2 border-t border-white/5 text-[10px] font-black text-slate-500 hover:bg-white/5 hover:text-white transition-all uppercase tracking-[0.3em]">
                        View Comprehensive Security Log
                    </button>
                </div>

                {/* Security Tools */}
                <div className="space-y-8">
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-white mb-6 uppercase italic">Access Control</h3>
                        <div className="space-y-4">
                            <button className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-blue-500/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <UserCheck className="text-slate-400 group-hover:text-blue-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">Audit Admin Activity</p>
                                        <p className="text-[10px] font-medium text-slate-500 italic">4 active sessions monitored</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-blue-600/10 text-blue-400 text-[10px] font-black rounded-lg border border-blue-600/20">MANAGE</div>
                            </button>
                            <button className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-rose-500/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <Eye className="text-slate-400 group-hover:text-rose-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">Global Device Monitoring</p>
                                        <p className="text-[10px] font-medium text-slate-500 italic">Tracking fingerprint anomalies</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-rose-600/10 text-rose-400 text-[10px] font-black rounded-lg border border-rose-600/20">TRACK</div>
                            </button>
                            <button className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-amber-500/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <Lock className="text-slate-400 group-hover:text-amber-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">Emergency Protocol Lock</p>
                                        <p className="text-[10px] font-medium text-slate-500 italic">Requires Level 10 Clearance</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-amber-600/10 text-amber-400 text-[10px] font-black rounded-lg border border-amber-600/20 tracking-tighter">RESTRICTED</div>
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Fraud Prevention</h3>
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search IP, Fingerprint, ID..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Confidence</p>
                                    <p className="text-xs font-black text-emerald-400">99.98%</p>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[99.98%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
