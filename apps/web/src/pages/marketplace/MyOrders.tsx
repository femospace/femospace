import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle2,
    ChevronRight,
    Search,
    MessageCircle,
    Star
} from 'lucide-react';

export const MyOrders = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Processing', 'Shipped', 'Delivered'];

    const orders = [
        {
            id: 'FEMO-8829',
            date: 'Oct 24, 2024',
            total: 599,
            status: 'Shipped',
            items: [
                { title: 'Premium Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
                { title: 'Minimalist Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' }
            ],
            store: 'TechStore Mega'
        },
        {
            id: 'FEMO-8710',
            date: 'Oct 20, 2024',
            total: 45,
            status: 'Delivered',
            items: [
                { title: 'Eco-Friendly Yoga Mat', image: 'https://images.unsplash.com/photo-1592432678896-188b39867049?w=100&q=80' }
            ],
            store: 'EcoLife'
        }
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Shipped': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'Delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'Processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Shipped': return <Truck size={14} />;
            case 'Delivered': return <CheckCircle2 size={14} />;
            case 'Processing': return <Package size={14} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/marketplace')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                    </button>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">My Orders</h1>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <Search size={24} className="text-gray-400" />
                </button>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Filters */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === f
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group"
                        >
                            {/* Order Top Info */}
                            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                    <h3 className="font-extrabold text-gray-900 dark:text-white">{order.id}</h3>
                                </div>
                                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{order.store}</p>
                                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Placed on {order.date}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">${order.total}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition">
                                            <MessageCircle size={20} />
                                        </button>
                                        <button className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm tracking-tight hover:scale-105 transition-transform">
                                            Track Order
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            {order.status === 'Delivered' && (
                                <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <Star size={16} className="text-yellow-500" /> Rate and Review items
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
