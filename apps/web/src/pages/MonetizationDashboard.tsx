import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, TrendingUp,
    Plus, Settings as SettingsIcon, CheckCircle2,
    CreditCard, Users, Gift, Landmark, BarChart3,
    Rocket, FileText, LayoutDashboard,
    PlayCircle, Handshake, ShieldCheck
} from 'lucide-react';
import { monetizationService, Transaction, Payout, Gift as GiftData, SubscriptionTier, EarningsBreakdown, Wallet } from '../services/monetization.service';
import { useAuth } from '../contexts/AuthContext';
import { kycService, KYCStatus } from '../services/kyc.service';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PageWrapper } from '../components/common/PageWrapper';
import { useTheme } from '../contexts/ThemeContext';

type TabId = 'overview' | 'gifts' | 'subscriptions' | 'ads' | 'fund' | 'brand' | 'analytics' | 'payouts' | 'tax' | 'settings';

export const MonetizationDashboard = () => {
    const { } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<KYCStatus>(KYCStatus.NOT_STARTED);
    const [data, setData] = useState<{
        wallet: Wallet | null;
        breakdown: EarningsBreakdown | null;
        transactions: Transaction[];
        payouts: Payout[];
        gifts: GiftData[];
        tiers: SubscriptionTier[];
    }>({
        wallet: null,
        breakdown: null,
        transactions: [],
        payouts: [],
        gifts: [],
        tiers: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [w, eb, t, p, g, kyc] = await Promise.all([
                monetizationService.getWallet(),
                monetizationService.getEarningsBreakdown(),
                monetizationService.getTransactions(),
                monetizationService.getPayouts(),
                monetizationService.getGifts(),
                kycService.getProfile()
            ]);
            setData({
                wallet: w,
                breakdown: eb,
                transactions: t,
                payouts: p,
                gifts: g,
                tiers: []
            });
            setKycStatus(kyc.status);
        } catch (error) {
            console.error('Failed to fetch monetization data', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs: { id: TabId, label: string, icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
        { id: 'gifts', label: 'Live Gifts', icon: <Gift size={18} /> },
        { id: 'subscriptions', label: 'Subscriptions', icon: <Users size={18} /> },
        { id: 'ads', label: 'Ads Revenue', icon: <PlayCircle size={18} /> },
        { id: 'fund', label: 'Creator Fund', icon: <Rocket size={18} /> },
        { id: 'brand', label: 'Brand Deals', icon: <Handshake size={18} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
        { id: 'payouts', label: 'Payouts', icon: <Landmark size={18} /> },
        { id: 'tax', label: 'Tax & Compliance', icon: <FileText size={18} /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-600/20" />
        </div>
    );

    return (
        <PageWrapper className="pb-24 font-sans antialiased">
            {/* Top Bar */}
            <div className={`fixed top-0 inset-x-0 h-16 ${isDark ? 'bg-black/60' : 'bg-white/60'} backdrop-blur-3xl border-b border-white/5 z-50 flex items-center justify-between px-8`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <h1 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white/90' : 'text-slate-900'}`}>{isDark ? 'Creator Monetization Center' : 'Creator Center'}</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-black ${isDark ? 'text-white/40' : 'text-slate-400'} uppercase tracking-tighter`}>Coin Balance</span>
                        <span className="text-sm font-black text-blue-500">{(data.wallet?.coinBalance || 0).toLocaleString()} Coins</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-black ${isDark ? 'text-white/40' : 'text-slate-400'} uppercase tracking-tighter`}>Earnings</span>
                        <span className="text-sm font-black text-green-500">${(data.wallet?.cashBalance || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="pt-24 max-w-[1400px] mx-auto px-8 flex gap-10">
                {/* Sidebar Nav */}
                <div className="w-64 flex flex-col gap-1 sticky top-24 h-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1'
                                : `${isDark ? 'text-neutral-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* TAB: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {kycStatus !== KYCStatus.APPROVED && (
                                        <div className={`p-6 rounded-[32px] border ${isDark ? 'bg-blue-600/10 border-blue-600/20' : 'bg-blue-50 border-blue-200'} flex items-center justify-between`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                                    <ShieldCheck className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <p className={`font-black text-sm uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Identity Verification Required</p>
                                                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Complete KYC to unlock full monetization and high-volume payouts.</p>
                                                </div>
                                            </div>
                                            <Link
                                                to="/monetization/kyc"
                                                className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                                            >
                                                {kycStatus === KYCStatus.NOT_STARTED ? 'START VERIFICATION' : 'CHECK STATUS'}
                                            </Link>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className={`col-span-2 bg-gradient-to-br ${isDark ? 'from-blue-600/10 to-transparent border-white/5' : 'from-blue-100 to-transparent border-blue-200'} border p-10 rounded-[48px] relative overflow-hidden group`}>
                                            <div className="absolute top-0 right-0 p-10 text-blue-500/5 -rotate-12 transform scale-150 group-hover:text-blue-500/10 transition-all duration-700">
                                                <DollarSign size={200} />
                                            </div>
                                            <h3 className={`text-xs font-black ${isDark ? 'text-white/40' : 'text-slate-400'} uppercase tracking-[0.3em] mb-4`}>Gross Estimated Earnings</h3>
                                            <div className="flex items-baseline gap-4">
                                                <p className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>${(data.breakdown?.totalEarnings || 0).toLocaleString()}</p>
                                                <span className="text-green-500 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full">+24.5%</span>
                                            </div>
                                            <div className={`mt-10 grid grid-cols-2 gap-10 border-t ${isDark ? 'border-white/5' : 'border-slate-200'} pt-10`}>
                                                <div>
                                                    <p className={`text-[10px] font-black ${isDark ? 'text-white/30' : 'text-slate-400'} uppercase mb-2`}>Pending Clearances</p>
                                                    <p className={`text-xl font-bold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>${((data.breakdown?.totalEarnings || 0) * 0.15).toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className={`text-[10px] font-black ${isDark ? 'text-white/30' : 'text-slate-400'} uppercase mb-2`}>Available for Withdrawal</p>
                                                    <p className="text-xl font-bold text-blue-500">${(data.wallet?.cashBalance || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${isDark ? 'bg-neutral-900/40 border-white/5' : 'bg-white border-slate-200'} border p-10 rounded-[48px] flex flex-col justify-between`}>
                                            <div>
                                                <h3 className={`text-xs font-black ${isDark ? 'text-white/40' : 'text-slate-400'} uppercase tracking-[0.3em] mb-6`}>Revenue Mix</h3>
                                                <div className="space-y-6">
                                                    {[
                                                        { label: 'Live Gifts', val: 45, color: '#3b82f6' },
                                                        { label: 'Ads', val: 30, color: '#a855f7' },
                                                        { label: 'Brand Deals', val: 15, color: '#10b981' },
                                                        { label: 'Subscriptions', val: 10, color: '#f59e0b' },
                                                    ].map(item => (
                                                        <div key={item.label}>
                                                            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                                                <span className={isDark ? 'text-white/60' : 'text-slate-500'}>{item.label}</span>
                                                                <span className={isDark ? 'text-white' : 'text-slate-900'}>{item.val}%</span>
                                                            </div>
                                                            <div className={`h-1.5 ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                                                <div className="h-full bg-current" style={{ width: `${item.val}%`, color: item.color }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className={`w-full py-4 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'} border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all`}>
                                                Detailed Breakdown
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-[40px]">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest">Recent Cashflow</h3>
                                            <button className="text-xs text-blue-500 font-bold hover:underline">View All History</button>
                                        </div>
                                        <div className="space-y-1">
                                            {data.transactions.slice(0, 4).map(t => (
                                                <div key={t._id} className="group flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                            {t.type === 'gift_send' ? <Gift size={18} /> : <TrendingUp size={18} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">{t.description}</p>
                                                            <p className="text-[10px] text-white/30 uppercase font-black">{t.type} • {format(new Date(t.createdAt), 'MMM dd, HH:mm')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-black ${t.amount > 0 ? 'text-green-500' : 'text-blue-500'}`}>
                                                            {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()} {t.type.includes('coin') ? 'Coins' : 'USD'}
                                                        </p>
                                                        <p className="text-[10px] text-white/20 uppercase font-black">{t.status}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'gifts' && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Live Stream Gifts</h2>
                                            <p className="text-white/40 text-sm">Manage your interactive gifts and viewing rewards.</p>
                                        </div>
                                        <div className="bg-neutral-900 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Receiving Enabled</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-6">
                                        {[
                                            { name: 'Femo Star', val: 10, color: 'from-amber-400 to-orange-500' },
                                            { name: 'Super Rocket', val: 500, color: 'from-blue-400 to-indigo-600' },
                                            { name: 'Diamond Ring', val: 1000, color: 'from-cyan-300 to-blue-500' },
                                            { name: 'Creator Crown', val: 5000, color: 'from-purple-400 to-pink-600' }
                                        ].map(mock => (
                                            <div key={mock.name} className="bg-neutral-900/40 border border-white/5 p-6 rounded-[32px] group hover:border-blue-500 transition-all">
                                                <div className={`aspect-square bg-gradient-to-br ${mock.color} opacity-20 group-hover:opacity-40 rounded-2xl mb-4 flex items-center justify-center transition-opacity`}>
                                                    <Gift size={48} className="text-white" />
                                                </div>
                                                <h4 className="font-black text-sm text-center mb-1">{mock.name}</h4>
                                                <div className="flex items-center justify-center gap-1.5 text-blue-500 font-black text-xs">
                                                    {mock.val} COINS
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'subscriptions' && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Subscription Tiers</h2>
                                            <p className="text-white/40 text-sm">Create exclusive experiences for your superfans.</p>
                                        </div>
                                        <button className="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-2">
                                            <Plus size={18} /> New Tier
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { name: 'Supporter', price: 4.99, subs: 124, color: 'blue' },
                                            { name: 'Superfan', price: 9.99, subs: 45, color: 'purple' },
                                            { name: 'Elite', price: 24.99, subs: 12, color: 'amber' },
                                        ].map(tier => (
                                            <div key={tier.name} className="bg-neutral-900 border border-white/5 p-8 rounded-[40px] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Users size={80} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase text-white/40 mb-2">{tier.name} ACCESS</p>
                                                <h4 className="text-3xl font-black mb-6">${tier.price}<span className="text-sm font-normal text-white/30">/mo</span></h4>
                                                <div className="flex items-center gap-2 mb-8">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-black" />)}
                                                    </div>
                                                    <span className="text-xs font-black text-blue-500">{tier.subs} active subscribers</span>
                                                </div>
                                                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                    Manage Perks
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ads' && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Advertiser Revenue</h2>
                                            <p className="text-white/40 text-sm">Real-time performance of your video and reel ads.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="bg-neutral-900 border border-white/5 px-6 py-3 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase text-white/40 mb-1">Avg. CPM</p>
                                                <p className="text-lg font-black text-white">$14.20</p>
                                            </div>
                                            <div className="bg-neutral-900 border border-white/5 px-6 py-3 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase text-white/40 mb-1">Fill Rate</p>
                                                <p className="text-lg font-black text-green-500">98.2%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-900/40 border border-white/5 p-10 rounded-[48px] h-64 flex items-center justify-center relative overflow-hidden group">
                                        <div className="flex flex-col items-center gap-4 relative z-10">
                                            <BarChart3 size={48} className="text-blue-500 animate-bounce" />
                                            <p className="text-sm font-black uppercase tracking-widest text-white/40">Integrating Ad-Sense Neural Core...</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-neutral-900 border border-white/5 p-8 rounded-[40px]">
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Top Performing Content</h3>
                                            <div className="space-y-4">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                                                                <PlayCircle size={20} className="text-white/20" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold">Awesome Video #{i}</p>
                                                                <p className="text-[10px] text-white/20 uppercase font-black">12.4K Impressions</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-black text-blue-500">$84.20</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-neutral-900 border border-white/5 p-8 rounded-[40px]">
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Ad Controls</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                                    <p className="text-xs font-black uppercase">Enable Mid-roll Ads</p>
                                                    <div className="w-10 h-5 bg-blue-600 rounded-full" />
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl opacity-50">
                                                    <p className="text-xs font-black uppercase">Reserved Inventory</p>
                                                    <div className="w-10 h-5 bg-white/10 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'payouts' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white/5 border border-white/10 p-10 rounded-[48px]">
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Payment Settings</h3>
                                            <div className="space-y-4">
                                                <div className="p-6 bg-blue-600/10 border border-blue-600/30 rounded-3xl flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                                            <Landmark className="text-white" size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm uppercase">Direct Bank Transfer</p>
                                                            <p className="text-xs text-white/40">Verified • SWIFT: ****4321</p>
                                                        </div>
                                                    </div>
                                                    <CheckCircle2 size={24} className="text-blue-500" />
                                                </div>
                                                <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-3xl text-xs font-black text-white/30 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                                                    <Plus size={18} /> ADD NEW METHOD
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/5 p-10 rounded-[48px] flex flex-col justify-center items-center text-center">
                                            <div className="w-20 h-20 bg-green-600/20 rounded-3xl flex items-center justify-center text-green-500 mb-6">
                                                <CreditCard size={40} />
                                            </div>
                                            <h3 className="text-2xl font-black mb-2">Request Payout</h3>
                                            <p className="text-sm text-white/40 max-w-xs mb-8">Minimum withdrawal is $50. Processing takes 3-5 business days.</p>
                                            <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:scale-105 transition-all">
                                                WITHDRAW ${(data.wallet?.cashBalance || 0).toLocaleString()}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Placeholder for other tabs */}
                            {['ads', 'fund', 'brand', 'analytics', 'tax', 'settings'].includes(activeTab) && (
                                <div className="min-h-[600px] bg-white/5 border border-white/10 rounded-[48px] flex flex-col items-center justify-center p-20 text-center gap-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40">
                                        {tabs.find(t => t.id === activeTab)?.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
                                            {tabs.find(t => t.id === activeTab)?.label}
                                        </h2>
                                        <p className="text-white/40 text-sm max-w-md mx-auto">
                                            Elevate your creator career with our enterprise-grade {activeTab} engine. High-performance monetization for the next generation.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all">
                                            Unlock Access
                                        </button>
                                        <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
                                            Documentation
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
};
