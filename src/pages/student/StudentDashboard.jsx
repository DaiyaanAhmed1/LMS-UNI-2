import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Users2, ClipboardList, Calendar, BarChart2, MessageCircle, FileText, CheckCircle, TrendingUp, Bell, Award, Library, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const statsData = {
  'this': [
    { labelKey: 'student.dashboard.stats.enrolledCourses', value: '5', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { labelKey: 'student.dashboard.stats.pendingAssignments', value: '3', icon: ClipboardList, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { labelKey: 'student.dashboard.stats.averageGrade', value: '85%', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { labelKey: 'student.dashboard.stats.nextClass', value: 'Math 101', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ],
  'last': [
    { labelKey: 'student.dashboard.stats.enrolledCourses', value: '4', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { labelKey: 'student.dashboard.stats.pendingAssignments', value: '0', icon: ClipboardList, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { labelKey: 'student.dashboard.stats.averageGrade', value: '82%', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { labelKey: 'student.dashboard.stats.nextClass', value: 'N/A', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]
};

const messages = [
  { name: 'Dr. Emily Carter', time: '10:15 AM', msg: 'Your assignment has been graded. Great work!', avatar: '', color: 'bg-blue-200' },
  { name: 'Study Group', time: 'Yesterday', msg: 'Meeting tomorrow at 2 PM in Library', avatar: '', color: 'bg-green-200' },
  { name: 'Academic Advisor', time: '2 days ago', msg: 'Course registration opens next week', avatar: '', color: 'bg-yellow-200' },
];

const activities = [
  { icon: CheckCircle, desc: 'Submitted Math Assignment #3', time: '2 hours ago', color: 'text-blue-600' },
  { icon: Award, desc: 'Received A+ in Physics Lab', time: '1 day ago', color: 'text-green-600' },
  { icon: FileText, desc: 'Downloaded Chemistry Notes', time: '2 days ago', color: 'text-yellow-600' },
  { icon: Users2, desc: 'Joined Study Group', time: '3 days ago', color: 'text-purple-600' },
];

const upcomingClasses = [
  { time: '9:00 AM', title: 'Mathematics 101', room: 'Room 302, Building A', instructor: 'Dr. Emily Carter' },
  { time: '1:00 PM', title: 'Physics 201', room: 'Room 105, Building B', instructor: 'Prof. David Kim' },
  { time: '3:30 PM', title: 'Chemistry Lab', room: 'Lab 203, Science Building', instructor: 'Dr. Sarah Lee' },
];

const courseProgressData = {
  'this': [
    { name: 'Mathematics 101', progress: 75, color: 'bg-blue-500' },
    { name: 'Physics 201', progress: 60, color: 'bg-green-500' },
    { name: 'Chemistry 101', progress: 85, color: 'bg-yellow-500' },
    { name: 'Computer Science 101', progress: 90, color: 'bg-purple-500' },
  ],
  'last': [
    { name: 'Calculus I', progress: 88, color: 'bg-blue-500' },
    { name: 'General Physics', progress: 72, color: 'bg-green-500' },
    { name: 'Introduction to Chemistry', progress: 91, color: 'bg-yellow-500' },
    { name: 'Programming Fundamentals', progress: 85, color: 'bg-purple-500' },
  ]
};

const upcomingAssignments = [
  {
    course: 'Mathematics 101',
    title: 'Linear Algebra Assignment',
    dueDate: '2024-03-20',
    daysLeft: 3,
    status: 'pending',
    priority: 'high'
  },
  {
    course: 'Physics 201',
    title: 'Lab Report: Wave Motion',
    dueDate: '2024-03-22',
    daysLeft: 5,
    status: 'in-progress',
    priority: 'medium'
  },
  {
    course: 'Chemistry 101',
    title: 'Chemical Reactions Quiz',
    dueDate: '2024-03-25',
    daysLeft: 8,
    status: 'not-started',
    priority: 'low'
  }
];

const studyProgressData = {
  'this': [
    { labelKey: 'student.dashboard.studyProgress.attendanceRate', value: '92%', icon: Users2, trend: '+2.5%' },
    { labelKey: 'student.dashboard.studyProgress.studyHours', value: '24h', icon: Clock, trend: '+5h' },
    { labelKey: 'student.dashboard.studyProgress.completedTasks', value: '18/20', icon: CheckCircle, trend: '+3' },
    { labelKey: 'student.dashboard.studyProgress.currentGpa', value: '3.8', icon: Award, trend: '+0.2' }
  ],
  'last': [
    { labelKey: 'student.dashboard.studyProgress.attendanceRate', value: '89%', icon: Users2, trend: '+1.2%' },
    { labelKey: 'student.dashboard.studyProgress.studyHours', value: '28h', icon: Clock, trend: '+3h' },
    { labelKey: 'student.dashboard.studyProgress.completedTasks', value: '22/25', icon: CheckCircle, trend: '+2' },
    { labelKey: 'student.dashboard.studyProgress.currentGpa', value: '3.6', icon: Award, trend: '+0.1' }
  ]
};

const quickActions = [
  { 
    labelKey: 'student.dashboard.widgets.buttons.courseMaterials', 
    icon: FileText, 
    color: 'blue',
    path: '/student/materials'
  },
  { 
    labelKey: 'student.dashboard.widgets.buttons.assignments', 
    icon: ClipboardList, 
    color: 'purple',
    path: '/student/assignments'
  },
  { 
    labelKey: 'student.dashboard.widgets.buttons.schedule', 
    icon: Calendar, 
    color: 'yellow',
    path: '/student/schedule'
  },
  { 
    labelKey: 'student.dashboard.widgets.buttons.grades', 
    icon: Award, 
    color: 'green',
    path: '/student/grades'
  }
];

const upcomingDeadlines = [
  { 
    type: 'Assignment',
    course: 'Mathematics 101',
    title: 'Linear Algebra Quiz',
    deadline: '2024-03-22',
    priority: 'high'
  },
  {
    type: 'Project',
    course: 'Computer Science',
    title: 'Database Design',
    deadline: '2024-03-25',
    priority: 'medium'
  }
];

function AnimatedBar({ value, color }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    setDisplayed(0);
    const timeout = setTimeout(() => setDisplayed(value), 100);
    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${displayed}%` }}></div>
    </div>
  );
}

function AnimatedNumber({ value }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < value) {
        start += Math.ceil(value / 30);
        setDisplayed(start > value ? value : start);
        requestAnimationFrame(step);
      }
    };
    step();
  }, [value]);
  return <span>{displayed}</span>;
}

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const navigate = useNavigate();
  const [showTourChooser, setShowTourChooser] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('this');
  useEffect(() => {
    const key = 'tour:student:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:v1:state');
    
    // Only auto-start for truly new users who haven't seen or completed the tour
    if (!hasSeenTour && tourCompleted !== 'completed') {
      // Longer delay for better UX - let page fully load
      setTimeout(() => {
        startStudentTour(true);
        localStorage.setItem(key, 'shown');
      }, 800);
    }
    
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        // Small delay to ensure page is ready
        setTimeout(() => startStudentTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  // Check for pending tour launch when navigating to dashboard
  useEffect(() => {
    const launch = localStorage.getItem('tour:launch');
    if (launch === 'student-full' || launch === 'student-resume') {
      localStorage.removeItem('tour:launch');
      // Delay to ensure page is fully rendered after navigation
      setTimeout(() => startStudentTour(), 400);
    }
  }, []);
  const startStudentTour = (auto = false) => {
    const steps = [
      {
        target: '#sidebar-nav [data-tour="sidebar-link-dashboard"]',
        title: t('student.tour.sidebar.title', 'Navigation'),
        content: t('student.tour.sidebar.desc', 'Use this sidebar to navigate between different sections of your LMS.'),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '#stat-cards',
        title: t('student.tour.dashboard.cards.title', 'Your Status'),
        content: t('student.tour.dashboard.cards.desc', 'Quick overview of your academic progress and important metrics.'),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="academic-performance"]',
        title: t('student.tour.performance.title', 'Academic Performance'),
        content: t('student.tour.performance.desc', 'Track your overall academic progress and performance trends.'),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="study-stats"]',
        title: t('student.tour.studyStats.title', 'Study Progress'),
        content: t('student.tour.studyStats.desc', 'Monitor your attendance, study hours, and completed tasks.'),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '#upcoming-assignments',
        title: t('student.tour.assignments.title', 'Upcoming Assignments'),
        content: t('student.tour.assignments.desc', 'Stay on top of your deadlines and upcoming assignments.'),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '#quick-links',
        title: t('student.tour.courses.title', 'Quick Links'),
        content: t('student.tour.courses.desc', 'Access frequently used features and sections quickly.'),
        placement: 'left',
        disableBeacon: true,
      },
      {
        target: '[data-tour="deadlines"]',
        title: t('student.tour.deadlines.title', 'Important Deadlines'),
        content: t('student.tour.deadlines.desc', 'Never miss important dates and deadlines.'),
        placement: 'left',
        disableBeacon: true,
      },
      {
        target: '[data-tour="messages"]',
        title: t('student.tour.messages.title', 'Messages'),
        content: t('student.tour.messages.desc', 'Stay connected with your instructors and classmates.'),
        placement: 'left',
        disableBeacon: true,
      },
    ].filter(s => document.querySelector(s.target));
    
    startTour('student:v1', steps);
  };

  const startFullTour = () => {
    // Force-set queue to the default set of pages (no Sage AI)
    const defaultQueue = [
      '/student/courses',
      '/student/assignments', 
      '/student/grades',
      '/student/materials',
      '/student/schedule',
      '/student/messages',
      '/student/notifications',
      '/student/ecollab'
    ];
    localStorage.setItem('tour:queue', JSON.stringify(defaultQueue));
    localStorage.setItem('tour:full:sequence', JSON.stringify(defaultQueue));
    startStudentTour();
    setShowTourChooser(false);
  };
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto p-6">
        {/* Tour chooser accessible via sidebar Start Tour button; keeping the modal for demo */}
        {false && (
          <div className="flex justify-end mb-2">
            <button onClick={() => setShowTourChooser(true)} className="px-3 py-1.5 text-xs rounded-md bg-purple-600 text-white hover:bg-purple-700">
              {t('student.tour.cta.try', 'Start Tour')}
            </button>
          </div>
        )}
        {false && showTourChooser && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('student.tour.startPrompt.title', 'Choose your tour')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{t('student.tour.startPrompt.desc', 'Take the full guided tour or jump to a section.')}</p>
              <div className="space-y-2">
                <button onClick={startFullTour} className="w-full px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 text-sm">{t('student.tour.startPrompt.full', 'Full tour (recommended)')}</button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setShowTourChooser(false); startStudentTour(); }} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm">{t('navigation.dashboard', 'Dashboard')}</button>
                  <button onClick={() => { localStorage.setItem('tour:queue', JSON.stringify([])); window.location.assign('/student/courses'); }} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm">{t('student.courses.title', 'My Courses')}</button>
                  <button onClick={() => { localStorage.setItem('tour:queue', JSON.stringify([])); window.location.assign('/student/assignments'); }} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm">{t('student.assignments.title', 'Assignments')}</button>
                  <button onClick={() => { localStorage.setItem('tour:queue', JSON.stringify([])); window.location.assign('/student/schedule'); }} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm">{t('student.schedule.title', 'Schedule')}</button>
                </div>
                <button onClick={() => setShowTourChooser(false)} className="w-full px-3 py-2 rounded border dark:border-gray-600 text-sm">{t('common.cancel', 'Cancel')}</button>
              </div>
            </div>
          </div>
        )}
        {/* Top Stats */}
        <div id="stat-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" data-tour="stat-cards">
          {statsData[selectedSemester].map((stat) => (
            <div key={stat.labelKey} className={`rounded-xl shadow p-6 flex items-center gap-4 ${stat.bg} dark:bg-gray-800`}>
              <stat.icon size={36} className={stat.color} />
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {stat.value === 'N/A' ? 'N/A' : <AnimatedNumber value={parseInt(stat.value)} />}
                </div>
                <div className="text-gray-500 dark:text-gray-300 text-sm">{t(stat.labelKey)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Academic Performance */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6" data-tour="academic-performance">
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-100">{t('student.dashboard.academicPerformance.title')}</div>
                <select 
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="border rounded px-2 py-1 text-sm dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                >
                  <option value="this">{t('student.dashboard.academicPerformance.semester.this')}</option>
                  <option value="last">{t('student.dashboard.academicPerformance.semester.last')}</option>
                </select>
              </div>
              <div className="space-y-4">
                {courseProgressData[selectedSemester].map((course) => (
                  <div key={course.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{course.name}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{course.progress}%</span>
                    </div>
                    <AnimatedBar value={course.progress} color={course.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Study Progress Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-tour="study-stats">
              {studyProgressData[selectedSemester].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <item.icon size={18} className="text-blue-600" />
                    <span className={`text-xs font-medium ${
                      item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>{item.trend}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{item.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{t(item.labelKey)}</div>
                </div>
              ))}
            </div>

            {/* Upcoming Assignments */}
            <div id="upcoming-assignments" className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6" data-tour="upcoming-assignments">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">{t('student.dashboard.upcomingAssignments.title')}</span>
                </div>
                                <button 
                  onClick={() => navigate('/student/assignments')}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t('student.dashboard.upcomingAssignments.viewAll')}
                  <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {upcomingAssignments.map((a, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => navigate('/student/assignments')}
                    className="w-full text-left flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-200">{a.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{a.course} • {a.dueDate}</div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{a.daysLeft}d</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Widgets */}
          <div className="col-span-12 lg:col-span-4">
            {/* Quick Actions */}
            <div id="quick-links" className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6" data-tour="quick-links">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-blue-600" />
                <span className="font-medium text-gray-700 dark:text-gray-100">{t('student.dashboard.widgets.quickLinks', 'Quick Links')}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => navigate(action.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 hover:scale-105 ${
                      action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300' :
                      action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300' :
                      action.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300' :
                      'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-800/30 text-green-700 dark:text-green-300'
                    }`}
                  >
                    <action.icon size={16} />
                    <span className="text-sm font-medium">{t(action.labelKey)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6" data-tour="messages">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">{t('student.dashboard.widgets.messages')}</span>
                </div>
                <button 
                  onClick={() => navigate('/student/messages')}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t('common.viewAll')}
                </button>
              </div>
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => navigate('/student/messages')}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full ${m.color}`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{m.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">{m.msg} • {m.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4" data-tour="deadlines">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-blue-600" />
                <span className="font-medium text-gray-700 dark:text-gray-100">{t('student.dashboard.deadlines.title')}</span>
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{d.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">{d.type} • {d.course} • {d.deadline}</div>
                    </div>
                    <AlertCircle size={16} className="text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
