import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { detectIdentifierType, IdentifierType } from '../../auth/utils/identifier.utils';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) => {
    const { t } = useTranslation();
    const [identifier, setIdentifier] = useState('');
    const [identifierType, setIdentifierType] = useState<IdentifierType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIdentifier(value);
        if (!value.trim()) {
            setIdentifierType(null);
            return;
        }
        setIdentifierType(detectIdentifierType(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!identifier.trim()) {
            setError(t('auth.login.errors.identifierRequired'));
            return;
        }

        if (identifierType === IdentifierType.INVALID) {
            setError(t('auth.login.errors.identifierInvalid'));
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/forgot-password/request', { identifier });
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.forgotPassword.errors.failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIdentifier('');
        setIsSent(false);
        setError('');
        setIdentifierType(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-white/10"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                aria-label={t('selector.close')}
                            >
                                <X size={24} />
                            </button>

                            {isSent ? (
                                <div className="text-center py-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </motion.div>
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                                        {t('auth.forgotPassword.successTitle')}
                                    </h2>
                                    <p className="text-gray-400 mb-8">
                                        {t('auth.register.verification.subtitle')} <strong>{identifier}</strong>.
                                    </p>
                                    <button
                                        onClick={onBackToLogin}
                                        className="w-full py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={20} />
                                        {t('auth.register.credentials.back')}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                            {t('auth.forgotPassword.title')}
                                        </h2>
                                        <p className="text-gray-400">
                                            {t('auth.forgotPassword.subtitle')}
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                {t('auth.login.identifierLabel')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <User size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={identifier}
                                                    onChange={handleIdentifierChange}
                                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${identifierType === IdentifierType.INVALID
                                                            ? 'border-red-500/50 focus:ring-red-500/50'
                                                            : 'border-white/10 focus:ring-blue-500/50'
                                                        }`}
                                                    placeholder={t('auth.login.identifierPlaceholder')}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                t('auth.forgotPassword.submit')
                                            )}
                                        </motion.button>

                                        <button
                                            type="button"
                                            onClick={onBackToLogin}
                                            className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft size={16} />
                                            {t('auth.forgotPassword.backToLogin')}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
