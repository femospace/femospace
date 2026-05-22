import React from 'react';
import { Phone, Star, ShieldCheck, Briefcase, FileText, CheckCircle, XCircle, Search, MessageSquare } from 'lucide-react';

export const VerificationHub: React.FC = () => {
    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Pending Phone', value: '18', icon: <Phone size={24} className="text-blue-400" /> },
                    { label: 'VIP Requests', value: '06', icon: <Star size={24} className="text-amber-400" /> },
                    { label: 'Business Apps', value: '24', icon: <Briefcase size={24} className="text-indigo-400" /> },
                    { label: 'Payment Proofs', value: '82', icon: <FileText size={24} className="text-emerald-400" /> },
                ].map((item, i) => (
                    <div key={i} className="glass-card p-8 group hover:bg-white/5 transition-all text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mx-auto mb-6 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{item.value}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Phone & Account Manual Verification */}
                <div className="glass-card">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/5 to-transparent">
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Identity Signal Hub</h3>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input placeholder="Search user ID..." className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-[10px] text-white focus:outline-none w-32" />
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {[
                            { user: 'Satoshi_99', type: 'PHONE_PROOF', detail: 'Telecom invoice #8293', date: '5m ago' },
                            { user: 'Digital_Asset', type: 'BUSINESS_VERIFICATION', detail: 'Tax ID & Incorporation Documents', date: '34m ago' },
                            { user: 'Femo_Creator_01', type: 'CREATOR_VERIFIED', detail: 'Verified Social Proof (100K+ followers)', date: '1h ago' },
                        ].map((item, i) => (
                            <div key={i} className="p-6 hover:bg-white/2 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type.includes('PHONE') ? 'bg-blue-600/10 text-blue-400' :
                                        item.type.includes('CREATOR') ? 'bg-amber-600/10 text-amber-500' : 'bg-indigo-600/10 text-indigo-400'
                                        }`}>
                                        {item.type.includes('PHONE') ? <Phone size={20} /> : item.type.includes('CREATOR') ? <Star size={20} /> : <Briefcase size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-white uppercase italic tracking-wider">@{item.user}</p>
                                            <span className="text-[8px] font-bold text-slate-600 italic">[{item.date}]</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">{item.type.replace('_', ' ')} • <span className="text-slate-400 font-medium italic">{item.detail}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg hover:bg-emerald-600/20 transition-all">
                                        <CheckCircle size={18} />
                                    </button>
                                    <button className="p-2 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600/20 transition-all">
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Proof Verification (Bank Transfers) */}
                <div className="glass-card">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-600/5 to-transparent">
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Financial Ledger Proofs</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Audit Active</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/2 border-b border-white/5">
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest underline decoration-white/10">Transaction Entity</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest underline decoration-white/10">Value</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest underline decoration-white/10 text-center">Status</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest underline decoration-white/10 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[1, 2, 3, 4].map((idx) => (
                                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 border border-white/10 italic">#TX</div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase italic tracking-tighter">BANK_W_{idx}892</p>
                                                    <p className="text-[8px] font-bold text-slate-500 tracking-[0.1em]">User: Nexus_Matrix_{idx}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-black text-white italic tracking-tight">${(idx * 1250).toLocaleString()}.00</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded uppercase border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]">PENDING</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-all">
                                                    <ShieldCheck size={14} />
                                                </button>
                                                <button className="p-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 transition-all">
                                                    <MessageSquare size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-white/2 border-t border-white/5 text-center">
                        <button className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] hover:text-white transition-all italic underline decoration-slate-700 underline-offset-4">Run comprehensive fraud reconciliation audit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
