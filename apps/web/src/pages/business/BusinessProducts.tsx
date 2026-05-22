import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export const BusinessProducts = () => {
    const [products] = useState([
        { id: '1', title: 'Premium Wireless Headphones', price: 299, stock: 45, sales: 120, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
        { id: '2', title: 'Minimalist Watch', price: 150, stock: 12, sales: 85, status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' },
        { id: '3', title: 'Eco-Friendly Yoga Mat', price: 45, stock: 150, sales: 450, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1592432678896-188b39867049?w=100&q=80' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                    />
                </div>
                <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition">
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Sales</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                                        <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] uppercase text-xs">{p.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${p.price}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${p.stock < 20 ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="font-medium">{p.stock} units</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">{p.sales}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                        }`}>
                                        {p.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <button className="hover:text-indigo-600 transition"><Edit size={18} /></button>
                                        <button className="hover:text-blue-500 transition"><Eye size={18} /></button>
                                        <button className="hover:text-red-500 transition"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
