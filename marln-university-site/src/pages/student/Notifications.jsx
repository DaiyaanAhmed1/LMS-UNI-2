import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Info,
  Calendar,
  BookOpen,
  FileText,
  Award,
  Clock,
  ChevronRight,
  X,
  Grid3X3,
  List,
  ExternalLink,
  User,
  CalendarDays
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTour } from '../../context/TourContext.jsx';

const notifications = [
  {
    id: 1,
    type: 'assignment',
    title: 'Programming Assignment Due',
    message: 'Your Data Structures assignment is due in 2 days',
    course: 'Data Structures and Algorithms',
    time: '10 minutes ago',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'grade',
    title: 'Grade Posted',
    message: 'Your grade for Web Development Project has been posted',
    course: 'Web Development',
    time: '1 hour ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Course Schedule Update',
    message: 'The next lecture has been rescheduled to Friday',
    course: 'Database Systems',
    time: '2 hours ago',
    read: true,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'material',
    title: 'New Course Material',
    message: 'New lecture notes have been uploaded for your review',
    course: 'Introduction to Computer Science',
    time: '3 hours ago',
    read: true,
    priority: 'low'
  },
  {
    id: 5,
    type: 'exam',
    title: 'Exam Schedule',
    message: 'Final exam schedule has been published',
    course: 'All Courses',
    time: '1 day ago',
    read: true,
    priority: 'high'
  }
];

function Notifications() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const { startTour } = useTour();

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' ? true : notification.type === selectedType;
    const matchesPriority = selectedPriority === 'all' ? true : notification.priority === selectedPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'grade':
        return <Award className="h-6 w-6 text-green-500" />;
      case 'announcement':
        return <Info className="h-6 w-6 text-yellow-500" />;
      case 'material':
        return <BookOpen className="h-6 w-6 text-purple-500" />;
      case 'exam':
        return <Calendar className="h-6 w-6 text-red-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedNotification(null);
  };

  const handleTakeAction = (notification) => {
    // Generate action message based on notification type
    let message = '';
    switch (notification.type) {
      case 'assignment':
        message = `Opening assignment: ${notification.title}\nCourse: ${notification.course}\nDue: ${notification.time}`;
        break;
      case 'grade':
        message = `Viewing grade for: ${notification.title}\nCourse: ${notification.course}\nTime: ${notification.time}`;
        break;
      case 'announcement':
        message = `Reading announcement: ${notification.title}\nCourse: ${notification.course}\nTime: ${notification.time}`;
        break;
      case 'material':
        message = `Accessing course material: ${notification.title}\nCourse: ${notification.course}\nTime: ${notification.time}`;
        break;
      case 'exam':
        message = `Viewing exam details: ${notification.title}\nCourse: ${notification.course}\nTime: ${notification.time}`;
        break;
      default:
        message = `Taking action on: ${notification.title}\nCourse: ${notification.course}\nTime: ${notification.time}`;
    }
    
    setActionMessage(message);
    setShowActionPopup(true);
    closeDetailsModal();
  };

  const closeActionPopup = () => {
    setShowActionPopup(false);
    setActionMessage('');
  };

  const startNotificationsTour = () => {
    const steps = [
      { 
        target: '#notifications-search', 
        title: t('student.tour.notifications.title', 'Search Notifications'), 
        content: t('student.tour.notifications.desc', 'Search notifications by keyword, course, or message content.'),
        placement: 'bottom',
        disableBeacon: true
      },
      { 
        target: '#toggle-notifications-filters', 
        title: t('student.tour.notifications.toggleTitle', 'Filter Options'), 
        content: t('student.tour.notifications.toggleDesc', 'Open filter menu to organize notifications by type and priority.'),
        placement: 'bottom',
        disableBeacon: true
      },
      { 
        target: '[data-tour="notifications-filters"]', 
        title: t('student.tour.notifications.filtersTitle', 'Filter Controls'), 
        content: t('student.tour.notifications.filtersDesc', 'Filter by notification type and priority level.'),
        placement: 'top-start',
        disableBeacon: true
      },
      { 
        target: '[data-tour="notifications-list"]', 
        title: t('student.tour.notifications.listTitle', 'Notifications Feed'), 
        content: t('student.tour.notifications.listDesc', 'View all notifications with course, time, and priority indicators.'),
        placement: 'top-start',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:notifications:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:notifications:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:notifications:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startNotificationsTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startNotificationsTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              {t('student.notifications.title')}
            </h1>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title={t('student.notifications.viewMode.listView')}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'card'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title={t('student.notifications.viewMode.cardView')}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                id="toggle-notifications-filters"
              >
                <Filter size={20} />
                {t('student.notifications.filters')}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder={t('student.notifications.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                id="notifications-search"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour="notifications-filters">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">{t('student.notifications.types.all')}</option>
                  <option value="assignment">{t('student.notifications.types.assignment')}</option>
                  <option value="grade">{t('student.notifications.types.grade')}</option>
                  <option value="announcement">{t('student.notifications.types.announcement')}</option>
                  <option value="material">{t('student.notifications.types.material')}</option>
                  <option value="exam">{t('student.notifications.types.exam')}</option>
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">{t('student.notifications.priorities.all')}</option>
                  <option value="high">{t('student.notifications.priorities.high')}</option>
                  <option value="medium">{t('student.notifications.priorities.medium')}</option>
                  <option value="low">{t('student.notifications.priorities.low')}</option>
                </select>
              </div>
            )}
          </div>

          {/* Notifications List/Cards */}
          <div 
            className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'} 
            data-tour="notifications-list"
          >
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow duration-200 ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                } ${viewMode === 'card' ? 'h-full' : ''}`}
              >
                {viewMode === 'card' ? (
                  // Card View Layout
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                            {t(`student.notifications.priorities.${notification.priority}`)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">{notification.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{notification.course}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 line-clamp-3">{notification.message}</p>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.read ? t('student.notifications.status.read') : t('student.notifications.status.unread')}
                        </span>
                        <button 
                          onClick={() => handleViewDetails(notification)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          {t('student.notifications.actions.viewDetails')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View Layout (Original)
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{notification.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{notification.course}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                              {t(`student.notifications.priorities.${notification.priority}`)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{notification.message}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.read ? t('student.notifications.status.read') : t('student.notifications.status.unread')}
                          </span>
                          <button 
                            onClick={() => handleViewDetails(notification)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          >
                            {t('student.notifications.actions.viewDetails')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('student.notifications.empty.title')}</h3>
              <p className="text-gray-500 dark:text-gray-400">{t('student.notifications.empty.subtitle')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Details Modal */}
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDetailsModal}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {getNotificationIcon(selectedNotification.type)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedNotification.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedNotification.course}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Priority and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedNotification.priority)}`}>
                      {t(`student.notifications.priorities.${selectedNotification.priority}`)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedNotification.read 
                        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                        : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      {selectedNotification.read ? t('student.notifications.status.read') : t('student.notifications.status.unread')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {selectedNotification.time}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {t('student.notifications.details.message')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedNotification.message}
                  </p>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{t('student.notifications.details.course')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedNotification.course}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{t('student.notifications.details.type')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{selectedNotification.type}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closeDetailsModal}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    {t('common.close')}
                  </button>
                  <button 
                    onClick={() => handleTakeAction(selectedNotification)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('student.notifications.actions.takeAction')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Popup */}
      {showActionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeActionPopup}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('student.notifications.actionRequired.title')}</h3>
              <button onClick={closeActionPopup} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{actionMessage}</p>
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mt-6`}>
              <button
                onClick={closeActionPopup}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications; 