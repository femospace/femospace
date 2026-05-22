import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Bitcoin,
    Banknote,
    Wallet,
    ArrowUpRight,
    CheckCircle2,
    Info,
    ShieldCheck
} from 'lucide-react';

export const WithdrawFunds = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('500');
    const [selectedMethod, setSelectedMethod] = useState('');

    const methods = [
        { id: 'payoneer', name: 'Payoneer', icon: <ArrowUpRight size={24} />, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { id: 'binance', name: 'Binance (USDT)', icon: <Bitcoin size={24} />, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { id: 'paypal', name: 'PayPal Payout', icon: <Wallet size={24} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'bank', name: 'Bank Transfer (SWIFT)', icon: <Banknote size={24} />, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] pb-32">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Withdraw Funds</h1>
                    <p className="text-[10px] font-black text-gray-400">Security Check: Level 2</p>
                </div>
                <div className="w-10 h-10" />
            </header>

            <div className="max-w-2xl mx-auto p-6 mt-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Amount */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-8"
                        >
                            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[40px] border border-gray-100 dark:border-gray-800 flex justify-between items-center group">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Withdrawable Balance</p>
                                    <h4 className="text-3xl font-black text-gray-900 dark:text-white">$11,600.00</h4>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                                    <ShieldCheck size={32} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Withdrawal Amount</h2>
                                <p className="text-gray-500 font-medium">Fee: $0.00 (Standard Tier)</p>
                            </div>

                            <div className="group relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300 group-focus-within:text-blue-500 transition-colors">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-[32px] pl-12 pr-8 py-10 text-6xl font-black text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>

                            <button
                                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > 11600}
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-3xl text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue to Method
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Confirmation & Method */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Select Account</h2>
                                <p className="text-gray-500 font-medium">Choose your payout destination</p>
                            </div>

                            <div className="space-y-4">
                                {methods.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMethod(m.id)}
                                        className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${selectedMethod === m.id ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.bg} ${m.color}`}>
                                                {m.icon}
                                            </div>
                                            <span className={`font-black uppercase tracking-tight ${selectedMethod === m.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{m.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3-5 days</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                                <Info className="text-blue-600 mt-1 shrink-0" size={20} />
                                <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                                    For security, withdrawals are processed within 48-72 hours. All funds are subject to anti-money laundering (AML) checks.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black rounded-3xl uppercase tracking-widest">Back</button>
                                <button
                                    disabled={!selectedMethod}
                                    onClick={() => navigate('/wallet')}
                                    className="flex-[2] py-5 bg-orange-600 text-white font-black rounded-3xl text-xl shadow-2xl shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    Confirm Withdrawal <CheckCircle2 size={24} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
