import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Shield, Star, Rocket, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vipService } from '../services/badge.service';
import { UserBadge } from '../components/common/UserBadge';
import { useAuth } from '../contexts/AuthContext';

export const VipBadge: React.FC = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [selectedPlan] = useState<number>(1);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        setLoading(false);
    };

    const handleBuy = async () => {
        setBuying(true);
        try {
            await vipService.buyVip(selectedPlan, 'card'); // Default to card for now
            setSuccess(true);
            if (refreshUser) refreshUser();
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (error) {
            console.error('Buy failed', error);
            alert('Purchase failed. Please try again.');
        } finally {
            setBuying(false);
        }
    };

    const benefits = [
        { icon: <Star className="text-yellow-400" />, title: 'Exclusive VIP Badge', desc: 'Show your premium status everywhere.' },
        { icon: <Zap className="text-blue-400" />, title: 'Priority Support', desc: 'Get your issues resolved faster.' },
        { icon: <Shield className="text-green-400" />, title: 'Advanced Protection', desc: 'Enhanced security features for your account.' },
        { icon: <Rocket className="text-purple-400" />, title: 'Early Access', desc: 'Be the first to try new features.' },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (success) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-6 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
            >
                <Check size={48} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to VIP!</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">Your VIP badge is now active. You will be redirected to your profile in a few seconds.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-20">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">VIP Badge</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 pt-8">
                {/* Badge Preview */}
                <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl mb-6">
                        <UserBadge type="vip" size={80} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Elevate Your Profile</h2>
                    <p className="text-gray-500 dark:text-gray-400">Join the exclusive circle of VIP members on Femo Space.</p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {benefits.map((b, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                {b.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{b.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing Selection */}
                <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Choose Your Plan</h3>
                    <div className="space-y-3">
                        <div
                            className="flex items-center justify-between p-6 rounded-2xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">12 Months VIP Access</p>
                                    <p className="text-sm text-gray-500">Premium Verification & All Benefits</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400 line-through font-bold">$49.00</p>
                                <p className="text-2xl font-black text-blue-600">$29.00</p>
                                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Special Offer</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Payment Methods</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { id: 'card', name: 'Debit Card' },
                            { id: 'paypal', name: 'PayPal' },
                            { id: 'payoneer', name: 'Payoneer' },
                            { id: 'binance', name: 'Binance Tripto (bit, usdt)' },
                            { id: 'skrill', name: 'skriil' },
                            { id: 'google', name: 'Google Play' }
                        ].map((method) => (
                            <button
                                key={method.id}
                                className="p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 transition-all text-xs font-bold text-gray-600 dark:text-gray-400 text-center"
                            >
                                {method.name}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={buying || user?.isVip}
                        onClick={handleBuy}
                        className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {buying ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : user?.isVip ? 'Already VIP' : 'Buy Now - $29'}
                    </button>
                </div>
            </main>
        </div>
    );
};
