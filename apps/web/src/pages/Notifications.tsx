import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    DollarSign,
    ShieldAlert,
    Trash2,
    Filter,
    Settings as SettingsIcon,
    ChevronRight,
    Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';


type NotifCategory = 'all' | 'mentions' | 'follows' | 'monetization' | 'system';

interface NotificationItem {
    _id: string;
    type: string;
    category: string;
    title: string;
    message: string;
    isRead: boolean;
    priority: string;
    createdAt: string;
    senderId?: string;
}

export const Notifications = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<NotifCategory>('all');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async (category: NotifCategory) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/notifications?category=${category}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(activeTab);
    }, [activeTab]);

    const markRead = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (category: string, type: string) => {
        switch (category) {
            case 'social':
                if (type === 'like') return <Heart size={20} className="text-red-500 fill-red-500" />;
                if (type === 'follow') return <UserPlus size={20} className="text-blue-500" />;
                return <MessageCircle size={20} className="text-green-500" />;
            case 'monetization':
                return <DollarSign size={20} className="text-yellow-500" />;
            case 'system':
                return <ShieldAlert size={20} className="text-orange-500" />;
            default:
                return <Bell size={20} className="text-gray-400" />;
        }
    };

    const tabs = [
        { id: 'all', label: t('notifications.all', 'All') },
        { id: 'mentions', label: t('notifications.mentions', 'Mentions') },
        { id: 'follows', label: t('notifications.follows', 'Follows') },
        { id: 'monetization', label: t('notifications.monetization', 'Monetization') },
        { id: 'system', label: t('notifications.system', 'System') }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a] max-w-2xl mx-auto border-x border-gray-100 dark:border-gray-800">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black dark:text-white flex items-center gap-2">
                        {t('notifications.title', 'Notifications')}
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                {notifications.filter(n => !n.isRead).length} {t('notifications.new', 'NEW')}
                            </span>
                        )}
                    </h1>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                            <SettingsIcon size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Categories Tab Bar */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as NotifCategory)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1">
                {loading ? (
                    <div className="flex flex-col gap-4 p-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <AnimatePresence mode="popLayout">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <motion.div
                                        key={notif._id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`p-4 border-b border-gray-50 dark:border-gray-800/50 flex gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all cursor-pointer group relative ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                        onClick={() => !notif.isRead && markRead(notif._id)}
                                    >
                                        <div className="shrink-0 relative">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notif.category === 'system' ? 'bg-orange-100 dark:bg-orange-900/20' :
                                                notif.category === 'monetization' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                                    'bg-blue-100 dark:bg-blue-900/20'
                                                }`}>
                                                {getIcon(notif.category, notif.type)}
                                            </div>
                                            {!notif.isRead && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 border-2 border-white dark:border-[#0f172a] rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`text-sm font-bold ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                                    {notif.title}
                                                </h3>
                                                <span className="text-[10px] text-gray-400 font-medium">2h ago</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {notif.message}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                        <Bell size={40} />
                                    </div>
                                    <h2 className="text-xl font-bold dark:text-white mb-2">{t('notifications.noNotifs', 'No notifications yet')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('notifications.noNotifsSubtitle', "When people interact with your content or there are system updates, they'll show up here.")}</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* AI Summary Banner (Mock) */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 m-4 rounded-2xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Info size={20} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">{t('notifications.dailySummary', 'AI Daily Summary')}</h4>
                            <p className="text-[10px] opacity-90">{t('notifications.summaryDesc', { likes: 12, follows: 3, defaultValue: 'You had 12 likes and 3 new followers today.' })}</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="opacity-70" />
                </div>
            </div>
        </div>
    );
};
