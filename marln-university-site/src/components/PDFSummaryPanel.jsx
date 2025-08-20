import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Lock, FileText, HelpCircle, BookOpen, Loader, Languages, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useTypewriter } from '../utils/typewriterEffect';
import ReactMarkdown from 'react-markdown';

const PDFSummaryPanel = ({ 
  isOpen, 
  onClose, 
  pdfTitle, 
  pdfUrl,
  className = ''
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'questions'
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [showTranslated, setShowTranslated] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionReport, setInspectionReport] = useState(null);
  const contentRef = useRef(null);


  const { displayedText: displayedSummary } = useTypewriter(
    analysis?.summary || '', 
    { speed: 15 }
  );

  const { displayedText: displayedQuestions } = useTypewriter(
    analysis?.questions || '', 
    { speed: 15 }
  );

  // Auto-scroll to bottom when content is being generated
  useEffect(() => {
    if (contentRef.current && (displayedSummary || displayedQuestions)) {
      const scrollContainer = contentRef.current;
      
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
  }, [displayedSummary, displayedQuestions, isAnalyzing]);

  const handleAnalyzePDF = async () => {
    if (!pdfUrl) {
      setError('No PDF URL provided');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setInspectionReport(null);

    const startTime = Date.now();
    let validationResult = null;
    let analysisResult = null;
    let errorDetails = null;

    try {
      // Import PDF service dynamically to avoid loading issues
      const { default: pdfService } = await import('../utils/pdfService.js');
      
      setProgress(10);
      
      // Validate PDF first
      const validation = await pdfService.validatePDF(pdfUrl);
      validationResult = validation;
      
      if (!validation.isValid) {
        // If validation fails, try to provide a helpful error message
        if (validation.error.includes('Failed to fetch')) {
          throw new Error('Unable to access PDF file. This might be due to CORS restrictions or the file being in an iframe. Please ensure the PDF is publicly accessible.');
        } else {
          throw new Error(`PDF validation failed: ${validation.error}`);
        }
      }
      
      setProgress(20);
      
      // Perform comprehensive analysis
      const result = await pdfService.analyzePDF(pdfUrl, pdfTitle);
      analysisResult = result;
      
      setProgress(100);
      setAnalysis(result);
      
    } catch (error) {
      console.error('PDF analysis failed:', error);
      errorDetails = error;
      
      // Check for different types of errors and provide user-friendly messages
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('Unable to access')) {
        setError('Unable to access PDF file. This might be due to CORS restrictions or the file being in an iframe. Please ensure the PDF is publicly accessible.');
      } else if (error.message.includes('API') || error.message.includes('rate limit') || error.message.includes('busy')) {
        setError('AI service is currently busy. Please try again in a few moments. The system will use fallback content to provide you with a summary.');
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        setError('Network connection issue. Please check your internet connection and try again.');
      } else {
        setError(`Analysis failed: ${error.message}`);
      }
    } finally {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Generate inspection report
      const report = {
        timestamp: new Date().toISOString(),
        duration: duration,
        success: !errorDetails,
        pdfUrl: pdfUrl,
        pdfTitle: pdfTitle,
        validation: validationResult,
        analysis: analysisResult,
        error: errorDetails,
        progress: progress,
        fallbackUsed: errorDetails && (errorDetails.message.includes('busy') || errorDetails.message.includes('fallback'))
      };
      
      setInspectionReport(report);
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const handleCopyContent = async () => {
    const content = activeTab === 'summary' ? analysis?.summary : analysis?.questions;
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCopied(false);
    setShowTranslated(false);
    setTranslatedContent('');
  };

  const handleClose = () => {
    // Reset all states when closing
    setShowTranslated(false);
    setTranslatedContent('');
    setCopied(false);
    setError(null);
    onClose();
  };

  const handleTranslateContent = async () => {
    if (isTranslating) return;

    const content = activeTab === 'summary' ? analysis?.summary : analysis?.questions;
    if (!content) return;

    setIsTranslating(true);
    setError(null);

    try {
      // Import AI service dynamically
      const { default: aiService } = await import('../utils/aiService.js');
      
      const translationPrompt = `Please translate the following text to Arabic. Maintain the formatting, structure, and educational tone. If there are markdown elements like headers, lists, or bold text, preserve them in the Arabic translation:

${content}`;

      const translation = await aiService.getAIResponse(
        translationPrompt,
        `pdf-translation-${Date.now()}`,
        'free',
        'ar'
      );

      setTranslatedContent(translation);
      setShowTranslated(true);
      
    } catch (error) {
      console.error('Translation failed:', error);
      setError('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleTranslation = () => {
    if (showTranslated) {
      setShowTranslated(false);
    } else {
      handleTranslateContent();
    }
  };

  const handleDemoMode = async () => {
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate analysis progress
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);

      // Demo analysis data
      const demoAnalysis = {
        summary: `# AI-Generated Summary: ${pdfTitle}

## Main Topics
This document covers fundamental concepts in cybersecurity, including network security, threat detection, and best practices for protecting digital assets.

## Important Concepts
- **Network Security**: Understanding how to secure network infrastructure
- **Threat Detection**: Identifying and responding to security threats
- **Security Protocols**: Implementing proper security measures
- **Risk Assessment**: Evaluating potential security vulnerabilities

## Key Takeaways
1. Cybersecurity is essential in today's digital landscape
2. Proactive threat detection is better than reactive response
3. Regular security audits help maintain system integrity
4. Employee training is crucial for organizational security

## Structure
The document is organized into logical sections covering theoretical foundations, practical applications, and real-world case studies.

## Practical Applications
- Implement security policies in organizations
- Conduct security assessments
- Develop incident response plans
- Train staff on security best practices`,

        questions: `# AI-Generated Questions: ${pdfTitle}

## Multiple Choice Questions

### 1. What is the primary goal of network security?
A) To increase network speed
B) To protect network infrastructure from threats
C) To reduce network costs
D) To improve network aesthetics
**Correct Answer: B**

### 2. Which of the following is NOT a common security threat?
A) Malware attacks
B) Phishing attempts
C) Hardware upgrades
D) Data breaches
**Correct Answer: C**

## Short Answer Questions

### 3. Explain the importance of threat detection in cybersecurity.
**Expected Points:**
- Early identification of security risks
- Prevention of data breaches
- Cost reduction through proactive measures
- Protection of sensitive information

### 4. Describe the key components of a security audit.
**Expected Points:**
- Vulnerability assessment
- Policy review
- Access control evaluation
- Incident response testing

## Critical Thinking Questions

### 5. How would you design a comprehensive security strategy for a small business?
**Difficulty: Hard**
Consider factors like budget constraints, employee training, technology implementation, and ongoing maintenance.

## Study Tips
- Focus on understanding the relationship between different security concepts
- Practice applying theoretical knowledge to real-world scenarios
- Review case studies to understand practical implementations`,

        textLength: 15000,
        pages: 25
      };

      setAnalysis(demoAnalysis);
      
    } catch (error) {
      console.error('Demo mode failed:', error);
      setError('Demo mode failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

    if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={handleClose} />
      <div className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${className} ${isOpen ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`} style={{ maxWidth: 'min(450px, 100vw)', height: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {t('student.pdfViewer.aiAnalysis', 'AI PDF Analysis')}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('student.pdfViewer.poweredBy', 'Powered by Sage AI')}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Document Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                {t('student.pdfViewer.documentTitle', 'Document')}
              </h3>
              
              {/* Action Icons */}
              {analysis && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInspection(!showInspection)}
                    disabled={!inspectionReport}
                    className={`p-2 rounded-lg transition-colors ${
                      showInspection
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : inspectionReport
                        ? 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    }`}
                    title={inspectionReport ? (isRTL ? "تقرير التحليل" : "Analysis Report") : (isRTL ? "لا يوجد تقرير" : "No report available")}
                  >
                    <Search size={16} />
                  </button>
                  
                  <button 
                    onClick={handleCopyContent}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={copied ? t('student.pdfViewer.copied', 'Copied!') : t('student.pdfViewer.copy', 'Copy Content')}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  
                  <button
                    onClick={toggleTranslation}
                    disabled={isTranslating}
                    className={`p-2 rounded-lg transition-colors ${
                      isTranslating 
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                        : showTranslated
                        ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        : 'text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={isTranslating 
                      ? t('student.pdfViewer.translating', 'Translating...') 
                      : showTranslated 
                      ? t('student.pdfViewer.showOriginal', 'Show Original')
                      : t('student.pdfViewer.translateToArabic', 'Translate to Arabic')
                    }
                  >
                    {isTranslating ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Languages size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {pdfTitle}
            </p>
            {analysis && (
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>📄 {analysis.pages} pages</span>
                <span>📏 {analysis.textLength.toLocaleString()} characters</span>
              </div>
            )}
          </div>

          {/* Analysis Button */}
          {!analysis && !isAnalyzing && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleAnalyzePDF}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
                {t('student.pdfViewer.analyzePDF', 'Analyze PDF with AI')}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {t('student.pdfViewer.analyzeDescription', 'Generate summary and questions from PDF content')}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t('student.pdfViewer.analyzing', 'Analyzing PDF...')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {progress < 30 && t('student.pdfViewer.extractingText', 'Extracting text from PDF...')}
                {progress >= 30 && progress < 70 && t('student.pdfViewer.generatingSummary', 'Generating AI summary...')}
                {progress >= 70 && t('student.pdfViewer.generatingQuestions', 'Generating questions...')}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 whitespace-pre-line">{error}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleAnalyzePDF}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                  >
                    {t('student.pdfViewer.retry', 'Retry')}
                  </button>
                  {error.includes('CORS') || error.includes('Failed to fetch') || error.includes('Unable to access') ? (
                    <button
                      onClick={handleDemoMode}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                    >
                      Try Demo Mode
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          {analysis && (
            <div className="flex-1 flex flex-col">
              
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <button
                  onClick={() => handleTabChange('summary')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'summary'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <BookOpen className="w-4 h-4" />
                    {t('student.pdfViewer.summary', 'Summary')}
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('questions')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'questions'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <HelpCircle className="w-4 h-4" />
                    {t('student.pdfViewer.questions', 'Questions')}
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-hidden">
                <div 
                  ref={contentRef}
                  className={`h-full bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-300px)] relative ${isAutoScrolling ? 'scroll-smooth' : ''}`}
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}
                >
                  {activeTab === 'summary' ? (
                    <div className={`prose dark:prose-invert max-w-none text-sm leading-7 text-gray-800 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="space-y-6">
                        <div className="markdown-content">
                          <ReactMarkdown>
                            {showTranslated ? translatedContent : displayedSummary}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`prose dark:prose-invert max-w-none text-sm leading-7 text-gray-800 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="space-y-6">
                        <div className="markdown-content">
                          <ReactMarkdown>
                            {showTranslated ? translatedContent : displayedQuestions}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>{t('student.pdfViewer.footer.line1', 'AI-powered PDF analysis for better learning')}</p>
              <p className="mt-1">{t('student.pdfViewer.footer.line2', 'Generated by Sage AI technology')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Report Modal */}
      {showInspection && inspectionReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  inspectionReport.success 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {inspectionReport.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {isRTL ? "تقرير تحليل PDF" : "PDF Analysis Report"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {inspectionReport.success ? (isRTL ? "تم التحليل بنجاح" : "Analysis completed successfully") : (isRTL ? "فشل في التحليل" : "Analysis failed")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInspection(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-4">
                {/* Status Overview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {isRTL ? "نظرة عامة على الحالة" : "Status Overview"}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الحالة:" : "Status:"}</span>
                      <div className="flex items-center gap-2 mt-1">
                        {inspectionReport.success ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400 font-medium">{isRTL ? "نجح" : "Success"}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400 font-medium">{isRTL ? "فشل" : "Failed"}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{isRTL ? "المدة:" : "Duration:"}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{inspectionReport.duration}ms</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الوقت:" : "Timestamp:"}</span>
                      <span className="font-medium">{new Date(inspectionReport.timestamp).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{isRTL ? "المحتوى الاحتياطي:" : "Fallback Used:"}</span>
                      <span className={`font-medium ${inspectionReport.fallbackUsed ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300'}`}>
                        {inspectionReport.fallbackUsed ? (isRTL ? "نعم" : "Yes") : (isRTL ? "لا" : "No")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PDF Details */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {isRTL ? "تفاصيل PDF" : "PDF Details"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{isRTL ? "العنوان:" : "Title:"}</span>
                      <span className="font-medium ml-2">{inspectionReport.pdfTitle}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الرابط:" : "URL:"}</span>
                      <span className="font-medium ml-2 text-blue-600 dark:text-blue-400 break-all">{inspectionReport.pdfUrl}</span>
                    </div>
                  </div>
                </div>

                {/* Validation Results */}
                {inspectionReport.validation && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {isRTL ? "نتائج التحقق" : "Validation Results"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">{isRTL ? "صالح:" : "Valid:"}</span>
                        <span className={`font-medium ml-2 ${inspectionReport.validation.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {inspectionReport.validation.isValid ? (isRTL ? "نعم" : "Yes") : (isRTL ? "لا" : "No")}
                        </span>
                      </div>
                      {inspectionReport.validation.pages && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{isRTL ? "عدد الصفحات:" : "Pages:"}</span>
                          <span className="font-medium ml-2">{inspectionReport.validation.pages}</span>
                        </div>
                      )}
                      {inspectionReport.validation.size && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الحجم:" : "Size:"}</span>
                          <span className="font-medium ml-2">{inspectionReport.validation.size} bytes</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Details */}
                {inspectionReport.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-3">
                      {isRTL ? "تفاصيل الخطأ" : "Error Details"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-red-700 dark:text-red-300">{isRTL ? "نوع الخطأ:" : "Error Type:"}</span>
                        <span className="font-medium ml-2 text-red-800 dark:text-red-200">{inspectionReport.error.name}</span>
                      </div>
                      <div>
                        <span className="text-red-700 dark:text-red-300">{isRTL ? "الرسالة:" : "Message:"}</span>
                        <span className="font-medium ml-2 text-red-800 dark:text-red-200">{inspectionReport.error.message}</span>
                      </div>
                      {inspectionReport.error.stack && (
                        <div>
                          <span className="text-red-700 dark:text-red-300">{isRTL ? "التفاصيل التقنية:" : "Technical Details:"}</span>
                          <pre className="mt-2 text-xs text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-x-auto">
                            {inspectionReport.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Analysis Results */}
                {inspectionReport.analysis && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
                      {isRTL ? "نتائج التحليل" : "Analysis Results"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-green-700 dark:text-green-300">{isRTL ? "ملخص:" : "Summary:"}</span>
                        <span className="font-medium ml-2 text-green-800 dark:text-green-200">
                          {inspectionReport.analysis.summary ? `${inspectionReport.analysis.summary.length} characters` : (isRTL ? "غير متوفر" : "Not available")}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-300">{isRTL ? "الأسئلة:" : "Questions:"}</span>
                        <span className="font-medium ml-2 text-green-800 dark:text-green-200">
                          {inspectionReport.analysis.questions ? `${inspectionReport.analysis.questions.length} characters` : (isRTL ? "غير متوفر" : "Not available")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFSummaryPanel; 