import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRegistration, Step3Data } from '../context/RegistrationContext';
import { COUNTRIES } from '../../data/countries';
import { registrationAPI } from '../api/registrationAPI';
import { RegisterProgress } from '../components/RegisterProgress';

const RegisterStep3: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sessionToken, step1Data, step2Data, setFemoId, setFemoMail, reset } = useRegistration();

  const [formData, setFormData] = useState<Step3Data>({
    femoMailName: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
  });

  const [femoId, setLocalFemoId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [femoMailAvailable, setFemoMailAvailable] = useState<boolean | null>(null);
  const [femoMailValidating, setFemoMailValidating] = useState(false);

  if (!sessionToken || !step1Data || !step2Data) {
    navigate('/auth/register/step1');
    return null;
  }

  useEffect(() => {
    // Generate initial Femo ID (Mock: Starts from 1050600)
    const generatedId = 1050600 + Math.floor(Math.random() * 10000);
    setLocalFemoId(generatedId);

    // Load suggestions based on email username
    const emailUsername = step2Data.email.split('@')[0];
    loadSuggestions(emailUsername);
  }, []);

  const loadSuggestions = async (baseUsername: string) => {
    setIsSuggestionsLoading(true);
    try {
      const result = await registrationAPI.getFemoMailSuggestions(baseUsername);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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

    if (name === 'femoMailName') {
      setFemoMailAvailable(null);
    }
  };

  const validateFemoMail = async (femoMailName: string) => {
    if (!femoMailName) return;
    setFemoMailValidating(true);
    try {
      // Try actual API
      const result = await registrationAPI.validateFemoMail(femoMailName);
      setFemoMailAvailable(result.available);
      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          femoMailName: result.message,
        }));
      }
    } catch (error: any) {
      // Fallback: Assume available if backend is down
      console.warn("Backend validation failed, assuming available for mock flow.");
      setFemoMailAvailable(true);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.femoMailName; // Clear error
        return newErrors;
      });
    } finally {
      setFemoMailValidating(false);
    }
  };

  const handleFemoMailBlur = () => {
    validateFemoMail(formData.femoMailName);
  };

  const selectSuggestion = async (suggestion: string) => {
    const username = suggestion.replace('@femo.com', '');
    setFormData((prev) => ({
      ...prev,
      femoMailName: username,
    }));
    setFemoMailAvailable(true);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.femoMailName;
      return newErrors;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.femoMailName.trim()) {
      newErrors.femoMailName = t('auth.register.credentials.errors.emailRequired');
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.femoMailName)) {
      newErrors.femoMailName = t('auth.register.credentials.errors.emailInvalid');
    } else if (!femoMailAvailable) {
      newErrors.femoMailName = t('auth.register.credentials.errors.emailTaken', { defaultValue: 'Mail is not available' });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await registrationAPI.step3(sessionToken, formData);
      setFemoId(result.femoId);
      setFemoMail(result.femoMail);

      // Show success and redirect to verification
      setTimeout(() => {
        reset();
        navigate('/auth/verify-email', {
          state: {
            email: step2Data.email,
          },
        });
      }, 2000);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || t('auth.register.credentials.errors.failed'),
      });
    } finally {
      setIsLoading(false);
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
        {/* Main Header */}
        {/* Main Header */}
        <motion.div className="text-center mb-6" variants={inputVariants}>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {t('auth.register.steps.finalize', { defaultValue: 'Finalize Your Account' })}
          </h1>
          <p className="text-gray-400">{t('auth.register.credentials.subtitle')}</p>
        </motion.div>

        {/* Progress indicator */}
        <RegisterProgress currentStep={3} />

        {/* Form */}
        <motion.form
          onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Femo ID Display */}
          <motion.div className="mb-6" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.login.identifierLabelId', { defaultValue: 'Femo ID' })}</label>
            <div className="relative">
              <input
                type="text"
                value={femoId || 'Generating...'}
                disabled
                className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-blue-300 font-semibold focus:outline-none"
              />
              <motion.button
                type="button"
                onClick={() => femoId && copyToClipboard(femoId.toString())}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-3.5 text-blue-400 hover:text-blue-300"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </motion.button>
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('auth.register.identity.idInfo', { defaultValue: 'Auto-generated, read-only, permanent' })}</p>
          </motion.div>

          {/* Femo Mail */}
          <motion.div className="mb-6" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.login.identifierLabelMail', { defaultValue: 'Femo Mail' })}</label>
            <div className="relative">
              <input
                type="text"
                name="femoMailName"
                value={formData.femoMailName}
                onChange={handleChange}
                onBlur={handleFemoMailBlur}
                placeholder={t('auth.register.credentials.placeholder.username', { defaultValue: 'username' })}
                className={`w-full px-4 py-3 pr-20 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.femoMailName ? 'border-red-500' : 'border-white/20'
                  }`}
              />
              <span className="absolute right-4 top-3.5 text-gray-300 text-sm font-medium">
                @femo.com
              </span>
            </div>
            {femoMailValidating && (
              <p className="text-sm text-gray-400 mt-1">{t('common.checking', { defaultValue: 'Checking availability...' })}</p>
            )}
            {femoMailAvailable === true && !femoMailValidating && (
              <p className="text-sm text-green-400 mt-1">✓ {t('common.available', { defaultValue: 'Available' })}</p>
            )}
            {errors.femoMailName && (
              <p className="text-red-400 text-xs mt-1">{errors.femoMailName}</p>
            )}
          </motion.div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <motion.div className="mb-6" variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                {t('common.suggestions', { defaultValue: 'Suggestions' })} ({isSuggestionsLoading ? '...' : suggestions.length})
              </label>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2 text-left border border-white/20 rounded-lg bg-white/5 hover:bg-blue-500/20 transition text-sm text-gray-300 hover:text-blue-300 font-medium"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phone Number (Optional) */}
          <motion.div className="mb-6" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.credentials.phoneNumber', { defaultValue: 'Phone Number (Optional)' })}</label>
            <div className="flex gap-2">
              <select
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="w-32 px-2 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm overflow-hidden"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dialCode} className="bg-gray-900 border-none">
                    {c.flag} {c.code} ({c.dialCode})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={t('auth.register.credentials.placeholder.phone', { defaultValue: '1234567890' })}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              onClick={() => navigate('/auth/register/step2')}
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
              {isLoading ? t('common.loading', { defaultValue: 'Registering...' }) : '✓ ' + t('auth.register.credentials.submit')}
            </motion.button>
          </div>
        </motion.form>

        {/* Summary */}
        <motion.div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10" variants={inputVariants}>
          <p className="text-xs text-gray-300 mb-2 font-semibold">{t('common.accountSummary', { defaultValue: 'Account Summary:' })}</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>👤 {step1Data.firstName} {step1Data.lastName}</p>
            <p>📧 {step2Data.email}</p>
            <p>🌍 {step2Data.country}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterStep3;
