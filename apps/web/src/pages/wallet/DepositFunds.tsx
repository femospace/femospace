import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import {
    ChevronLeft,
    CreditCard,
    Bitcoin,
    Banknote,
    Wallet,
    Plus,
    Copy,
    CheckCircle2,
    Upload,
    Info,
    Smartphone,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';

export const DepositFunds = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('100');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [showCopyToast, setShowCopyToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [bankDetails, setBankDetails] = useState<any>(null);

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const { data } = await api.get('/payments/bank-details');
                setBankDetails(data);
            } catch (err) {
                console.error('Failed to fetch bank details');
            }
        };
        fetchBankDetails();
    }, []);

    const handleProceed = async () => {
        if (!selectedMethod) return;

        if (selectedMethod === 'bank-transfer') {
            setStep(3);
            return;
        }

        // For Stripe/PayPal/Binance
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.post(`/payments/create-session/${selectedMethod}`, {
                amount: parseFloat(amount)
            });

            if (data.url) {
                setStep(3);
                // In a real app, you might want to window.location.href = data.url
                // But for the "wow" factor, we'll wait 2 seconds then redirect
                setTimeout(() => {
                    window.location.href = data.url;
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate payment');
            setStep(2);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
    };

    const methods = [
        { id: 'paypal', name: 'PayPal', icon: <Wallet size={24} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'binance', name: 'Binance Crypto', icon: <Bitcoin size={24} />, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { id: 'stripe', name: 'Visa / Mastercard', icon: <CreditCard size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { id: 'skrill', name: 'Skrill Wallet', icon: <Smartphone size={24} />, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { id: 'bank-transfer', name: 'Direct Bank Transfer', icon: <Banknote size={24} />, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] pb-32">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Deposit Funds</h1>
                    <p className="text-[10px] font-black text-gray-400">Step {step} of 3</p>
                </div>
                <div className="w-10 h-10" /> {/* Spacer */}
            </header>

            <div className="max-w-2xl mx-auto p-6 mt-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Amount */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">How much?</h2>
                                <p className="text-gray-500 font-medium">Enter amount or select from presets.</p>
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

                            <div className="grid grid-cols-3 gap-4">
                                {['50', '100', '500'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setAmount(p)}
                                        className={`py-4 rounded-2xl font-black text-lg transition-all ${amount === p ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        ${p}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={!amount || parseFloat(amount) <= 0}
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-3xl text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Method */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Select Method</h2>
                                <p className="text-gray-500 font-medium">Deposit to your Femo Wallet</p>
                            </div>

                            <div className="space-y-3">
                                {methods.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMethod(m.id)}
                                        className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${selectedMethod === m.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.bg} ${m.color}`}>
                                                {m.icon}
                                            </div>
                                            <span className={`font-black uppercase tracking-tight ${selectedMethod === m.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{m.name}</span>
                                        </div>
                                        {selectedMethod === m.id && <Plus size={24} className="text-blue-500" />}
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600">
                                    <AlertCircle size={20} />
                                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                                </div>
                            )}

                            <div className="pt-6 flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black rounded-3xl uppercase tracking-widest">Back</button>
                                <button
                                    disabled={!selectedMethod || isLoading}
                                    onClick={handleProceed}
                                    className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-3xl text-xl shadow-2xl shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Processing...' : 'Proceed'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Bank Details or Provider Load */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {selectedMethod === 'bank-transfer' ? (
                                <div className="space-y-8">
                                    {!bankDetails ? (
                                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                            <div className="w-10 h-10 border-4 border-blue-500 border-t-white rounded-full animate-spin" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Bank Details...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-indigo-600 rounded-[40px] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden">
                                                <Banknote className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
                                                <div className="flex justify-between items-center relative z-10">
                                                    <h3 className="text-lg font-black uppercase tracking-widest">Bank Details</h3>
                                                    <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Direct Deposit</span>
                                                </div>
                                                <div className="space-y-4 pt-4 relative z-10">
                                                    {[
                                                        { label: 'Bank Name', value: bankDetails.bankName },
                                                        { label: 'Acc Name', value: bankDetails.accountName },
                                                        { label: 'Acc Number', value: bankDetails.accountNumber },
                                                        { label: 'Branch', value: bankDetails.branch },
                                                        { label: 'SWIFT Code', value: bankDetails.swiftCode },
                                                        { label: 'Reference', value: 'USR-' + Math.floor(Math.random() * 9000 + 1000), special: true },
                                                    ].map((item) => (
                                                        <div key={item.label} className="flex justify-between items-center group">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">{item.label}</p>
                                                                <p className={`font-black ${item.special ? 'text-yellow-300' : ''}`}>{item.value}</p>
                                                            </div>
                                                            <button onClick={() => copyToClipboard(item.value)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                                                <Copy size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl border border-yellow-100 dark:border-yellow-900/30 flex items-start gap-4">
                                                <Info className="text-yellow-600 mt-1 shrink-0" size={20} />
                                                <p className="text-xs font-bold text-yellow-700 leading-relaxed uppercase tracking-tight">
                                                    IMPORTANT: YOU MUST INCLUDE THE REFERENCE PROVIDED ABOVE IN YOUR TRANSFER NOTES. DEPOSITS WITHOUT REFERENCE WILL TAKE LONGER TO PROCESS.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <button className="w-full py-5 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 font-bold rounded-3xl flex flex-col items-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-all">
                                                    <Upload size={32} />
                                                    <p className="uppercase text-xs tracking-widest">Upload Payment Proof</p>
                                                </button>

                                                <button
                                                    onClick={() => navigate('/wallet')}
                                                    className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-3xl text-xl shadow-2xl"
                                                >
                                                    Confirm Transfer Sent
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center space-y-8">
                                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 border-4 border-blue-500 border-t-white rounded-full animate-spin" />
                                        <ShieldCheck className="text-blue-600" size={48} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Connecting to {selectedMethod}</h3>
                                        <p className="text-gray-500 font-medium">Please finish the payment in the browser window popup.</p>
                                    </div>
                                    <div className="max-w-xs text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-widest">
                                        Funds will be added to your available balance automatically once the transaction is complete.
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Copy Toast */}
            <AnimatePresence>
                {showCopyToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl z-50 flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} /> Copied to Clipboard
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
