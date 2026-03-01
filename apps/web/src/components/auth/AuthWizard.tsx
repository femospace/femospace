import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { IdentityStep } from './steps/IdentityStep';
import { CredentialsStep } from './steps/CredentialsStep';
import { VerificationStep } from './steps/VerificationStep';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface AuthWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchMode: () => void;
}

export const AuthWizard = ({ isOpen, onClose, onSwitchMode }: AuthWizardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { register } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '',
        lastName: '',
        birthday: '',
        gender: '',
        // Step 2
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        termsAccepted: false,
        privacyAccepted: false,
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleIdentityNext = () => {
        setCurrentStep(2);
    };

    const handleCredentialsBack = () => {
        setCurrentStep(1);
    };

    const handleCredentialsNext = async () => {
        setIsLoading(true);
        setError('');

        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthday: formData.birthday,
                gender: formData.gender,
                email: formData.email,
                password: formData.password,
                country: formData.country,
                termsAccepted: formData.termsAccepted,
                privacyAccepted: formData.privacyAccepted,
            });

            // Move to verification step (Simulation for now, or actual if implemented)
            setCurrentStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.register.credentials.errors.failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        // TODO: Implement actual OTP verification on backend if required
        // Since register already logged us in (returned tokens), we can just proceed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTimeout(() => {
            onClose();
            navigate('/home');
        }, 500);
    };

    const handleResendOTP = async () => {
        // TODO: Implement resend OTP endpoint
        await new Promise((resolve) => setTimeout(resolve, 500));
    };

    const handleClose = () => {
        setCurrentStep(1);
        setFormData({
            firstName: '',
            lastName: '',
            birthday: '',
            gender: '',
            email: '',
            password: '',
            confirmPassword: '',
            country: '',
            termsAccepted: false,
            privacyAccepted: false,
        });
        setError('');
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-white/10 my-8"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            {currentStep !== 3 && (
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                                    aria-label={t('selector.close')}
                                >
                                    <X size={24} />
                                </button>
                            )}

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <IdentityStep
                                        data={{
                                            firstName: formData.firstName,
                                            lastName: formData.lastName,
                                            birthday: formData.birthday,
                                            gender: formData.gender,
                                        }}
                                        onChange={handleFieldChange}
                                        onNext={handleIdentityNext}
                                    />
                                )}

                                {currentStep === 2 && (
                                    <CredentialsStep
                                        data={{
                                            email: formData.email,
                                            password: formData.password,
                                            confirmPassword: formData.confirmPassword,
                                            country: formData.country,
                                            termsAccepted: formData.termsAccepted,
                                            privacyAccepted: formData.privacyAccepted,
                                        }}
                                        onChange={handleFieldChange}
                                        onNext={handleCredentialsNext}
                                        onBack={handleCredentialsBack}
                                    />
                                )}

                                {currentStep === 3 && (
                                    <VerificationStep
                                        email={formData.email}
                                        onVerify={handleVerify}
                                        onResend={handleResendOTP}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Global Error */}
                            {error && currentStep !== 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Switch to Login */}
                            {currentStep === 1 && (
                                <div className="mt-6 text-center">
                                    <p className="text-gray-400 text-sm">
                                        {t('auth.login.alreadyHaveAccount')}{' '}
                                        <button
                                            onClick={onSwitchMode}
                                            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                        >
                                            {t('auth.login.submit')}
                                        </button>
                                    </p>
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
