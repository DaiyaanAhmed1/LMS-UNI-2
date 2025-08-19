import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bell, Plus, Trash2, Edit, Users, Search, Filter, SortAsc, SortDesc, Clock, Target, Eye, MoreVertical, Calendar, FileText, BookOpen, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const dummyStudents = [
  { id: 1, name: 'Alice Johnson', course: 'CS101 - Intro to Computer Science' },
  { id: 2, name: 'Bob Smith', course: 'ML305 - Machine Learning' },
  { id: 3, name: 'Charlie Brown', course: 'DS220 - Data Structures' },
  { id: 4, name: 'Diana Prince', course: 'AI410 - Artificial Intelligence' },
  { id: 5, name: 'Eve Wilson', course: 'WD150 - Web Development' },
];

const dummyNotifications = [
  { id: 1, title: 'Schedule Change', message: 'The class schedule has been updated for next week. Please check your calendar for the new timings.', timestamp: '2025-06-01T10:00:00', targetAudience: 'all', type: 'schedule', priority: 'high' },
  { id: 2, title: 'Upcoming Test', message: 'There will be a test on Friday covering chapters 5-8. Please prepare accordingly and bring your calculators.', timestamp: '2025-06-02T11:00:00', targetAudience: 'all', type: 'exam', priority: 'high' },
  { id: 3, title: 'Assignment Deadline Extended', message: 'The deadline for Assignment #3 has been extended to next Monday. Take advantage of this extra time to submit quality work.', timestamp: '2025-06-03T12:00:00', targetAudience: 'all', type: 'assignment', priority: 'medium' },
  { id: 4, title: 'Office Hours Update', message: 'Office hours this week will be held virtually on Zoom. Check your email for the meeting link.', timestamp: '2025-06-04T09:00:00', targetAudience: 'all', type: 'general', priority: 'low' },
  { id: 5, title: 'Course Material Available', message: 'New course materials for Week 6 are now available in the learning management system.', timestamp: '2025-06-05T14:00:00', targetAudience: 'all', type: 'material', priority: 'medium' },
  { id: 6, title: 'Individual Feedback', message: 'Alice, I\'ve reviewed your latest assignment. Great work on the algorithm implementation!', timestamp: '2025-06-06T15:00:00', targetAudience: 1, type: 'feedback', priority: 'low' },
];

