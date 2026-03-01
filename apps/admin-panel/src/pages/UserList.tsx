import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Shield, ShieldAlert, CheckCircle2, UserPlus, ExternalLink, Ban } from 'lucide-react';

interface User {
    id: string;
    femoId: string;
    username: string;
    email: string;
    status: 'active' | 'suspended' | 'verified' | 'vip';
    role: 'user' | 'creator' | 'moderator' | 'admin';
    joinedAt: string;
    avatar: string;
}

const mockUsers: User[] = [
    { id: '1', femoId: '1050600', username: 'alex_femo', email: 'alex@femo.app', status: 'vip', role: 'creator', joinedAt: '2024-01-12', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', femoId: '1050601', username: 'sarah_m', email: 'sarah@femo.app', status: 'active', role: 'user', joinedAt: '2024-02-15', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', femoId: '1050602', username: 'mod_dave', email: 'dave@femo.app', status: 'verified', role: 'moderator', joinedAt: '2023-11-20', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', femoId: '1050603', username: 'toxic_user', email: 'spam@gmail.com', status: 'suspended', role: 'user', joinedAt: '2024-03-01', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', femoId: '1050604', username: 'premium_star', email: 'star@femo.app', status: 'vip', role: 'creator', joinedAt: '2024-01-05', avatar: 'https://i.pravatar.cc/150?u=5' },
];

export const UserList: React.FC = () => {
    const [users] = useState(mockUsers);
    const [search, setSearch] = useState('');

    const getStatusStyle = (status: User['status']) => {
        switch (status) {
            case 'vip': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
            case 'active': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
            case 'suspended': return 'bg-red-400/10 text-red-400 border-red-400/20';
            case 'verified': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
            default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
        }
    };

    const getRoleIcon = (role: User['role']) => {
        switch (role) {
            case 'admin': return <Shield className="text-red-400" size={14} />;
            case 'moderator': return <ShieldAlert className="text-amber-400" size={14} />;
            case 'creator': return <CheckCircle2 className="text-blue-400" size={14} />;
            default: return null;
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.femoId.includes(search)
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, Username or Email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/60 text-slate-300 rounded-2xl font-black border border-slate-700/30 transition-all hover:bg-slate-700/60">
                        <Filter size={18} /> Filter List
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700">
                        <UserPlus size={18} /> Add User
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden border border-slate-700/30">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-700/30 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                            <th className="py-6 px-8">Member Profile</th>
                            <th className="py-6 px-8">Unique Identifier</th>
                            <th className="py-6 px-8">Membership Status</th>
                            <th className="py-6 px-8">Privilege Role</th>
                            <th className="py-6 px-8">Join Date</th>
                            <th className="py-6 px-8 text-right">Administrative Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        <AnimatePresence>
                            {filteredUsers.map((user, i) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                                                <img src={user.avatar} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">@{user.username}</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className="font-mono text-xs font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg border border-blue-400/20">{user.femoId}</span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`text-[9px] uppercase font-black tracking-[0.15em] px-2.5 py-1.5 rounded-full border ${getStatusStyle(user.status)} shadow-sm`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(user.role)}
                                            <span className="text-xs font-bold text-slate-300 capitalize">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="text-xs font-bold text-slate-400">{user.joinedAt}</p>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button className="p-2.5 text-slate-500 hover:text-white bg-slate-800/20 hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-2.5 text-slate-500 hover:text-red-400 bg-slate-800/20 hover:bg-red-400/10 rounded-xl transition-all shadow-sm">
                                                <Ban size={16} />
                                            </button>
                                            <button className="p-2.5 text-slate-500 hover:text-white bg-slate-800/20 hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600 border border-slate-700/30">
                            <Ban size={32} />
                        </div>
                        <h4 className="text-lg font-black text-white">No members matched your query</h4>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto font-medium">Try adjusting your filters or search keywords to find the desired user profile.</p>
                    </div>
                )}

                <div className="p-8 border-t border-slate-700/30 bg-slate-900/40 flex justify-between items-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span>Displaying {filteredUsers.length} members</span>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700/30 disabled:opacity-30" disabled>Previous Page</button>
                        <button className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700/30">Next Page</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
