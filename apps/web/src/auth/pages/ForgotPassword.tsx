import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { detectIdentifierType, IdentifierType } from '../utils/identifier.utils';
import clsx from 'clsx';
import { API_BASE_URL } from '../../config';


export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [step, setStep] = useState<'identifier' | 'verification' | 'reset'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [identifierType, setIdentifierType] = useState<IdentifierType | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);

    if (!value.trim()) {
      setIdentifierError(null);
      setIdentifierType(null);
      return;
    }

    const detectedType = detectIdentifierType(value);
    setIdentifierType(detectedType);

    if (detectedType === IdentifierType.INVALID) {
      setIdentifierError(t('auth.login.errors.identifierInvalid'));
    } else {
      setIdentifierError(null);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!identifier.trim() || identifierType === IdentifierType.INVALID) {
      setIdentifierError(t('auth.login.errors.identifierInvalid'));
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password/request`, {
        identifier: identifier.trim().toLowerCase(),
      });

      setMessage(t('auth.register.verification.subtitle') + ' ' + identifier);
      setStep('verification');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.forgotPassword.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!verificationCode.trim()) {
      setError(t('auth.register.verification.errors.invalid'));
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password/verify`, {
        identifier: identifier.trim().toLowerCase(),
        code: verificationCode.trim(),
      });

      setMessage(t('auth.register.verification.success'));
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.register.verification.errors.invalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setError(t('auth.register.credentials.errors.passwordRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.register.credentials.errors.match'));
      return;
    }

    if (newPassword.length < 8) {
      setError(t('auth.register.credentials.errors.passwordShort'));
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password/reset`, {
        identifier: identifier.trim().toLowerCase(),
        code: verificationCode.trim(),
        newPassword,
      });

      setMessage(t('auth.forgotPassword.successSubtitle') + ' ' + t('auth.login.title'));
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.forgotPassword.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20"
        whileHover={{ boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)' }}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={inputVariants}>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {t('auth.forgotPassword.title')}
          </h1>
          <p className="text-gray-300">{t('auth.forgotPassword.subtitle')}</p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div className="flex gap-2 mb-8" variants={inputVariants}>
          <div className={clsx('flex-1 h-2 rounded-full', (step === 'identifier' || step === 'verification' || step === 'reset') ? 'bg-blue-500' : 'bg-white/20')}></div>
          <div className={clsx('flex-1 h-2 rounded-full', (step === 'verification' || step === 'reset') ? 'bg-blue-500' : 'bg-white/20')}></div>
          <div className={clsx('flex-1 h-2 rounded-full', step === 'reset' ? 'bg-blue-500' : 'bg-white/20')}></div>
        </motion.div>

        {/* Messages */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4 mb-6">
          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex gap-2"
              variants={inputVariants}
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {message && (
            <motion.div
              className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 flex gap-2"
              variants={inputVariants}
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300">{message}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Step 1: Identifier */}
        {step === 'identifier' && (
          <motion.form onSubmit={handleRequestReset} className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.login.identifierLabel')}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={handleIdentifierChange}
                placeholder={t('auth.login.identifierPlaceholder')}
                className={clsx(
                  'w-full px-4 py-3 bg-white/10 border rounded-lg transition-colors',
                  'placeholder-gray-400 text-white focus:outline-none focus:ring-2',
                  identifierError
                    ? 'border-red-500/50 focus:ring-red-500/50'
                    : identifierType === IdentifierType.INVALID
                      ? 'border-yellow-500/50 focus:ring-yellow-500/50'
                      : identifierType
                        ? 'border-emerald-500/50 focus:ring-emerald-500/50'
                        : 'border-white/20 focus:ring-blue-500/50',
                )}
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || !identifier || identifierType === IdentifierType.INVALID}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={inputVariants}
              className={clsx(
                'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                loading || !identifier || identifierType === IdentifierType.INVALID
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.sending', { defaultValue: 'Sending code...' })}
                </>
              ) : (
                <>
                  {t('auth.forgotPassword.submit')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <motion.div className="text-center" variants={inputVariants}>
              <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </motion.div>
          </motion.form>
        )}

        {/* Step 2: Verification Code */}
        {step === 'verification' && (
          <motion.form onSubmit={handleVerifyCode} className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.register.verification.inputLabel')}
              </label>
              <p className="text-gray-400 text-sm mb-3">{t('auth.register.verification.subtitle')}</p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-center text-2xl tracking-widest transition-colors"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={inputVariants}
              className={clsx(
                'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                loading || verificationCode.length !== 6
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.verifying', { defaultValue: 'Verifying...' })}
                </>
              ) : (
                <>
                  {t('auth.register.verification.verifyButton', { defaultValue: 'Verify Code' })}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setStep('identifier')}
              variants={inputVariants}
              className="w-full py-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              ← {t('auth.register.credentials.back')}
            </motion.button>
          </motion.form>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <motion.form onSubmit={handleResetPassword} className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.register.credentials.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.register.credentials.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.register.credentials.confirmPassword')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={inputVariants}
              className={clsx(
                'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                loading || !newPassword || !confirmPassword
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.resetting', { defaultValue: 'Resetting...' })}
                </>
              ) : (
                <>
                  {t('auth.forgotPassword.submit')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setStep('verification')}
              variants={inputVariants}
              className="w-full py-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              ← {t('auth.register.credentials.back')}
            </motion.button>
          </motion.form>
        )}
      </motion.div>

      {/* Security Info */}
      <motion.div className="mt-6 text-center text-gray-400 text-xs space-y-2" variants={inputVariants}>
        <p>🔒 {t('auth.login.securityInfo.encrypted')}</p>
        <p>⚡ {t('auth.login.securityInfo.rateLimited')}</p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
