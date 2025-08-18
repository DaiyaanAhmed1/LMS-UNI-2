import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Users2, ClipboardList, Calendar, BarChart2, MessageCircle, FileText, CheckCircle, TrendingUp, Bell, ArrowUpRight, ChevronDown, ExternalLink, Clock, MapPin, X, HelpCircle, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';

const stats = [
  { labelKey: 'instructor.dashboard.stats.myCourses', value: '6', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { labelKey: 'instructor.dashboard.stats.studentsTaught', value: '180', icon: Users2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  { labelKey: 'instructor.dashboard.stats.assignmentsToGrade', value: '12', icon: ClipboardList, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { labelKey: 'instructor.dashboard.stats.upcomingClasses', value: '3', icon: Calendar, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
];

const messages = [
  { 
    name: 'Sarah Lee', 
    time: '10:15 AM', 
    msg: 'Could you clarify the project requirements?', 
    avatar: '', 
    color: 'bg-blue-200 dark:bg-blue-800',
    status: 'unread',
    course: 'CS101 - Introduction to Programming'
  },
  { 
    name: 'David Kim', 
    time: 'Yesterday', 
    msg: 'I will be absent next class.', 
    avatar: '', 
    color: 'bg-green-200 dark:bg-green-800',
    status: 'read',
    course: 'ML305 - Machine Learning'
  },
  { 
    name: 'Eva Green', 
    time: '2 days ago', 
    msg: 'Thank you for the feedback!', 
    avatar: '', 
    color: 'bg-yellow-200 dark:bg-yellow-800',
    status: 'read',
    course: 'DS201 - Data Structures'
  },
];

const activities = [
  { icon: CheckCircle, desc: 'Graded Assignment 2 for CS101.', time: '5 min ago', color: 'text-blue-600 dark:text-blue-400' },
  { icon: FileText, desc: 'Uploaded new lecture notes for ML305.', time: '30 min ago', color: 'text-green-600 dark:text-green-400' },
  { icon: BarChart2, desc: 'Reviewed attendance for Data Structures.', time: '1 hr ago', color: 'text-yellow-600 dark:text-yellow-400' },
  { icon: Users2, desc: 'Held office hours for students.', time: '3 hr ago', color: 'text-purple-600 dark:text-purple-400' },
];

const noticeBoard = [
  { title: 'Midterm Exam Schedule', desc: 'Midterms will be held next week. Check the calendar.', date: 'Oct 10, 2025', by: 'Academic Office', views: 210 },
  { title: 'Faculty Meeting', desc: 'Monthly faculty meeting this Friday at 2 PM.', date: 'Oct 8, 2025', by: 'Dean Office', views: 98 },
  { title: 'Course Material Update', desc: 'New resources added to the library.', date: 'Oct 5, 2025', by: 'Library', views: 120 },
];

// Enhanced data with different time ranges - Fixed for accurate visualization
const coursePerformanceData = {
  last7: [65, 72, 78, 85, 82, 88, 92],
  lastSemester: [68, 72, 75, 80, 83, 87, 90, 88, 92, 89, 91, 94]
};

const studentEngagementData = {
  last7: [45, 52, 48, 65, 58, 62, 68],
  lastSemester: [50, 55, 48, 62, 68, 65, 72, 70, 75, 73, 78, 82]
};

const quickAccess = [
  { 
    label: 'Gradebook', 
    labelKey: 'instructor.dashboard.quickAccess.gradebook',
    icon: BarChart2, 
    color: 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50', 
    iconColor: 'text-blue-700 dark:text-blue-400',
    href: '/instructor/grades',
    description: 'instructor.dashboard.quickAccess.gradebookDesc'
  },
  { 
    label: 'Materials', 
    labelKey: 'instructor.dashboard.quickAccess.materials',
    icon: FileText, 
    color: 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50', 
    iconColor: 'text-green-700 dark:text-green-400',
    href: '/instructor/materials',
    description: 'instructor.dashboard.quickAccess.materialsDesc'
  },
  { 
    label: 'Attendance', 
    labelKey: 'instructor.dashboard.quickAccess.attendance',
    icon: ClipboardList, 
    color: 'bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50', 
    iconColor: 'text-yellow-700 dark:text-yellow-400',
    href: '/instructor/students',
    description: 'instructor.dashboard.quickAccess.attendanceDesc'
  },
  { 
    label: 'Messages', 
    labelKey: 'instructor.dashboard.quickAccess.messages',
    icon: MessageCircle, 
    color: 'bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50', 
    iconColor: 'text-purple-700 dark:text-purple-400',
    href: '/instructor/messages',
    description: 'instructor.dashboard.quickAccess.messagesDesc'
  },
  { 
    label: 'Courses', 
    labelKey: 'instructor.dashboard.quickAccess.courses',
    icon: BookOpen, 
    color: 'bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50', 
    iconColor: 'text-indigo-700 dark:text-indigo-400',
    href: '/instructor/courses',
    description: 'instructor.dashboard.quickAccess.coursesDesc'
  },
  { 
    label: 'Schedule', 
    labelKey: 'instructor.dashboard.quickAccess.schedule',
    icon: Calendar, 
    color: 'bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50', 
    iconColor: 'text-pink-700 dark:text-pink-400',
    href: '/instructor/calendar',
    description: 'instructor.dashboard.quickAccess.scheduleDesc'
  }
];

const events = [
  { 
    time: '9:00 AM', 
    title: 'CS101 Lecture', 
    desc: 'Room 204, Main Building',
    course: 'CS101 - Introduction to Programming',
    instructor: 'Dr. Sarah Johnson',
    duration: '90 minutes',
    type: 'lecture',
    attendees: 45
  },
  { 
    time: '11:00 AM', 
    title: 'Office Hours', 
    desc: 'Faculty Office 12',
    course: 'General Office Hours',
    instructor: 'Dr. Sarah Johnson',
    duration: '60 minutes',
    type: 'office-hours',
    attendees: 8
  },
  { 
    time: '2:00 PM', 
    title: 'ML305 Lab', 
    desc: 'Lab 3, Science Block',
    course: 'ML305 - Machine Learning',
    instructor: 'Dr. Sarah Johnson',
    duration: '120 minutes',
    type: 'lab',
    attendees: 32
  },
];

export default function InstructorDashboard() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { startTour } = useTour();
  const navigate = useNavigate();

  // Animated Number Component
  const AnimatedNumber = ({ value, duration = 2000, className = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (!isVisible) return;

      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = 0;
      const endValue = typeof value === 'number' ? value : parseInt(value) || 0;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }, [isVisible, value, duration]);

    return (
      <span 
        ref={ref} 
        className={`${className} ${isAnimating ? 'animate-count-up' : ''}`}
        style={{
          display: 'inline-block',
          transform: isAnimating ? 'translateY(0)' : 'translateY(0)',
          opacity: isAnimating ? 1 : 1
        }}
      >
        {displayValue}
      </span>
    );
  };
  const [coursePerformanceRange, setCoursePerformanceRange] = useState('last7');
  const [studentEngagementRange, setStudentEngagementRange] = useState('last7');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showEngagementDropdown, setShowEngagementDropdown] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNoticePopup, setShowNoticePopup] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showActivityPopup, setShowActivityPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowCourseDropdown(false);
        setShowEngagementDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-full' || launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startInstructorTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  useEffect(() => {
    const launch = localStorage.getItem('tour:launch');
    if (launch === 'instructor-full' || launch === 'instructor-resume') {
      localStorage.removeItem('tour:launch');
      setTimeout(() => startInstructorTour(), 400);
    }
  }, []);

  const startInstructorTour = () => {
    const steps = [
      {
        target: '#sidebar-nav [data-tour="sidebar-link-dashboard"]',
        title: t('instructor.tour.sidebar.title', 'Navigation'),
        content: t('instructor.tour.sidebar.desc', 'Use the sidebar to navigate between instructor features.'),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '#instructor-stat-cards',
        title: t('instructor.tour.dashboard.stats.title', 'Your Teaching Overview'),
        content: t('instructor.tour.dashboard.stats.desc', 'Quick stats about your courses, students, grading and upcoming classes.'),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="instructor-messages"]',
        title: t('instructor.tour.dashboard.messages.title', 'Student Messages'),
        content: t('instructor.tour.dashboard.messages.desc', 'Review and respond to the latest messages from your students.'),
        placement: 'left',
        disableBeacon: true,
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:v1', steps);
  };

  // Calculate average performance
  const getAveragePerformance = (data) => {
    return Math.round(data.reduce((sum, val) => sum + val, 0) / data.length);
  };

  // Generate SVG path for line chart
  const generateLinePath = (data, width, height, offsetX = 0) => {
    if (data.length === 1) {
      const y = height - (data[0] / 100) * height;
      return `0,${y}`;
    }
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width + offsetX;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    }).join(' ');
    return points;
  };

  // Generate bars for bar chart
  const generateBars = (data, width, height, offsetX = 0) => {
    return data.map((value, index) => {
      const barWidth = (width / data.length) - 6;
      const x = offsetX + (index * width / data.length) + 3;
      const barHeight = (value / 100) * height;
      const y = height - barHeight;
      return { x, y, width: barWidth, height: barHeight, value };
    });
  };

  const currentCourseData = coursePerformanceData[coursePerformanceRange];
  const currentEngagementData = studentEngagementData[studentEngagementRange];

  const handleQuickAccessClick = (href) => {
    navigate(href);
  };

  const handleStatClick = (stat) => {
    // Navigate to relevant pages based on stat type
    switch (stat.labelKey) {
      case 'instructor.dashboard.stats.myCourses':
        navigate('/instructor/courses');
        break;
      case 'instructor.dashboard.stats.studentsTaught':
        navigate('/instructor/students');
        break;
      case 'instructor.dashboard.stats.assignmentsToGrade':
        navigate('/instructor/assignments');
        break;
      case 'instructor.dashboard.stats.upcomingClasses':
        navigate('/instructor/calendar');
        break;
      default:
        // Navigate to dashboard for any undefined stats
        navigate('/instructor/dashboard');
    }
  };

  const handleMessageClick = (messageIndex) => {
    navigate('/instructor/messages');
  };

  const handleEventClick = (eventIndex) => {
    setSelectedEvent(events[eventIndex]);
    setShowEventPopup(true);
  };

  const closeEventPopup = () => {
    setShowEventPopup(false);
    setSelectedEvent(null);
  };

  const handleGoToCalendar = () => {
    closeEventPopup();
    navigate('/instructor/calendar');
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowNoticePopup(true);
  };

  const closeNoticePopup = () => {
    setShowNoticePopup(false);
    setSelectedNotice(null);
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowActivityPopup(true);
  };

  const closeActivityPopup = () => {
    setShowActivityPopup(false);
    setSelectedActivity(null);
  };

  const getUnreadCount = () => {
    return messages.filter(msg => msg.status === 'unread').length;
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'lab': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'office-hours': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'lecture': return t('instructor.dashboard.events.types.lecture', 'Lecture');
      case 'lab': return t('instructor.dashboard.events.types.lab', 'Lab');
      case 'office-hours': return t('instructor.dashboard.events.types.officeHours', 'Office Hours');
      default: return t('instructor.dashboard.events.types.other', 'Other');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Stats */}
            <div id="instructor-stat-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="instructor-stats">
              {stats.map((stat) => (
                <button
                  key={stat.labelKey}
                  onClick={() => handleStatClick(stat)}
                  className={`rounded-xl shadow-lg p-6 flex items-center gap-4 ${stat.bg} dark:shadow-gray-900/20 transition-all duration-200 hover:shadow-xl dark:hover:shadow-gray-900/30 hover:scale-105 active:scale-95 cursor-pointer group`}
                >
                  <div className={`p-2 rounded-lg bg-white/20 dark:bg-white/10 group-hover:bg-white/30 transition-colors duration-200`}>
                    <stat.icon size={32} className={stat.color} />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      <AnimatedNumber 
                        value={stat.value} 
                        duration={2500}
                        className="inline-block"
                      />
                    </div>
                    <div className="text-gray-500 dark:text-gray-300 text-sm font-medium">{t(stat.labelKey)}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Performance (Enhanced Line Chart) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:shadow-gray-900/20 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/30 border border-gray-100 dark:border-gray-700" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{t('instructor.dashboard.charts.coursePerformance')}</h3>
                    <button 
                      onClick={() => navigate('/instructor/insights')}
                      className="relative group p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                      title={t('instructor.dashboard.charts.insights.viewDetailed')}
                    >
                      <BarChart2 size={14} className="text-blue-600 dark:text-blue-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {t('instructor.dashboard.charts.insights.clickForDetails')}
                      </div>
                    </button>
                  </div>
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                      className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <span className="font-medium">{t(`instructor.dashboard.charts.range.${coursePerformanceRange}`)}</span>
                      <ChevronDown size={12} className={`transition-transform duration-200 ${showCourseDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showCourseDropdown && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg dark:shadow-gray-900/50 z-10 min-w-[120px] animate-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            setCoursePerformanceRange('last7');
                            setShowCourseDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-t-md ${
                            coursePerformanceRange === 'last7' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {t('instructor.dashboard.charts.range.last7')}
                        </button>
                        <button
                          onClick={() => {
                            setCoursePerformanceRange('lastSemester');
                            setShowCourseDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-b-md ${
                            coursePerformanceRange === 'lastSemester' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {t('instructor.dashboard.charts.range.lastSemester')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Line Chart */}
                <div className="relative">
                  <svg viewBox="0 0 600 320" className="w-full h-64">
                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map((tick, index) => (
                      <g key={tick}>
                        <line
                          x1="70"
                          y1={260 - (tick / 100) * 200}
                          x2="530"
                          y2={260 - (tick / 100) * 200}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          className="dark:stroke-gray-600"
                        />
                        <text
                          x={isRTL ? "540" : "55"}
                          y={260 - (tick / 100) * 200 + 5}
                          fontSize="13"
                          fill="#6b7280"
                          className="dark:fill-gray-300"
                          textAnchor={isRTL ? "end" : "start"}
                        >
                          {tick}%
                        </text>
                      </g>
                    ))}
                    
                    {/* Axes */}
                    <line x1="70" y1="60" x2="70" y2="260" stroke="#9ca3af" strokeWidth="2" className="dark:stroke-gray-400" />
                    <line x1="70" y1="260" x2="530" y2="260" stroke="#9ca3af" strokeWidth="2" className="dark:stroke-gray-400" />
                    
                    {/* Line chart */}
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      points={currentCourseData.map((value, index) => {
                        const x = 70 + (index / (currentCourseData.length - 1)) * 460;
                        const y = 260 - (value / 100) * 200;
                        return `${x},${y}`;
                      }).join(' ')}
                      className="drop-shadow-sm"
                    />
                    
                    {/* Data points */}
                    {currentCourseData.map((value, index) => {
                      const x = 70 + (index / (currentCourseData.length - 1)) * 460;
                      const y = 260 - (value / 100) * 200;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#3b82f6"
                          stroke="#ffffff"
                          strokeWidth="3"
                          className="dark:stroke-gray-800 drop-shadow-sm"
                        />
                      );
                    })}
                    
                    {/* X-axis labels */}
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => (
                      <text
                        key={index}
                        x={70 + (index / 6) * 460}
                        y="285"
                        fontSize="13"
                        fill="#6b7280"
                        className="dark:fill-gray-300"
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {label}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Student Engagement (Enhanced Bar Chart) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:shadow-gray-900/20 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/30 border border-gray-100 dark:border-gray-700" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{t('instructor.dashboard.charts.studentEngagement')}</h3>
                    <button 
                      onClick={() => navigate('/instructor/insights')}
                      className="relative group p-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-all duration-200 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700"
                      title={t('instructor.dashboard.charts.insights.viewDetailed')}
                    >
                      <BarChart2 size={14} className="text-green-600 dark:text-green-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {t('instructor.dashboard.charts.insights.clickForDetails')}
                      </div>
                    </button>
                  </div>
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setShowEngagementDropdown(!showEngagementDropdown)}
                      className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <span className="font-medium">{t(`instructor.dashboard.charts.range.${studentEngagementRange}`)}</span>
                      <ChevronDown size={12} className={`transition-transform duration-200 ${showEngagementDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showEngagementDropdown && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg dark:shadow-gray-900/50 z-10 min-w-[120px] animate-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            setStudentEngagementRange('last7');
                            setShowEngagementDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-t-md ${
                            studentEngagementRange === 'last7' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {t('instructor.dashboard.charts.range.last7')}
                        </button>
                        <button
                          onClick={() => {
                            setStudentEngagementRange('lastSemester');
                            setShowEngagementDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-b-md ${
                            studentEngagementRange === 'lastSemester' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {t('instructor.dashboard.charts.range.lastSemester')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Bar Chart */}
                <div className="relative">
                  <svg viewBox="0 0 600 320" className="w-full h-64">
                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map((tick, index) => (
                      <g key={tick}>
                        <line
                          x1="70"
                          y1={260 - (tick / 100) * 200}
                          x2="530"
                          y2={260 - (tick / 100) * 200}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          className="dark:stroke-gray-600"
                        />
                        <text
                          x={isRTL ? "540" : "55"}
                          y={260 - (tick / 100) * 200 + 5}
                          fontSize="13"
                          fill="#6b7280"
                          className="dark:fill-gray-300"
                          textAnchor={isRTL ? "end" : "start"}
                        >
                          {tick}%
                        </text>
                      </g>
                    ))}
                    
                    {/* Axes */}
                    <line x1="70" y1="60" x2="70" y2="260" stroke="#9ca3af" strokeWidth="2" className="dark:stroke-gray-400" />
                    <line x1="70" y1="260" x2="530" y2="260" stroke="#9ca3af" strokeWidth="2" className="dark:stroke-gray-400" />
                    
                    {/* Bars */}
                    {currentEngagementData.map((value, index) => {
                      const barWidth = 460 / currentEngagementData.length - 12;
                      const x = 70 + (index * 460 / currentEngagementData.length) + 6;
                      const barHeight = (value / 100) * 200;
                      const y = 260 - barHeight;
                      
                      return (
                        <rect
                          key={index}
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill="#22c55e"
                          rx="4"
                          className="transition-all duration-300 hover:fill-green-600 drop-shadow-sm"
                        />
                      );
                    })}
                    
                    {/* X-axis labels */}
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => (
                      <text
                        key={index}
                        x={70 + (index / 6) * 460}
                        y="285"
                        fontSize="13"
                        fill="#6b7280"
                        className="dark:fill-gray-300"
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {label}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Middle Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Compact Messages Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col dark:shadow-gray-900/20 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/30" data-tour="instructor-messages">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{t('instructor.dashboard.sections.messages')}</h3>
                  </div>
                                      {getUnreadCount() > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {getUnreadCount()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleMessageClick(i)}
                      className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        msg.status === 'unread' 
                          ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {/* Unread indicator */}
                      {msg.status === 'unread' && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.color} shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                          <Users2 size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-gray-800 dark:text-gray-100 text-xs truncate">{msg.name}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{msg.time}</div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">{msg.course}</div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{msg.msg}</div>
                        </div>
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
                
                {/* View All Messages Button */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate('/instructor/messages')}
                    className="w-full py-1.5 px-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    {t('instructor.dashboard.messages.viewAll', 'View All Messages')}
                  </button>
                </div>
              </div>
              
              {/* Compact Quick Access */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col dark:shadow-gray-900/20 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/30" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="font-semibold text-gray-700 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <ArrowUpRight size={16}/> 
                  {t('instructor.dashboard.sections.quickAccess')}
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {quickAccess.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAccessClick(item.href)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm ${item.color} transition-all duration-200 hover:scale-105 group relative overflow-hidden min-h-[80px]`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
                      {/* Icon */}
                      <item.icon size={24} className={`mb-2 ${item.iconColor} transition-transform duration-200 group-hover:scale-110`} />
                      
                      {/* Label */}
                      <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm text-center leading-tight">
                        {t(item.labelKey, item.label)}
                      </span>
                      
                      {/* External link indicator */}
                      <ExternalLink size={12} className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {t(item.description, item.label)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Compact Upcoming Events */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col dark:shadow-gray-900/20 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{t('instructor.dashboard.sections.upcomingEvents')}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {events.length} {t('instructor.dashboard.events.count', 'events')}
                    </div>
                    <button 
                      onClick={() => navigate('/instructor/events')}
                      className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      title={t('instructor.dashboard.events.viewAll', 'View All Events')}
                    >
                      <Calendar size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {events.map((e, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleEventClick(i)}
                      className="group relative p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                          <Calendar size={16} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-gray-800 dark:text-gray-100 text-xs truncate">{e.title}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{e.time}</div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                            <MapPin size={10} />
                            {e.desc}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(e.type)}`}>
                              {getEventTypeLabel(e.type)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {e.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
                
                {/* View All Events Button */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate('/instructor/events')}
                    className="w-full py-1.5 px-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    {t('instructor.dashboard.events.viewAll', 'View All Events')}
                  </button>
                </div>
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 dark:shadow-gray-900/20 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/30" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="font-semibold text-gray-700 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Bell size={16}/> 
                {t('instructor.dashboard.sections.noticeBoard')}
                <button 
                  onClick={() => navigate('/instructor/notifications')}
                  className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1`}
                >
                  <Bell size={12} />
                  {t('instructor.dashboard.notifications.viewAll', 'Notifications')}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className={`py-2 px-2 ${isRTL ? 'text-right' : 'text-left'} font-medium text-xs`}>{t('instructor.dashboard.table.title')}</th>
                      <th className={`py-2 px-2 ${isRTL ? 'text-right' : 'text-left'} font-medium text-xs`}>{t('instructor.dashboard.table.by')}</th>
                      <th className={`py-2 px-2 ${isRTL ? 'text-right' : 'text-left'} font-medium text-xs`}>{t('instructor.dashboard.table.date')}</th>
                      <th className={`py-2 px-2 ${isRTL ? 'text-left' : 'text-right'} font-medium text-xs`}>{t('instructor.dashboard.table.views')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noticeBoard.slice(0, 3).map((n, i) => (
                      <tr 
                        key={i} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => handleNoticeClick(n)}
                      >
                        <td className={`py-2 px-2 font-semibold text-blue-700 dark:text-blue-400 text-xs hover:text-blue-800 dark:hover:text-blue-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {n.title}
                        </td>
                        <td className={`py-2 px-2 text-gray-600 dark:text-gray-300 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{n.by}</td>
                        <td className={`py-2 px-2 text-gray-600 dark:text-gray-300 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{n.date}</td>
                        <td className={`py-2 px-2 text-gray-600 dark:text-gray-300 text-xs ${isRTL ? 'text-left' : 'text-right'}`}>{n.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 dark:shadow-gray-900/20 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/30" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="font-semibold text-gray-700 dark:text-gray-100 mb-3 flex items-center gap-2">
                <TrendingUp size={16}/> 
                {t('instructor.dashboard.sections.recentActivity')}
                <button 
                  onClick={() => navigate('/instructor/events')}
                  className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1`}
                >
                  <Calendar size={12} />
                  {t('instructor.dashboard.events.viewAll', 'Events')}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {activities.slice(0, 4).map((a, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => handleActivityClick(a)}
                  >
                    <a.icon size={18} className={a.color} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 text-xs">{a.desc}</div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced CSS Animations for Charts and Numbers */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes drawLine {
            to { stroke-dashoffset: 0; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes countUp {
            from { 
              transform: translateY(10px);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes bounceIn {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-count-up {
            animation: countUp 0.6s ease-out forwards;
          }
          
          .animate-bounce-in {
            animation: bounceIn 0.8s ease-out forwards;
          }
        `
      }} />

             {/* Enhanced Upcoming Event Popup */}
       {showEventPopup && selectedEvent && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full max-h-full overflow-y-auto dark:shadow-gray-900/50" dir={isRTL ? 'rtl' : 'ltr'}>
             {/* Header */}
             <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                   <Calendar size={20} className="text-green-600 dark:text-green-400" />
                 </div>
                 <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">{selectedEvent.title}</h3>
               </div>
               <button 
                 onClick={closeEventPopup} 
                 className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
               >
                 <X size={24} />
               </button>
             </div>
             
             {/* Event Type Badge */}
             <div className="mb-4">
               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                 {getEventTypeLabel(selectedEvent.type)}
               </span>
             </div>
             
             {/* Event Details */}
             <div className="space-y-4">
               {/* Time */}
               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                 <Clock size={18} className="text-blue-500 dark:text-blue-400" />
                 <div>
                   <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedEvent.time}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.duration}</div>
                 </div>
               </div>
               
               {/* Location */}
               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                 <MapPin size={18} className="text-red-500 dark:text-red-400" />
                 <div>
                   <div className="font-semibold text-gray-800 dark:text-gray-100">{t('instructor.dashboard.events.location', 'Location')}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.desc}</div>
                 </div>
               </div>
               
               {/* Course */}
               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                 <BookOpen size={18} className="text-purple-500 dark:text-purple-400" />
                 <div>
                   <div className="font-semibold text-gray-800 dark:text-gray-100">{t('instructor.dashboard.events.course', 'Course')}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.course}</div>
                 </div>
               </div>
               
               {/* Instructor */}
               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                 <Users2 size={18} className="text-green-500 dark:text-green-400" />
                 <div>
                   <div className="font-semibold text-gray-800 dark:text-gray-100">{t('instructor.dashboard.events.instructor', 'Instructor')}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.instructor}</div>
                 </div>
               </div>
               
               {/* Attendees */}
               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                 <div className="w-[18px] h-[18px] rounded-full bg-orange-500 dark:bg-orange-400 flex items-center justify-center">
                   <span className="text-white text-xs font-bold">{selectedEvent.attendees}</span>
                 </div>
                 <div>
                   <div className="font-semibold text-gray-800 dark:text-gray-100">{t('instructor.dashboard.events.attendees', 'Attendees')}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.attendees} {t('instructor.dashboard.events.students', 'students')}</div>
                 </div>
               </div>
             </div>
             
             {/* Action Buttons */}
             <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
               <button
                 onClick={closeEventPopup}
                 className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
               >
                 {t('instructor.dashboard.events.close', 'Close')}
               </button>
               <button
                 onClick={handleGoToCalendar}
                 className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
               >
                 {t('instructor.dashboard.events.goToCalendar', 'Go to Calendar')}
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Notice Board Popup */}
       {showNoticePopup && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto dark:shadow-gray-900/50" dir={isRTL ? 'rtl' : 'ltr'}>
             {/* Header */}
             <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                   <Bell size={20} className="text-blue-600 dark:text-blue-400" />
                 </div>
                 <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">{t('instructor.dashboard.sections.noticeBoard')}</h3>
               </div>
               <button 
                 onClick={closeNoticePopup}
                 className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               >
                 <X size={16} className="text-gray-600 dark:text-gray-300" />
               </button>
             </div>
             
             {/* Notice Details */}
             {selectedNotice && (
               <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                 <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">{selectedNotice.title}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                   <div>
                     <span className="text-gray-500 dark:text-gray-400">By:</span>
                     <span className="ml-2 font-medium text-gray-800 dark:text-gray-100">{selectedNotice.by}</span>
                   </div>
                   <div>
                     <span className="text-gray-500 dark:text-gray-400">Date:</span>
                     <span className="ml-2 font-medium text-gray-800 dark:text-gray-100">{selectedNotice.date}</span>
                   </div>
                   <div>
                     <span className="text-gray-500 dark:text-gray-400">Views:</span>
                     <span className="ml-2 font-medium text-gray-800 dark:text-gray-100">{selectedNotice.views}</span>
                   </div>
                 </div>
               </div>
             )}
             
             {/* All Notices Table */}
             <div className="overflow-x-auto">
               <table className="min-w-full text-sm">
                 <thead>
                   <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                     <th className="py-3 px-3 text-left font-medium">{t('instructor.dashboard.table.title')}</th>
                     <th className="py-3 px-3 text-left font-medium">{t('instructor.dashboard.table.by')}</th>
                     <th className="py-3 px-3 text-left font-medium">{t('instructor.dashboard.table.date')}</th>
                     <th className="py-3 px-3 text-right font-medium">{t('instructor.dashboard.table.views')}</th>
                   </tr>
                 </thead>
                 <tbody>
                   {noticeBoard.map((n, i) => (
                     <tr 
                       key={i} 
                       className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                       onClick={() => setSelectedNotice(n)}
                     >
                       <td className="py-3 px-3 font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                         {n.title}
                       </td>
                       <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{n.by}</td>
                       <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{n.date}</td>
                       <td className="py-3 px-3 text-right text-gray-600 dark:text-gray-300">{n.views}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             
             {/* Action Button */}
             <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
               <button
                 onClick={closeNoticePopup}
                 className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Recent Activity Popup */}
       {showActivityPopup && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto dark:shadow-gray-900/50" dir={isRTL ? 'rtl' : 'ltr'}>
             {/* Header */}
             <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                   <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                 </div>
                 <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">{t('instructor.dashboard.sections.recentActivity')}</h3>
               </div>
               <button 
                 onClick={closeActivityPopup}
                 className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               >
                 <X size={16} className="text-gray-600 dark:text-gray-300" />
               </button>
             </div>
             
             {/* Activity Details */}
             {selectedActivity && (
               <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                 <div className="flex items-center gap-3 mb-3">
                   <selectedActivity.icon size={24} className={selectedActivity.color} />
                   <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{selectedActivity.desc}</h4>
                 </div>
                 <div className="text-sm text-gray-600 dark:text-gray-400">
                   <span className="text-gray-500 dark:text-gray-400">Time:</span>
                   <span className="ml-2 font-medium text-gray-800 dark:text-gray-100">{selectedActivity.time}</span>
                 </div>
               </div>
             )}
             
             {/* All Activities List */}
             <div className="space-y-3">
               {activities.map((a, i) => (
                 <div 
                   key={i} 
                   className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                   onClick={() => setSelectedActivity(a)}
                 >
                   <a.icon size={24} className={a.color} />
                   <div className="flex-1">
                     <div className="font-semibold text-gray-800 dark:text-gray-100">{a.desc}</div>
                   </div>
                   <div className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">{a.time}</div>
                 </div>
               ))}
             </div>
             
             {/* Action Button */}
             <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
               <button
                 onClick={closeActivityPopup}
                 className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}