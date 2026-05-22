import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    CreditCard
} from 'lucide-react';

export const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        { id: '1', title: 'Premium Wireless Headphones', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80', store: 'TechStore' },
        { id: '2', title: 'Minimalist Watch', price: 150, quantity: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80', store: 'StyleHub' },
    ]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping mock
    const total = subtotal + shipping;

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Your cart is empty</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => navigate('/marketplace')}
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-40">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Shopping Cart</h1>
                <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-black px-3 py-1 rounded-full">{cartItems.length} Items</span>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Cart Items List */}
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-[#1e293b] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-4 text-sm uppercase">{item.title}</h3>
                                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{item.store}</p>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-xl font-black text-gray-900 dark:text-white">${item.price}</p>
                                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-blue-600 transition">
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="text-blue-600 hover:scale-110 transition">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="bg-white dark:bg-[#1e293b] rounded-[40px] p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Order Summary</h2>
                    <div className="space-y-3 font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-gray-900 dark:text-white font-bold">${subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-500 font-bold">FREE</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <span className="text-gray-900 dark:text-white font-black text-xl">Total</span>
                            <span className="text-gray-900 dark:text-white font-black text-2xl">${total}</span>
                        </div>
                    </div>
                </div>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-6 py-4 opacity-50">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} /> Secure Payment
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                        <CreditCard size={14} /> Encrypted
                    </div>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 dark:from-[#0f172a] via-gray-50/80 dark:via-[#0f172a]/80 to-transparent">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/marketplace/checkout')}
                        className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform text-lg"
                    >
                        Checkout Now <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
