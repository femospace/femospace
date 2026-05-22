import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Search,
    Star,
    ShieldCheck,
    Users,
    ShoppingBag,
    Info,
    MessageSquare,
    Share2,
    Calendar
} from 'lucide-react';

export const StorePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Home');

    // Mock Store Data
    const store = {
        name: 'TechStore Mega',
        slug: slug || 'techstore-mega',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TS',
        banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
        rating: 4.9,
        reviews: 1420,
        followers: '24.5K',
        joinedDate: 'Mar 2024',
        isVerified: true,
        description: 'Leading provider of high-quality electronics and smart accessories. We focus on innovation and customer satisfaction.',
        location: 'Silicon Valley, CA'
    };

    const products = [
        { id: '1', title: 'Premium Wireless Headphones', price: 299, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
        { id: '2', title: 'Smart Watch Pro', price: 199, rating: 4.7, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
        { id: '3', title: 'Gaming Mouse', price: 89, rating: 4.9, image: 'https://images.unsplash.com/photo-1527814050087-37a3d7199143?w=500&q=80' },
        { id: '4', title: 'Portable Charger', price: 59, rating: 4.6, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80' },
    ];

    const tabs = ['Home', 'Products', 'Reviews', 'About'];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] pb-24">
            {/* Store Banner */}
            <div className="relative h-48 md:h-80 bg-gray-200 overflow-hidden">
                <img src={store.banner} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Store Profile Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 transition-all">
                <div className="bg-white dark:bg-[#1e293b] rounded-[40px] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                        <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-900 overflow-hidden shadow-xl bg-gray-100">
                            <img src={store.logo} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2 pb-2">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{store.name}</h1>
                                {store.isVerified && <ShieldCheck size={24} className="text-blue-500" fill="currentColor" />}
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {store.rating} ({store.reviews} Reviews)</span>
                                <span className="flex items-center gap-1.5"><Users size={16} /> {store.followers} Followers</span>
                                <span className="flex items-center gap-1.5"><Calendar size={16} /> Member since {store.joinedDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                            Follow
                        </button>
                        <button className="flex-1 md:flex-none px-6 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <MessageSquare size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="max-w-7xl mx-auto px-6 mt-12 space-y-10">
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content - Home View */}
                {activeTab === 'Home' && (
                    <div className="space-y-12">
                        {/* New Arrivals Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <ShoppingBag size={24} className="text-blue-600" /> New Arrivals
                                </h3>
                                <button className="text-sm font-black text-blue-500 uppercase tracking-widest hover:underline">View All</button>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                        className="group bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all cursor-pointer"
                                    >
                                        <div className="aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
                                            <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate uppercase text-sm">{product.title}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-blue-600">${product.price}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                    <span className="text-[10px] font-bold text-gray-500">{product.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Highlight */}
                        <div className="bg-gray-50 dark:bg-[#1e293b]/50 rounded-[40px] p-10 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <Info size={24} className="text-blue-500" />
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">About the Store</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed">
                                {store.description}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
