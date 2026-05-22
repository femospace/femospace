import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, Hash, Key, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
    const { login } = useAdminAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        serviceNumber: '',
        secretKey: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const success = await login(
            formData.firstName,
            formData.lastName,
            formData.serviceNumber,
            formData.secretKey
        );

        if (success) {
            navigate('/');
        } else {
            setError('ACCESS DENIED: Authentication credentials invalid.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg glass-card p-10 relative z-10 border border-white/5"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/10 animate-pulse">
                        <ShieldCheck className="text-blue-500" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">FEMO ADMIN</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Admin Core System Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    placeholder="Shan"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    placeholder="Sandaruwan"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Number</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.serviceNumber}
                                onChange={e => setFormData({ ...formData, serviceNumber: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                placeholder="0209..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Access Key</label>
                        <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="password"
                                required
                                value={formData.secretKey}
                                onChange={e => setFormData({ ...formData, secretKey: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-widest"
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 mt-4 flex items-center justify-center gap-3 active:scale-95"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                VERIFYING...
                            </>
                        ) : (
                            <>
                                <Lock size={20} />
                                DEPLOY SYSTEM ACCESS
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] italic mb-2">
                        Authorized Personnel Only • Intrusion Detection Active
                    </p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        © 2026 SS Corporate Inc
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
