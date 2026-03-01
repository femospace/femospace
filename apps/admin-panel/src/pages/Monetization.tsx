import React from 'react';
import { CreditCard, DollarSign, PieChart, RefreshCcw } from 'lucide-react';

export const Monetization: React.FC = () => {
    const transactions = [
        { id: '1', user: 'alex_femo', amount: 15.00, type: 'Gift', status: 'completed' },
        { id: '2', user: 'sarah_m', amount: 50.00, type: 'Subscription', status: 'completed' },
        { id: '3', user: 'mod_dave', amount: 120.00, type: 'Ads', status: 'pending' },
        { id: '4', user: 'toxic_user', amount: 200.00, type: 'Coins', status: 'failed' },
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-white">Monetization Control</h1>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700">Financial Reports</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass-card p-8 border border-slate-700/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">+12.4%</span>
                    </div>
                    <p className="text-sm font-bold text-slate-400">Total Ecosystem Revenue</p>
                    <h3 className="text-4xl font-black text-white mt-2">$24,500.90</h3>
                </div>

                <div className="glass-card p-8 border border-slate-700/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <CreditCard size={24} />
                        </div>
                        <span className="text-xs font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">+8.2%</span>
                    </div>
                    <p className="text-sm font-bold text-slate-400">Active Subscriptions</p>
                    <h3 className="text-4xl font-black text-white mt-2">1,245</h3>
                </div>

                <div className="glass-card p-8 border border-slate-700/30 h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <PieChart size={24} />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-400">Ad Conversion Rate</p>
                    <h3 className="text-4xl font-black text-white mt-2">4.8%</h3>
                </div>
            </div>

            <div className="glass-card overflow-hidden border border-slate-700/30">
                <div className="p-8 border-b border-slate-700/30 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white">Recent Transactions</h3>
                    <button className="text-slate-500 hover:text-white transition-all"><RefreshCcw size={18} /></button>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900 border-b border-slate-700/30 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                            <th className="py-6 px-8">Transaction ID</th>
                            <th className="py-6 px-8">Member</th>
                            <th className="py-6 px-8">Value (USD)</th>
                            <th className="py-6 px-8">Transaction Origin</th>
                            <th className="py-6 px-8">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-white/[0.02]">
                                <td className="py-6 px-8 text-xs font-mono font-black text-slate-400">#FTX-{t.id}009B</td>
                                <td className="py-6 px-8 font-bold text-sm text-white">@{t.user}</td>
                                <td className="py-6 px-8 font-black text-lg text-white">${t.amount.toFixed(2)}</td>
                                <td className="py-6 px-8"><span className="text-xs font-bold text-blue-400 bg-blue-400/5 px-2 py-1 rounded-lg">{t.type}</span></td>
                                <td className="py-6 px-8">
                                    <span className={`text-[9px] uppercase font-black px-2.5 py-1.5 rounded-full border ${t.status === 'completed' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                                        t.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                                            'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
