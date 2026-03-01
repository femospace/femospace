import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LanguageSelector } from '../components/LanguageSelector';
import { ContactModal } from '../components/ContactModal';
import {
    ChevronRight,
    LogOut,
    User as UserIcon,
    Edit,
    Mail,
    Briefcase,
    Layout,
    Settings,
    TrendingUp,
    CreditCard,
    Moon,
    Sun,
    FileText,
    ShieldAlert,
    HelpCircle,
    Globe,
    CheckCircle,
    Award,
    ShieldCheck
} from 'lucide-react';
import { UserBadge } from '../components/common/UserBadge';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

export const Menu = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    const MenuItem = ({ icon: Icon, label, subtitle, onClick, path, extra }: any) => (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => path ? navigate(path) : onClick?.()}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <Icon size={22} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-gray-100">{label}</span>
                    {subtitle && <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {extra}
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-32">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <img src="/icons/Favicon.png" alt="Femo" className="w-6 h-6 object-contain brightness-0 invert" />
                        </div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Menu</h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleLogout}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <LogOut size={20} />
                    </motion.button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 pt-6 space-y-6">
                {/* 1) ACCOUNT SECTION */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#1e293b] rounded-[24px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img
                                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                alt="User"
                                className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-gray-700"
                            />
                            {user?.isEmailVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-[#1e293b]">
                                    <CheckCircle size={14} fill="currentColor" className="text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {user?.isVip && <UserBadge type="vip" size={18} />}
                                    {user?.isCreatorCertified && <UserBadge type="creator" size={18} />}
                                </div>
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-blue-500">Femo ID: {user?.femoId || '1000000'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.femoMail || `${user?.username}@femo.com`}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate(`/profile/${user?.username}`)}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-500/20"
                        >
                            <UserIcon size={16} /> View Profile
                        </button>
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold transition-all text-sm"
                        >
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>
                </motion.section>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                    {/* 2) FEMO MAIL */}
                    <MenuItem
                        icon={Mail}
                        label="Femo Mail"
                        subtitle="Internal Email System"
                        path="/mail"
                    />

                    {/* 3) BUSINESS TOOL CARD */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/business')}
                        className="p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl text-white shadow-xl shadow-blue-500/20 cursor-pointer relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-colors" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <Briefcase size={28} className="text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-extrabold tracking-tight">Business Tool</h2>
                                    <p className="text-sm text-blue-100/80 font-medium">Manage your business & ads</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </motion.div>

                    {/* OTHER MENU ITEMS */}
                    <MenuItem
                        icon={Award}
                        label="VIP Badge"
                        subtitle={user?.isVip ? "Active Subscription" : "Get Premium Status"}
                        path="/vip-badge"
                        extra={user?.isVip && <UserBadge type="vip" size={20} />}
                    />
                    <MenuItem
                        icon={ShieldCheck}
                        label="Creator Certification"
                        subtitle={user?.isCreatorCertified ? "Certified Creator" : "Apply for Badge"}
                        path="/creator-certification"
                        extra={user?.isCreatorCertified && <UserBadge type="creator" size={20} />}
                    />
                    <MenuItem icon={Layout} label="Creator Tool" path="/creator" />
                    <MenuItem icon={Settings} label="Settings" path="/settings" />
                    <MenuItem icon={TrendingUp} label="Monetization" path="/monetization" />
                    <MenuItem icon={CreditCard} label="Payment" path="/payment" />

                    {/* Dark Mode Toggle */}
                    <MenuItem
                        icon={isDarkMode ? Moon : Sun}
                        label="Dark Mode"
                        onClick={toggleTheme}
                        extra={
                            <div className={clsx(
                                "w-12 h-6 rounded-full p-1 transition-all duration-300",
                                isDarkMode ? "bg-blue-600" : "bg-gray-200"
                            )}>
                                <div className={clsx(
                                    "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                                    isDarkMode ? "translate-x-6" : "translate-x-0"
                                )} />
                            </div>
                        }
                    />

                    <MenuItem icon={FileText} label="Terms and Conditions" path="/terms" />
                    <MenuItem icon={ShieldAlert} label="Privacy Policy" path="/privacy" />
                    <MenuItem icon={HelpCircle} label="Help Center" path="/help" />
                    <MenuItem
                        icon={Globe}
                        label="Languages"
                        onClick={() => setShowLanguageSelector(true)}
                        extra={<span className="text-xs font-bold text-blue-500 uppercase">{t('current_lang_code', { defaultValue: 'EN' })}</span>}
                    />
                </motion.div>

                {/* Footer */}
                <footer className="pt-12 pb-8 text-center space-y-4">
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium italic">© 2026 SS Corporate Inc</p>
                    <div className="flex items-center justify-center gap-6 text-xs font-bold text-gray-500 dark:text-gray-400">
                        <Link to="/terms" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Terms</Link>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <Link to="/privacy" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Privacy Policy</Link>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <button onClick={() => setShowContactModal(true)} className="hover:text-blue-500 transition-colors uppercase tracking-widest">Contact Us</button>
                    </div>
                </footer>
            </main>

            {/* Language Selector Modal */}
            <AnimatePresence>
                {showLanguageSelector && (
                    <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showContactModal && (
                    <ContactModal onClose={() => setShowContactModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};
