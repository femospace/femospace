import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Share2,
    Heart,
    ShoppingCart,
    Star,
    ShieldCheck,
    Truck,
    RefreshCcw,
    MessageCircle,
    Plus,
    Minus,
    Zap,
    ChevronRight
} from 'lucide-react';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    // Mock data
    const product = {
        id: id || '1',
        title: 'Premium Studio Wireless Headphones - Active Noise Cancelling',
        price: 299,
        originalPrice: 399,
        rating: 4.8,
        reviews: 124,
        description: 'Experience pure sound with our flagship wireless headphones. Features include advanced active noise cancellation, 40-hour battery life, and ultra-soft memory foam ear cups for all-day comfort. Perfect for music lovers and professional creators alike.',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426ff472b?w=800&q=80',
            'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80',
        ],
        store: {
            name: 'TechStore Mega',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TS',
            slug: 'techstore-mega',
            isVerified: true,
            rating: 4.9
        },
        shipping: 'Free Global Shipping',
        warranty: '2 Year Limited Warranty'
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] pb-32">
            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Heart size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto md:p-10">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left: Image Gallery */}
                    <div className="flex-1 space-y-4">
                        <div className="relative aspect-square md:rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={product.images[activeImage]}
                                className="w-full h-full object-cover cursor-zoom-in"
                            />
                            {/* Navigation Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {product.images.map((_, idx) => (
                                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'w-6 bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4 px-6 md:px-0 scrollbar-hide overflow-x-auto">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-60'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex-1 px-6 md:px-0 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <Zap size={12} fill="currentColor" /> Best Seller
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={16} className={`${s <= Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-700'}`} />
                                    ))}
                                    <span className="text-sm font-bold text-gray-900 dark:text-white ml-2">{product.rating}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({product.reviews} reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">${product.price}</span>
                            <span className="text-xl font-bold text-gray-400 line-through">${product.originalPrice}</span>
                            <div className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg">25% OFF</div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
                            {product.description}
                        </p>

                        {/* Store Card */}
                        <div
                            onClick={() => navigate(`/marketplace/store/${product.store.slug}`)}
                            className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <img src={product.store.logo} className="w-14 h-14 rounded-2xl" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{product.store.name}</h4>
                                        {product.store.isVerified && <ShieldCheck size={16} className="text-blue-500" fill="currentColor" />}
                                    </div>
                                    <p className="text-xs font-bold text-gray-500">{product.store.rating} Rating • Official Store</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-300" />
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30">
                                <Truck size={20} className="text-blue-500" />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{product.shipping}</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30">
                                <RefreshCcw size={20} className="text-blue-500" />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">30-Day Returns</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                                <span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest">Quantity</span>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700 shadow-sm">
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-black text-xl w-6 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="py-5 px-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-lg shadow-xl hover:scale-[1.02] transition-transform">
                                    Buy Now
                                </button>
                                <button className="py-5 px-8 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                            </div>

                            <button className="w-full py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center gap-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <MessageCircle size={20} /> Chat with Seller
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
