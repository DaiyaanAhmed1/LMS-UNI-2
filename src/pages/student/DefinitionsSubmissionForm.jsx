import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  ArrowLeft, 
  BookOpen, 
  Upload, 
  FileText, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

function DefinitionsSubmissionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const course = location.state?.course || { title: t('student.assignmentSubmission.allCourses', 'All Courses') };
  const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');

  const startDefinitionsFormTour = () => {
    const steps = [
      {
        target: '[data-tour="definitions-form-header"]',
        title: t('student.tour.definitionsForm.header.title', 'Definitions Submission Form'),
        content: t('student.tour.definitionsForm.header.desc', 'Welcome to the Definitions Submission Form. Here you can submit definitions for multiple courses and terms.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="definitions-form-instructions"]',
        title: t('student.tour.definitionsForm.instructions.title', 'Instructions'),
        content: t('student.tour.definitionsForm.instructions.desc', 'Read the instructions carefully to understand how to submit your definitions properly.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="definitions-form-student-info"]',
        title: t('student.tour.definitionsForm.studentInfo.title', 'Student Information'),
        content: t('student.tour.definitionsForm.studentInfo.desc', 'Fill in your personal information including your name and student ID.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="definitions-form-course-section"]',
        title: t('student.tour.definitionsForm.courseSection.title', 'Course Information'),
        content: t('student.tour.definitionsForm.courseSection.desc', 'Add course details and definitions. You can add multiple courses and multiple definitions per course.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="definitions-form-definitions"]',
        title: t('student.tour.definitionsForm.definitions.title', 'Definitions'),
        content: t('student.tour.definitionsForm.definitions.desc', 'Add terms and their definitions. Include source information and page numbers when available.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="definitions-form-submit"]',
        title: t('student.tour.definitionsForm.submit.title', 'Submit Form'),
        content: t('student.tour.definitionsForm.submit.desc', 'Review your information and submit the form when ready.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:definitions-form:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:definitions-form:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:definitions-form:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startDefinitionsFormTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation (sidebar "Start Tour" button)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startDefinitionsFormTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    submissionDate: new Date().toISOString().split('T')[0],
    courseDefinitions: [
      {
        courseName: '',
        courseCode: '',
        definitions: [
          {
            term: '',
            definition: '',
            source: '',
            pageNumber: ''
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
      courseDefinitions: [
        ...prev.courseDefinitions,
        {
          courseName: '',
          courseCode: '',
          definitions: [
            {
              term: '',
              definition: '',
              source: '',
              pageNumber: ''
            }
          ]
        }
      ]
    }));
  };

  const removeCourse = (courseIndex) => {
    if (formData.courseDefinitions.length > 1) {
      setFormData(prev => ({
        ...prev,
        courseDefinitions: prev.courseDefinitions.filter((_, index) => index !== courseIndex)
      }));
    }
  };

  const addDefinition = (courseIndex) => {
    setFormData(prev => ({
      ...prev,
      courseDefinitions: prev.courseDefinitions.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            definitions: [
              ...course.definitions,
              {
                term: '',
                definition: '',
                source: '',
                pageNumber: ''
              }
            ]
          };
        }
        return course;
      })
    }));
  };

  const removeDefinition = (courseIndex, definitionIndex) => {
    setFormData(prev => ({
      ...prev,
      courseDefinitions: prev.courseDefinitions.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            definitions: course.definitions.filter((_, defIndex) => defIndex !== definitionIndex)
          };
        }
        return course;
      })
    }));
  };

  const updateCourse = (courseIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseDefinitions: prev.courseDefinitions.map((course, index) => {
        if (index === courseIndex) {
          return { ...course, [field]: value };
        }
        return course;
      })
    }));
  };

  const updateDefinition = (courseIndex, definitionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseDefinitions: prev.courseDefinitions.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            definitions: course.definitions.map((def, defIndex) => {
              if (defIndex === definitionIndex) {
                return { ...def, [field]: value };
              }
              return def;
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
      newErrors.studentName = t('student.definitionsForm.validation.studentName');
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = t('student.definitionsForm.validation.studentId');
    }

    formData.courseDefinitions.forEach((course, courseIndex) => {
      if (!course.courseName.trim()) {
        newErrors[`course${courseIndex}Name`] = t('student.definitionsForm.validation.courseName');
      }
      if (!course.courseCode.trim()) {
        newErrors[`course${courseIndex}Code`] = t('student.definitionsForm.validation.courseCode');
      }

      course.definitions.forEach((definition, defIndex) => {
        if (!definition.term.trim()) {
          newErrors[`course${courseIndex}Def${defIndex}Term`] = t('student.definitionsForm.validation.term');
        }
        if (!definition.definition.trim()) {
          newErrors[`course${courseIndex}Def${defIndex}Definition`] = t('student.definitionsForm.validation.definition');
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
      alert(t('student.definitionsForm.submitSuccess'));
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8" data-tour="definitions-form-header">
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('student.definitionsForm.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('student.definitionsForm.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8" data-tour="definitions-form-instructions">
            <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <BookOpen className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {t('student.definitionsForm.instructionsTitle')}
                </h2>
                <div className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                  <p>{t('student.definitionsForm.instructionsP1')}</p>
                  <p>
                    <strong>{t('student.definitionsForm.instructionsNoteStrong')}</strong>{' '}
                    {t('student.definitionsForm.instructionsNoteTail')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="definitions-form-student-info">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-500`} />
                {t('student.definitionsForm.studentInfoTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.definitionsForm.fields.studentName')}
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
                    placeholder={t('student.definitionsForm.placeholders.studentName')}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('student.definitionsForm.fields.studentId')}
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
                    placeholder={t('student.definitionsForm.placeholders.studentId')}
                  />
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Definitions */}
            {formData.courseDefinitions.map((course, courseIndex) => (
              <div key={courseIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="definitions-form-course-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <BookOpen className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-green-500`} />
                    {t('student.definitionsForm.courseTitle', { num: courseIndex + 1 })}
                  </h2>
                  {formData.courseDefinitions.length > 1 && (
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
                      {t('student.definitionsForm.fields.courseName')}
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
                      placeholder={t('student.definitionsForm.placeholders.courseName')}
                    />
                    {errors[`course${courseIndex}Name`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('student.definitionsForm.fields.courseCode')}
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
                      placeholder={t('student.definitionsForm.placeholders.courseCode')}
                    />
                    {errors[`course${courseIndex}Code`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Code`]}</p>
                    )}
                  </div>
                </div>

                {/* Definitions List */}
                <div className="space-y-4" data-tour="definitions-form-definitions">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('student.definitionsForm.definitionsTitle')}</h3>
                    <button
                      type="button"
                      onClick={() => addDefinition(courseIndex)}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('student.definitionsForm.addDefinition')}
                    </button>
                  </div>

                  {course.definitions.map((definition, definitionIndex) => (
                    <div key={definitionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                          {t('student.definitionsForm.definitionTitle', { num: definitionIndex + 1 })}
                        </h4>
                        {course.definitions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDefinition(courseIndex, definitionIndex)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.definitionsForm.fields.term')}
                          </label>
                          <input
                            type="text"
                            value={definition.term}
                            onChange={(e) => updateDefinition(courseIndex, definitionIndex, 'term', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              errors[`course${courseIndex}Def${definitionIndex}Term`] 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                            }`}
                            placeholder={t('student.definitionsForm.placeholders.term')}
                          />
                          {errors[`course${courseIndex}Def${definitionIndex}Term`] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Def${definitionIndex}Term`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('student.definitionsForm.fields.source')}
                          </label>
                          <input
                            type="text"
                            value={definition.source}
                            onChange={(e) => updateDefinition(courseIndex, definitionIndex, 'source', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                            placeholder={t('student.definitionsForm.placeholders.source')}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('student.definitionsForm.fields.definition')}
                        </label>
                        <textarea
                          value={definition.definition}
                          onChange={(e) => updateDefinition(courseIndex, definitionIndex, 'definition', e.target.value)}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                            errors[`course${courseIndex}Def${definitionIndex}Definition`] 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                          }`}
                          placeholder={t('student.definitionsForm.placeholders.definition')}
                        />
                        {errors[`course${courseIndex}Def${definitionIndex}Definition`] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`course${courseIndex}Def${definitionIndex}Definition`]}</p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('student.definitionsForm.fields.pageNumber')}
                        </label>
                        <input
                          type="text"
                          value={definition.pageNumber}
                          onChange={(e) => updateDefinition(courseIndex, definitionIndex, 'pageNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
                          placeholder={t('student.definitionsForm.placeholders.pageNumber')}
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
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('student.definitionsForm.addAnotherCourse')}
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center" data-tour="definitions-form-submit">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {t('student.definitionsForm.submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('student.definitionsForm.submitButton')}
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

export default DefinitionsSubmissionForm; 