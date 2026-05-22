import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Megaphone, Plus, BarChart3, Target, CreditCard, ChevronRight, Play, Eye, MousePointer2, TrendingUp } from 'lucide-react';

export const AdManager = () => {
    const { t } = useTranslation();
    
    const activeStats = [
        { label: t('ads.stats.impressions', 'Impressions'), value: '142.8K', change: '+12.4%', icon: <Eye size={18} /> },
        { label: t('ads.stats.clicks', 'Total Clicks'), value: '4,291', change: '+8.2%', icon: <MousePointer2 size={18} /> },
        { label: t('ads.stats.ctr', 'Avg. CTR'), value: '3.1%', change: '+0.5%', icon: <BarChart3 size={18} /> },
        { label: t('ads.stats.sales', 'Total Sales'), value: '$842.00', change: '+14.1%', icon: <TrendingUp size={18} /> },
    ];

    const campaigns = [
        { id: '1', name: 'Spring_Collection_2024', status: 'ACTIVE', budget: '$50.00/day', objective: 'Sales', spend: '$1,294.00' },
        { id: '2', name: 'Profile_Visit_Boost', status: 'PAUSED', budget: '$10.00/day', objective: 'Visits', spend: '$420.00' },
        { id: '3', name: 'Marketplace_Featured_Video', status: 'PROCESSING', budget: '$100.00', objective: 'Views', spend: '$0.00' },
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-neutral-900/50 p-8 rounded-[48px] border border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Megaphone className="text-white" size={20} />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tight italic">{t('ads.title', 'Ad Manager')}</h1>
                        </div>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{t('ads.subtitle', 'Reach millions across the FemoSpace ecosystem')}</p>
                    </div>
                    <button className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[32px] transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95">
                        <Plus size={20} />
                        {t('ads.createCampaign', 'CREATE CAMPAIGN')}
                    </button>
                </div>

                {/* Performance Hub */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeStats.map((stat, i) => (
                        <div key={i} className="bg-neutral-900 border border-white/5 p-8 rounded-[40px] group hover:border-blue-500/30 transition-all cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <span className="text-emerald-400 text-xs font-black">{stat.change}</span>
                            </div>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Campaigns Table */}
                    <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-[48px] overflow-hidden self-start">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase italic tracking-tight underline decoration-blue-500 decoration-4 underline-offset-8">{t('ads.activeCampaigns', 'Active Campaigns')}</h3>
                            <button className="text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-[0.2em]">{t('common.viewHistory', 'View History')}</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/2">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t('ads.table.overview', 'Campaign Overview')}</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t('ads.table.budget', 'Budget / Spends')}</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">{t('common.status', 'Status')}</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">{t('common.settings', 'Settings')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {campaigns.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/2 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-700 border border-white/5 flex items-center justify-center text-white/20">
                                                        <Play size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-tight">OBJ: {item.objective}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-black text-white tracking-tight">{item.budget}</p>
                                                <p className="text-[10px] font-bold text-white/40 mt-1 uppercase italic tracking-tighter">Spent: {item.spend}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        item.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-white/20 hover:text-white transition-all">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar: New Ad Creation Shortcuts */}
                    <div className="space-y-8">
                        <div className="bg-neutral-900 border border-white/5 p-8 rounded-[48px] bg-gradient-to-br from-blue-600/5 to-transparent relative overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-blue-600/10 blur-3xl -z-10" />
                            <h4 className="text-lg font-black italic uppercase tracking-tight mb-8">{t('ads.audienceReach', 'Audience Reach')}</h4>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-white/40 tracking-widest uppercase italic">
                                        <span>{t('ads.targetEfficiency', 'Target Efficiency')}</span>
                                        <span className="text-emerald-400">{t('common.high', 'High')}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '82%' }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                        />
                                    </div>
                                    <p className="text-[10px] font-medium text-white/40 italic leading-relaxed">{t('ads.reachEstimate', 'Your current targeting parameters reach approximately 2.4M monthly active users.')}</p>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-white/60 hover:text-white transition-all cursor-pointer group">
                                        <Target size={18} className="group-hover:text-blue-400 transition-colors" />
                                        <span className="text-xs font-black uppercase tracking-widest italic">{t('ads.targetCompetitors', 'Target Competitors')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/60 hover:text-white transition-all cursor-pointer group">
                                        <Plus size={18} className="group-hover:text-blue-400 transition-colors" />
                                        <span className="text-xs font-black uppercase tracking-widest italic">{t('ads.retargetingPixels', 'Retargeting Pixels')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-900 border border-white/5 p-10 rounded-[48px] border-l-4 border-indigo-600">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="text-indigo-400" size={24} />
                                <h4 className="text-lg font-black italic uppercase tracking-tight">{t('ads.adWallet', 'Ad Wallet')}</h4>
                            </div>
                            <p className="text-3xl font-black italic tracking-tighter mb-2">$1,482.50</p>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-8">{t('wallet.availableCredits', 'Available Credits')}</p>
                            <button className="w-full py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-[0.2em] italic">
                                {t('wallet.addFunds', 'Add Funds')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
