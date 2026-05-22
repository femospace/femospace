import { useState } from 'react';
import { Search, Filter, Mail, Package } from 'lucide-react';

export const BusinessOrders = () => {
    const [orders] = useState([
        { id: '#ORD-7890', customer: 'Alice Smith', items: '2x Summer Dress', total: '$140.00', status: 'Processing', date: 'Oct 24, 14:20' },
        { id: '#ORD-7889', customer: 'Bob Jones', items: '1x Denim Jacket', total: '$85.00', status: 'Shipped', date: 'Oct 24, 12:45' },
        { id: '#ORD-7888', customer: 'Charlie Brown', items: '3x T-Shirt Pack', total: '$65.00', status: 'Delivered', date: 'Oct 23, 16:30' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none w-64"
                        />
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-bold text-sm flex items-center gap-2">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{o.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white">{o.customer}</span>
                                        <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{o.items}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${o.status === 'Processing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            o.status === 'Shipped' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{o.total}</td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-400">{o.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-indigo-600 transition"><Mail size={16} /></button>
                                        <button className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"><Package size={16} /></button>
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
