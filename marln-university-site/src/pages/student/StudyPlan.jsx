import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Calendar, 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Target, 
  TrendingUp, 
  Award,
  FileText,
  Video,
  BookMarked,
  Lightbulb,
  Clock3,
  CalendarDays,
  ChevronRight,
  Activity,
  Flag,
  Info
} from 'lucide-react';

// Function to get localized study plan data
const getLocalizedStudyPlan = (t, courseTitle) => {
  // Static data that doesn't need localization
  const staticData = {
    'Cyber Security': {
      duration: '16 weeks',
      totalHours: '120 hours',
      difficulty: 'Intermediate',
      weeklyPlan: [
        { week: 1, estimatedHours: 8, status: 'completed' },
        { week: 2, estimatedHours: 10, status: 'completed' },
        { week: 3, estimatedHours: 12, status: 'in-progress' },
        { week: 4, estimatedHours: 10, status: 'not-started' },
        { week: 5, estimatedHours: 8, status: 'not-started' }
      ],
      milestones: [
        { week: 4, weight: '30%' },
        { week: 8, weight: '20%' },
        { week: 12, weight: '25%' },
        { week: 16, weight: '25%' }
      ]
    },
    'Advanced Python': {
      duration: '12 weeks',
      totalHours: '96 hours',
      difficulty: 'Advanced',
      weeklyPlan: [
        { week: 1, estimatedHours: 8, status: 'completed' },
        { week: 2, estimatedHours: 10, status: 'completed' },
        { week: 3, estimatedHours: 12, status: 'in-progress' },
        { week: 4, estimatedHours: 10, status: 'not-started' }
      ],
      milestones: [
        { week: 3, weight: '25%' },
        { week: 6, weight: '30%' },
        { week: 9, weight: '25%' },
        { week: 12, weight: '20%' }
      ]
    },
    'Web Development': {
      duration: '14 weeks',
      totalHours: '112 hours',
      difficulty: 'Intermediate',
      weeklyPlan: [
        { week: 1, estimatedHours: 8, status: 'completed' },
        { week: 2, estimatedHours: 10, status: 'completed' },
        { week: 3, estimatedHours: 12, status: 'in-progress' },
        { week: 4, estimatedHours: 10, status: 'not-started' }
      ],
      milestones: [
        { week: 4, weight: '30%' },
        { week: 8, weight: '25%' },
        { week: 11, weight: '25%' },
        { week: 14, weight: '20%' }
      ]
    }
  };

  const staticInfo = staticData[courseTitle] || staticData['Cyber Security'];
  
  // Try to read fully localized course content first
  const courseKey = courseTitle === 'Cyber Security' ? 'cyberSecurity' :
                   courseTitle === 'Advanced Python' ? 'advancedPython' :
                   courseTitle === 'Web Development' ? 'webDevelopment' : 'cyberSecurity';
  const localizedData = t(`student.courses.modal.studyPlan.courses.${courseKey}`, { returnObjects: true });
  if (localizedData && typeof localizedData === 'object' && localizedData.title) {
    const weeklyContent = localizedData.weeks || {};
    return {
      title: localizedData.title,
      description: localizedData.description,
      duration: staticInfo.duration,
      totalHours: staticInfo.totalHours,
      difficulty: staticInfo.difficulty,
      prerequisites: localizedData.prerequisites || [],
      objectives: localizedData.objectives || [],
      weeklyPlan: staticInfo.weeklyPlan.map((week) => {
        const weekKey = `week${week.week}`;
        const weekData = weeklyContent[weekKey] || {};
        return {
          ...week,
          title: weekData.title || '',
          topics: weekData.topics || [],
          activities: weekData.activities || [],
          deliverables: weekData.deliverables || []
        };
      }),
      resources: (localizedData.resources || []).map(resource => ({
        ...resource,
        available: true
      })),
      milestones: staticInfo.milestones.map((milestone, index) => ({
        ...milestone,
        title: (localizedData.milestones && localizedData.milestones[index] && localizedData.milestones[index].title) || '',
        type: (localizedData.milestones && localizedData.milestones[index] && localizedData.milestones[index].type) || ''
      }))
    };
  }
  
  // Get localized content based on course
  let title, description, objectives, prerequisites, weeklyContent, resources, milestones;
  
  if (courseTitle === 'Cyber Security') {
    title = 'Cyber Security Study Plan';
    description = 'Comprehensive study plan covering cybersecurity fundamentals, threats, and defense mechanisms.';
    objectives = [
      'Understand cybersecurity principles and best practices',
      'Learn about common cyber threats and attack vectors',
      'Master security tools and defense mechanisms',
      'Develop incident response and recovery skills'
    ];
    prerequisites = ['Basic Computer Science', 'Networking Fundamentals'];
    weeklyContent = {
      week1: {
        title: 'Introduction to Cybersecurity',
        topics: ['Cybersecurity fundamentals', 'Threat landscape overview', 'Security principles'],
        activities: ['Read Chapter 1-2', 'Complete Quiz 1', 'Join discussion forum'],
        deliverables: ['Quiz submission', 'Discussion participation']
      },
      week2: {
        title: 'Network Security Basics',
        topics: ['Network protocols', 'Firewall configuration', 'VPN setup'],
        activities: ['Lab exercises', 'Hands-on practice', 'Group project planning'],
        deliverables: ['Lab report', 'Project outline']
      },
      week3: {
        title: 'Cryptography Fundamentals',
        topics: ['Encryption algorithms', 'Hash functions', 'Digital signatures'],
        activities: ['Cryptography exercises', 'Code implementation', 'Security analysis'],
        deliverables: ['Code submission', 'Security report']
      },
      week4: {
        title: 'Web Application Security',
        topics: ['OWASP Top 10', 'SQL injection', 'XSS prevention'],
        activities: ['Vulnerability assessment', 'Penetration testing', 'Security audit'],
        deliverables: ['Vulnerability report', 'Security recommendations']
      },
      week5: {
        title: 'Incident Response',
        topics: ['Incident detection', 'Response procedures', 'Recovery planning'],
        activities: ['Case studies', 'Simulation exercises', 'Documentation'],
        deliverables: ['Incident response plan', 'Case study analysis']
      }
    };
    resources = [
      { type: 'Textbook', name: 'Cybersecurity Essentials', author: 'Dr. Sarah Johnson', available: true },
      { type: 'Online Course', name: 'Cybersecurity Fundamentals', platform: 'Coursera', available: true },
      { type: 'Lab Environment', name: 'Virtual Security Lab', platform: 'VMware', available: true },
      { type: 'Tools', name: 'Wireshark, Metasploit, Nmap', platform: 'Open Source', available: true }
    ];
    milestones = [
      { title: 'Midterm Assessment', type: 'Exam' },
      { title: 'Project Phase 1', type: 'Project' },
      { title: 'Security Audit', type: 'Practical' },
      { title: 'Final Project', type: 'Project' }
    ];
  } else if (courseTitle === 'Advanced Python') {
    title = 'Advanced Python Study Plan';
    description = 'Master advanced Python concepts, best practices, and real-world applications.';
    objectives = [
      'Master advanced Python features and syntax',
      'Learn design patterns and best practices',
      'Develop real-world applications',
      'Understand performance optimization'
    ];
    prerequisites = ['Python Basics', 'Object-Oriented Programming'];
    weeklyContent = {
      week1: {
        title: 'Advanced Python Features',
        topics: ['Decorators', 'Generators', 'Context managers'],
        activities: ['Code examples', 'Practice exercises', 'Mini projects'],
        deliverables: ['Code submission', 'Feature demonstration']
      },
      week2: {
        title: 'Design Patterns',
        topics: ['Creational patterns', 'Structural patterns', 'Behavioral patterns'],
        activities: ['Pattern implementation', 'Case studies', 'Design exercises'],
        deliverables: ['Pattern examples', 'Design document']
      },
      week3: {
        title: 'Performance Optimization',
        topics: ['Profiling', 'Memory management', 'Algorithm optimization'],
        activities: ['Performance testing', 'Optimization exercises', 'Benchmarking'],
        deliverables: ['Performance report', 'Optimized code']
      },
      week4: {
        title: 'Testing and Debugging',
        topics: ['Unit testing', 'Integration testing', 'Debugging techniques'],
        activities: ['Test writing', 'Debugging practice', 'Test coverage'],
        deliverables: ['Test suite', 'Debugging report']
      }
    };
    resources = [
      { type: 'Textbook', name: 'Python Cookbook', author: 'Prof. Michael Chen', available: true },
      { type: 'Online Course', name: 'Advanced Python Programming', platform: 'edX', available: true },
      { type: 'Development Environment', name: 'PyCharm Professional', platform: 'JetBrains', available: true },
      { type: 'Libraries', name: 'NumPy, Pandas, Django', platform: 'Python Package Index', available: true }
    ];
    milestones = [
      { title: 'Feature Assessment', type: 'Code Review' },
      { title: 'Design Pattern Project', type: 'Project' },
      { title: 'Performance Challenge', type: 'Practical' },
      { title: 'Final Application', type: 'Project' }
    ];
  } else if (courseTitle === 'Web Development') {
    title = 'Web Development Study Plan';
    description = 'Learn modern web development technologies and best practices.';
    objectives = [
      'Master modern web technologies',
      'Learn responsive design principles',
      'Understand web security best practices',
      'Build full-stack web applications'
    ];
    prerequisites = ['HTML/CSS Basics', 'JavaScript Fundamentals'];
    weeklyContent = {
      week1: {
        title: 'Modern HTML & CSS',
        topics: ['Semantic HTML', 'CSS Grid', 'Flexbox', 'CSS Variables'],
        activities: ['Layout exercises', 'Responsive design', 'CSS animations'],
        deliverables: ['Portfolio page', 'CSS showcase']
      },
      week2: {
        title: 'JavaScript ES6+',
        topics: ['Arrow functions', 'Destructuring', 'Modules', 'Async/await'],
        activities: ['Code challenges', 'Mini applications', 'ES6 features'],
        deliverables: ['JavaScript project', 'Feature demonstration']
      },
      week3: {
        title: 'Frontend Frameworks',
        topics: ['React basics', 'Component lifecycle', 'State management'],
        activities: ['React tutorials', 'Component building', 'State exercises'],
        deliverables: ['React app', 'Component library']
      },
      week4: {
        title: 'Backend Development',
        topics: ['Node.js', 'Express.js', 'API design', 'Database integration'],
        activities: ['Server setup', 'API development', 'Database queries'],
        deliverables: ['Backend API', 'Database schema']
      }
    };
    resources = [
      { type: 'Textbook', name: 'Web Development Guide', author: 'Dr. Emily Brown', available: true },
      { type: 'Online Course', name: 'Full Stack Web Development', platform: 'Udemy', available: true },
      { type: 'Development Tools', name: 'VS Code, Chrome DevTools', platform: 'Various', available: true },
      { type: 'Frameworks', name: 'React, Node.js, Express', platform: 'Open Source', available: true }
    ];
    milestones = [
      { title: 'Frontend Assessment', type: 'Project' },
      { title: 'Backend Integration', type: 'Project' },
      { title: 'Full Stack App', type: 'Project' },
      { title: 'Final Portfolio', type: 'Project' }
    ];
  } else {
    // Fallback to Cyber Security
    title = 'Cyber Security Study Plan';
    description = 'Comprehensive study plan covering cybersecurity fundamentals, threats, and defense mechanisms.';
    objectives = [
      'Understand cybersecurity principles and best practices',
      'Learn about common cyber threats and attack vectors',
      'Master security tools and defense mechanisms',
      'Develop incident response and recovery skills'
    ];
    prerequisites = ['Basic Computer Science', 'Networking Fundamentals'];
    weeklyContent = {
      week1: {
        title: 'Introduction to Cybersecurity',
        topics: ['Cybersecurity fundamentals', 'Threat landscape overview', 'Security principles'],
        activities: ['Read Chapter 1-2', 'Complete Quiz 1', 'Join discussion forum'],
        deliverables: ['Quiz submission', 'Discussion participation']
      },
      week2: {
        title: 'Network Security Basics',
        topics: ['Network protocols', 'Firewall configuration', 'VPN setup'],
        activities: ['Lab exercises', 'Hands-on practice', 'Group project planning'],
        deliverables: ['Lab report', 'Project outline']
      },
      week3: {
        title: 'Cryptography Fundamentals',
        topics: ['Encryption algorithms', 'Hash functions', 'Digital signatures'],
        activities: ['Cryptography exercises', 'Code implementation', 'Security analysis'],
        deliverables: ['Code submission', 'Security report']
      },
      week4: {
        title: 'Web Application Security',
        topics: ['OWASP Top 10', 'SQL injection', 'XSS prevention'],
        activities: ['Vulnerability assessment', 'Penetration testing', 'Security audit'],
        deliverables: ['Vulnerability report', 'Security recommendations']
      },
      week5: {
        title: 'Incident Response',
        topics: ['Incident detection', 'Response procedures', 'Recovery planning'],
        activities: ['Case studies', 'Simulation exercises', 'Documentation'],
        deliverables: ['Incident response plan', 'Case study analysis']
      }
    };
    resources = [
      { type: 'Textbook', name: 'Cybersecurity Essentials', author: 'Dr. Sarah Johnson', available: true },
      { type: 'Online Course', name: 'Cybersecurity Fundamentals', platform: 'Coursera', available: true },
      { type: 'Lab Environment', name: 'Virtual Security Lab', platform: 'VMware', available: true },
      { type: 'Tools', name: 'Wireshark, Metasploit, Nmap', platform: 'Open Source', available: true }
    ];
    milestones = [
      { title: 'Midterm Assessment', type: 'Exam' },
      { title: 'Project Phase 1', type: 'Project' },
      { title: 'Security Audit', type: 'Practical' },
      { title: 'Final Project', type: 'Project' }
    ];
  }
  
  // Combine localized and static data
  return {
    title: title,
    description: description,
    duration: staticInfo.duration,
    totalHours: staticInfo.totalHours,
    difficulty: staticInfo.difficulty,
    prerequisites: prerequisites,
    objectives: objectives,
    weeklyPlan: staticInfo.weeklyPlan.map((week, index) => {
      const weekKey = `week${week.week}`;
      const weekData = weeklyContent[weekKey];
      return {
        ...week,
        title: weekData.title,
        topics: weekData.topics,
        activities: weekData.activities,
        deliverables: weekData.deliverables
      };
    }),
    resources: resources,
    milestones: staticInfo.milestones.map((milestone, index) => ({
      ...milestone,
      title: milestones[index].title,
      type: milestones[index].type
    }))
  };
};

