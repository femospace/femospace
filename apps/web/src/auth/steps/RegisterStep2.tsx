import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { useRegistration, Step2Data } from '../context/RegistrationContext';
import { registrationAPI } from '../api/registrationAPI';
import { PasswordValidator } from '../utils/passwordValidator';
import { COUNTRIES } from '../constants/countries';
import { RegisterProgress } from '../components/RegisterProgress';

const RegisterStep2: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sessionToken, setCurrentStep, setStep2Data } = useRegistration();

  const [formData, setFormData] = useState<Step2Data>({
    email: '',
    password: '',
    confirmPassword: '',
    country: 'US',
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  if (!sessionToken) {
    navigate('/auth/register/step1');
    return null;
  }

  useEffect(() => {
    if (formData.password) {
      const strength = PasswordValidator.calculateStrength(formData.password);
      setPasswordStrength(strength);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEmail = async (email: string) => {
    if (!email) return;
    setEmailValidating(true);
    try {
      const result = await registrationAPI.validateEmail(email);
      setEmailAvailable(result.available);
      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          email: t('auth.register.credentials.errors.emailTaken', { defaultValue: 'Email is already taken' }),
        }));
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        email: error.response?.data?.message || t('auth.register.credentials.errors.emailInvalid'),
      }));
    } finally {
      setEmailValidating(false);
    }
  };

  const handleEmailBlur = () => {
    validateEmail(formData.email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = t('auth.register.credentials.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.register.credentials.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.register.credentials.errors.passwordRequired');
    } else if (!PasswordValidator.isValid(formData.password)) {
      newErrors.password = t('auth.register.credentials.errors.passwordComplex');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.credentials.errors.confirmRequired');
    } else if (!PasswordValidator.passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = t('auth.register.credentials.errors.match');
    }

    if (!formData.country) {
      newErrors.country = t('auth.register.credentials.errors.country');
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t('auth.register.credentials.errors.terms');
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = t('auth.register.credentials.errors.privacy');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await registrationAPI.step2(sessionToken, formData);
      setStep2Data(formData);
      setCurrentStep(3);
      navigate('/auth/register/step3');
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || t('auth.register.credentials.errors.failed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (score: number) => {
    const colors = ['from-red-500 to-red-600', 'from-orange-500 to-orange-600', 'from-yellow-500 to-yellow-600', 'from-lime-500 to-lime-600', 'from-green-500 to-green-600'];
    return colors[Math.min(score, 4)];
  };

  const getTranslatedStrength = (feedback: string) => {
    const keyMap: Record<string, string> = {
      'Too weak': 'tooWeak',
      'Weak': 'weak',
      'Fair': 'fair',
      'Good': 'good',
      'Strong': 'strong',
      'Very strong': 'veryStrong',
    };
    const key = keyMap[feedback] || 'fair';
    return t(`auth.password.scores.${key}`);
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
        {/* Main Header */}
        <motion.div className="text-center mb-6" variants={inputVariants}>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {t('auth.register.credentials.title')}
          </h1>
          <p className="text-gray-400">{t('auth.register.credentials.subtitle')}</p>
        </motion.div>

        {/* Progress indicator */}
        <RegisterProgress currentStep={2} />

        {/* Form */}
        <motion.form
          onSubmit={(e) => { e.preventDefault(); handleNext(); }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Email */}
          <motion.div className="mb-5" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.credentials.email')}</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                placeholder={t('auth.register.credentials.placeholder.email', { defaultValue: 'your@email.com' })}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
              />
              {emailValidating && (
                <div className="absolute right-3 top-3.5 text-gray-300 animate-spin">⚙️</div>
              )}
              {emailAvailable === true && (
                <div className="absolute right-3 top-3.5 text-green-400">✓</div>
              )}
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div className="mb-5" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.credentials.password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.login.passwordPlaceholder')}
                className={`w-full px-4 py-3 pr-10 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.password ? 'border-red-500' : 'border-white/20'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {formData.password && passwordStrength && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-300">{t('auth.password.strength')}:</span>
                  <span className="text-xs font-semibold text-blue-300">
                    {getTranslatedStrength(passwordStrength.feedback)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getStrengthColor(passwordStrength.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((passwordStrength.score + 1) / 6) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div className="mb-5" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.credentials.confirmPassword')}</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('auth.register.credentials.confirmPassword')}
                className={`w-full px-4 py-3 pr-10 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </motion.div>

          {/* Country */}
          <motion.div className="mb-6" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.credentials.country')}</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code} className="bg-gray-900">
                  {country.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Checkboxes */}
          <motion.div className="mb-6 space-y-3" variants={inputVariants}>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-500 rounded"
              />
              <span className="ml-3 text-sm text-gray-300">
                <Trans i18nKey="auth.register.credentials.terms">
                  I accept the <button type="button" onClick={() => window.open('#terms', '_blank')} className="text-blue-400 hover:text-blue-300 font-semibold transition">Terms & Conditions</button>
                </Trans>
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-red-400 text-xs">{errors.termsAccepted}</p>
            )}

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-500 rounded"
              />
              <span className="ml-3 text-sm text-gray-300">
                <Trans i18nKey="auth.register.credentials.privacy">
                  I accept the <button type="button" onClick={() => window.open('#privacy', '_blank')} className="text-blue-400 hover:text-blue-300 font-semibold transition">Privacy Policy</button>
                </Trans>
              </span>
            </label>
            {errors.privacyAccepted && (
              <p className="text-red-400 text-xs">{errors.privacyAccepted}</p>
            )}
          </motion.div>

          {/* Error message */}
          {errors.submit && (
            <motion.div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {errors.submit}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => navigate('/auth/register/step1')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-1/3 bg-gray-600/50 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
            >
              ← {t('auth.register.credentials.back')}
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-2/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
            >
              {isLoading ? t('common.loading', { defaultValue: 'Loading...' }) : t('auth.register.credentials.submit') + ' →'}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default RegisterStep2;
