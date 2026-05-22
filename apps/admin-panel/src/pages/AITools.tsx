import React from 'react';
import { Cpu, Zap, Activity, ShieldAlert, HardDrive, RefreshCw } from 'lucide-react';

export const AITools: React.FC = () => {
    const clusterStats = [
        { label: 'AI Compute Load', value: '42.8%', detail: 'System-wide utilization', icon: <Cpu size={20} className="text-blue-400" /> },
        { label: 'Daily Requests', value: '184k', detail: '+12.4% from yesterday', icon: <Zap size={20} className="text-amber-400" /> },
        { label: 'Accuracy Rating', value: '99.9%', detail: 'Validation pass rate', icon: <Activity size={20} className="text-emerald-400" /> },
        { label: 'Active Models', value: '12', detail: 'Running across 3 clusters', icon: <HardDrive size={20} className="text-indigo-400" /> },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Cluster Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clusterStats.map((stat) => (
                    <div key={stat.label} className="glass-card p-6 border-l-4 border-transparent hover:border-blue-500 transition-all group">
                        <div className="flex justify-between items-center mb-6">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                {stat.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500 italic">{stat.detail}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Usage & Limits Management */}
                <div className="xl:col-span-2 glass-card">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Intelligence Oversight</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Manage global AI constraints and neural performance</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-blue-400 text-xs font-black hover:bg-white/10 transition-all">
                            <RefreshCw size={14} />
                            FLUSH BUFFERS
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="space-y-8">
                            {[
                                { name: 'Gemini-1.5-Pro Cluster', usage: 78, type: 'CORE INTEL', health: 'OPTIMAL' },
                                { name: 'LLama-3-Ultra (Self-Hosted)', usage: 32, type: 'CONTENT MOD', health: 'STABLE' },
                                { name: 'Femo Vision Processor', usage: 56, type: 'IMAGE GEN', health: 'LOAD BALANCING' },
                            ].map((model, i) => (
                                <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all group">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400">
                                                <Zap size={24} className="group-hover:text-amber-400 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{model.name}</p>
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">{model.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-10">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Health</p>
                                                <p className="text-xs font-black text-emerald-400 group-hover:animate-pulse">{model.health}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Duty Cycle</p>
                                                <p className="text-xs font-black text-white">{model.usage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${model.usage > 70 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                }`}
                                            style={{ width: `${model.usage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Global Policy Settings */}
                <div className="space-y-8">
                    <div className="glass-card p-8 bg-gradient-to-br from-amber-500/5 to-transparent border-t-2 border-amber-500/20">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldAlert className="text-amber-500" size={24} />
                            <h3 className="text-lg font-black text-white italic">Neural Constraints</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 tracking-widest uppercase">
                                    <span>Standard User Limit</span>
                                    <span className="text-white">20/day</span>
                                </div>
                                <input type="range" className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 tracking-widest uppercase">
                                    <span>Pro Member Limit</span>
                                    <span className="text-white">UNLIMITED</span>
                                </div>
                                <input type="range" className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" defaultValue={100} />
                            </div>
                            <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 italic">Policy enforcement active across all nodes.</p>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-white mb-6">Inference Cost Tracking</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4 py-3 bg-white/2 rounded-xl border border-white/5">
                                <p className="text-xs font-bold text-slate-400 italic font-mono">EST_MTD_COST</p>
                                <p className="text-sm font-black text-white font-mono">$1,294.52</p>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-white/2 rounded-xl border border-white/5">
                                <p className="text-xs font-bold text-slate-400 italic font-mono">AVG_REQ_COST</p>
                                <p className="text-sm font-black text-white font-mono">$0.0021</p>
                            </div>
                            <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-[0.2em]">
                                System Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
