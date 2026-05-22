import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Settings, LogOut, Package, CreditCard, BarChart3, Star, Cpu, ShieldAlert, Megaphone, Shield, UserCog, TrendingUp, AlertOctagon, Globe } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminRole } from '../services/adminAuth.service';

export const Sidebar: React.FC = () => {
    const { admin, logout } = useAdminAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER, AdminRole.SUPPORT_AGENT, AdminRole.GENERAL_STAFF] },
        { name: 'Personnel', path: '/staff', icon: <UserCog size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'User Management', path: '/users', icon: <Users size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'Complaints', path: '/complaints', icon: <AlertOctagon size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER, AdminRole.COMPLAINT_SPECIALIST, AdminRole.SUPPORT_AGENT, AdminRole.GENERAL_STAFF] },
        { name: 'Performance', path: '/performance', icon: <TrendingUp size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'KYC Moderation', path: '/kyc', icon: <Shield size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER, AdminRole.SUPPORT_AGENT] },
        { name: 'Verification Hub', path: '/verifications', icon: <ShieldCheck size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER, AdminRole.SUPPORT_AGENT] },
        { name: 'Marketplace', path: '/marketplace', icon: <Package size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'Payments & Wallet', path: '/payments', icon: <CreditCard size={20} />, roles: [AdminRole.SUPER_ADMIN] },
        { name: 'Ad Moderation', path: '/ads', icon: <Megaphone size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'Creator Economy', path: '/creators', icon: <Star size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'AI System Tools', path: '/ai-tools', icon: <Cpu size={20} />, roles: [AdminRole.SUPER_ADMIN] },
        { name: 'Analytics Hub', path: '/analytics', icon: <BarChart3 size={20} />, roles: [AdminRole.SUPER_ADMIN, AdminRole.MANAGER] },
        { name: 'Security Center', path: '/security', icon: <ShieldAlert size={20} />, roles: [AdminRole.SUPER_ADMIN] },
        { name: 'System Settings', path: '/settings', icon: <Settings size={20} />, roles: [AdminRole.SUPER_ADMIN] },
    ];

    const allowedItems = menuItems.filter(item => admin && item.roles.includes(admin.role));

    return (
        <aside className="w-80 h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col z-50">
            <div className="p-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white italic tracking-tighter">FEMO ADMIN</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Admin Core System</p>
                    </div>
                </div>

                <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 scrollbar-hide">
                    {allowedItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase italic tracking-[0.1em] ${isActive
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-slate-800 flex flex-col gap-4">
                <div className="px-6 flex justify-center mb-2">
                    <button
                        onClick={() => document.dispatchEvent(new CustomEvent('open-language-selector'))}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-bold text-white w-full justify-center"
                    >
                        <Globe size={16} className="text-blue-400" />
                        CHANGE LANGUAGE
                    </button>
                </div>
                <div className="px-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 font-black text-[10px] border border-white/5">
                        {admin?.firstName?.[0]}{admin?.lastName?.[0]}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-black text-white truncate uppercase italic">{admin?.firstName} {admin?.lastName}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate">{admin?.role.replace('_', ' ')}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest italic outline-none"
                >
                    <LogOut size={20} />
                    SECURITY_EXIT
                </button>
                <div className="text-center mt-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        © 2026 SS Corporate Inc
                    </p>
                </div>
            </div>
        </aside>
    );
};
