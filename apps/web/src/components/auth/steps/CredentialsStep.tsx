import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { PasswordInput } from '../shared/PasswordInput';
import { CountrySelector } from '../shared/CountrySelector';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

interface CredentialsStepProps {
    data: {
        email: string;
        password: string;
        confirmPassword: string;
        country: string;
        termsAccepted: boolean;
        privacyAccepted: boolean;
    };
    onChange: (field: string, value: string | boolean) => void;
    onNext: () => void;
    onBack: () => void;
}

export const CredentialsStep = ({ data, onChange, onNext, onBack }: CredentialsStepProps) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateAndProceed = () => {
        const newErrors: Record<string, string> = {};

        if (!data.email) {
            newErrors.email = t('auth.register.credentials.errors.emailRequired');
        } else if (!validateEmail(data.email)) {
            newErrors.email = t('auth.register.credentials.errors.emailInvalid');
        }

        if (!data.password) {
            newErrors.password = t('auth.register.credentials.errors.passwordRequired');
        } else if (data.password.length < 8) {
            newErrors.password = t('auth.register.credentials.errors.passwordShort');
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(data.password)) {
            newErrors.password = t('auth.register.credentials.errors.passwordComplex');
        }

        if (!data.confirmPassword) {
            newErrors.confirmPassword = t('auth.register.credentials.errors.confirmRequired');
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = t('auth.register.credentials.errors.match');
        }

        if (!data.country) {
            newErrors.country = t('auth.register.credentials.errors.country');
        }

        if (!data.termsAccepted) {
            newErrors.terms = t('auth.register.credentials.errors.terms');
        }

        if (!data.privacyAccepted) {
            newErrors.privacy = t('auth.register.credentials.errors.privacy');
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {t('auth.register.credentials.title')}
                </h2>
                <p className="text-gray-400">
                    {t('auth.register.credentials.subtitle')}
                </p>
            </div>

            {/* Progress */}
            <div className="flex flex-col items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                    <div className="h-2 w-16 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <div className="h-2 w-16 rounded-full bg-white/10" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                    {t('auth.register.identity.stepInfo', { step: 2 })}
                </span>
            </div>

            {/* Form */}
            <div className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('auth.register.credentials.email')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'
                                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                            placeholder="you@femo.space"
                        />
                    </div>
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                        >
                            {errors.email}
                        </motion.p>
                    )}
                </div>

                {/* Password */}
                <PasswordInput
                    value={data.password}
                    onChange={(val) => onChange('password', val)}
                    showStrength={true}
                    label={t('auth.register.credentials.password')}
                />
                {errors.password && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs"
                    >
                        {errors.password}
                    </motion.p>
                )}

                {/* Confirm Password */}
                <PasswordInput
                    value={data.confirmPassword}
                    onChange={(val) => onChange('confirmPassword', val)}
                    label={t('auth.register.credentials.confirmPassword')}
                />
                {data.confirmPassword && data.password !== data.confirmPassword && (
                    <motion.p
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-red-400 text-xs mt-1 font-medium bg-red-400/10 p-2 rounded-lg border border-red-400/20"
                    >
                        ⚠️ {t('auth.register.credentials.errors.match')}
                    </motion.p>
                )}
                {errors.confirmPassword && data.password === data.confirmPassword && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs"
                    >
                        {errors.confirmPassword}
                    </motion.p>
                )}

                {/* Country */}
                <CountrySelector
                    value={data.country}
                    onChange={(val) => onChange('country', val)}
                />
                {errors.country && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs"
                    >
                        {errors.country}
                    </motion.p>
                )}

                {/* Terms & Privacy */}
                <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3 group">
                        <div className="relative flex items-center justify-center pt-0.5">
                            <input
                                id="terms-checkbox"
                                type="checkbox"
                                checked={data.termsAccepted}
                                onChange={(e) => onChange('termsAccepted', e.target.checked)}
                                className="sr-only"
                            />
                            <button
                                type="button"
                                onClick={() => onChange('termsAccepted', !data.termsAccepted)}
                                className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${data.termsAccepted
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-400 hover:border-blue-400'
                                    }`}
                            >
                                {data.termsAccepted && <Check size={16} className="text-white" />}
                            </button>
                        </div>
                        <label htmlFor="terms-checkbox" className="text-sm text-gray-400 cursor-pointer">
                            <Trans
                                i18nKey="auth.register.credentials.terms"
                                components={{ link: <Link to="/terms" target="_blank" className="text-blue-500 hover:underline font-semibold" onClick={(e) => e.stopPropagation()} /> }}
                            />
                        </label>
                    </div>
                    {errors.terms && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs pl-8"
                        >
                            {errors.terms}
                        </motion.p>
                    )}

                    <div className="flex items-start gap-3 group">
                        <div className="relative flex items-center justify-center pt-0.5">
                            <input
                                id="privacy-checkbox"
                                type="checkbox"
                                checked={data.privacyAccepted}
                                onChange={(e) => onChange('privacyAccepted', e.target.checked)}
                                className="sr-only"
                            />
                            <button
                                type="button"
                                onClick={() => onChange('privacyAccepted', !data.privacyAccepted)}
                                className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${data.privacyAccepted
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-400 hover:border-blue-400'
                                    }`}
                            >
                                {data.privacyAccepted && <Check size={16} className="text-white" />}
                            </button>
                        </div>
                        <label htmlFor="privacy-checkbox" className="text-sm text-gray-400 cursor-pointer">
                            <Trans
                                i18nKey="auth.register.credentials.privacy"
                                components={{ link: <Link to="/privacy" target="_blank" className="text-blue-500 hover:underline font-semibold" onClick={(e) => e.stopPropagation()} /> }}
                            />
                        </label>
                    </div>
                    {errors.privacy && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs pl-8"
                        >
                            {errors.privacy}
                        </motion.p>
                    )}
                    <div className="pt-2 text-[10px] text-gray-500 italic">
                        <p className="font-bold text-gray-400 mb-1">
                            <Check size={10} className="inline mr-1" />
                            {t('auth.register.credentials.termsConfirmationTitle')}
                        </p>
                        <p>{t('auth.register.credentials.termsConfirmationText')}</p>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <motion.button
                    type="button"
                    onClick={onBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                    ← {t('auth.register.credentials.back')}
                </motion.button>
                <motion.button
                    type="button"
                    onClick={validateAndProceed}
                    disabled={!data.termsAccepted || !data.privacyAccepted}
                    whileHover={{ scale: (!data.termsAccepted || !data.privacyAccepted) ? 1 : 1.02 }}
                    whileTap={{ scale: (!data.termsAccepted || !data.privacyAccepted) ? 1 : 0.98 }}
                    className={`flex-1 py-3 font-semibold rounded-xl shadow-lg transition-all ${(!data.termsAccepted || !data.privacyAccepted)
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-500/50'
                        }`}
                >
                    {t('auth.register.credentials.submit')}
                </motion.button>
            </div>
        </motion.div>
    );
};
