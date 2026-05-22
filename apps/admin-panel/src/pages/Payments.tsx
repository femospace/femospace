import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Shield, Wallet, History, Search, Download } from 'lucide-react';

export const Payments: React.FC = () => {
    const financialStats = [
        { label: 'Total Volume', value: '$2,482,091', detail: 'Gross processing volume', icon: <CreditCard className="text-blue-400" /> },
        { label: 'Escrow Holdings', value: '$458,203', detail: 'Secured in platform escrow', icon: <Shield className="text-purple-400" /> },
        { label: 'Wallet Assets', value: '$1,920,442', detail: 'Aggregated user balances', icon: <Wallet className="text-indigo-400" /> },
        { label: 'Platform Fees', value: '$84,520', detail: 'Net revenue this period', icon: <ArrowUpRight className="text-emerald-400" /> },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financialStats.map((stat) => (
                    <div key={stat.label} className="glass-card p-8 group">
                        <div className="flex justify-between items-center mb-6">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                                {stat.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500">{stat.detail}</p>
                    </div>
                ))}
            </div>

            {/* Transaction & Escrow Management */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="xl:col-span-2 glass-card overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-black text-white">Financial Ledger</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Real-time monitoring of all platform movements</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-black hover:bg-white/10 transition-all flex items-center gap-2">
                                <Download size={14} />
                                EXPORT
                            </button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="TXID, User, Amount..."
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all w-48"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/2 border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User / Entity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[1, 2, 3, 4, 5, 6].map((idx) => (
                                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                                        <td className="px-8 py-5 text-xs font-mono text-slate-400">TX-A82-F{idx}9C</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {idx % 2 === 0 ? <ArrowDownLeft size={14} className="text-emerald-400" /> : <ArrowUpRight size={14} className="text-rose-400" />}
                                                <span className="text-xs font-black text-slate-300">{idx % 2 === 0 ? 'DEPOSIT' : 'WITHDRAW'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-white">alpha_user_{idx}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className={`text-sm font-black ${idx % 2 === 0 ? 'text-white' : 'text-slate-300'}`}>${(idx * 250).toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${idx === 1 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                {idx === 1 ? 'PROCESSING' : 'COMPLETED'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Center */}
                <div className="space-y-8">
                    <div className="glass-card p-8 border-l-4 border-amber-500">
                        <div className="flex items-center gap-3 mb-6">
                            <History className="text-amber-500" size={24} />
                            <h3 className="text-lg font-black text-white">Pending Clearances</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-white">Withdrawal Request</p>
                                            <p className="text-[10px] font-medium text-slate-500">Bank Transfer • User ID: {i}829</p>
                                        </div>
                                        <p className="text-sm font-black text-white">$4,500.00</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg transition-all shadow-lg shadow-emerald-500/10">
                                            APPROVE
                                        </button>
                                        <button className="flex-1 py-2 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-[10px] font-black rounded-lg transition-all border border-white/10">
                                            INVESTIGATE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-white mb-6">Escrow Operations</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-blue-400">MARKETPLACE SECURED</p>
                                    <p className="text-xl font-black text-white mt-1">$342,910</p>
                                </div>
                                <Shield className="text-blue-400/50" size={32} />
                            </div>
                            <button className="w-full py-3 bg-white/5 border border-white/10 text-slate-300 text-xs font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">
                                View All Dispute Cases
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
