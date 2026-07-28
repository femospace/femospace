import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ContactModal } from '../components/ContactModal';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { LoginModal } from '../components/auth/LoginModal';
import { AuthWizard } from '../components/auth/AuthWizard';
import { LanguageSelector } from '../components/LanguageSelector';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';
import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';

export const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0f172a] dark">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Top Bar */}
      <TopBar
        onLoginClick={() => navigate('/auth/login')}
        onRegisterClick={() => navigate('/auth/register')}
      />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-20 pb-40 sm:pt-24 sm:pb-36">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Subtle Logo Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8 flex justify-center"
          >
            <img
              src="/icons/Favicon.png"
              alt="Femo Space"
              className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('welcome.title')}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 sm:mb-12 font-light px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('welcome.tagline')}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/auth/login')}
              className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20 sm:min-w-[200px]"
              whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              {t('welcome.login')}
            </motion.button>

            <motion.button
              onClick={() => navigate('/auth/register')}
              className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all sm:min-w-[200px]"
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              {t('welcome.register')}
            </motion.button>
          </motion.div>
        </div>
      </main>


      {/* Footer with Language Selector */}
      <Footer
        onLanguageClick={() => setShowLanguageSelector(true)}
        onContactClick={() => setShowContactModal(true)}
      />

      {/* Authentication Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onForgotPassword={() => {
          setIsLoginOpen(false);
          setIsForgotPasswordOpen(true);
        }}
      />

      <AuthWizard
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchMode={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onBackToLogin={() => {
          setIsForgotPasswordOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
      )}
      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
};
