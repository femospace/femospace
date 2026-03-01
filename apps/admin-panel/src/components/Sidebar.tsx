import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Settings, LogOut, Package, CreditCard, BarChart3 } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Users', path: '/users', icon: <Users size={20} /> },
        { name: 'Content', path: '/content', icon: <Package size={20} /> },
        { name: 'Monetization', path: '/monetization', icon: <CreditCard size={20} /> },
        { name: 'Moderation', path: '/moderation', icon: <ShieldCheck size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="h-full w-64 glass border-r border-[#ffffff10] flex flex-col pt-8">
            <div className="px-6 mb-12">
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    FEMO ADMIN
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">Management Portal</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all
              ${isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
            `}
                    >
                        {item.icon}
                        <span className="text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6">
                <button className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all">
                    <LogOut size={20} />
                    <span className="text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
