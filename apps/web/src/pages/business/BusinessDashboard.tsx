import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    ShoppingBag,
    ShoppingCart,
    Users,
    BarChart3,
    Megaphone,
    Wallet,
    Settings,
    Bell,
    Search,
    Plus,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// --- MOCK DATA ---
const SALES_STATS = [
    { label: 'Total Sales', value: '$12,450.00', change: '+15.3%', isUp: true },
    { label: 'Active Orders', value: '45', change: '+12%', isUp: true },
    { label: 'Avg. Order Value', value: '$85.00', change: '-2.1%', isUp: false },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', isUp: true },
];

const RECENT_ORDERS = [
    { id: '#ORD-7890', customer: 'Alice Smith', items: '2x Summer Dress', total: '$140.00', status: 'Processing', date: '2 mins ago' },
    { id: '#ORD-7889', customer: 'Bob Jones', items: '1x Denim Jacket', total: '$85.00', status: 'Shipped', date: '1 hour ago' },
    { id: '#ORD-7888', customer: 'Charlie Brown', items: '3x T-Shirt Pack', total: '$65.00', status: 'Delivered', date: 'Yesterday' },
    { id: '#ORD-7887', customer: 'Diana Prince', items: '1x Golden Tiara', total: '$250.00', status: 'Cancelled', date: 'Yesterday' },
];

const PRODUCTS = [
    { id: 1, name: 'Summer Floral Dress', sku: 'DRS-001', price: '$70.00', stock: 45, sales: 120 },
    { id: 2, name: 'Classic Denim Jacket', sku: 'JKT-005', price: '$85.00', stock: 12, sales: 85 },
    { id: 3, name: 'Basic White Tee', sku: 'TEE-002', price: '$25.00', stock: 150, sales: 450 },
    { id: 4, name: 'Leather Boots', sku: 'BTS-009', price: '$120.00', stock: 5, sales: 30 },
];

export const BusinessDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const renderSidebarItem = (id: string, icon: any, label: string) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-[#f3f4f6] dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans overflow-hidden">

            {/* SIDEBAR - Dark Theme Always for Professional look */}
            <div className="w-64 bg-[#111827] text-white flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg">B</div>
                    <div>
                        <div className="font-bold tracking-tight text-lg leading-none">Business</div>
                        <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-1">Suite</div>
                    </div>
                </div>

                <div className="px-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 border border-gray-700">
                        <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">F</div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">Femo Fashion</div>
                            <div className="text-xs text-gray-400">femo-fashion.store</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {renderSidebarItem('overview', <LayoutGrid size={18} />, 'Overview')}
                    {renderSidebarItem('products', <ShoppingBag size={18} />, 'Products')}
                    {renderSidebarItem('orders', <ShoppingCart size={18} />, 'Orders')}
                    {renderSidebarItem('customers', <Users size={18} />, 'Customers')}
                    {renderSidebarItem('analytics', <BarChart3 size={18} />, 'Analytics')}
                    {renderSidebarItem('marketing', <Megaphone size={18} />, 'Marketing & Ads')}
                    {renderSidebarItem('finance', <Wallet size={18} />, 'Finance')}
                    <div className="py-4"><hr className="border-gray-800" /></div>
                    {renderSidebarItem('settings', <Settings size={18} />, 'Settings')}
                </nav>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                    Femo Business Manager v2.0
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* TOP HEADER */}
                <header className="h-16 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-gray-100">{activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <input
                                className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 w-64 dark:text-gray-200"
                                placeholder="Search orders, products..."
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <img src={user?.avatarUrl || 'https://i.pravatar.cc/150'} className="w-9 h-9 rounded-full border border-gray-200" />
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE AREA */}
                <main className="flex-1 overflow-auto p-8 remove-scrollbar bg-[#f3f4f6] dark:bg-[#0f172a]">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="max-w-7xl mx-auto space-y-8">

                            {/* Action Bar */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-white">Good afternoon, Store Manager</h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Here's what's happening with your business today.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">View Store</button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                                        <Plus size={16} /> Add Product
                                    </button>
                                </div>
                            </div>

                            {/* Analytics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {SALES_STATS.map((stat, i) => (
                                    <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                                        <div className="text-3xl font-bold dark:text-white mb-2">{stat.value}</div>
                                        <div className={`text-xs font-bold inline-flex items-center gap-1 ${stat.isUp ? 'text-green-600 bg-green-100 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400' : 'text-red-600 bg-red-100 px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                            {stat.change}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Recent Orders */}
                                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                        <h3 className="font-bold text-lg dark:text-white">Recent Orders</h3>
                                        <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Order ID</th>
                                                    <th className="px-6 py-3 font-medium">Customer</th>
                                                    <th className="px-6 py-3 font-medium">Items</th>
                                                    <th className="px-6 py-3 font-medium">Total</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {RECENT_ORDERS.map((order, i) => (
                                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{order.id}</td>
                                                        <td className="px-6 py-4 dark:text-gray-300">{order.customer}</td>
                                                        <td className="px-6 py-4 dark:text-gray-300">{order.items}</td>
                                                        <td className="px-6 py-4 dark:text-gray-300">{order.total}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900' :
                                                                order.status === 'Shipped' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900' :
                                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' :
                                                                        'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{order.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Stock Alert / Task List */}
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                        <h3 className="font-bold text-lg dark:text-white mb-4">Stock Alerts</h3>
                                        <div className="space-y-3">
                                            {PRODUCTS.filter(p => p.stock < 20).map(p => (
                                                <div key={p.id} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/50">
                                                    <Package className="text-orange-500" size={20} />
                                                    <div>
                                                        <div className="text-sm font-bold dark:text-white">{p.name}</div>
                                                        <div className="text-xs text-orange-600 dark:text-orange-400">Only {p.stock} units left</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-4 py-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Manage Inventory</button>
                                    </div>

                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white text-center">
                                        <Megaphone className="mx-auto mb-3 opacity-80" size={32} />
                                        <h3 className="font-bold text-lg">Boost Sales</h3>
                                        <p className="text-indigo-100 text-sm mb-4">Run a new ad campaign to reach 50k+ potential customers.</p>
                                        <button className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg w-full text-sm hover:bg-indigo-50">Create Campaign</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* FINANCE TAB */}
                    {activeTab === 'finance' && (
                        <div className="flex flex-col items-center justify-center p-12">
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg max-w-2xl w-full border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                        <Wallet size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold dark:text-white">Wallet & Payouts</h2>
                                        <p className="text-gray-500 dark:text-gray-400">Manage your earnings and withdrawal methods</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="text-sm text-gray-500 font-medium mb-1">Available to Payout</div>
                                        <div className="text-3xl font-bold dark:text-white">$4,250.00</div>
                                    </div>
                                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="text-sm text-gray-500 font-medium mb-1">Pending (Escrow)</div>
                                        <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">$850.00</div>
                                    </div>
                                </div>

                                <h3 className="font-bold mb-4 dark:text-white">Payout Methods</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600"><CreditCard size={20} /></div>
                                            <div>
                                                <div className="font-bold dark:text-white">Visa ending in 4242</div>
                                                <div className="text-xs text-gray-500">Instant Transfer</div>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Default</span>
                                    </div>
                                    <button className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2">
                                        <Plus size={16} /> Add Payment Method
                                    </button>
                                </div>

                                <button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 transition-all">
                                    Withdraw Funds
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab !== 'overview' && activeTab !== 'finance') && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Megaphone size={48} className="mb-4 text-indigo-200" />
                            <p>Business Module <strong>{activeTab}</strong> is under development.</p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};
