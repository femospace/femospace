import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { detectIdentifierType, IdentifierType } from '../utils/identifier.utils';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';


export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithIdentifier } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [identifierType, setIdentifierType] = useState<IdentifierType | null>(null);

  // Real-time identifier validation
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, identifier: value }));

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIdentifierError(null);

    // Client-side validation
    if (!formData.identifier.trim()) {
      setIdentifierError(t('auth.login.errors.identifierRequired'));
      return;
    }

    if (identifierType === IdentifierType.INVALID) {
      setIdentifierError(t('auth.login.errors.identifierInvalid'));
      return;
    }

    if (!formData.password) {
      setError(t('auth.login.errors.passwordRequired'));
      return;
    }

    setLoading(true);

    try {
      await loginWithIdentifier(formData.identifier.trim().toLowerCase(), formData.password);

      // We don't need to navigate manually. 
      // The PublicRoute wrapper in App.tsx will detect the state change and redirect.
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed';

      if (errorMessage.includes('Email not verified')) {
        setError(t('auth.login.errors.unverified'));
      } else if (errorMessage.includes('temporarily locked')) {
        setError(t('auth.login.errors.locked'));
      } else if (errorMessage.includes('blocked')) {
        setError(t('auth.login.errors.blocked'));
      } else {
        setError(t('auth.login.errors.invalid'));
      }

      console.error('Login error:', err);
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
            {t('auth.login.title')}
          </h1>
          <p className="text-gray-300">{t('auth.login.subtitle')}</p>
        </motion.div>

        {/* Errors */}
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

          {identifierError && (
            <motion.div
              className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 flex gap-2"
              variants={inputVariants}
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-300">{identifierError}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
          {/* Identifier Input */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('auth.login.identifierLabel')}
            </label>
            <input
              type="text"
              value={formData.identifier}
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

          {/* Password Input */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('auth.login.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder={t('auth.login.passwordPlaceholder')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading || !formData.identifier || !formData.password || identifierType === IdentifierType.INVALID}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={inputVariants}
            className={clsx(
              'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
              loading || !formData.identifier || !formData.password || identifierType === IdentifierType.INVALID
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('auth.login.submitting')}
              </>
            ) : (
              t('auth.login.submit')
            )}
          </motion.button>

          {/* Links */}
          <motion.div className="flex items-center justify-between text-sm" variants={inputVariants}>
            <Link to="/auth/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('auth.login.forgotPassword')}
            </Link>
            <Link to="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('auth.login.signUp')}
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>

      {/* Security Info */}
      <motion.div className="mt-6 text-center text-gray-400 text-xs space-y-2" variants={inputVariants}>
        <p>🔒 {t('auth.login.securityInfo.encrypted')}</p>
        <p>⚡ {t('auth.login.securityInfo.rateLimited')}</p>
      </motion.div>
    </div>
  );
};

export default Login;
