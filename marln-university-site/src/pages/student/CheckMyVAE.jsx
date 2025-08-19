import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, BookOpen, BarChart3, GraduationCap, TrendingUp, AlertCircle, Info } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const CheckMyVAE = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const ms = isRTL ? 'ml-2' : 'mr-2';
  const sxr = isRTL ? 'space-x-reverse' : '';
  const course = location.state?.course;
  
  // Smart navigation logic
  const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');

  const startCheckMyVAETour = () => {
    const steps = [
      {
        target: '[data-tour="check-my-vae-header"]',
        title: t('student.tour.checkMyVae.header.title', 'Check My VAE'),
        content: t('student.tour.checkMyVae.header.desc', 'Welcome to the Check My VAE page. Here you can view your academic progress, course performance, and overall standing.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="check-my-vae-tabs"]',
        title: t('student.tour.checkMyVae.tabs.title', 'Navigation Tabs'),
        content: t('student.tour.checkMyVae.tabs.desc', 'Use these tabs to navigate between different views: Overview, Course Details, Requirements, and Progress Timeline.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="check-my-vae-overall-status"]',
        title: t('student.tour.checkMyVae.overallStatus.title', 'Overall Academic Status'),
        content: t('student.tour.checkMyVae.overallStatus.desc', 'View your overall academic progress including credit hours, GPA, courses completed, and academic standing.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="check-my-vae-course-progress"]',
        title: t('student.tour.checkMyVae.courseProgress.title', 'Current Course Progress'),
        content: t('student.tour.checkMyVae.courseProgress.desc', 'See detailed progress for the current course including attendance, assignments, grades, and upcoming milestones.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="check-my-vae-requirements"]',
        title: t('student.tour.checkMyVae.requirements.title', 'Requirements Overview'),
        content: t('student.tour.checkMyVae.requirements.desc', 'Track your progress across different requirement categories: core courses, electives, and general education.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="check-my-vae-progress-timeline"]',
        title: t('student.tour.checkMyVae.progressTimeline.title', 'Progress Timeline'),
        content: t('student.tour.checkMyVae.progressTimeline.desc', 'View your academic journey timeline and progress insights to understand your learning trajectory.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:check-my-vae:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:check-my-vae:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:check-my-vae:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startCheckMyVAETour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation (sidebar "Start Tour" button)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startCheckMyVAETour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  // Mock VAE data - in real app this would come from API
  const [vaeData] = useState({
    overallProgress: 78,
    academicStanding: 'Good Standing',
    creditHoursCompleted: 45,
    creditHoursRequired: 120,
    gpa: 3.45,
    coursesInProgress: 4,
    coursesCompleted: 12,
    lastUpdated: '2025-03-19T10:30:00',
    requirements: {
      coreCourses: { completed: 8, required: 10, status: 'In Progress' },
      electives: { completed: 15, required: 20, status: 'In Progress' },
      generalEducation: { completed: 22, required: 25, status: 'In Progress' }
    },
    courseSpecific: {
      'Cyber Security': {
        progress: 75,
        attendance: 92,
        assignments: 8,
        completedAssignments: 6,
        midtermGrade: 'A-',
        finalGrade: null,
        lastActivity: '2025-03-18T14:00:00',
        nextMilestone: 'Final Project Due',
        nextMilestoneDate: '2025-04-15T23:59:00',
        requirements: [
          { name: 'Weekly Quizzes', completed: 8, total: 12, status: 'In Progress' },
          { name: 'Lab Assignments', completed: 6, total: 8, status: 'In Progress' },
          { name: 'Midterm Exam', completed: 1, total: 1, status: 'Completed' },
          { name: 'Final Project', completed: 0, total: 1, status: 'Pending' }
        ]
      },
      'Advanced Python': {
        progress: 60,
        attendance: 88,
        assignments: 10,
        completedAssignments: 6,
        midtermGrade: 'B+',
        finalGrade: null,
        lastActivity: '2025-03-17T16:30:00',
        nextMilestone: 'Capstone Project',
        nextMilestoneDate: '2025-04-20T23:59:00',
        requirements: [
          { name: 'Programming Exercises', completed: 15, total: 20, status: 'In Progress' },
          { name: 'Code Reviews', completed: 4, total: 6, status: 'In Progress' },
          { name: 'Midterm Exam', completed: 1, total: 1, status: 'Completed' },
          { name: 'Capstone Project', completed: 0, total: 1, status: 'Pending' }
        ]
      },
      'Web Development': {
        progress: 85,
        attendance: 95,
        assignments: 12,
        completedAssignments: 10,
        midtermGrade: 'A',
        finalGrade: null,
        lastActivity: '2025-03-19T09:15:00',
        nextMilestone: 'Portfolio Submission',
        nextMilestoneDate: '2025-04-10T23:59:00',
        requirements: [
          { name: 'Website Projects', completed: 4, total: 5, status: 'In Progress' },
          { name: 'Code Documentation', completed: 8, total: 10, status: 'In Progress' },
          { name: 'Midterm Exam', completed: 1, total: 1, status: 'Completed' },
          { name: 'Portfolio', completed: 0, total: 1, status: 'Pending' }
        ]
      }
    }
  });

  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate overall statistics
  const overallStats = {
    completionRate: Math.round((vaeData.creditHoursCompleted / vaeData.creditHoursRequired) * 100),
    remainingHours: vaeData.creditHoursRequired - vaeData.creditHoursCompleted,
    averageGrade: vaeData.gpa >= 3.5 ? 'A' : vaeData.gpa >= 3.0 ? 'B' : vaeData.gpa >= 2.0 ? 'C' : 'D'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'In Progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
      case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getLocalizedStatus = (status) => {
    switch (status) {
      case 'Completed':
        return t('student.courses.modal.checkMyVae.status.completed');
      case 'In Progress':
        return t('student.courses.modal.checkMyVae.status.inProgress');
      case 'Pending':
        return t('student.courses.modal.checkMyVae.status.pending');
      default:
        return status;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleBackNavigation = () => {
    if (typeof returnTo === 'number') {
      navigate(returnTo);
    } else {
      navigate(returnTo);
    }
  };

  const handleRefreshVAE = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  if (!course) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{t('student.courses.modal.checkMyVae.notFound.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('student.courses.modal.checkMyVae.notFound.desc')}</p>
            <button
              onClick={handleBackNavigation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('student.courses.modal.checkMyVae.notFound.backToCourses')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const courseVAE = vaeData.courseSpecific[course.title];

  const tabs = [
    { id: 'overview', label: t('student.courses.modal.checkMyVae.tabs.overview'), icon: BarChart3 },
    { id: 'course', label: t('student.courses.modal.checkMyVae.tabs.course'), icon: BookOpen },
    { id: 'requirements', label: t('student.courses.modal.checkMyVae.tabs.requirements'), icon: CheckCircle },
    { id: 'progress', label: t('student.courses.modal.checkMyVae.tabs.progress'), icon: TrendingUp }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4" data-tour="check-my-vae-header">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-4 ${sxr}`}>
              <button
                onClick={handleBackNavigation}
                aria-label={t('common.back')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t('student.courses.modal.checkMyVae.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {course.title} • {t('student.courses.modal.checkMyVae.lastUpdated', { date: new Date(vaeData.lastUpdated).toLocaleString() })}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefreshVAE}
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ${sxr}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span>{t('student.courses.modal.checkMyVae.refresh')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" data-tour="check-my-vae-tabs">
          <div className="px-6">
            <nav className={`flex space-x-8 ${sxr}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${sxr} transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Overall Academic Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" data-tour="check-my-vae-overall-status">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <GraduationCap className={`w-5 h-5 ${ms} text-blue-600`} />
                  {t('student.courses.modal.checkMyVae.overallStatusTitle')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('student.courses.modal.checkMyVae.creditHours')}</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {vaeData.creditHoursCompleted}/{vaeData.creditHoursRequired}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600 dark:text-blue-400">{overallStats.completionRate}%</p>
                        <p className="text-xs text-blue-500 dark:text-blue-300">{t('student.courses.modal.checkMyVae.complete')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{t('student.courses.modal.checkMyVae.gpa')}</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {vaeData.gpa}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 dark:text-green-400">{overallStats.averageGrade}</p>
                        <p className="text-xs text-green-500 dark:text-green-300">{t('student.courses.modal.checkMyVae.grade')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('student.courses.modal.checkMyVae.courses')}</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {vaeData.coursesCompleted}/{vaeData.coursesCompleted + vaeData.coursesInProgress}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-purple-600 dark:text-purple-400">{t('student.courses.modal.checkMyVae.completed')}</p>
                        <p className="text-xs text-purple-500 dark:text-purple-300">{t('student.courses.modal.checkMyVae.total')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('student.courses.modal.checkMyVae.standing')}</p>
                        <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                          {vaeData.academicStanding}
                        </p>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Course Progress */}
              {courseVAE && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" data-tour="check-my-vae-course-progress">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BookOpen className={`w-5 h-5 ${ms} text-green-600`} />
                    {t('student.courses.modal.checkMyVae.currentCourseTitle', { course: course.title })}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - courseVAE.progress / 100)}`}
                            className={`${getProgressColor(courseVAE.progress)} transition-all duration-500`}
                          />
                        </svg>
                        <span className="absolute text-lg font-bold text-gray-900 dark:text-gray-100">
                          {courseVAE.progress}%
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">{t('student.courses.modal.checkMyVae.courseProgress')}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.attendance')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{courseVAE.attendance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.assignments')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{courseVAE.completedAssignments}/{courseVAE.assignments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.midtermGrade')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{courseVAE.midtermGrade}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{t('student.courses.modal.checkMyVae.nextMilestone')}</p>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{courseVAE.nextMilestone}</p>
                        <p className="text-xs text-blue-500 dark:text-blue-300">
                          {t('student.courses.modal.checkMyVae.dueDate', { date: new Date(courseVAE.nextMilestoneDate).toLocaleDateString() })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" data-tour="check-my-vae-requirements">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <CheckCircle className={`w-5 h-5 ${ms} text-purple-600`} />
                  {t('student.courses.modal.checkMyVae.requirementsOverviewTitle')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(vaeData.requirements).map(([key, requirement]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {t(`student.courses.modal.checkMyVae.requirements.${key}`, key.replace(/([A-Z])/g, ' $1').trim())}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(requirement.status)}`}>
                          {getLocalizedStatus(requirement.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {requirement.completed}/{requirement.required}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {Math.round((requirement.completed / requirement.required) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(requirement.completed / requirement.required) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'course' && courseVAE && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <BookOpen className={`w-5 h-5 ${ms} text-green-600`} />
                  {t('student.courses.modal.checkMyVae.courseDetailsVaeTitle', { course: course.title })}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Course Statistics */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('student.courses.modal.checkMyVae.courseStats')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.courseProgress')}</span>
                        <span className={`text-sm font-medium ${getProgressColor(courseVAE.progress)}`}>
                          {courseVAE.progress}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.attendanceRate')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {courseVAE.attendance}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.assignmentsCompleted')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {courseVAE.completedAssignments}/{courseVAE.assignments}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.lastActivity')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {new Date(courseVAE.lastActivity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grades and Milestones */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('student.courses.modal.checkMyVae.gradesMilestones')}</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.courses.modal.checkMyVae.midtermGrade')}</span>
                          <span className="text-lg font-bold text-green-800 dark:text-green-200">{courseVAE.midtermGrade}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('student.courses.modal.checkMyVae.nextMilestone')}</span>
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{courseVAE.nextMilestone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600 dark:text-blue-400">{t('student.courses.modal.checkMyVae.due')}</span>
                            <span className="text-xs text-blue-700 dark:text-blue-300">
                              {new Date(courseVAE.nextMilestoneDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'requirements' && courseVAE && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <CheckCircle className={`w-5 h-5 ${ms} text-purple-600`} />
                  {t('student.courses.modal.checkMyVae.courseRequirementsBreakdown')}
                </h2>
                
                <div className="space-y-4">
                  {courseVAE.requirements.map((requirement, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                          {requirement.name}
                        </h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(requirement.status)}`}>
                          {getLocalizedStatus(requirement.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t('student.courses.modal.checkMyVae.courseProgress')}: {requirement.completed}/{requirement.total}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {Math.round((requirement.completed / requirement.total) * 100)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(requirement.completed / requirement.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'progress' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" data-tour="check-my-vae-progress-timeline">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <TrendingUp className={`w-5 h-5 ${ms} text-green-600`} />
                  {t('student.courses.modal.checkMyVae.progressTimeline')}
                </h2>
                
                <div className="space-y-4">
                  <div className={`flex items-center space-x-4 ${sxr}`}>
                    <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('student.courses.modal.checkMyVae.timeline.sem1.title')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.timeline.sem1.desc')}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.checkMyVae.timeline.sem1.time')}</span>
                  </div>
                  
                  <div className={`flex items-center space-x-4 ${sxr}`}>
                    <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('student.courses.modal.checkMyVae.timeline.sem2.title')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.timeline.sem2.desc')}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.checkMyVae.timeline.sem2.time')}</span>
                  </div>
                  
                  <div className={`flex items-center space-x-4 ${sxr}`}>
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('student.courses.modal.checkMyVae.timeline.current.title')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.checkMyVae.timeline.current.desc')}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.checkMyVae.timeline.current.time')}</span>
                  </div>
                  
                  <div className={`flex items-center space-x-4 ${sxr}`}>
                    <div className="flex-shrink-0 w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{t('student.courses.modal.checkMyVae.timeline.future.title')}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{t('student.courses.modal.checkMyVae.timeline.future.desc')}</p>
                    </div>
                    <span className="text-sm text-gray-400 dark:text-gray-500">{t('student.courses.modal.checkMyVae.timeline.future.time')}</span>
                  </div>
                </div>
              </div>

              {/* Progress Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('student.courses.modal.checkMyVae.progressInsightsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className={`flex items-center space-x-2 ${sxr} mb-2`}>
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('student.courses.modal.checkMyVae.insights.onTrack.title')}</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {t('student.courses.modal.checkMyVae.insights.onTrack.text')}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className={`flex items-center space-x-2 ${sxr} mb-2`}>
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.courses.modal.checkMyVae.insights.improving.title')}</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {t('student.courses.modal.checkMyVae.insights.improving.text')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckMyVAE; 