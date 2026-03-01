import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, User, LogIn, ShieldCheck, Zap } from 'lucide-react';
import { PasswordInput } from './shared/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { detectIdentifierType, IdentifierType } from '../../auth/utils/identifier.utils';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    onForgotPassword: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onForgotPassword }: LoginModalProps) => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [identifierType, setIdentifierType] = useState<IdentifierType | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        if (!password) {
            setError(t('auth.login.errors.passwordRequired'));
            return;
        }

        setIsLoading(true);

        try {
            await login(identifier, password);
            onClose();

            const pendingAction = localStorage.getItem('pendingSupportAction');
            if (pendingAction === 'chat') {
                localStorage.removeItem('pendingSupportAction');
                navigate('/chat?support=true');
            } else {
                navigate('/home');
            }
        } catch (err: any) {
            setError(err.message || t('auth.login.errors.invalid'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIdentifier('');
        setPassword('');
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

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    {t('auth.login.title')}
                                </h2>
                                <p className="text-gray-400">
                                    {t('auth.login.subtitle')}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Identifier */}
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

                                {/* Password */}
                                <PasswordInput
                                    value={password}
                                    onChange={setPassword}
                                    showStrength={false}
                                    label={t('auth.login.passwordLabel')}
                                />

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onForgotPassword}
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        {t('auth.login.forgotPassword')}
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Submit Button */}
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
                                        <>
                                            <LogIn size={20} />
                                            {t('auth.login.submit')}
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Security Badges */}
                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>{t('auth.login.securityInfo.encrypted').split(' ')[0]}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <Zap className="w-3 h-3" />
                                    <span>{t('auth.login.securityInfo.rateLimited').split(' ')[0]}</span>
                                </div>
                            </div>

                            {/* Switch to Register */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-400 text-sm">
                                    {t('auth.login.dontHaveAccount')}{' '}
                                    <button
                                        onClick={onSwitchToRegister}
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                    >
                                        {t('auth.login.signUp')}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
