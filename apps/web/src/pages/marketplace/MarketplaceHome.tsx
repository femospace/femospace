import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Search,
    ShoppingCart,
    ChevronRight,
    Star,
    TrendingUp,
    Zap,
    ShoppingBag,
    Grid,
    List as ListIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketplaceHome = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { name: t('marketplace.categories.all', 'All'), id: 'All', icon: Grid },
        { name: t('marketplace.categories.fashion', 'Fashion'), id: 'Fashion', icon: ShoppingBag },
        { name: t('marketplace.categories.electronics', 'Electronics'), id: 'Electronics', icon: Zap },
        { name: t('marketplace.categories.home', 'Home'), id: 'Home', icon: TrendingUp },
        { name: t('marketplace.categories.beauty', 'Beauty'), id: 'Beauty', icon: ShoppingBag },
        { name: t('marketplace.categories.gaming', 'Gaming'), id: 'Gaming', icon: ListIcon },
    ];

    // Mock data for initial render
    const featuredProducts = [
        { id: '1', title: 'Premium Wireless Headphones', price: 299, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', store: 'TechStore' },
        { id: '2', title: 'Minimalist Minimalist Watch', price: 150, rating: 4.5, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', store: 'StyleHub' },
        { id: '3', title: 'Eco-Friendly Yoga Mat', price: 45, rating: 4.9, image: 'https://images.unsplash.com/photo-1592432678896-188b39867049?w=500&q=80', store: 'EcoLife' },
        { id: '4', title: 'Smart Home Speaker', price: 120, rating: 4.7, image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80', store: 'SmartConnect' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-24">
            {/* Header / Search Area */}
            <div className="bg-white dark:bg-[#1e293b] p-6 shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            {t('marketplace.title', 'Marketplace')}
                        </h1>
                        <button onClick={() => navigate('/marketplace/cart')} className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <ShoppingCart size={24} className="text-gray-700 dark:text-gray-300" />
                            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#1e293b]">3</span>
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('marketplace.searchPlaceholder', 'Search for unique products...')}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pt-8 space-y-10">

                {/* Hero Banner / Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-xl"
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative h-full flex flex-col justify-center p-8 md:p-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-black mb-2">{t('marketplace.exclusiveDeals', 'Exclusive Deals')}</h2>
                        <p className="text-indigo-100 mb-4 max-w-md font-medium">{t('marketplace.dealsSubtitle', 'Discover unique products from top creators and business owners globally.')}</p>
                        <button className="w-fit px-6 py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:scale-105 transition-transform">
                            {t('marketplace.shopNow', 'Shop Now')}
                        </button>
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {t('marketplace.categories', 'Categories')}
                        </h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex flex-col items-center gap-2 min-w-[80px] p-4 rounded-2xl transition-all ${activeCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <cat.icon size={24} />
                                <span className="text-xs font-bold">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('marketplace.featuredProducts', 'Featured Products')}</h3>
                        <button className="text-sm font-bold text-blue-500 flex items-center gap-1 hover:underline">
                            {t('marketplace.seeAll', 'See All')} <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                className="group bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                            <span className="text-[10px] font-bold text-gray-900 dark:text-white">★ {product.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{product.store}</p>
                                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-500 transition-colors uppercase text-sm">
                                        {product.title}
                                    </h4>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-lg font-black text-gray-900 dark:text-white">${product.price}</span>
                                        <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Trending Creator Corner */}
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-[40px] p-8 md:p-12 border border-blue-100/20">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest">
                                <TrendingUp size={14} /> {t('marketplace.creatorPicks', 'Creator Picks')}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                {t('marketplace.creatorCornerTitle', 'Shop what your favorite Creators are promoting')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                                {t('marketplace.creatorCornerSubtitle', 'Real reviews, real people. Tagged products in videos and lives now available in one place.')}
                            </p>
                            <button className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl">
                                {t('marketplace.exploreFeed', 'Explore Feed')}
                            </button>
                        </div>
                        <div className="w-full md:w-1/3 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800">
                            <img
                                src="https://images.unsplash.com/photo-1541093113199-a2e9d84e903f?w=500&q=80"
                                className="w-full h-full object-cover"
                                alt="Creator Promotion"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
