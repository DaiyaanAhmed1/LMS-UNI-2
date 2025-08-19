import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useTypewriter } from '../utils/typewriterEffect';

const SageAISummaryPanel = ({ 
  isOpen, 
  onClose, 
  videoTitle, 
  summary, 
  className = '',
  isGenerating = false,
  proLock = false,
  onSummaryTyped
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);
  const { displayedText } = useTypewriter(summary || '', { speed: 15, onComplete: () => { if (onSummaryTyped) onSummaryTyped(); } });

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} />
      <div className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${className} ${isOpen ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`} style={{ maxWidth: 'min(400px, 100vw)' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('student.sageAI.panel.summaryTitle', 'AI Summary')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('student.sageAI.panel.poweredBy', 'Powered by Sage AI')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={t('student.sageAI.panel.closeAria', 'Close summary panel')}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.sageAI.panel.documentTitle', 'Document')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{videoTitle}</p>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">{t('student.sageAI.panel.aiGenerated', 'AI Generated Summary')}</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[200px] relative">
                {proLock ? (
                  <>
                    <div className="h-28 rounded-md border border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-600/40 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <Lock size={16} />
                        <span>{t('student.sageAI.panel.upsell.title', 'Upgrade to PRO')}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between p-3 rounded-md border border-purple-600 bg-white/90 dark:bg-purple-900/30">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-200">
                        <Lock size={16} />
                        <div>
                          <div className="text-sm font-semibold">{t('student.sageAI.panel.upsell.title', 'Upgrade to PRO')}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">{t('student.sageAI.panel.upsell.desc', 'Get unlimited AI insights and advanced analytics')}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-md text-white bg-purple-600 hover:bg-purple-700 text-xs whitespace-nowrap">{t('student.sageAI.panel.upsell.button', 'Upgrade Now')}</button>
                    </div>
                  </>
                ) : summary ? (
                  <div className={`prose dark:prose-invert max-w-none text-sm leading-6 text-gray-800 dark:text-gray-100 whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'}`}>
                    {displayedText}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{isGenerating ? t('student.sageAI.panel.generating', 'Generating summary...') : t('student.sageAI.panel.noSummary', 'No summary available')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!proLock && summary && (
              <button onClick={handleCopySummary} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? t('student.sageAI.panel.copy.copied', 'Copied!') : t('student.sageAI.panel.copy.button', 'Copy Summary')}
              </button>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>{t('student.sageAI.panel.footer.line1', 'AI-powered insights for better learning')}</p>
              <p className="mt-1">{t('student.sageAI.panel.footer.line2', 'Generated by Sage AI technology')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SageAISummaryPanel;
