import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  ArrowLeft, 
  FileCheck, 
  Upload, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  BookOpen,
  Clock,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

function MidtermEssaySubmissionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const course = location.state?.course || { title: t('student.courses.title', 'All Courses') };
  const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');

  const startMidtermEssayFormTour = () => {
    const steps = [
      {
        target: '[data-tour="midterm-essay-form-header"]',
        title: t('student.tour.midtermEssayForm.header.title', 'Midterm Essay Submission Form'),
        content: t('student.tour.midtermEssayForm.header.desc', 'Welcome to the Midterm Essay Submission Form. Here you can submit essay exam responses for multiple courses.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="midterm-essay-form-instructions"]',
        title: t('student.tour.midtermEssayForm.instructions.title', 'Instructions'),
        content: t('student.tour.midtermEssayForm.instructions.desc', 'Read the instructions carefully to understand how to submit your midterm essays properly.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="midterm-essay-form-student-info"]',
        title: t('student.tour.midtermEssayForm.studentInfo.title', 'Student Information'),
        content: t('student.tour.midtermEssayForm.studentInfo.desc', 'Fill in your personal information including your name and student ID.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="midterm-essay-form-course-section"]',
        title: t('student.tour.midtermEssayForm.courseSection.title', 'Course Information'),
        content: t('student.tour.midtermEssayForm.courseSection.desc', 'Add course details and exam information. You can add multiple courses and multiple essay questions per course.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="midterm-essay-form-essay-questions"]',
        title: t('student.tour.midtermEssayForm.essayQuestions.title', 'Essay Questions'),
        content: t('student.tour.midtermEssayForm.essayQuestions.desc', 'Add essay questions and your detailed responses. Include question numbers, text, and your answers.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="midterm-essay-form-important-notice"]',
        title: t('student.tour.midtermEssayForm.importantNotice.title', 'Important Notice'),
        content: t('student.tour.midtermEssayForm.importantNotice.desc', 'Pay attention to these important requirements and guidelines for your midterm essay submission.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="midterm-essay-form-submit"]',
        title: t('student.tour.midtermEssayForm.submit.title', 'Submit Form'),
        content: t('student.tour.midtermEssayForm.submit.desc', 'Review your information and submit the form when ready.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:midterm-essay-form:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:midterm-essay-form:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:midterm-essay-form:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startMidtermEssayFormTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation (sidebar "Start Tour" button)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startMidtermEssayFormTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    submissionDate: new Date().toISOString().split('T')[0],
    courseEssays: [
      {
        courseName: '',
        courseCode: '',
        examDate: '',
        timeLimit: '',
        essayQuestions: [
          {
            questionNumber: '',
            questionText: '',
            answer: '',
            wordCount: '',
            timeSpent: ''
          }
        ]
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courseEssays: [
        ...prev.courseEssays,
        {
          courseName: '',
          courseCode: '',
          examDate: '',
          timeLimit: '',
          essayQuestions: [
            {
              questionNumber: '',
              questionText: '',
              answer: '',
              wordCount: '',
              timeSpent: ''
            }
          ]
        }
      ]
    }));
  };

  const removeCourse = (courseIndex) => {
    if (formData.courseEssays.length > 1) {
      setFormData(prev => ({
        ...prev,
        courseEssays: prev.courseEssays.filter((_, index) => index !== courseIndex)
      }));
    }
  };

  const addEssayQuestion = (courseIndex) => {
    setFormData(prev => ({
      ...prev,
      courseEssays: prev.courseEssays.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            essayQuestions: [
              ...course.essayQuestions,
              {
                questionNumber: '',
                questionText: '',
                answer: '',
                wordCount: '',
                timeSpent: ''
              }
            ]
          };
        }
        return course;
      })
    }));
  };

  const removeEssayQuestion = (courseIndex, questionIndex) => {
    setFormData(prev => ({
      ...prev,
      courseEssays: prev.courseEssays.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            essayQuestions: course.essayQuestions.filter((_, qIdx) => qIdx !== questionIndex)
          };
        }
        return course;
      })
    }));
  };

  const updateCourse = (courseIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseEssays: prev.courseEssays.map((course, index) => {
        if (index === courseIndex) {
          return { ...course, [field]: value };
        }
        return course;
      })
    }));
  };

  const updateEssayQuestion = (courseIndex, questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseEssays: prev.courseEssays.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            essayQuestions: course.essayQuestions.map((question, qIdx) => {
              if (qIdx === questionIndex) {
                return { ...question, [field]: value };
              }
              return question;
            })
          };
        }
        return course;
      })
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = t('student.courses.modal.midtermEssays.validation.studentName');
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = t('student.courses.modal.midtermEssays.validation.studentId');
    }

    formData.courseEssays.forEach((course, courseIndex) => {
      if (!course.courseName.trim()) {
        newErrors[`course${courseIndex}Name`] = t('student.courses.modal.midtermEssays.validation.courseName');
      }
      if (!course.courseCode.trim()) {
        newErrors[`course${courseIndex}Code`] = t('student.courses.modal.midtermEssays.validation.courseCode');
      }
      if (!course.examDate) {
        newErrors[`course${courseIndex}ExamDate`] = t('student.courses.modal.midtermEssays.validation.examDate');
      }

      course.essayQuestions.forEach((question, questionIndex) => {
        if (!question.questionNumber.trim()) {
          newErrors[`course${courseIndex}Question${questionIndex}Number`] = t('student.courses.modal.midtermEssays.validation.questionNumber');
        }
        if (!question.questionText.trim()) {
          newErrors[`course${courseIndex}Question${questionIndex}Text`] = t('student.courses.modal.midtermEssays.validation.questionText');
        }
        if (!question.answer.trim()) {
          newErrors[`course${courseIndex}Question${questionIndex}Answer`] = t('student.courses.modal.midtermEssays.validation.answer');
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert(t('student.courses.modal.midtermEssays.submitSuccess'));
      // Smart navigation after successful submission
      if (typeof returnTo === 'number') {
        navigate(returnTo);
      } else {
        navigate(returnTo);
      }
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8" data-tour="midterm-essay-form-header">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
              <button
                onClick={() => {
                  // Smart back navigation - go to where we came from or default to courses
                  if (typeof returnTo === 'number') {
                    navigate(returnTo);
                  } else {
                    navigate(returnTo);
                  }
                }}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={t('common.back', 'Back')}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('student.courses.modal.midtermEssays.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('student.courses.modal.midtermEssays.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8" data-tour="midterm-essay-form-instructions">
            <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <FileCheck className="h-6 w-6 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  {t('student.courses.modal.midtermEssays.instructionsTitle')}
                </h2>
                <div className="text-orange-800 dark:text-orange-200 space-y-2 text-sm">
                  <p>{t('student.courses.modal.midtermEssays.instructionsP1')}</p>
                  <p>
                    <strong>{t('common.note', 'Note')}:</strong> {t('student.courses.modal.midtermEssays.instructionsP2')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="midterm-essay-form-student-info">
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-500`} />
                {t('student.courses.modal.midtermEssays.studentInfoTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.courses.modal.midtermEssays.fields.studentName')}
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.studentName 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                    }`}
                    placeholder={t('student.courses.modal.midtermEssays.placeholders.studentName')}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.courses.modal.midtermEssays.fields.studentId')}
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.studentId 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                    }`}
                    placeholder={t('student.courses.modal.midtermEssays.placeholders.studentId')}
                  />
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Essay Exams */}
            {formData.courseEssays.map((course, courseIndex) => (
              <div key={courseIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="midterm-essay-form-course-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <BookOpen className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-orange-500`} />
                    {t('student.courses.modal.midtermEssays.courseTitle', { num: courseIndex + 1 })}
                  </h2>
                  {formData.courseEssays.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(courseIndex)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.courses.modal.midtermEssays.fields.courseName')}
                    </label>
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={(e) => updateCourse(courseIndex, 'courseName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors[`course${courseIndex}Name`] 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                      }`}
                      placeholder={t('student.courses.modal.midtermEssays.placeholders.courseName')}
                    />
                    {errors[`course${courseIndex}Name`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.courses.modal.midtermEssays.fields.courseCode')}
                    </label>
                    <input
                      type="text"
                      value={course.courseCode}
                      onChange={(e) => updateCourse(courseIndex, 'courseCode', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors[`course${courseIndex}Code`] 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                      }`}
                      placeholder={t('student.courses.modal.midtermEssays.placeholders.courseCode')}
                    />
                    {errors[`course${courseIndex}Code`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Code`]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.courses.modal.midtermEssays.fields.examDate')}
                    </label>
                    <input
                      type="date"
                      value={course.examDate}
                      onChange={(e) => updateCourse(courseIndex, 'examDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors[`course${courseIndex}ExamDate`] 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                      }`}
                    />
                    {errors[`course${courseIndex}ExamDate`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}ExamDate`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.courses.modal.midtermEssays.fields.timeLimit')}
                    </label>
                    <input
                      type="text"
                      value={course.timeLimit}
                      onChange={(e) => updateCourse(courseIndex, 'timeLimit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                      placeholder={t('student.courses.modal.midtermEssays.placeholders.timeLimit')}
                    />
                  </div>
                </div>

                {/* Essay Questions List */}
                <div className="space-y-6" data-tour="midterm-essay-form-essay-questions">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('student.courses.modal.midtermEssays.essayQuestionsTitle')}</h3>
                    <button
                      type="button"
                      onClick={() => addEssayQuestion(courseIndex)}
                      className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('student.courses.modal.midtermEssays.addQuestion')}
                    </button>
                  </div>

                  {course.essayQuestions.map((question, questionIndex) => (
                    <div key={questionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {t('student.courses.modal.midtermEssays.essayQuestionTitle', { num: questionIndex + 1 })}
                        </h4>
                        {course.essayQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEssayQuestion(courseIndex, questionIndex)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Question Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.midtermEssays.fields.questionNumber')}
                          </label>
                          <input
                            type="text"
                            value={question.questionNumber}
                            onChange={(e) => updateEssayQuestion(courseIndex, questionIndex, 'questionNumber', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Question${questionIndex}Number`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.midtermEssays.placeholders.questionNumber')}
                          />
                          {errors[`course${courseIndex}Question${questionIndex}Number`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Question${questionIndex}Number`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.midtermEssays.fields.wordCount')}
                          </label>
                          <input
                            type="number"
                            value={question.wordCount}
                            onChange={(e) => updateEssayQuestion(courseIndex, questionIndex, 'wordCount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.midtermEssays.placeholders.wordCount')}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('student.courses.modal.midtermEssays.fields.questionText')}
                        </label>
                        <textarea
                          value={question.questionText}
                          onChange={(e) => updateEssayQuestion(courseIndex, questionIndex, 'questionText', e.target.value)}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                            errors[`course${courseIndex}Question${questionIndex}Text`] 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                          }`}
                          placeholder={t('student.courses.modal.midtermEssays.placeholders.questionText')}
                        />
                        {errors[`course${courseIndex}Question${questionIndex}Text`] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Question${questionIndex}Text`]}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('student.courses.modal.midtermEssays.fields.answer')}
                        </label>
                        <textarea
                          value={question.answer}
                          onChange={(e) => updateEssayQuestion(courseIndex, questionIndex, 'answer', e.target.value)}
                          rows={8}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                            errors[`course${courseIndex}Question${questionIndex}Answer`] 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                          }`}
                          placeholder={t('student.courses.modal.midtermEssays.placeholders.answer')}
                        />
                        {errors[`course${courseIndex}Question${questionIndex}Answer`] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Question${questionIndex}Answer`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('student.courses.modal.midtermEssays.fields.timeSpent')}
                        </label>
                        <input
                          type="text"
                          value={question.timeSpent}
                          onChange={(e) => updateEssayQuestion(courseIndex, questionIndex, 'timeSpent', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                          placeholder={t('student.courses.modal.midtermEssays.placeholders.timeSpent')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add Course Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={addCourse}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white text-lg font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('student.courses.modal.midtermEssays.addAnotherCourse')}
              </button>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6" data-tour="midterm-essay-form-important-notice">
              <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
                <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {t('student.courses.modal.midtermEssays.importantNoticeTitle')}
                  </h3>
                  <ul className="text-yellow-800 dark:text-yellow-200 space-y-1 text-sm">
                    {t('student.courses.modal.midtermEssays.importantNoticeList', { returnObjects: true }).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center" data-tour="midterm-essay-form-submit">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {t('student.courses.modal.midtermEssays.submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('student.courses.modal.midtermEssays.submitButton')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MidtermEssaySubmissionForm; 