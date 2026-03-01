import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { calculatePasswordStrength } from '../../../lib/validation';
import { useTranslation } from 'react-i18next';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showStrength?: boolean;
    label?: string;
}

export const PasswordInput = ({
    value,
    onChange,
    placeholder = '••••••••',
    showStrength = false,
    label = 'Password'
}: PasswordInputProps) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const strength = calculatePasswordStrength(value);

    const localizedStrengthLabel = t(`auth.password.scores.${strength.label.charAt(0).toLowerCase() + strength.label.slice(1).replace(/\s/g, '')}`, { defaultValue: strength.label });

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label === 'Password' ? t('auth.register.credentials.password') : label}
            </label>

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder={placeholder}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {showStrength && value && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    {/* Strength Bar */}
                    <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength.score ? strength.color : 'bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Strength Label */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">
                            {t('auth.password.strength')}: <span className={strength.color.replace('bg-', 'text-')}>{localizedStrengthLabel}</span>
                        </span>
                    </div>

                    {/* Feedback */}
                    {strength.feedback.length > 0 && (
                        <ul className="text-xs text-gray-500 space-y-1">
                            {strength.feedback.map((item, idx) => (
                                <li key={idx}>• {t(`auth.password.feedback.${item.charAt(0).toLowerCase() + item.slice(1).split(' ')[0]}`, { defaultValue: item })}</li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            )}
        </div>
    );
};
