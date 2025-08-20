import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Languages, FileText, Target, Clock, Download, Play, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useTypewriter } from '../utils/typewriterEffect';
import videoAnalysisService from '../utils/videoAnalysisService';

const VideoSummaryPanel = ({ 
  isOpen, 
  onClose, 
  videoFile = null,
  videoTitle = '',
  videoUrl = '',
  className = '',
  preAnalysis = null, // Pre-analyzed data
  onAnalysisComplete
}) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('summary');
  const [analysis, setAnalysis] = useState(preAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [showTranslated, setShowTranslated] = useState(false);
  const [contentRef, setContentRef] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Typewriter effects for different content types
  const { displayedText: displayedSummary } = useTypewriter(
    showTranslated ? translatedContent : (analysis?.summary || ''), 
    { speed: 15 }
  );
  const { displayedText: displayedKeyPoints } = useTypewriter(
    showTranslated ? translatedContent : (analysis?.keyPoints || ''), 
    { speed: 15 }
  );
  const { displayedText: displayedTranscript } = useTypewriter(
    showTranslated ? translatedContent : (analysis?.transcript || ''), 
    { speed: 20 }
  );

  // Handle video analysis
  const handleAnalyzeVideo = async () => {
    if (!videoFile && !videoUrl) {
      setError('No video file or URL provided');
      return;
    }

    // If we already have pre-analyzed data, use it
    if (preAnalysis && !analysis) {
      console.log('📊 Using pre-analyzed video data');
      setAnalysis(preAnalysis);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Perform video analysis
      const result = await videoAnalysisService.analyzeVideo(
        videoFile, 
        videoTitle || 'Untitled Video',
        currentLanguage
      );

      clearInterval(progressInterval);
      setProgress(100);
      setAnalysis(result);

      // Call completion callback
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

      // Reset translation state
      setShowTranslated(false);
      setTranslatedContent('');

    } catch (err) {
      console.error('Video analysis failed:', err);
      setError(err.message || 'Failed to analyze video');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  // Handle content translation
  const handleTranslateContent = async () => {
    if (!analysis) return;

    setIsTranslating(true);
    try {
      const content = activeTab === 'summary' ? analysis.summary :
                     activeTab === 'keypoints' ? analysis.keyPoints :
                     analysis.transcript;

      const targetLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
      
      const translated = await videoAnalysisService.generateSummary(
        content,
        videoTitle,
        targetLanguage
      );

      setTranslatedContent(translated);
      setShowTranslated(true);
    } catch (err) {
      console.error('Translation failed:', err);
      setError('Failed to translate content');
    } finally {
      setIsTranslating(false);
    }
  };

  // Toggle translation display
  const toggleTranslation = () => {
    setShowTranslated(!showTranslated);
  };

  // Handle copy content
  const handleCopyContent = async () => {
    const content = activeTab === 'summary' ? (showTranslated ? translatedContent : analysis?.summary) :
                   activeTab === 'keypoints' ? (showTranslated ? translatedContent : analysis?.keyPoints) :
                   (showTranslated ? translatedContent : analysis?.transcript);

    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Update analysis when preAnalysis changes
  useEffect(() => {
    if (preAnalysis && !analysis) {
      setAnalysis(preAnalysis);
    }
  }, [preAnalysis, analysis]);

  // Auto-scroll during content generation
  useEffect(() => {
    if (contentRef && (displayedSummary || displayedKeyPoints || displayedTranscript || isAnalyzing)) {
      const scrollContainer = contentRef;
      
      // Only auto-scroll if we're near the bottom or if content is being generated
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 100;
      
      if (isNearBottom || isAnalyzing) {
        setIsAutoScrolling(true);
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
        
        // Reset auto-scroll indicator after animation
        setTimeout(() => setIsAutoScrolling(false), 500);
      }
    }
  }, [displayedSummary, displayedKeyPoints, displayedTranscript, isAnalyzing]);

  // Handle close
  const handleClose = () => {
    setShowTranslated(false);
    setTranslatedContent('');
    setCopied(false);
    setError(null);
    onClose();
  };

  // Get current displayed content
  const getCurrentContent = () => {
    if (activeTab === 'summary') return displayedSummary;
    if (activeTab === 'keypoints') return displayedKeyPoints;
    if (activeTab === 'transcript') return displayedTranscript;
    return '';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={handleClose} />
      
      {/* Panel */}
      <div 
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${className} ${isOpen ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`} 
        style={{ maxWidth: 'min(450px, 100vw)' }} 
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('student.videoViewer.aiAnalysis', 'AI Video Analysis')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('student.videoViewer.poweredBy', 'Powered by Sage AI')}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('student.videoViewer.close', 'Close analysis panel')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
            {t('student.videoViewer.documentTitle', 'Video')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            {videoTitle || 'Untitled Video'}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyContent}
              disabled={!analysis}
              className={`p-2 rounded-lg transition-colors ${
                copied 
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={copied ? t('student.videoViewer.copied', 'Copied!') : t('student.videoViewer.copy', 'Copy Content')}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            
            <button
              onClick={handleTranslateContent}
              disabled={!analysis || isTranslating}
              className={`p-2 rounded-lg transition-colors ${
                showTranslated 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={isTranslating ? t('student.videoViewer.translating', 'Translating...') : t('student.videoViewer.translateToArabic', 'Translate to Arabic')}
            >
              <Languages size={16} />
            </button>
          </div>
        </div>

        {/* Analysis Button */}
        {!analysis && !isAnalyzing && (
          <div className="p-4">
            <button
              onClick={handleAnalyzeVideo}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles size={18} />
              {preAnalysis 
                ? t('student.videoViewer.loadAnalysis', 'Load Analysis Results')
                : t('student.videoViewer.analyzeVideo', 'Analyze Video with AI')
              }
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {preAnalysis 
                ? t('student.videoViewer.loadAnalysisDesc', 'Load pre-analyzed video content')
                : t('student.videoViewer.analyzeDescription', 'Generate transcript, summary, and key points from video content')
              }
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="p-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {t('student.videoViewer.analyzing', 'Analyzing video...')} {progress}%
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleAnalyzeVideo}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                >
                  {t('student.videoViewer.retry', 'Retry')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        {analysis && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'summary', label: t('student.videoViewer.summary', 'Summary'), icon: FileText },
                { id: 'keypoints', label: t('student.videoViewer.keyPoints', 'Key Points'), icon: Target },
                { id: 'transcript', label: t('student.videoViewer.transcript', 'Transcript'), icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-hidden">
              <div 
                ref={setContentRef}
                className={`h-full bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-300px)] ${
                  isAutoScrolling ? 'scroll-smooth' : ''
                }`}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgb(156 163 175) rgb(243 244 246)'
                }}
              >
                <div className={`prose dark:prose-invert max-w-none text-sm leading-7 text-gray-800 dark:text-gray-100 whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'}`}>
                  {getCurrentContent()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('student.videoViewer.footer', 'AI-powered video analysis for better learning')}
          </p>
        </div>
      </div>
    </>
  );
};

export default VideoSummaryPanel; 