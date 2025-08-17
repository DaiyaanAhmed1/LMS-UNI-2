import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Edit3, 
  FileCheck,
  Upload,
  Info,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

function AssignmentSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const course = location.state?.course || { title: t('student.courses.title', 'All Courses') };

  const startAssignmentSubmissionTour = () => {
    const steps = [
      {
        target: '[data-tour="assignment-submission-header"]',
        title: t('student.tour.assignmentSubmission.header.title', 'Assignment Submission Center'),
        content: t('student.tour.assignmentSubmission.header.desc', 'Welcome to the Assignment Submission Center. Here you can access different types of assignment submission forms.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="assignment-submission-instructions"]',
        title: t('student.tour.assignmentSubmission.instructions.title', 'Instructions'),
        content: t('student.tour.assignmentSubmission.instructions.desc', 'Read the instructions carefully to understand how to submit your assignments properly.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="assignment-submission-forms"]',
        title: t('student.tour.assignmentSubmission.forms.title', 'Assignment Forms'),
        content: t('student.tour.assignmentSubmission.forms.desc', 'Choose the appropriate form type for your assignment. Each form is designed for specific assignment types.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="assignment-submission-important-notes"]',
        title: t('student.tour.assignmentSubmission.importantNotes.title', 'Important Notes'),
        content: t('student.tour.assignmentSubmission.importantNotes.desc', 'Pay attention to these important notes and requirements before submitting your assignments.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:assignment-submission:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:assignment-submission:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:assignment-submission:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startAssignmentSubmissionTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation (sidebar "Start Tour" button)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startAssignmentSubmissionTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const assignmentTypes = [
    {
      id: 'definitions',
      title: t('student.courses.modal.assignmentSubmission.forms.definitions.title'),
      description: t('student.courses.modal.assignmentSubmission.forms.definitions.description'),
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      route: '/student/assignment-submission/definitions'
    },
    {
      id: 'case-briefs',
      title: t('student.courses.modal.assignmentSubmission.forms.caseBriefs.title'),
      description: t('student.courses.modal.assignmentSubmission.forms.caseBriefs.description'),
      icon: FileText,
      color: 'from-green-500 to-green-600',
      route: '/student/assignment-submission/case-briefs'
    },
    {
      id: 'mini-thesis',
      title: t('student.courses.modal.assignmentSubmission.forms.miniThesis.title'),
      description: t('student.courses.modal.assignmentSubmission.forms.miniThesis.description'),
      icon: Edit3,
      color: 'from-purple-500 to-purple-600',
      route: '/student/assignment-submission/mini-thesis'
    },
    {
      id: 'midterm-essays',
      title: t('student.courses.modal.assignmentSubmission.forms.midtermEssays.title'),
      description: t('student.courses.modal.assignmentSubmission.forms.midtermEssays.description'),
      icon: FileCheck,
      color: 'from-orange-500 to-orange-600',
      route: '/student/assignment-submission/midterm-essays'
    }
  ];

  const handleFormClick = (route) => {
    // Determine where to return to based on where we came from
    const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');
    
    navigate(route, { 
      state: { 
        course: course,
        returnTo: returnTo
      } 
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8" data-tour="assignment-submission-header">
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                onClick={() => {
                  // Smart back navigation - go to where we came from or default to courses
                  const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('student.courses.modal.assignmentSubmission.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{course.title}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8" data-tour="assignment-submission-instructions">
            <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <Info className={`h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0`} />
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {t('student.courses.modal.assignmentSubmission.instructionsTitle')}
                </h2>
                <div className="text-blue-800 dark:text-blue-200 space-y-2">
                  <p>{t('student.courses.modal.assignmentSubmission.instructionsP1')}</p>
                  <p>
                    {t('student.courses.modal.assignmentSubmission.instructionsP2.part1')}{' '}
                    <strong>{t('student.courses.modal.assignmentSubmission.instructionsP2.strong')}</strong>{' '}
                    {t('student.courses.modal.assignmentSubmission.instructionsP2.part2')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Forms */}
          <div className="space-y-4" data-tour="assignment-submission-forms">
            {assignmentTypes.map((assignmentType) => (
              <div
                key={assignmentType.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleFormClick(assignmentType.route)}
              >
                <div className="p-6">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${assignmentType.color}`}>
                      <assignmentType.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {assignmentType.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {assignmentType.description}
                      </p>
                    </div>
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-gray-400 dark:text-gray-500`}>
                      <span className="text-sm">{t('student.courses.modal.assignmentSubmission.clickToAccess')}</span>
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6" data-tour="assignment-submission-important-notes">
            <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <AlertCircle className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  {t('student.courses.modal.assignmentSubmission.importantNotesTitle')}
                </h3>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-1 text-sm">
                  {Array.isArray(t('student.courses.modal.assignmentSubmission.importantNotesList', { returnObjects: true }))
                    ? t('student.courses.modal.assignmentSubmission.importantNotesList', { returnObjects: true }).map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))
                    : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmission; 