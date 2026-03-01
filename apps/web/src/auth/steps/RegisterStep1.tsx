import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegistration, Step1Data } from '../context/RegistrationContext';
import { registrationAPI } from '../api/registrationAPI';
import { RegisterProgress } from '../components/RegisterProgress';

const RegisterStep1: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setCurrentStep, setSessionToken, setStep1Data } = useRegistration();

  const [formData, setFormData] = useState<Step1Data>({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: 'Male',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('auth.register.identity.errors.firstName');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('auth.register.identity.errors.lastName');
    }
    if (!formData.birthday) {
      newErrors.birthday = t('auth.register.identity.errors.birthday');
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 13) {
        newErrors.birthday = t('auth.register.identity.errors.age');
      }
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
      const result = await registrationAPI.step1(formData);
      setStep1Data(formData);
      setSessionToken(result.sessionToken);
      setCurrentStep(2);
      navigate('/auth/register/step2');
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || t('auth.register.identity.errors.failed'),
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
        staggerChildren: 0.1,
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
            {t('auth.register.identity.title')}
          </h1>
          <p className="text-gray-400">{t('auth.register.identity.subtitle')}</p>
        </motion.div>

        {/* Progress indicator */}
        <RegisterProgress currentStep={1} />

        {/* Form */}
        <motion.form
          onSubmit={(e) => { e.preventDefault(); handleNext(); }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* First Name */}
          <motion.div className="mb-5" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.identity.firstName')}</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('auth.register.identity.placeholder.firstName')}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.firstName ? 'border-red-500' : 'border-white/20'
                }`}
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </motion.div>

          {/* Last Name */}
          <motion.div className="mb-5" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.identity.lastName')}</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('auth.register.identity.placeholder.lastName')}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.lastName ? 'border-red-500' : 'border-white/20'
                }`}
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </motion.div>

          {/* Birthday */}
          <motion.div className="mb-5" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.identity.birthday')}</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.birthday ? 'border-red-500' : 'border-white/20'
                }`}
            />
            {errors.birthday && (
              <p className="text-red-400 text-xs mt-1">{errors.birthday}</p>
            )}
          </motion.div>

          {/* Gender */}
          <motion.div className="mb-6" variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-2">{t('auth.register.identity.gender')}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="Male" className="bg-gray-900">{t('auth.gender.male')}</option>
              <option value="Female" className="bg-gray-900">{t('auth.gender.female')}</option>
              <option value="Non-binary" className="bg-gray-900">{t('auth.gender.nonBinary')}</option>
              <option value="Other" className="bg-gray-900">{t('auth.gender.other')}</option>
              <option value="Prefer not to say" className="bg-gray-900">{t('auth.gender.preferNotToSay')}</option>
            </select>
          </motion.div>

          {/* Error message */}
          {errors.submit && (
            <motion.div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {errors.submit}
            </motion.div>
          )}

          {/* Next Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 mt-2"
          >
            {isLoading ? t('common.loading', { defaultValue: 'Loading...' }) : t('auth.register.identity.next') + ' →'}
          </motion.button>
        </motion.form>

        {/* Login Link */}
        <motion.div className="text-center mt-6 text-sm text-gray-300" variants={inputVariants}>
          {t('auth.login.alreadyHaveAccount')}{' '}
          <Link to="/auth/login" className="text-blue-400 font-semibold hover:text-blue-300 transition">
            {t('welcome.login')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterStep1;
