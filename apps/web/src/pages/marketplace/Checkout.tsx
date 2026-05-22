import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    MapPin,
    CreditCard,
    Truck,
    ChevronRight,
    CheckCircle2,
    Lock,
    Coins,
    Wallet as WalletIcon,
    ShieldCheck
} from 'lucide-react';

export const Checkout = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePlaceOrder = () => {
        setIsSuccess(true);
        setTimeout(() => {
            navigate('/marketplace/orders');
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/40"
                >
                    <CheckCircle2 size={48} className="text-white" />
                </motion.div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm">Thank you for your purchase. Your order #FEMO-8829 is being processed and will be shipped soon.</p>
                <div className="mt-12 text-sm font-bold text-blue-500 flex items-center gap-2">
                    Redirecting to your orders...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-32 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Checkout</h1>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Shipping Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={20} className="text-blue-500" /> Shipping Address
                        </h2>
                        <button className="text-xs font-black text-blue-500 uppercase tracking-widest">Edit</button>
                    </div>
                    <div className="p-6 bg-white dark:bg-[#1e293b] rounded-3xl border border-blue-100 dark:border-blue-900 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1 bg-blue-500 h-full" />
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">John Doe</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                            123 Innovation Drive, Tech City<br />
                            Silicon Valley, CA 94025<br />
                            United States
                        </p>
                    </div>
                </div>

                {/* Delivery Option */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Truck size={20} className="text-blue-500" /> Delivery Method
                    </h2>
                    <div className="p-6 bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <Truck size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Fast Standard Delivery</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">3-5 Business Days</p>
                            </div>
                        </div>
                        <span className="font-black text-green-500">FREE</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={20} className="text-blue-500" /> Payment Method
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'}`}
                        >
                            <CreditCard size={24} className={paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`font-black uppercase text-xs tracking-widest ${paymentMethod === 'card' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Card</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('wallet')}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'wallet' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'}`}
                        >
                            <WalletIcon size={24} className={paymentMethod === 'wallet' ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`font-black uppercase text-xs tracking-widest ${paymentMethod === 'wallet' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Wallet</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('coins')}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'coins' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'}`}
                        >
                            <Coins size={24} className={paymentMethod === 'coins' ? 'text-yellow-500' : 'text-gray-400'} />
                            <span className={`font-black uppercase text-xs tracking-widest ${paymentMethod === 'coins' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Coins</span>
                        </button>
                    </div>
                    {paymentMethod === 'wallet' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 flex items-center gap-3"
                        >
                            <ShieldCheck size={20} className="text-green-500" />
                            <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-tight">Protected by Femo Escrow. Funds only released when you approve delivery.</p>
                        </motion.div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="p-8 bg-white dark:bg-[#1e293b] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Order Summary</h2>
                    <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500">Premium Wireless Headphones</span>
                            <span className="font-bold text-gray-900 dark:text-white">$299</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500">Minimalist Watch x 2</span>
                            <span className="font-bold text-gray-900 dark:text-white">$300</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-900 dark:text-white font-black text-xl uppercase tracking-tighter">Total Amount</span>
                        <span className="text-gray-900 dark:text-white font-black text-3xl">$599</span>
                    </div>
                </div>

                {/* Final Action */}
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                        <Lock size={14} /> Secure Encrypted Transaction
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 hover:scale-[1.02] transition-transform text-xl flex items-center justify-center gap-3"
                    >
                        Confirm and Pay <ChevronRight size={24} />
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold text-center uppercase max-w-xs">By confirming, you agree to start the Escrow process for this order.</p>
                </div>
            </div>
        </div>
    );
};
