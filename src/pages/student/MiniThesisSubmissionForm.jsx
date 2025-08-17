import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  ArrowLeft, 
  Edit3, 
  Upload, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  BookOpen,
  FileText,
  Search,
  Quote,
  Link
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

function MiniThesisSubmissionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const course = location.state?.course || { title: t('student.courses.title', 'All Courses') };
  const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');

  const startMiniThesisFormTour = () => {
    const steps = [
      {
        target: '[data-tour="mini-thesis-form-header"]',
        title: t('student.tour.miniThesisForm.header.title', 'Mini Thesis Submission Form'),
        content: t('student.tour.miniThesisForm.header.desc', 'Welcome to the Mini Thesis Submission Form. Here you can submit research papers and mini theses for multiple courses.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="mini-thesis-form-instructions"]',
        title: t('student.tour.miniThesisForm.instructions.title', 'Instructions'),
        content: t('student.tour.miniThesisForm.instructions.desc', 'Read the instructions carefully to understand how to submit your mini thesis properly.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="mini-thesis-form-student-info"]',
        title: t('student.tour.miniThesisForm.studentInfo.title', 'Student Information'),
        content: t('student.tour.miniThesisForm.studentInfo.desc', 'Fill in your personal information including your name and student ID.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="mini-thesis-form-course-section"]',
        title: t('student.tour.miniThesisForm.courseSection.title', 'Course Information'),
        content: t('student.tour.miniThesisForm.courseSection.desc', 'Add course details and thesis papers. You can add multiple courses and multiple thesis papers per course.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="mini-thesis-form-thesis-papers"]',
        title: t('student.tour.miniThesisForm.thesisPapers.title', 'Thesis Papers'),
        content: t('student.tour.miniThesisForm.thesisPapers.desc', 'Add thesis details including abstract, introduction, methodology, findings, and conclusion.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="mini-thesis-form-submit"]',
        title: t('student.tour.miniThesisForm.submit.title', 'Submit Form'),
        content: t('student.tour.miniThesisForm.submit.desc', 'Review your information and submit the form when ready.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:mini-thesis-form:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:mini-thesis-form:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:mini-thesis-form:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startMiniThesisFormTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation (sidebar "Start Tour" button)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startMiniThesisFormTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    submissionDate: new Date().toISOString().split('T')[0],
    courseTheses: [
      {
        courseName: '',
        courseCode: '',
        thesisPapers: [
          {
            title: '',
            topic: '',
            abstract: '',
            introduction: '',
            literatureReview: '',
            methodology: '',
            findings: '',
            conclusion: '',
            references: '',
            wordCount: '',
            keywords: ''
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
      courseTheses: [
        ...prev.courseTheses,
        {
          courseName: '',
          courseCode: '',
          thesisPapers: [
            {
              title: '',
              topic: '',
              abstract: '',
              introduction: '',
              literatureReview: '',
              methodology: '',
              findings: '',
              conclusion: '',
              references: '',
              wordCount: '',
              keywords: ''
            }
          ]
        }
      ]
    }));
  };

  const removeCourse = (courseIndex) => {
    if (formData.courseTheses.length > 1) {
      setFormData(prev => ({
        ...prev,
        courseTheses: prev.courseTheses.filter((_, index) => index !== courseIndex)
      }));
    }
  };

  const addThesisPaper = (courseIndex) => {
    setFormData(prev => ({
      ...prev,
      courseTheses: prev.courseTheses.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            thesisPapers: [
              ...course.thesisPapers,
              {
                title: '',
                topic: '',
                abstract: '',
                introduction: '',
                literatureReview: '',
                methodology: '',
                findings: '',
                conclusion: '',
                references: '',
                wordCount: '',
                keywords: ''
              }
            ]
          };
        }
        return course;
      })
    }));
  };

  const removeThesisPaper = (courseIndex, thesisIndex) => {
    setFormData(prev => ({
      ...prev,
      courseTheses: prev.courseTheses.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            thesisPapers: course.thesisPapers.filter((_, thesisIdx) => thesisIdx !== thesisIndex)
          };
        }
        return course;
      })
    }));
  };

  const updateCourse = (courseIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseTheses: prev.courseTheses.map((course, index) => {
        if (index === courseIndex) {
          return { ...course, [field]: value };
        }
        return course;
      })
    }));
  };

  const updateThesisPaper = (courseIndex, thesisIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseTheses: prev.courseTheses.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            thesisPapers: course.thesisPapers.map((thesis, thesisIdx) => {
              if (thesisIdx === thesisIndex) {
                return { ...thesis, [field]: value };
              }
              return thesis;
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
      newErrors.studentName = t('student.courses.modal.miniThesis.validation.studentName');
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = t('student.courses.modal.miniThesis.validation.studentId');
    }

    formData.courseTheses.forEach((course, courseIndex) => {
      if (!course.courseName.trim()) {
        newErrors[`course${courseIndex}Name`] = t('student.courses.modal.miniThesis.validation.courseName');
      }
      if (!course.courseCode.trim()) {
        newErrors[`course${courseIndex}Code`] = t('student.courses.modal.miniThesis.validation.courseCode');
      }

      course.thesisPapers.forEach((thesis, thesisIndex) => {
        if (!thesis.title.trim()) {
          newErrors[`course${courseIndex}Thesis${thesisIndex}Title`] = t('student.courses.modal.miniThesis.validation.title');
        }
        if (!thesis.topic.trim()) {
          newErrors[`course${courseIndex}Thesis${thesisIndex}Topic`] = t('student.courses.modal.miniThesis.validation.topic');
        }
        if (!thesis.abstract.trim()) {
          newErrors[`course${courseIndex}Thesis${thesisIndex}Abstract`] = t('student.courses.modal.miniThesis.validation.abstract');
        }
        if (!thesis.introduction.trim()) {
          newErrors[`course${courseIndex}Thesis${thesisIndex}Introduction`] = t('student.courses.modal.miniThesis.validation.introduction');
        }
        if (!thesis.conclusion.trim()) {
          newErrors[`course${courseIndex}Thesis${thesisIndex}Conclusion`] = t('student.courses.modal.miniThesis.validation.conclusion');
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
      alert(t('student.courses.modal.miniThesis.submitSuccess'));
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
          <div className="flex items-center justify-between mb-8" data-tour="mini-thesis-form-header">
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('student.courses.modal.miniThesis.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('student.courses.modal.miniThesis.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-8" data-tour="mini-thesis-form-instructions">
            <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <Edit3 className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  {t('student.courses.modal.miniThesis.instructionsTitle')}
                </h2>
                <div className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
                  <p>{t('student.courses.modal.miniThesis.instructionsP1')}</p>
                  <p>
                    <strong>{t('common.note', 'Note')}:</strong> {t('student.courses.modal.miniThesis.instructionsP2')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="mini-thesis-form-student-info">
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-500`} />
                {t('student.courses.modal.miniThesis.studentInfoTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.courses.modal.miniThesis.fields.studentName')}
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
                    placeholder={t('student.courses.modal.miniThesis.placeholders.studentName')}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.courses.modal.miniThesis.fields.studentId')}
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
                    placeholder={t('student.courses.modal.miniThesis.placeholders.studentId')}
                  />
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Thesis Papers */}
            {formData.courseTheses.map((course, courseIndex) => (
              <div key={courseIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="mini-thesis-form-course-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <BookOpen className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-purple-500`} />
                    {t('student.courses.modal.miniThesis.courseTitle', { num: courseIndex + 1 })}
                  </h2>
                  {formData.courseTheses.length > 1 && (
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
                      {t('student.courses.modal.miniThesis.fields.courseName')}
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
                      placeholder={t('student.courses.modal.miniThesis.placeholders.courseName')}
                    />
                    {errors[`course${courseIndex}Name`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.courses.modal.miniThesis.fields.courseCode')}
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
                      placeholder={t('student.courses.modal.miniThesis.placeholders.courseCode')}
                    />
                    {errors[`course${courseIndex}Code`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Code`]}</p>
                    )}
                  </div>
                </div>

                {/* Thesis Papers List */}
                <div className="space-y-6" data-tour="mini-thesis-form-thesis-papers">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('student.courses.modal.miniThesis.thesisPapersTitle')}</h3>
                    <button
                      type="button"
                      onClick={() => addThesisPaper(courseIndex)}
                      className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('student.courses.modal.miniThesis.addThesisPaper')}
                    </button>
                  </div>

                  {course.thesisPapers.map((thesis, thesisIndex) => (
                    <div key={thesisIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {t('student.courses.modal.miniThesis.thesisPaperTitle', { num: thesisIndex + 1 })}
                        </h4>
                        {course.thesisPapers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeThesisPaper(courseIndex, thesisIndex)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.title')}
                          </label>
                          <input
                            type="text"
                            value={thesis.title}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Thesis${thesisIndex}Title`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.miniThesis.placeholders.title')}
                          />
                          {errors[`course${courseIndex}Thesis${thesisIndex}Title`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Thesis${thesisIndex}Title`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.topic')}
                          </label>
                          <input
                            type="text"
                            value={thesis.topic}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'topic', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Thesis${thesisIndex}Topic`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.miniThesis.placeholders.topic')}
                          />
                          {errors[`course${courseIndex}Thesis${thesisIndex}Topic`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Thesis${thesisIndex}Topic`]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.wordCount')}
                          </label>
                          <input
                            type="number"
                            value={thesis.wordCount}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'wordCount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.miniThesis.placeholders.wordCount')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.keywords')}
                          </label>
                          <input
                            type="text"
                            value={thesis.keywords}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'keywords', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.miniThesis.placeholders.keywords')}
                          />
                        </div>
                      </div>

                      {/* Thesis Content */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.abstract')}
                          </label>
                          <textarea
                            value={thesis.abstract}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'abstract', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Thesis${thesisIndex}Abstract`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.miniThesis.placeholders.abstract')}
                          />
                          {errors[`course${courseIndex}Thesis${thesisIndex}Abstract`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Thesis${thesisIndex}Abstract`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.introduction')}
                          </label>
                          <textarea
                            value={thesis.introduction}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'introduction', e.target.value)}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Thesis${thesisIndex}Introduction`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.miniThesis.placeholders.introduction')}
                          />
                          {errors[`course${courseIndex}Thesis${thesisIndex}Introduction`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Thesis${thesisIndex}Introduction`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.literatureReview')}
                          </label>
                          <textarea
                            value={thesis.literatureReview}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'literatureReview', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.miniThesis.placeholders.literatureReview')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.methodology')}
                          </label>
                          <textarea
                            value={thesis.methodology}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'methodology', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.miniThesis.placeholders.methodology')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.findings')}
                          </label>
                          <textarea
                            value={thesis.findings}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'findings', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.miniThesis.placeholders.findings')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.conclusion')}
                          </label>
                          <textarea
                            value={thesis.conclusion}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'conclusion', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Thesis${thesisIndex}Conclusion`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.miniThesis.placeholders.conclusion')}
                          />
                          {errors[`course${courseIndex}Thesis${thesisIndex}Conclusion`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Thesis${thesisIndex}Conclusion`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.miniThesis.fields.references')}
                          </label>
                          <textarea
                            value={thesis.references}
                            onChange={(e) => updateThesisPaper(courseIndex, thesisIndex, 'references', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.miniThesis.placeholders.references')}
                          />
                        </div>
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
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('student.courses.modal.miniThesis.addAnotherCourse')}
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center" data-tour="mini-thesis-form-submit">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {t('student.courses.modal.miniThesis.submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('student.courses.modal.miniThesis.submitButton')}
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

export default MiniThesisSubmissionForm; 