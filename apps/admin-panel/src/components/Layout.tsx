import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const Layout: React.FC = () => {
    const { admin, logout } = useAdminAuth();

    return (
        <div className="flex h-screen bg-[#000814] overflow-hidden">
            <div className="flex-shrink-0">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto px-12 py-10 relative bg-[#000814]/90">
                {/* Background Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[130px] rounded-full -z-10 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[130px] rounded-full -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Femo Administrative System</h2>
                            <p className="text-slate-400 mt-1 font-medium">Real-time ecosystem oversight and platform control</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-black text-white">{admin?.firstName} {admin?.lastName}</p>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{admin?.role?.replace('_', ' ')}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${admin?.firstName}+${admin?.lastName}&background=0f172a&color=fff`}
                                    className="w-full h-full rounded-[14px] border-2 border-[#1e293b]"
                                    alt="Admin Avatar"
                                />
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-xl border border-red-500/20 transition-all uppercase tracking-widest outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    <Outlet />
                </div>
            </main>
        </div>
    );
};