export default function Notifications() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { startTour } = useTour();
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [showModal, setShowModal] = useState(false);
  const [modalNotification, setModalNotification] = useState(null);
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:instructor:notifications:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:instructor:notifications:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startNotificationsTour();
        localStorage.setItem(key, 'shown');
      }, 100);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startNotificationsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startNotificationsTour = () => {
    const steps = [
      { target: '[data-tour="instructor-notifications-header"]', title: t('instructor.tour.notifications.header.title', 'Notifications Management'), content: t('instructor.tour.notifications.header.desc', 'Welcome to your notifications management page. Create and manage announcements for your students with different priorities and target audiences.'), placement: 'bottom', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-new"]', title: t('instructor.tour.notifications.new.title', 'Create New Notification'), content: t('instructor.tour.notifications.new.desc', 'Click this button to create a new announcement or notification for your students.'), placement: 'bottom', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-search"]', title: t('instructor.tour.notifications.search.title', 'Search Notifications'), content: t('instructor.tour.notifications.search.desc', 'Quickly find specific notifications by typing the title or message content.'), placement: 'bottom', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-filter"]', title: t('instructor.tour.notifications.filter.title', 'Filter by Type'), content: t('instructor.tour.notifications.filter.desc', 'Filter notifications by type: schedule, exam, assignment, material, feedback, or general announcements.'), placement: 'bottom', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-sort"]', title: t('instructor.tour.notifications.sort.title', 'Sort Notifications'), content: t('instructor.tour.notifications.sort.desc', 'Sort notifications by newest or oldest first to organize your announcements chronologically.'), placement: 'bottom', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-view-toggle"]', title: t('instructor.tour.notifications.viewToggle.title', 'View Options'), content: t('instructor.tour.notifications.viewToggle.desc', 'Switch between grid view (cards) and list view (table) to see your notifications in different layouts.'), placement: 'bottom', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-list"]', title: t('instructor.tour.notifications.list.title', 'Notifications List'), content: t('instructor.tour.notifications.list.desc', 'View all your notifications with priority indicators, timestamps, and target audience information. Click on any notification to edit or delete it.'), placement: 'top', disableBeacon: true },
      { target: '[data-tour="instructor-notifications-actions"]', title: t('instructor.tour.notifications.actions.title', 'Notification Actions'), content: t('instructor.tour.notifications.actions.desc', 'Edit or delete notifications using the action buttons. Each notification shows its type, priority level, and target audience.'), placement: 'left', disableBeacon: true }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:notifications:v1', steps);
  };

  const openAddNotification = () => {
    setModalNotification({ title: '', message: '', timestamp: new Date().toISOString(), targetAudience: selectedAudience });
    setShowModal(true);
  };

  const openEditNotification = (notification) => {
    setModalNotification(notification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalNotification(null);
  };

  const saveNotification = () => {
    if (modalNotification.id) {
      setNotifications(notifications.map(n => n.id === modalNotification.id ? modalNotification : n));
    } else {
      setNotifications([...notifications, { ...modalNotification, id: Date.now() }]);
    }
    setShowModal(false);
    setModalNotification(null);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'schedule': return <Calendar size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'exam': return <FileText size={20} className="text-red-600 dark:text-red-400" />;
      case 'assignment': return <BookOpen size={20} className="text-purple-600 dark:text-purple-400" />;
      case 'material': return <BookOpen size={20} className="text-green-600 dark:text-green-400" />;
      case 'feedback': return <MessageSquare size={20} className="text-orange-600 dark:text-orange-400" />;
      default: return <AlertCircle size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return t('instructor.notifications.yesterday', 'Yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTargetAudienceName = (targetAudience) => {
    if (targetAudience === 'all') {
      return t('instructor.notifications.allStudents', 'All Students');
    }
    const student = dummyStudents.find(s => s.id === targetAudience);
    return student ? student.name : targetAudience;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4" data-tour="instructor-notifications-header">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.notifications.title')}</h1>
            </div>
            <button onClick={openAddNotification} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors" data-tour="instructor-notifications-new">
              <Plus size={18} /> {t('instructor.notifications.new')}
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative" data-tour="instructor-notifications-search">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={18} />
              <input 
                type="text" 
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('instructor.notifications.searchPlaceholder', 'Search notifications...')} 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <select 
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              data-tour="instructor-notifications-filter"
            >
              <option value="all">{t('instructor.notifications.filters.all', 'All Types')}</option>
              <option value="schedule">{t('instructor.notifications.filters.schedule', 'Schedule')}</option>
              <option value="exam">{t('instructor.notifications.filters.exam', 'Exam')}</option>
              <option value="assignment">{t('instructor.notifications.filters.assignment', 'Assignment')}</option>
              <option value="material">{t('instructor.notifications.filters.material', 'Material')}</option>
              <option value="feedback">{t('instructor.notifications.filters.feedback', 'Feedback')}</option>
              <option value="general">{t('instructor.notifications.filters.general', 'General')}</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100 transition-colors"
              data-tour="instructor-notifications-sort"
            >
              {sortOrder === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />}
              {t(`instructor.notifications.sort.${sortOrder}`, sortOrder === 'newest' ? 'Newest First' : 'Oldest First')}
            </button>
            <div className="flex items-center gap-2" data-tour="instructor-notifications-view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <div className="space-y-0.5 w-4 h-4">
                  <div className="bg-current rounded-sm h-0.5"></div>
                  <div className="bg-current rounded-sm h-0.5"></div>
                  <div className="bg-current rounded-sm h-0.5"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="instructor-notifications-list">
                {sortedNotifications.map(notification => (
                  <div key={notification.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                                               <div className="flex items-center gap-3">
                         {getTypeIcon(notification.type)}
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{notification.title}</h3>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                              {t(`instructor.notifications.priority.${notification.priority}`, notification.priority)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1" data-tour="instructor-notifications-actions">
                          <button onClick={() => openEditNotification(notification)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deleteNotification(notification.id)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{notification.message}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target size={12} />
                          <span>{getTargetAudienceName(notification.targetAudience)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden" data-tour="instructor-notifications-list">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('instructor.notifications.table.notification', 'Notification')}
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('instructor.notifications.table.type', 'Type')}
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('instructor.notifications.table.priority', 'Priority')}
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('instructor.notifications.table.audience', 'Audience')}
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('instructor.notifications.table.date', 'Date')}
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('instructor.notifications.table.actions', 'Actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedNotifications.map(notification => (
                        <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{notification.message}</div>
                            </div>
                          </td>
                                                     <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               {getTypeIcon(notification.type)}
                               <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">{notification.type}</span>
                             </div>
                           </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                              {t(`instructor.notifications.priority.${notification.priority}`, notification.priority)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {getTargetAudienceName(notification.targetAudience)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(notification.timestamp)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEditNotification(notification)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => deleteNotification(notification.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {sortedNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t('instructor.notifications.noNotifications', 'No notifications found')}</p>
              </div>
            )}
          </div>
        </div>
        {showModal && modalNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
              <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeModal}><Trash2 size={28} /></button>
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-6">{modalNotification.id ? t('instructor.notifications.editTitle') : t('instructor.notifications.newTitle')}</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('instructor.notifications.fields.title')}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={modalNotification.title} 
                    onChange={e => setModalNotification({ ...modalNotification, title: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('instructor.notifications.fields.message')}</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows={4} 
                    value={modalNotification.message} 
                    onChange={e => setModalNotification({ ...modalNotification, message: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('instructor.notifications.fields.type', 'Type')}</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={modalNotification.type || 'general'}
                      onChange={e => setModalNotification({ ...modalNotification, type: e.target.value })}
                    >
                      <option value="general">{t('instructor.notifications.filters.general', 'General')}</option>
                      <option value="schedule">{t('instructor.notifications.filters.schedule', 'Schedule')}</option>
                      <option value="exam">{t('instructor.notifications.filters.exam', 'Exam')}</option>
                      <option value="assignment">{t('instructor.notifications.filters.assignment', 'Assignment')}</option>
                      <option value="material">{t('instructor.notifications.filters.material', 'Material')}</option>
                      <option value="feedback">{t('instructor.notifications.filters.feedback', 'Feedback')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('instructor.notifications.fields.priority', 'Priority')}</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={modalNotification.priority || 'medium'}
                      onChange={e => setModalNotification({ ...modalNotification, priority: e.target.value })}
                    >
                      <option value="low">{t('instructor.notifications.priority.low', 'Low')}</option>
                      <option value="medium">{t('instructor.notifications.priority.medium', 'Medium')}</option>
                      <option value="high">{t('instructor.notifications.priority.high', 'High')}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('instructor.notifications.targetAudience')}</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={modalNotification.targetAudience} 
                    onChange={e => setModalNotification({ ...modalNotification, targetAudience: e.target.value })}
                  >
                    <option value="all">{t('instructor.notifications.allStudents')}</option>
                    {dummyStudents.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors" 
                  onClick={saveNotification}
                >
                  {modalNotification.id ? t('instructor.notifications.actions.save') : t('instructor.notifications.actions.post')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 