function StudyPlan() {
  const { t, i18n } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWeek, setSelectedWeek] = useState(null);
  const { startTour } = useTour();
  const isRTL = i18n.dir() === 'rtl';
  const pr = (ltr, rtl) => (isRTL ? rtl : ltr);
  
  // Get course from location state or find by ID
  const course = location.state?.course || { title: t('student.courses.modal.studyPlan.unknownCourse') };
  const studyPlan = getLocalizedStudyPlan(t, course.title);

  const startStudyPlanTour = () => {
    const steps = [
      {
        target: '[data-tour="study-plan-header"]',
        title: t('student.tour.studyPlan.header.title', 'Study Plan Overview'),
        content: t('student.tour.studyPlan.header.desc', 'Here you can see the course title, duration, total hours, and difficulty level for your study plan.'),
        placement: pr('bottom', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="course-overview"]',
        title: t('student.tour.studyPlan.overview.title', 'Course Overview'),
        content: t('student.tour.studyPlan.overview.desc', 'This section shows the course description, learning objectives, and prerequisites you need to complete.'),
        placement: pr('top', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="weekly-plan"]',
        title: t('student.tour.studyPlan.weekly.title', 'Weekly Study Plan'),
        content: t('student.tour.studyPlan.weekly.desc', 'Click on any week to expand and see detailed topics, activities, and deliverables. Track your progress with status indicators.'),
        placement: pr('top', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="progress-summary"]',
        title: t('student.tour.studyPlan.progress.title', 'Progress Summary'),
        content: t('student.tour.studyPlan.progress.desc', 'Monitor your weekly progress at a glance with completion status for each week.'),
        placement: pr('left', 'right'),
        disableBeacon: true
      },
      {
        target: '[data-tour="resources"]',
        title: t('student.tour.studyPlan.resources.title', 'Learning Resources'),
        content: t('student.tour.studyPlan.resources.desc', 'Access all the textbooks, online courses, tools, and materials you need for this course.'),
        placement: pr('left', 'right'),
        disableBeacon: true
      },
      {
        target: '[data-tour="milestones"]',
        title: t('student.tour.studyPlan.milestones.title', 'Key Milestones'),
        content: t('student.tour.studyPlan.milestones.desc', 'Important deadlines and major assessments with their weights and schedules.'),
        placement: pr('left', 'right'),
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
         if (steps.length) startTour('student:study-plan:v1', steps);
   };

   useEffect(() => {
     // Auto-start tour for new users
     const key = 'tour:student:study-plan:v1:autostart';
     const hasSeenTour = localStorage.getItem(key);
     const tourCompleted = localStorage.getItem('tour:student:study-plan:v1:state');
     
     if (!hasSeenTour && tourCompleted !== 'completed') {
       setTimeout(() => {
         startStudyPlanTour();
         localStorage.setItem(key, 'shown');
       }, 600);
     }
     
     // Handle tour launches from navigation (sidebar "Start Tour" button)
     const onLaunch = () => {
       const launch = localStorage.getItem('tour:launch');
       if (launch === 'student-full' || launch === 'student-resume') {
         localStorage.removeItem('tour:launch');
         setTimeout(() => startStudyPlanTour(), 200);
       }
     };
     
     window.addEventListener('tour:launch', onLaunch);
     return () => window.removeEventListener('tour:launch', onLaunch);
   }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-5 w-5 text-yellow-500" />;
      case 'not-started':
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'not-started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8" data-tour="study-plan-header">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={t('student.courses.modal.studyPlan.backButton')}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{studyPlan.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('student.courses.modal.studyPlan.courseDuration', { course: course.title, duration: studyPlan.duration })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={startStudyPlanTour}
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                aria-label={t('student.tour.startTour', 'Start guided tour')}
                title={t('student.tour.startTour', 'Start guided tour')}
              >
                <Info className="h-4 w-4" />
              </button>
              <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.studyPlan.totalHours')}</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{studyPlan.totalHours}</div>
              </div>
              <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.studyPlan.difficulty')}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{studyPlan.difficulty}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="course-overview">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <BookOpen className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-500`} />
                  {t('student.courses.modal.studyPlan.courseOverview')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{studyPlan.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.courses.modal.studyPlan.learningObjectives')}</h3>
                    <ul className="space-y-1">
                      {studyPlan.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <Target className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} mt-0.5 text-green-500 flex-shrink-0`} />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.courses.modal.studyPlan.prerequisites')}</h3>
                    <ul className="space-y-1">
                      {studyPlan.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} mt-0.5 text-blue-500 flex-shrink-0`} />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Weekly Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="weekly-plan">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <CalendarDays className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-purple-500`} />
                  {t('student.courses.modal.studyPlan.weeklyStudyPlan')}
                </h2>
                <div className="space-y-4">
                  {studyPlan.weeklyPlan.map((week) => (
                    <div
                      key={week.week}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWeek === week.week
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedWeek(selectedWeek === week.week ? null : week.week)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(week.status)}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {t('student.courses.modal.studyPlan.week', { num: week.week })}: {week.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock3 className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {t('student.courses.modal.studyPlan.estimatedHours', { hours: week.estimatedHours })}
                                </div>
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(week.status)}`}>
                                {week.status === 'completed' ? t('student.courses.modal.studyPlan.status.completed') :
                                 week.status === 'in-progress' ? t('student.courses.modal.studyPlan.status.inProgress') :
                                 t('student.courses.modal.studyPlan.status.notStarted')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                          selectedWeek === week.week ? 'rotate-90' : ''
                        }`} />
                      </div>
                      
                      {selectedWeek === week.week && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.courses.modal.studyPlan.topicsCovered')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {week.topics.map((topic, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.courses.modal.studyPlan.activities')}</h4>
                            <ul className="space-y-1">
                              {week.activities.map((activity, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                  <Lightbulb className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} mt-0.5 text-yellow-500 flex-shrink-0`} />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.courses.modal.studyPlan.deliverables')}</h4>
                            <ul className="space-y-1">
                              {week.deliverables.map((deliverable, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                  <FileText className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} mt-0.5 text-blue-500 flex-shrink-0`} />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="progress-summary">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <TrendingUp className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-green-500`} />
                  {t('student.courses.modal.studyPlan.progressSummary')}
                </h3>
                <div className="space-y-4">
                  {studyPlan.weeklyPlan.map((week) => (
                    <div key={week.week} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{t('student.courses.modal.studyPlan.week', { num: week.week })}</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(week.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(week.status)}`}>
                          {week.status === 'completed' ? t('student.courses.modal.studyPlan.status.completed') :
                           week.status === 'in-progress' ? t('student.courses.modal.studyPlan.status.inProgress') :
                           t('student.courses.modal.studyPlan.status.notStarted')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="resources">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <BookMarked className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-purple-500`} />
                  {t('student.courses.modal.studyPlan.learningResources')}
                </h3>
                <div className="space-y-3">
                  {studyPlan.resources.map((resource, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{resource.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{resource.type}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.available 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {resource.available ? t('student.courses.modal.studyPlan.resourceStatus.available') : t('student.courses.modal.studyPlan.resourceStatus.unavailable')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" data-tour="milestones">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Award className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-yellow-500`} />
                  {t('student.courses.modal.studyPlan.keyMilestones')}
                </h3>
                <div className="space-y-3">
                  {studyPlan.milestones.map((milestone, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{milestone.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.studyPlan.week', { num: milestone.week })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{milestone.type}</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{milestone.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlan; 