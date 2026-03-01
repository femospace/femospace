import React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Activity, TrendingUp, Cpu, Server, Database, Globe } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Total Users', value: '45.2K', trend: '+12.5%', icon: <Users className="text-blue-400" />, color: 'blue' },
        { label: 'Active Sessions', value: '12.8K', trend: '+8.2%', icon: <Activity className="text-emerald-400" />, color: 'emerald' },
        { label: 'Monthly Revenue', value: '$84,200', trend: '+24.1%', icon: <CreditCard className="text-amber-400" />, color: 'amber' },
        { label: 'Ecosystem Growth', value: '18.4%', trend: '+4.5%', icon: <TrendingUp className="text-indigo-400" />, color: 'indigo' }
    ];

    const serverHealth = [
        { name: 'API Services', status: 'Optimal', load: '32%', icon: <Server size={18} /> },
        { name: 'User Database', status: 'Stable', load: '45%', icon: <Database size={18} /> },
        { name: 'Media Storage', status: 'Heavy', load: '78%', icon: <Cpu size={18} /> },
        { name: 'CDN Nodes', status: 'Global', load: '12%', icon: <Globe size={18} /> }
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-slate-700/30"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700/30">
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'} bg-black/20 px-2 py-1 rounded-lg`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 border border-slate-700/30">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-white">Platform Activity Chart</h3>
                        <div className="flex gap-4">
                            <button className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg border border-transparent transition-all">Hourly</button>
                            <button className="text-xs font-bold text-white px-3 py-1 bg-blue-600 rounded-lg border border-blue-500/50 shadow-lg shadow-blue-500/20 transition-all">Today</button>
                            <button className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg border border-transparent transition-all">Monthly</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full bg-gradient-to-b from-blue-600/5 to-transparent border-b border-l border-slate-700/30 flex items-end px-12 pb-8 gap-8">
                        {[45, 67, 43, 89, 56, 78, 92, 45, 63, 72, 54, 81].map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${val}%` }}
                                transition={{ delay: 0.3 + (i * 0.05), duration: 0.8 }}
                                className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg relative group"
                            >
                                <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] font-bold text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700 shadow-xl pointer-events-none">
                                    {val}K
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:59</span>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-8 border border-slate-700/30 h-full">
                        <h3 className="text-xl font-black text-white mb-10">Infrastructure Status</h3>
                        <div className="space-y-8">
                            {serverHealth.map((item) => (
                                <div key={item.name} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-800/40 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.name}</p>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-0.5">{item.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-white">{item.load}</p>
                                        <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${parseFloat(item.load) > 70 ? 'from-amber-400 to-orange-500' : 'from-blue-400 to-indigo-500'} rounded-full`}
                                                style={{ width: item.load }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-12 py-4 bg-slate-800/60 hover:bg-slate-700 rounded-2xl font-black text-sm text-slate-300 transition-all border border-slate-700/30">
                            Run Advanced Diagnostics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
