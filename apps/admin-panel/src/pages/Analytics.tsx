import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, LineChart, Target, Zap, Clock, TrendingUp, Calendar } from 'lucide-react';

export const Analytics: React.FC = () => {
    const metrics = [
        { title: 'User Retention', value: '68.4%', trend: '+4.2%', icon: <Target size={20} /> },
        { title: 'Response Time', value: '42ms', trend: '-12%', icon: <Zap size={20} /> },
        { title: 'Avg. Session', value: '18:24', trend: '+1:15', icon: <Clock size={20} /> },
        { title: 'Peak Concurrency', value: '8.4K', trend: '+1.2K', icon: <TrendingUp size={20} /> }
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Advanced Data Analytics</h1>
                    <p className="text-slate-400 font-medium">Holistic platform performance metrics and behavioral intelligence</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-800/60 text-slate-300 rounded-xl font-black border border-slate-700/30">
                        <Calendar size={18} /> Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {metrics.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-slate-700/30 flex flex-col justify-between"
                    >
                        <div className="flex justify-between mb-6">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                {m.icon}
                            </div>
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{m.trend}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">{m.title}</p>
                            <h3 className="text-2xl font-black text-white">{m.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 border border-slate-700/30 min-h-[400px]">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4">
                        <LineChart size={24} className="text-blue-500" />
                        Ecological Engagement Index
                    </h3>
                    <div className="flex items-center justify-center h-[280px] bg-slate-900/40 rounded-3xl border border-slate-700/20 border-dashed">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-time engagement graph processing...</p>
                    </div>
                </div>
                <div className="glass-card p-8 border border-slate-700/30 min-h-[400px]">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4">
                        <PieChart size={24} className="text-indigo-500" />
                        Regional Distribution Flow
                    </h3>
                    <div className="flex items-center justify-center h-[280px] bg-slate-900/40 rounded-3xl border border-slate-700/20 border-dashed">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Geospatial data rendering active...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
