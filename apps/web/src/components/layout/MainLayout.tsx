import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Layout.module.css';
import {
    UserCircle
} from 'lucide-react';
import { UserBadge } from '../common/UserBadge';

interface MainLayoutProps {
    children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    // Render logic configuration
    const isProfile = path.startsWith('/profile');
    const isMenu = path === '/menu';
    const showTopBar = !isProfile && !isMenu;

    const isActive = (route: string) => {
        if (route === '/home') return path === '/home' || path === '/feed';
        return path.startsWith(route);
    };

    const navItems = [
        { id: 'home', light: 'home_light_mode_icon.png', dark: 'home_dark_mode_icon.png', label: 'Home', route: '/home' },
        { id: 'videos', light: 'video_light_mode_icon.png', dark: 'video_dark_mode_icon.png', label: 'Videos', route: '/videos' },
        { id: 'chat', light: 'messages_light_mode_icon.png', dark: 'massages_dark_mode_icon.png', label: 'Chat', route: '/chat', badge: 3 },
        { id: 'notifications', light: 'notification_light_mode_icon.png', dark: 'notification_dark_mode_icon.png', label: 'Notifications', route: '/notifications', badge: 5 },
        { id: 'menu', light: 'menu_light_mode_icon.png', dark: 'menu_dark_mode_icon.png', label: 'Menu', route: '/menu' },
    ];

    return (
        <div className={styles.layoutContainer}>

            {/* TOP BAR */}
            {showTopBar && (
                <header className={styles.topBar}>
                    <div className={styles.logoPart} onClick={() => navigate('/home')}>
                        <img src="/icons/Favicon.png" alt="Logo" className={styles.logoIcon} style={{ background: 'none', borderRadius: 0, width: 40, height: 40 }} />
                        <div className={styles.logoText}>
                            <span className={styles.textFemo}>Femo</span>
                            <span className={styles.textSpace}>Space</span>
                        </div>
                    </div>

                    <div className={styles.searchCenter} onClick={() => navigate('/search')}>
                        <div className={styles.searchIcon} style={{ width: 24, height: 24 }}>
                            <img src="/icons/search_bar_dark_and_light_modes_icon.png" alt="Search" className="w-full h-full object-contain opacity-50" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Users, Pages, Groups..."
                            className={styles.searchInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                                }
                            }}
                        />
                    </div>

                    <div className={styles.rightActions}>
                        <div className={`${styles.avatar} relative`} onClick={() => navigate('/profile')}>
                            {user?.profile?.avatarUrl || user?.avatarUrl ? (
                                <img src={user?.profile?.avatarUrl || user?.avatarUrl} alt="Me" className={styles.avatarImg} />
                            ) : (
                                <UserCircle size={36} className="text-gray-400" />
                            )}
                            {(user?.isVip || user?.roles?.includes('vip')) && (
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                                    <UserBadge type="vip" size={14} />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* MAIN CONTENT AREA */}
            <main className={styles.mainContent} style={{ marginTop: showTopBar ? '64px' : '0' }}>
                {children || <Outlet />}
            </main>

            {/* BOTTOM TAB BAR (Global) */}
            <nav className={styles.bottomBar}>
                {navItems.map((item) => {
                    const active = isActive(item.route);
                    return (
                        <button
                            key={item.id}
                            className={`${styles.tabItem} ${active ? styles.active : ''}`}
                            onClick={() => navigate(item.route)}
                        >
                            {/* Icon Image Switcher */}
                            <div style={{ width: 24, height: 24, position: 'relative' }}>
                                <img src={`/icons/${item.light}`} alt={item.label} className="w-full h-full object-contain block dark:hidden" />
                                <img src={`/icons/${item.dark}`} alt={item.label} className="w-full h-full object-contain hidden dark:block" />
                            </div>
                            <span className={styles.tabLabel}>{item.label}</span>
                            {item.badge && <span className={styles.badge}>{item.badge}</span>}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
