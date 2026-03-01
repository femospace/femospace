import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export const EmailVerification: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || 'your email';

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) return;

        setLoading(true);
        setError(null);

        try {
            // Mock API call for verification
            // In real app: await axios.post('/auth/verify-email', { email, code });
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess(true);
            setTimeout(() => {
                navigate('/auth/login', { state: { message: t('auth.register.verification.success') } });
            }, 2000);
        } catch (err: any) {
            setError(t('auth.register.verification.errors.invalid'));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                        <Mail className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        {t('auth.register.verification.title')}
                    </h1>
                    <p className="text-gray-300">
                        {t('auth.register.verification.subtitle')} <span className="text-blue-300 font-medium">{email}</span>
                    </p>
                </div>

                {error && (
                    <motion.div
                        className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex gap-2 mb-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 flex gap-2 mb-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-300">{t('auth.register.verification.success')}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('auth.register.verification.inputLabel')}
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-3xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6 || success}
                        className={clsx(
                            "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                            loading || code.length !== 6 || success
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                        )}
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {t('auth.register.verification.verifyButton')}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-400">
                        {t('auth.register.verification.noEmail', { defaultValue: "Didn't receive an email?" })}{' '}
                        <button className="text-blue-400 hover:text-blue-300 font-semibold transition">
                            {t('auth.register.verification.resendButton')}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
