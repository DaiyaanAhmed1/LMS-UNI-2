import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  BookOpen,
  Gavel,
  MapPin,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

function CaseBriefsSubmissionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const course = location.state?.course || { title: t('student.courses.title', 'All Courses') };
  const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');

  const startCaseBriefsFormTour = () => {
    const steps = [
      {
        target: '[data-tour="case-briefs-form-header"]',
        title: t('student.tour.caseBriefsForm.header.title', 'Case Briefs Submission Form'),
        content: t('student.tour.caseBriefsForm.header.desc', 'Welcome to the Case Briefs Submission Form. Here you can submit legal case briefs for multiple courses.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="case-briefs-form-instructions"]',
        title: t('student.tour.caseBriefsForm.instructions.title', 'Instructions'),
        content: t('student.tour.caseBriefsForm.instructions.desc', 'Read the instructions carefully to understand how to submit your case briefs properly.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="case-briefs-form-student-info"]',
        title: t('student.tour.caseBriefsForm.studentInfo.title', 'Student Information'),
        content: t('student.tour.caseBriefsForm.studentInfo.desc', 'Fill in your personal information including your name and student ID.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="case-briefs-form-course-section"]',
        title: t('student.tour.caseBriefsForm.courseSection.title', 'Course Information'),
        content: t('student.tour.caseBriefsForm.courseSection.desc', 'Add course details and case briefs. You can add multiple courses and multiple case briefs per course.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="case-briefs-form-case-briefs"]',
        title: t('student.tour.caseBriefsForm.caseBriefs.title', 'Case Briefs'),
        content: t('student.tour.caseBriefsForm.caseBriefs.desc', 'Add case details including facts, issues, holdings, and legal analysis.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="case-briefs-form-submit"]',
        title: t('student.tour.caseBriefsForm.submit.title', 'Submit Form'),
        content: t('student.tour.caseBriefsForm.submit.desc', 'Review your information and submit the form when ready.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:case-briefs-form:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:case-briefs-form:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:case-briefs-form:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startCaseBriefsFormTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation (sidebar "Start Tour" button)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startCaseBriefsFormTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    submissionDate: new Date().toISOString().split('T')[0],
    courseCaseBriefs: [
      {
        courseName: '',
        courseCode: '',
        caseBriefs: [
          {
            caseName: '',
            citation: '',
            court: '',
            date: '',
            facts: '',
            issue: '',
            holding: '',
            reasoning: '',
            dissent: '',
            significance: ''
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
      courseCaseBriefs: [
        ...prev.courseCaseBriefs,
        {
          courseName: '',
          courseCode: '',
          caseBriefs: [
            {
              caseName: '',
              citation: '',
              court: '',
              date: '',
              facts: '',
              issue: '',
              holding: '',
              reasoning: '',
              dissent: '',
              significance: ''
            }
          ]
        }
      ]
    }));
  };

  const removeCourse = (courseIndex) => {
    if (formData.courseCaseBriefs.length > 1) {
      setFormData(prev => ({
        ...prev,
        courseCaseBriefs: prev.courseCaseBriefs.filter((_, index) => index !== courseIndex)
      }));
    }
  };

  const addCaseBrief = (courseIndex) => {
    setFormData(prev => ({
      ...prev,
      courseCaseBriefs: prev.courseCaseBriefs.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            caseBriefs: [
              ...course.caseBriefs,
              {
                caseName: '',
                citation: '',
                court: '',
                date: '',
                facts: '',
                issue: '',
                holding: '',
                reasoning: '',
                dissent: '',
                significance: ''
              }
            ]
          };
        }
        return course;
      })
    }));
  };

  const removeCaseBrief = (courseIndex, caseIndex) => {
    setFormData(prev => ({
      ...prev,
      courseCaseBriefs: prev.courseCaseBriefs.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            caseBriefs: course.caseBriefs.filter((_, caseIdx) => caseIdx !== caseIndex)
          };
        }
        return course;
      })
    }));
  };

  const updateCourse = (courseIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseCaseBriefs: prev.courseCaseBriefs.map((course, index) => {
        if (index === courseIndex) {
          return { ...course, [field]: value };
        }
        return course;
      })
    }));
  };

  const updateCaseBrief = (courseIndex, caseIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseCaseBriefs: prev.courseCaseBriefs.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            caseBriefs: course.caseBriefs.map((caseBrief, caseIdx) => {
              if (caseIdx === caseIndex) {
                return { ...caseBrief, [field]: value };
              }
              return caseBrief;
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
      newErrors.studentName = t('student.courses.modal.caseBriefs.validation.studentName');
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = t('student.courses.modal.caseBriefs.validation.studentId');
    }

    formData.courseCaseBriefs.forEach((course, courseIndex) => {
      if (!course.courseName.trim()) {
        newErrors[`course${courseIndex}Name`] = t('student.courses.modal.caseBriefs.validation.courseName');
      }
      if (!course.courseCode.trim()) {
        newErrors[`course${courseIndex}Code`] = t('student.courses.modal.caseBriefs.validation.courseCode');
      }

      course.caseBriefs.forEach((caseBrief, caseIndex) => {
        if (!caseBrief.caseName.trim()) {
          newErrors[`course${courseIndex}Case${caseIndex}Name`] = t('student.courses.modal.caseBriefs.validation.caseName');
        }
        if (!caseBrief.facts.trim()) {
          newErrors[`course${courseIndex}Case${caseIndex}Facts`] = t('student.courses.modal.caseBriefs.validation.facts');
        }
        if (!caseBrief.issue.trim()) {
          newErrors[`course${courseIndex}Case${caseIndex}Issue`] = t('student.courses.modal.caseBriefs.validation.issue');
        }
        if (!caseBrief.holding.trim()) {
          newErrors[`course${courseIndex}Case${caseIndex}Holding`] = t('student.courses.modal.caseBriefs.validation.holding');
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
      alert(t('student.courses.modal.caseBriefs.submitSuccess'));
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
          <div className="flex items-center justify-between mb-8" data-tour="case-briefs-form-header">
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('student.courses.modal.caseBriefs.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('student.courses.modal.caseBriefs.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8" data-tour="case-briefs-form-instructions">
            <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <Gavel className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  {t('student.courses.modal.caseBriefs.instructionsTitle')}
                </h2>
                <div className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                  <p>{t('student.courses.modal.caseBriefs.instructionsP1')}</p>
                  <p>
                    <strong>{t('common.note', 'Note')}:</strong> {t('student.courses.modal.caseBriefs.instructionsP2')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="case-briefs-form-student-info">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-500`} />
                {t('student.courses.modal.caseBriefs.studentInfoTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.courses.modal.caseBriefs.fields.studentName')}
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
                    placeholder={t('student.courses.modal.caseBriefs.placeholders.studentName')}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.courses.modal.caseBriefs.fields.studentId')}
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
                    placeholder={t('student.courses.modal.caseBriefs.placeholders.studentId')}
                  />
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Case Briefs */}
            {formData.courseCaseBriefs.map((course, courseIndex) => (
              <div key={courseIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="case-briefs-form-course-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <BookOpen className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-green-500`} />
                    {t('student.courses.modal.caseBriefs.courseTitle', { num: courseIndex + 1 })}
                  </h2>
                  {formData.courseCaseBriefs.length > 1 && (
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
                      {t('student.courses.modal.caseBriefs.fields.courseName')}
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
                      placeholder={t('student.courses.modal.caseBriefs.placeholders.courseName')}
                    />
                    {errors[`course${courseIndex}Name`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.courses.modal.caseBriefs.fields.courseCode')}
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
                      placeholder={t('student.courses.modal.caseBriefs.placeholders.courseCode')}
                    />
                    {errors[`course${courseIndex}Code`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Code`]}</p>
                    )}
                  </div>
                </div>

                {/* Case Briefs List */}
                <div className="space-y-6" data-tour="case-briefs-form-case-briefs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('student.courses.modal.caseBriefs.caseBriefsTitle')}</h3>
                    <button
                      type="button"
                      onClick={() => addCaseBrief(courseIndex)}
                      className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('student.courses.modal.caseBriefs.addCaseBrief')}
                    </button>
                  </div>

                  {course.caseBriefs.map((caseBrief, caseIndex) => (
                    <div key={caseIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {t('student.courses.modal.caseBriefs.caseBriefTitle', { num: caseIndex + 1 })}
                        </h4>
                        {course.caseBriefs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCaseBrief(courseIndex, caseIndex)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Case Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.caseName')}
                          </label>
                          <input
                            type="text"
                            value={caseBrief.caseName}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'caseName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Case${caseIndex}Name`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.caseName')}
                          />
                          {errors[`course${courseIndex}Case${caseIndex}Name`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Case${caseIndex}Name`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.citation')}
                          </label>
                          <input
                            type="text"
                            value={caseBrief.citation}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'citation', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.citation')}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.court')}
                          </label>
                          <input
                            type="text"
                            value={caseBrief.court}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'court', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.court')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.date')}
                          </label>
                          <input
                            type="date"
                            value={caseBrief.date}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>

                      {/* Case Analysis */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.facts')}
                          </label>
                          <textarea
                            value={caseBrief.facts}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'facts', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Case${caseIndex}Facts`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.facts')}
                          />
                          {errors[`course${courseIndex}Case${caseIndex}Facts`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Case${caseIndex}Facts`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.issue')}
                          </label>
                          <textarea
                            value={caseBrief.issue}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'issue', e.target.value)}
                            rows={2}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Case${caseIndex}Issue`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.issue')}
                          />
                          {errors[`course${courseIndex}Case${caseIndex}Issue`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Case${caseIndex}Issue`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.holding')}
                          </label>
                          <textarea
                            value={caseBrief.holding}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'holding', e.target.value)}
                            rows={2}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Case${caseIndex}Holding`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.holding')}
                          />
                          {errors[`course${courseIndex}Case${caseIndex}Holding`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Case${caseIndex}Holding`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.reasoning')}
                          </label>
                          <textarea
                            value={caseBrief.reasoning}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'reasoning', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.reasoning')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.dissent')}
                          </label>
                          <textarea
                            value={caseBrief.dissent}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'dissent', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.dissent')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.courses.modal.caseBriefs.fields.significance')}
                          </label>
                          <textarea
                            value={caseBrief.significance}
                            onChange={(e) => updateCaseBrief(courseIndex, caseIndex, 'significance', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.courses.modal.caseBriefs.placeholders.significance')}
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
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('student.courses.modal.caseBriefs.addAnotherCourse')}
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center" data-tour="case-briefs-form-submit">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {t('student.courses.modal.caseBriefs.submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('student.courses.modal.caseBriefs.submitButton')}
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

export default CaseBriefsSubmissionForm; 