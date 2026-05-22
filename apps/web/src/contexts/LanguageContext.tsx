import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { isRTL } from '../data/languages';

interface LanguageContextType {
  changeLanguage: (lang: string) => Promise<void>;
  currentLanguage: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { user, updateUserProfile } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    // If the user logs in and they have a saved language in their profile,
    // and it's different from the current, switch to it.
    if (user && user.language && user.language !== currentLanguage) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  useEffect(() => {
    const handleLanguageChanged = (lang: string) => {
      setCurrentLanguage(lang);

      // Update DOM
      const rtl = isRTL(lang);
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;

      // Local storage
      localStorage.setItem('i18nextLng', lang);
      localStorage.setItem('femo_lang', lang); // secondary backup
    };

    // Initialize DOM with current language
    handleLanguageChanged(i18n.language || 'en');

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    if (user) {
      updateUserProfile({ language: lang });
    }
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
