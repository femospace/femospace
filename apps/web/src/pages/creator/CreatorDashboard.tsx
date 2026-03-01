import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Video,
    BarChart2,
    DollarSign,
    Users,
    Settings,
    Bell,
    Plus,
    Search,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// --- MOCK DATA ---
const ANALYTICS_SUMMARY = [
    { label: 'Total Views', value: '1.2M', change: '+12.5%', isUp: true },
    { label: 'Watch Time (hrs)', value: '45.2K', change: '+8.3%', isUp: true },
    { label: 'Followers', value: '45.6K', change: '+1.2K', isUp: true },
    { label: 'Est. Revenue', value: '$2,450.00', change: '-2.1%', isUp: false },
];

const RECENT_CONTENT = [
    { id: 1, title: 'My Journey to Space 🚀', type: 'Video', date: '2 hours ago', views: '12.5K', revenue: '$45.20', status: 'Published' },
    { id: 2, title: 'Top 10 Coding Tips', type: 'Reel', date: 'Yesterday', views: '145K', revenue: '$12.00', status: 'Published' },
    { id: 3, title: 'React vs Vue 2026', type: 'Post', date: '2 days ago', views: '8.2K', revenue: '-', status: 'Published' },
    { id: 4, title: 'Live Stream Setup', type: 'Video', date: 'Draft', views: '-', revenue: '-', status: 'Draft' },
];

import { PageWrapper } from '../../components/common/PageWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { CreatorCreationModal } from '../../components/creator/CreatorCreationModal';

