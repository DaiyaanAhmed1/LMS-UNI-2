import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userData from '../../data/user';
const logo = 'https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnlogopng.png';
import banner from '../../assets/banner.png';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe } from 'lucide-react';

const LoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage, currentLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    logout();
    const user = userData.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      login(user.role);
      navigate(`/${user.role}/dashboard`);
    } else {
      setError(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Banner Panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-800 to-blue-600 relative">
        <img
          src={banner}
          alt={t('auth.bannerAlt')}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col justify-center h-full px-12">
          <img src={logo} alt={t('auth.logoAlt')} className="w-32 mb-6" />
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            {t('auth.heroTitle')}
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            {t('auth.heroSubtitle')}
          </p>
        </div>
        <div className="text-sm text-blue-100 text-center p-4 relative z-10">
          {t('common.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900 px-6 sm:px-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-200 dark:border-gray-700">
          {/* Top utility row with Theme and Language Toggle */}
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600 font-bold text-sm min-w-[2.5rem] h-[2.5rem] flex items-center justify-center"
              aria-label={t('common.language')}
            >
              {currentLanguage === 'en' ? 'ع' : 'EN'}
            </button>
          </div>

          <div className={`text-center ${isRTL ? 'text-right' : 'text-center'}`}>
            <img src={logo} alt="MarLn" className="mx-auto w-24 mb-4" />
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{t('auth.signInTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.email')}</label>
              <input
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.password')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                dir="ltr"
                required
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md transition-colors duration-200"
            >
              {t('common.login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
