import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import {
    Wallet as WalletIcon,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    ShieldCheck,
    History,
    Plus,
    CreditCard,
    Cpu,
    TrendingUp,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export const WalletDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWalletData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const [walletRes, txRes] = await Promise.all([
                    api.get('/wallet/me'),
                    api.get('/wallet/transactions')
                ]);
                setWallet(walletRes.data);
                setTransactions(txRes.data || []);
            } catch (err: any) {
                console.error('Wallet Error:', err);
                if (err.response?.status === 401) {
                    // Session expired or non-existent
                    localStorage.removeItem('femo_access_token');
                    window.location.href = '/';
                    return;
                }
                setError(err.response?.data?.message || t('wallet.error.loadFailed', 'Failed to load wallet data. Please check your connection.'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchWalletData();
    }, [t]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-white rounded-full animate-spin" />
                    <p className="font-black text-gray-400 uppercase tracking-widest text-xs">{t('wallet.loading', 'Loading Wallet...')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 text-center max-w-md">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">{t('common.error.title', 'Something went wrong')}</h2>
                    <p className="text-gray-500 mb-6 text-sm">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl uppercase tracking-widest text-xs">{t('common.retry', 'Retry')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-32">
            {/* Header / Summary */}
            <div className="bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-gray-800 px-6 py-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                            <WalletIcon className="text-blue-600" size={32} /> {t('wallet.title', 'Femo Wallet')}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('wallet.subtitle', 'Manage your global payments and creator earnings.')}</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/wallet/deposit')}
                            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Plus size={20} /> {t('wallet.deposit', 'Deposit')}
                        </button>
                        <button
                            onClick={() => navigate('/wallet/withdraw')}
                            className="flex-1 md:flex-none px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform"
                        >
                            {t('wallet.withdraw', 'Withdraw')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Balance Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <div className="space-y-1 relative z-10">
                                    <p className="text-sm font-black uppercase tracking-widest opacity-70">{t('wallet.availableBalance', 'Available Balance')}</p>
                                    <h2 className="text-5xl font-black">${wallet?.availableBalance?.toLocaleString() || '0'}</h2>
                                </div>
                                <div className="mt-8 flex items-center gap-4 relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase opacity-60">{t('wallet.withdrawable', 'Withdrawable')}</span>
                                        <span className="font-bold">${wallet?.withdrawableBalance?.toLocaleString() || '0'}</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/20" />
                                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <TrendingUp size={12} /> {t('wallet.trend', '+2.4% this month')}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('wallet.pendingBalance', 'Pending Balance')}</p>
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white">${wallet?.pendingBalance?.toLocaleString() || '0'}</h4>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300" />
                                </div>

                                <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('wallet.escrowFunds', 'Escrow Funds')}</p>
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white">${wallet?.escrowBalance?.toLocaleString() || '0'}</h4>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                    <History size={20} className="text-blue-500" /> {t('wallet.txHistory', 'Transaction History')}
                                </h3>
                                <button className="text-xs font-black text-blue-500 uppercase tracking-widest hover:underline">{t('common.viewAll', 'View All')}</button>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {transactions.map((tx) => (
                                    <div key={tx?._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx?.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                                                tx?.type === 'purchase' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                                    tx?.type === 'withdraw' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                                                        'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                                }`}>
                                                {tx?.type === 'deposit' ? <ArrowDownLeft size={20} /> :
                                                    tx?.type === 'withdraw' ? <ArrowUpRight size={20} /> :
                                                        tx?.type === 'escrow' ? <ShieldCheck size={20} /> :
                                                            <RefreshCcw size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase">{tx?.description || t('wallet.transaction', 'Transaction')}</h4>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                                                    <span>{tx?.createdAt ? new Date(tx.createdAt).toLocaleDateString() : t('common.recent', 'Recent')}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span>{tx?.method}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black ${(tx?.amount || 0) > 0 && tx?.type === 'deposit' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                                                {tx?.type === 'deposit' ? `+${tx?.amount}` : `-${tx?.amount}`}
                                            </p>
                                            <div className="flex items-center justify-end gap-1">
                                                {tx?.status === 'completed' ? <CheckCircle2 size={12} className="text-green-500" /> : <Clock size={12} className="text-yellow-500" />}
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${tx?.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>{tx?.status || 'pending'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: AI Credits & Payment Methods */}
                    <div className="space-y-8">
                        {/* AI Credits Tracker */}
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                            <Cpu className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Cpu size={18} className="text-blue-400" /> {t('wallet.aiCredits', 'AI Credits')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold opacity-60">{t('wallet.usedToday', 'Used today')}</span>
                                    <span className="text-2xl font-black">1.50 <span className="text-[10px] opacity-60">USD</span></span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-1/3 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                </div>
                                <p className="text-[10px] font-bold opacity-50 uppercase leading-relaxed">{t('wallet.aiCreditsDesc', 'AI tools consume credits directly from your Femo Wallet.')}</p>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors mt-2">
                                    {t('wallet.viewUsageLogs', 'View Usage Logs')}
                                </button>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-[40px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('wallet.savedMethods', 'Saved Methods')}</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">•••• 4242</p>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Visa Default</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                </div>

                                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-all">
                                    <Plus size={16} /> {t('wallet.addMethod', 'Add Method')}
                                </button>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="p-6 rounded-3xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 flex items-center gap-4">
                            <ShieldCheck className="text-green-500" size={32} />
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">{t('wallet.shieldTitle', 'Enterprise Shield')}</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">{t('wallet.shieldDesc', 'All transactions are 256-bit encrypted and monitored for fraud.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
