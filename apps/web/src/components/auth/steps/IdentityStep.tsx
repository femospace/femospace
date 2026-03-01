import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Calendar } from 'lucide-react';
import { GENDERS } from '../../../lib/constants';
import { useTranslation } from 'react-i18next';

interface IdentityStepProps {
    data: {
        firstName: string;
        lastName: string;
        birthday: string;
        gender: string;
    };
    onChange: (field: string, value: string) => void;
    onNext: () => void;
}

export const IdentityStep = ({ data, onChange, onNext }: IdentityStepProps) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateAndProceed = () => {
        const newErrors: Record<string, string> = {};

        if (!data.firstName.trim()) newErrors.firstName = t('auth.register.identity.errors.firstName');
        if (!data.lastName.trim()) newErrors.lastName = t('auth.register.identity.errors.lastName');
        if (!data.birthday) newErrors.birthday = t('auth.register.identity.errors.birthday');
        if (!data.gender) newErrors.gender = t('auth.register.identity.errors.gender');

        // Age validation (must be 13+)
        if (data.birthday) {
            const birthDate = new Date(data.birthday);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                newErrors.birthday = t('auth.register.identity.errors.age');
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNext();
        }
    };

    const localizedGenders = GENDERS.map(g => ({
        ...g,
        label: t(`auth.gender.${g.value.charAt(0).toLowerCase() + g.value.slice(1).replace(/[-\s]/g, '')}`, { defaultValue: g.label })
    }));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {t('auth.register.identity.title')}
                </h2>
                <p className="text-gray-400">
                    {t('auth.register.identity.subtitle')}
                </p>
            </div>

            {/* Progress */}
            <div className="flex flex-col items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <div className="h-2 w-16 rounded-full bg-white/10" />
                    <div className="h-2 w-16 rounded-full bg-white/10" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                    {t('auth.register.identity.stepInfo', { step: 1 })}
                </span>
            </div>

            {/* Form */}
            <div className="space-y-4">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('auth.register.identity.firstName')}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={data.firstName}
                            onChange={(e) => onChange('firstName', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-white/10'
                                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                            placeholder={t('auth.register.identity.placeholder.firstName')}
                        />
                    </div>
                    {errors.firstName && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                        >
                            {errors.firstName}
                        </motion.p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('auth.register.identity.lastName')}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={data.lastName}
                            onChange={(e) => onChange('lastName', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-white/10'
                                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                            placeholder={t('auth.register.identity.placeholder.lastName')}
                        />
                    </div>
                    {errors.lastName && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                        >
                            {errors.lastName}
                        </motion.p>
                    )}
                </div>

                {/* Birthday */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('auth.register.identity.birthday')}
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="date"
                            value={data.birthday}
                            onChange={(e) => onChange('birthday', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.birthday ? 'border-red-500' : 'border-white/10'
                                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                        />
                    </div>
                    {errors.birthday && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                        >
                            {errors.birthday}
                        </motion.p>
                    )}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        {t('auth.register.identity.gender')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {localizedGenders.map((gender) => (
                            <button
                                key={gender.value}
                                type="button"
                                onClick={() => onChange('gender', gender.value)}
                                className={`p-4 rounded-xl border transition-all ${data.gender === gender.value
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{gender.icon}</div>
                                <div className="text-sm font-medium">{gender.label}</div>
                            </button>
                        ))}
                    </div>
                    {errors.gender && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                        >
                            {errors.gender}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Next Button */}
            <motion.button
                type="button"
                onClick={validateAndProceed}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all"
            >
                {t('auth.register.identity.next')}
            </motion.button>
        </motion.div>
    );
};
