import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VerificationStepProps {
    email: string;
    onVerify: (code: string) => Promise<void>;
    onResend: () => Promise<void>;
}

export const VerificationStep = ({ email, onVerify, onResend }: VerificationStepProps) => {
    const { t } = useTranslation();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only numbers

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Take only last digit
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (index === 5 && value) {
            const fullCode = newCode.join('');
            if (fullCode.length === 6) {
                handleVerify(fullCode);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setCode(newCode);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();

        // Auto-verify if complete
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (fullCode: string) => {
        setIsVerifying(true);
        setError('');

        try {
            await onVerify(fullCode);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.register.verification.errors.invalid'));
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            await onResend();
            setTimer(60);
            setCanResend(false);
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(t('auth.register.verification.errors.resendFailed'));
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('auth.register.verification.success')}</h3>
                <p className="text-gray-400">{t('auth.register.verification.redirecting')}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    {t('auth.register.verification.title')}
                </h2>
                <p className="text-gray-400 mb-4">
                    {t('auth.register.verification.subtitle')}
                </p>
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
                        <div className="h-2 w-16 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                        <div className="h-2 w-16 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        {t('auth.register.identity.stepInfo', { step: 3 })}
                    </span>
                </div>
                <p className="text-white font-medium bg-white/5 py-2 px-4 rounded-lg border border-white/5 inline-block mx-auto">{email}</p>
            </div>

            {/* OTP Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                    {t('auth.register.verification.inputLabel')}
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-12 h-14 text-center text-2xl font-bold bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'
                                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all`}
                            disabled={isVerifying}
                        />
                    ))}
                </div>
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

            {/* Timer */}
            <div className="text-center">
                {!canResend ? (
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <Clock size={16} />
                        <span>{t('auth.register.verification.resendTimer', { timer })}</span>
                    </div>
                ) : (
                    <button
                        onClick={handleResend}
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                        {t('auth.register.verification.resendButton')}
                    </button>
                )}
            </div>

            {/* Loading Overlay */}
            {isVerifying && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </motion.div>
    );
};