export const CreatorDashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreationModal, setShowCreationModal] = useState(false);

    const renderSidebarItem = (id: string, icon: any, label: string) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id
                ? 'bg-blue-600 text-white shadow-lg'
                : `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <PageWrapper className="flex h-screen overflow-hidden">

            {/* SIDEBAR */}
            <div className={`w-64 ${isDark ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-slate-200'} border-r flex flex-col shrink-0`}>
                <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">F</div>
                    <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Creator Studio</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {renderSidebarItem('overview', <LayoutDashboard size={20} />, 'Overview')}
                    {renderSidebarItem('content', <Video size={20} />, 'Content')}
                    {renderSidebarItem('analytics', <BarChart2 size={20} />, 'Analytics')}
                    {renderSidebarItem('monetization', <DollarSign size={20} />, 'Monetization')}
                    {renderSidebarItem('audience', <Users size={20} />, 'Audience')}
                    {renderSidebarItem('settings', <Settings size={20} />, 'Settings')}
                </nav>

                <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-slate-200'}`}>
                    <div className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-slate-50'}`}>
                        <img src={user?.avatarUrl || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-full bg-gray-700" />
                        <div className="overflow-hidden">
                            <div className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.username || 'Creator'}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Level 2 Verified</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* TOP HEADER */}
                <header className={`h-16 border-b ${isDark ? 'border-gray-800 bg-[#1e293b]/50' : 'border-slate-200 bg-white/50'} backdrop-blur-md flex items-center justify-between px-8`}>
                    <h1 className={`text-xl font-bold capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-slate-100 text-slate-900'} border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 w-64 transitioning-colors`}
                                placeholder="Search content..."
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                        <button className={`relative ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} p-2 rounded-full`}>
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
                        </button>
                        <button
                            onClick={() => setShowCreationModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-lg shadow-blue-900/20"
                        >
                            <Plus size={18} /> Create
                        </button>
                    </div>
                </header>

                {/* SCROLLABLE AREA */}
                <main className="flex-1 overflow-auto p-8 remove-scrollbar">

                    {/* OVERVIEW TAB CONTENT */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 max-w-7xl mx-auto">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {ANALYTICS_SUMMARY.map((stat, i) => (
                                    <div key={i} className={`${isDark ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-slate-100'} p-6 rounded-2xl border hover:shadow-lg transition-all`}>
                                        <div className={`${isDark ? 'text-gray-400' : 'text-slate-500'} text-sm font-medium mb-1`}>{stat.label}</div>
                                        <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                                        <div className={`text-xs font-bold inline-flex items-center gap-1 ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                            {stat.isUp ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                                            {stat.change} vs last 28 days
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Chart Section (Simulated) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className={`${isDark ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-slate-100'} lg:col-span-2 p-6 rounded-2xl border h-[300px] flex flex-col shadow-sm`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance Over Time</h3>
                                        <select className={`${isDark ? 'bg-gray-800 text-white' : 'bg-slate-50 text-slate-700'} text-xs border-none rounded p-1`}><option>Last 28 Days</option></select>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-full ${isDark ? 'bg-blue-600/20 hover:bg-blue-500' : 'bg-blue-100 hover:bg-blue-400'} rounded-t transition-colors relative group`}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                            >
                                                <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${isDark ? 'bg-gray-900 text-white' : 'bg-slate-800 text-white'} text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}>
                                                    {h * 1000} Views
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className={`flex justify-between mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                        <span>Jan 1</span>
                                        <span>Jan 14</span>
                                        <span>Jan 28</span>
                                    </div>
                                </div>

                                <div className={`${isDark ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-slate-100'} p-6 rounded-2xl border shadow-sm`}>
                                    <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Latest Comments</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-3 text-sm">
                                                <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-slate-200'} shrink-0`} />
                                                <div>
                                                    <div className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>User {i} <span className={`${isDark ? 'text-gray-500' : 'text-slate-400'} font-normal text-xs`}>2h ago</span></div>
                                                    <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'} line-clamp-2`}>Great video! Really helped me understand the topic better. Keep it up!</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 text-blue-500 text-sm font-bold hover:underline">View All</button>
                                </div>
                            </div>

                            {/* Recent Content Table */}
                            <div className={`${isDark ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-slate-100'} rounded-2xl border overflow-hidden shadow-sm`}>
                                <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-slate-100'} flex justify-between items-center`}>
                                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Content</h3>
                                    <button className="text-blue-500 text-sm hover:underline font-bold">Go to Content Manager</button>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className={`${isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-slate-50 text-slate-500'} uppercase text-xs font-black`}>
                                        <tr>
                                            <th className="px-6 py-4">Content</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Views</th>
                                            <th className="px-6 py-4">Revenue</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-slate-100'}`}>
                                        {RECENT_CONTENT.map(item => (
                                            <tr key={item.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                                                <td className="px-6 py-4 font-bold flex items-center gap-3">
                                                    <div className={`w-16 h-9 ${isDark ? 'bg-gray-700' : 'bg-slate-200'} rounded overflow-hidden relative shadow-inner`}>
                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-[10px] font-black uppercase">Thumb</div>
                                                    </div>
                                                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{item.title}</span>
                                                </td>
                                                <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-slate-500'} font-medium`}>{item.type}</td>
                                                <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{item.date}</td>
                                                <td className={`px-6 py-4 font-black ${isDark ? 'text-white' : 'text-slate-700'}`}>{item.views}</td>
                                                <td className={`px-6 py-4 font-black ${isDark ? 'text-green-500' : 'text-green-600'}`}>{item.revenue}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Published'
                                                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                        : `${isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500 border border-slate-200'}`
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'monetization' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <DollarSign size={64} className="text-green-500" />
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Monetization Hub</h2>
                            <p className={`${isDark ? 'text-gray-400' : 'text-slate-500'} max-w-md`}>Manage your ad revenue, sponsorships, and payouts. <br /> You are estimated to earn <strong>$124.50</strong> today.</p>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
                                <div className={`${isDark ? 'bg-[#1e293b] border-gray-800 text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-500'} p-6 rounded-xl border cursor-pointer transition-all font-bold`}>Ads Settings</div>
                                <div className={`${isDark ? 'bg-[#1e293b] border-gray-800 text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-500'} p-6 rounded-xl border cursor-pointer transition-all font-bold`}>Payout Methods</div>
                                <div className={`${isDark ? 'bg-[#1e293b] border-gray-800 text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-500'} p-6 rounded-xl border cursor-pointer transition-all font-bold`}>Sponsorships</div>
                                <div className={`${isDark ? 'bg-[#1e293b] border-gray-800 text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-500'} p-6 rounded-xl border cursor-pointer transition-all font-bold`}>Tax Info</div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab !== 'overview' && activeTab !== 'monetization') && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <AlertCircle size={48} className="mb-4" />
                            <p>Module <strong>{activeTab}</strong> is under construction.</p>
                        </div>
                    )}

                </main>
            </div>

            <CreatorCreationModal
                isOpen={showCreationModal}
                onClose={() => setShowCreationModal(false)}
            />
        </PageWrapper>
    );
};
