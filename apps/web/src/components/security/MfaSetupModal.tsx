import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../lib/api';

interface MfaSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const MfaSetupModal: React.FC<MfaSetupModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [mfaData, setMfaData] = useState<{ secret: string; qrCode: string } | null>(null);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const startSetup = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.post('/security/mfa/setup');
            setMfaData(data);
            setStep(2);
        } catch (err) {
            setError('Failed to initialize MFA setup');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyAndEnable = async () => {
        if (otp.length !== 6) return;
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.post('/security/mfa/verify', {
                token: otp,
                secret: mfaData?.secret
            });

            if (data.isValid) {
                onSuccess();
                onClose();
            } else {
                setError('Invalid verification code. Please try again.');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (mfaData?.secret) {
            navigator.clipboard.writeText(mfaData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="text-blue-500" />
                                        <h3 className="text-xl font-bold text-white">Setup 2FA</h3>
                                    </div>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>

                                {step === 1 && (
                                    <div className="text-center py-4">
                                        <p className="text-gray-300 mb-8">
                                            Two-factor authentication adds an extra layer of security to your account.
                                            You'll need an authenticator app like Google Authenticator or Authy.
                                        </p>
                                        <button
                                            onClick={startSetup}
                                            disabled={isLoading}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? 'Initializing...' : 'Get Started'}
                                        </button>
                                    </div>
                                )}

                                {step === 2 && mfaData && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-4 rounded-xl flex justify-center mx-auto w-fit">
                                            <QRCodeSVG value={mfaData.qrCode} size={180} />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm text-gray-400 mb-4">
                                                Scan this QR code with your authenticator app, or enter the secret key manually.
                                            </p>

                                            <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                                                <code className="flex-1 text-blue-400 font-mono text-sm truncate">
                                                    {mfaData.secret}
                                                </code>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="text-gray-400 hover:text-white p-1"
                                                >
                                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Verification Code</label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                placeholder="000000"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-center text-2xl tracking-[0.5em] font-bold text-white focus:outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded-lg border border-red-400/20">
                                                {error}
                                            </p>
                                        )}

                                        <button
                                            onClick={verifyAndEnable}
                                            disabled={isLoading || otp.length !== 6}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? 'Verifying...' : 'Enable 2FA'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
