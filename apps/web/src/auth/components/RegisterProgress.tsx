import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface RegisterProgressProps {
    currentStep: number;
}

export const RegisterProgress: React.FC<RegisterProgressProps> = ({ currentStep }) => {
    const { t } = useTranslation();

    const steps = [
        { id: 1, label: t('auth.register.steps.identity', { defaultValue: 'Identity' }) },
        { id: 2, label: t('auth.register.steps.account', { defaultValue: 'Account' }) },
        { id: 3, label: t('auth.register.steps.finalize', { defaultValue: 'Finalize' }) },
    ];

    return (
        <div className="mb-10">
            {/* Step Count Text */}
            <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-300">
                    {t('auth.register.identity.stepInfo', { step: currentStep })}
                </h2>
                <div className="text-gray-400 text-sm mt-1">
                    {steps[currentStep - 1].label}
                </div>
            </div>

            {/* Visual Bar */}
            <div className="flex items-center gap-2">
                {steps.map((step) => (
                    <div key={step.id} className="flex-1">
                        <div className="relative h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                            {currentStep >= step.id && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Labels below bars */}
            <div className="flex justify-between mt-2 px-1">
                {steps.map((step) => (
                    <span
                        key={step.id}
                        className={`text-[10px] uppercase tracking-wider font-bold ${currentStep >= step.id ? 'text-blue-400' : 'text-gray-500'
                            }`}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    );
};
