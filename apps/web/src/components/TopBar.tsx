import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

interface TopBarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  showButtons?: boolean;
}

export const TopBar = ({ onLoginClick, onRegisterClick, showButtons = true }: TopBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white dark:border-blue-500/30"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src="/icons/logo_512.png"
              alt="Femo Space Logo"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex items-baseline gap-1">
            <span className="text-blue-600 dark:text-blue-500 font-bold text-2xl tracking-tight">Femo</span>
            <span className="text-gray-900 dark:text-white font-bold text-2xl tracking-tight">Space</span>
          </div>
        </motion.div>

        {/* Right: Auth Buttons */}
        {showButtons && (
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onLoginClick}
              className="text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={18} />
              {t('welcome.login')}
            </motion.button>

            <motion.button
              onClick={onRegisterClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus size={18} />
              {t('welcome.register')}
            </motion.button>
          </div>
        )}
      </div>
    </motion.header>
  );
};


