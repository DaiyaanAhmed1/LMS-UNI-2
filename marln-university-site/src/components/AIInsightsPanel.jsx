import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Lightbulb, AlertTriangle, CheckCircle, Clock, BarChart3, Users, BookOpen, Zap, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import aiInsightsService from '../utils/aiInsightsService';

const AIInsightsPanel = ({ 
  studentData, 
  courseData, 
  insightType = 'student_performance',
  onClose,
  isVisible = false 
}) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data for demonstration
  const sampleStudentData = {
    id: 1,
    name: 'أحمد محمد',
    currentGrade: 'B+',
    progress: 75,
    assignments: [
      { name: 'Assignment 1', score: 85 },
      { name: 'Assignment 2', score: 78 },
      { name: 'Assignment 3', score: 92 }
    ],
    studyTime: 12,
    attendance: 95,
    learningStyle: 'Visual',
    studyHabits: 'Regular evening study sessions',
    weakAreas: ['Advanced Mathematics', 'Programming Concepts'],
    engagement: 'High',
    assignmentCompletion: 90
  };

  const sampleCourseData = {
    id: 1,
    name: 'Computer Networks',
    averageGrade: 'B',
    completionRate: 88,
    engagement: 82,
    assignments: [
      { name: 'Network Basics', avgScore: 78 },
      { name: 'Protocols', avgScore: 85 },
      { name: 'Security', avgScore: 72 }
    ],
    feedback: [
      'Great course content',
      'Need more practical examples',
      'Excellent instructor'
    ],
    difficulty: 'Intermediate',
    currentTopic: 'Network Security',
    upcomingAssignments: ['Final Project', 'Security Quiz'],
    requiredGrade: 'C+',
    remainingAssignments: 3
  };

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      const data = studentData || sampleStudentData;
      const course = courseData || sampleCourseData;

      switch (insightType) {
        case 'student_performance':
          result = currentLanguage === 'ar' 
            ? await aiInsightsService.getArabicInsights(data, 'student_performance')
            : await aiInsightsService.analyzeStudentPerformance(data);
          break;
        
        case 'course_analytics':
          result = currentLanguage === 'ar'
            ? await aiInsightsService.getArabicInsights(course, 'course_analytics')
            : await aiInsightsService.analyzeCourseEffectiveness(course);
          break;
        
        case 'recommendations':
          result = await aiInsightsService.generateStudyRecommendations(data, course);
          break;
        
        case 'predictions':
          result = await aiInsightsService.predictStudentSuccess(data, course);
          break;
        
        default:
          result = await aiInsightsService.analyzeStudentPerformance(data);
      }

      setInsights(result);
    } catch (err) {
      console.error('Error generating insights:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      generateInsights();
    }
  }, [isVisible, insightType, currentLanguage]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'student_performance': return <Brain className="w-6 h-6" />;
      case 'course_analytics': return <BarChart3 className="w-6 h-6" />;
      case 'recommendations': return <Lightbulb className="w-6 h-6" />;
      case 'predictions': return <TrendingUp className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
    }
  };

  const getInsightTitle = (type) => {
    switch (type) {
      case 'student_performance': return currentLanguage === 'ar' ? 'تحليل أداء الطالب' : 'Student Performance Analysis';
      case 'course_analytics': return currentLanguage === 'ar' ? 'تحليل فعالية الدورة' : 'Course Effectiveness Analysis';
      case 'recommendations': return currentLanguage === 'ar' ? 'التوصيات الشخصية' : 'Personalized Recommendations';
      case 'predictions': return currentLanguage === 'ar' ? 'توقعات النجاح' : 'Success Predictions';
      default: return currentLanguage === 'ar' ? 'الرؤى الذكية' : 'AI Insights';
    }
  };

  const renderInsightContent = () => {
    if (!insights) return null;

    const isArabic = currentLanguage === 'ar';
    const textAlign = isArabic ? 'text-right' : 'text-left';

    switch (insightType) {
      case 'student_performance':
        return (
          <div className={`space-y-4 ${textAlign}`}>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                {isArabic ? 'ملخص الأداء' : 'Performance Summary'}
              </h4>
              <p className="text-blue-700 dark:text-blue-300">
                {insights.summary || insights.rawResponse}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {isArabic ? 'نقاط القوة' : 'Strengths'}
                </h4>
                <ul className="text-green-700 dark:text-green-300 space-y-1">
                  {insights.strengths?.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {isArabic ? 'مجالات التحسين' : 'Areas for Improvement'}
                </h4>
                <ul className="text-orange-700 dark:text-orange-300 space-y-1">
                  {insights.improvements?.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? 'تحليل الأنماط' : 'Pattern Analysis'}
              </h4>
              <p className="text-purple-700 dark:text-purple-300">
                {insights.patterns}
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {isArabic ? 'مستوى المخاطر' : 'Risk Level'}
                </h4>
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {insights.riskLevel}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex-1">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {isArabic ? 'معدل الثقة' : 'Confidence'}
                </h4>
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {insights.confidenceScore}%
                </p>
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className={`space-y-4 ${textAlign}`}>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isArabic ? 'الإجراءات الفورية' : 'Immediate Actions'}
              </h4>
              <ul className="text-green-700 dark:text-green-300 space-y-1">
                {insights.immediateActions?.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {isArabic ? 'استراتيجيات الدراسة' : 'Study Strategies'}
                </h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  {insights.studyStrategies?.map((strategy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  {isArabic ? 'إدارة الوقت' : 'Time Management'}
                </h4>
                <ul className="text-purple-700 dark:text-purple-300 space-y-1">
                  {insights.timeManagement?.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`space-y-4 ${textAlign}`}>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(insights, null, 2)}
              </pre>
            </div>
          </div>
        );
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {getInsightIcon(insightType)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getInsightTitle(insightType)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentLanguage === 'ar' ? 'تحليل ذكي مدعوم بالذكاء الاصطناعي' : 'AI-Powered Intelligent Analysis'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={generateInsights}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              title={currentLanguage === 'ar' ? 'تحديث التحليل' : 'Refresh Analysis'}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600 dark:text-gray-300">
                  {currentLanguage === 'ar' ? 'جاري تحليل البيانات...' : 'Analyzing data...'}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">
                  {currentLanguage === 'ar' ? 'خطأ في التحليل' : 'Analysis Error'}
                </span>
              </div>
              <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
            </div>
          )}

          {!loading && !error && renderInsightContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              {currentLanguage === 'ar' ? 'تم إنشاؤه بواسطة الذكاء الاصطناعي' : 'Generated by AI'}
            </span>
            <span>
              {new Date().toLocaleString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel; 