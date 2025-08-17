import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    localStorage.setItem('language', currentLanguage);
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${currentLanguage}`);
  }, [currentLanguage, i18n]);

  const changeLanguage = (language) => setCurrentLanguage(language);
  const toggleLanguage = () => setCurrentLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));

  const value = {
    currentLanguage,
    changeLanguage,
    toggleLanguage,
    isRTL: currentLanguage === 'ar',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}; 