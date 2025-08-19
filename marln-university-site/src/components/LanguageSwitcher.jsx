import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0a1f4d] dark:hover:bg-gray-800 transition-colors ${className}`}
      title={t('common.language')}
      aria-label={t('common.language')}
    >
      <Globe size={20} />
      <span className="font-medium">{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};

export default LanguageSwitcher; 