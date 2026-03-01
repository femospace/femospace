import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageTrigger } from './LanguageSelector';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface FooterProps {
  onLanguageClick?: () => void;
  onContactClick?: () => void;
  isAuth?: boolean;
}

export const Footer = ({ onLanguageClick, onContactClick, isAuth = false }: FooterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.footer
      className={clsx(
        "left-0 right-0 z-50 px-6 py-6",
        isAuth ? "relative mt-auto" : "fixed bottom-0 pointer-events-none"
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
    >
      <div className={clsx("max-w-7xl mx-auto", !isAuth && "pointer-events-auto")}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          {!isAuth && (
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              {t('footer.copyright')}
            </motion.p>
          )}

          {/* Links */}
          <div className={clsx("flex items-center gap-6 flex-wrap justify-center", isAuth && "flex-1")}>
            <motion.button
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContactClick}
            >
              {t('footer.contact')}
            </motion.button>
            <motion.button
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/terms')}
            >
              {t('footer.terms')}
            </motion.button>
            <motion.button
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/privacy')}
            >
              {t('footer.privacy')}
            </motion.button>
          </div>

          {/* New Global Language Selector Trigger */}
          <div className="flex items-center">
            <LanguageTrigger onClick={onLanguageClick || (() => { })} />
          </div>
        </div>
      </div>
    </motion.footer>
  );
};


