import React from 'react';
import { Globe, CreditCard, Cpu, Bell, Save, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-10 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Platform Calibration</h2>
                    <p className="text-slate-400 font-medium mt-1">Configure global operational parameters and system logic</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 active:scale-95">
                    <Save size={20} />
                    DEPLOY CHANGES
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <Globe className="text-blue-500" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Network Parameters</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Platform Name</label>
                                <input
                                    type="text"
                                    defaultValue="FEMO SPACE"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Primary Domain</label>
                                <input
                                    type="text"
                                    defaultValue="femo.space"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Maintenance Mode</label>
                                <div className="flex items-center gap-4 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
                                    <button className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-500">Active</button>
                                    <button className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg">Standby</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <CreditCard className="text-emerald-500" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Economic Engine</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Marketplace Sales Fee</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue="5.0"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">%</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Creator Payout Split</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue="10.0"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Configuration */}
                <div className="space-y-8">
                    <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-transparent">
                        <div className="flex items-center gap-4 mb-8">
                            <Cpu className="text-blue-400" size={20} />
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Neural Defaults</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'Chat Logic Tier', val: 'V4.2 Quantum' },
                                { name: 'Image Synth Engine', val: 'Proprietary V2' },
                                { name: 'Global Rate Limit', val: '2000 req/min' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.name}</p>
                                    <p className="text-xs font-black text-blue-400 italic">{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <Bell className="text-amber-400" size={20} />
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Platform Alerts</h4>
                        </div>
                        <div className="space-y-4">
                            {[
                                'Notify on 10K+ Transaction',
                                'Audit Log persistence: 1 year',
                                'Auto-ban repeat fraud IPs',
                                'Email daily summary to Root',
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-700 bg-white/5 flex items-center justify-center cursor-pointer hover:border-blue-500 group transition-all">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 border-l-4 border-emerald-500 flex items-center gap-5">
                        <ShieldCheck className="text-emerald-500 shrink-0" size={32} />
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Security Clearance</p>
                            <p className="text-sm font-black text-white mt-1 italic">Verified Encrypted Session</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
