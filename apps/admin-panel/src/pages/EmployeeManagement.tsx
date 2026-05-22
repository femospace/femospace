import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Star, Briefcase, Headset, MoreVertical, Search, Zap, XCircle } from 'lucide-react';
import { adminAuthService, AdminRole, type AdminUser, type AdminRoleType } from '../services/adminAuth.service';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const EmployeeManagement: React.FC = () => {
    const { admin } = useAdminAuth();
    const [employees, setEmployees] = useState<AdminUser[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        serviceNumber: string;
        secretKey: string;
        role: AdminRoleType;
        department: string;
        notes: string;
    }>({
        firstName: '',
        lastName: '',
        serviceNumber: '',
        secretKey: '',
        role: AdminRole.GENERAL_STAFF,
        department: '',
        notes: ''
    });

    useEffect(() => {
        if (admin) {
            const list = adminAuthService.getEmployees(admin);
            setEmployees(list);
        }
    }, [admin]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!admin) return;

        try {
            adminAuthService.registerEmployee(formData, admin);
            setIsRegistering(false);
            setEmployees(adminAuthService.getEmployees(admin));
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                serviceNumber: '',
                secretKey: '',
                role: AdminRole.GENERAL_STAFF,
                department: '',
                notes: ''
            });
        } catch (error) {
            alert('Failed to register employee: Only Super Admin has this clearance.');
        }
    };

    const getRoleIcon = (role: AdminRoleType) => {
        switch (role) {
            case AdminRole.SUPER_ADMIN: return <Zap size={14} className="text-amber-400" />;
            case AdminRole.MANAGER: return <Star size={14} className="text-blue-400" />;
            case AdminRole.COMPLAINT_SPECIALIST: return <Shield size={14} className="text-rose-400" />;
            case AdminRole.SUPPORT_AGENT: return <Headset size={14} className="text-emerald-400" />;
            default: return <Briefcase size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Employee Infrastructure</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage platform staff, clearance levels, and operational roles</p>
                </div>
                {admin?.role === AdminRole.SUPER_ADMIN && (
                    <button
                        onClick={() => setIsRegistering(true)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 active:scale-95"
                    >
                        <UserPlus size={20} />
                        REGISTER STAFF
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Employee List */}
                <div className="xl:col-span-2 glass-card overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input placeholder="Filter staff..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all shadow-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/2 border-b border-white/5">
                                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Personnel</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Service Slot</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Clearance</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-white/2 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all font-black text-[10px]">
                                                    {emp.firstName[0]}{emp.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white italic tracking-wider uppercase">{emp.firstName} {emp.lastName}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter italic">{emp.department || 'GLOBAL OPS'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-xs text-slate-400">{emp.serviceNumber}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg w-fit">
                                                {getRoleIcon(emp.role)}
                                                <span className="text-[10px] font-black text-white tracking-widest">{emp.role.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-600 hover:text-white transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Context */}
                <div className="space-y-8">
                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8">Node Distribution</h3>
                        <div className="space-y-6">
                            {[
                                { role: 'Managers', count: employees.filter(e => e.role === AdminRole.MANAGER).length, color: 'bg-blue-500' },
                                { role: 'Specialists', count: employees.filter(e => e.role === AdminRole.COMPLAINT_SPECIALIST).length, color: 'bg-rose-500' },
                                { role: 'Support', count: employees.filter(e => e.role === AdminRole.SUPPORT_AGENT).length, color: 'bg-emerald-500' },
                                { role: 'Staff', count: employees.filter(e => e.role === AdminRole.GENERAL_STAFF).length, color: 'bg-slate-500' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>{stat.role}</span>
                                        <span className="text-white">{stat.count} ACTIVE</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${stat.color} shadow-lg`}
                                            style={{ width: employees.length > 0 ? `${(stat.count / employees.length) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 border-l-4 border-amber-500">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-amber-500" size={24} />
                            <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Root Oversight</h4>
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 italic leading-relaxed">
                            Personnel records are immutable after system deployment. Only the Super Admin can revoke clearance or update service slots.
                        </p>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {isRegistering && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl glass-card p-10 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Personnel Enrollment</h3>
                                <p className="text-slate-500 text-xs font-medium italic mt-1 font-sans">Enter detailed credentials for the new platform administrator</p>
                            </div>
                            <button onClick={() => setIsRegistering(false)} className="text-slate-500 hover:text-white transition-all"><XCircle size={24} /></button>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                                    <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                                    <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Number</label>
                                    <input required value={formData.serviceNumber} onChange={e => setFormData({ ...formData, serviceNumber: e.target.value })} placeholder="0209..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secret Key</label>
                                    <input required type="password" value={formData.secretKey} onChange={e => setFormData({ ...formData, secretKey: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 font-mono" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assigned Role</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as AdminRoleType })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500">
                                        <option value={AdminRole.MANAGER}>MANAGER</option>
                                        <option value={AdminRole.SUPPORT_AGENT}>SUPPORT AGENT</option>
                                        <option value={AdminRole.COMPLAINT_SPECIALIST}>COMPLAINT SPECIALIST</option>
                                        <option value={AdminRole.GENERAL_STAFF}>GENERAL STAFF</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</label>
                                    <input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Finance Hub" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 mt-6 uppercase tracking-[0.2em] italic">
                                CONFIRM STAFF DEPLOYMENT
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
