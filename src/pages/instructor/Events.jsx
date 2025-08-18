import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users2, 
  BookOpen, 
  Coffee, 
  Video, 
  GraduationCap,
  MessageSquare,
  Bell,
  ChevronDown,
  Search,
  Filter,
  Plus,
  ExternalLink,
  User,
  Building,
  Grid,
  List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTour } from '../../context/TourContext.jsx';

// Extended events data with more variety
const allEvents = [
  { 
    id: 1,
    time: '9:00 AM', 
    date: 'Today',
    title: 'CS101 Lecture', 
    desc: 'Room 204, Main Building',
    course: 'CS101 - Introduction to Programming',
    instructor: 'Dr. Emily Carter',
    duration: '90 minutes',
    type: 'lecture',
    attendees: 45,
    category: 'teaching'
  },
  { 
    id: 2,
    time: '11:00 AM', 
    date: 'Today',
    title: 'Office Hours', 
    desc: 'Faculty Office 12',
    course: 'General Office Hours',
    instructor: 'Dr. Emily Carter',
    duration: '60 minutes',
    type: 'office-hours',
    attendees: 8,
    category: 'support'
  },
  { 
    id: 3,
    time: '2:00 PM', 
    date: 'Today',
    title: 'ML305 Lab', 
    desc: 'Lab 3, Science Block',
    course: 'ML305 - Machine Learning',
    instructor: 'Dr. Emily Carter',
    duration: '120 minutes',
    type: 'lab',
    attendees: 32,
    category: 'teaching'
  },
  { 
    id: 4,
    time: '10:00 AM', 
    date: 'Tomorrow',
    title: 'Faculty Meeting', 
    desc: 'Conference Room A',
    course: 'Department Meeting',
    instructor: 'Department Head',
    duration: '60 minutes',
    type: 'meeting',
    attendees: 15,
    category: 'administrative'
  },
  { 
    id: 5,
    time: '3:30 PM', 
    date: 'Tomorrow',
    title: 'Student Consultation', 
    desc: 'Online via Zoom',
    course: 'DS201 - Data Structures',
    instructor: 'Dr. Emily Carter',
    duration: '30 minutes',
    type: 'consultation',
    attendees: 1,
    category: 'support'
  },
  { 
    id: 6,
    time: '1:00 PM', 
    date: 'Oct 15, 2025',
    title: 'Webinar: AI in Education', 
    desc: 'Virtual Event',
    course: 'Professional Development',
    instructor: 'Dr. Sarah Johnson',
    duration: '90 minutes',
    type: 'webinar',
    attendees: 200,
    category: 'development'
  },
  { 
    id: 7,
    time: '9:30 AM', 
    date: 'Oct 16, 2025',
    title: 'Research Presentation', 
    desc: 'Auditorium, Main Building',
    course: 'Computer Science Research',
    instructor: 'Dr. Emily Carter',
    duration: '45 minutes',
    type: 'presentation',
    attendees: 75,
    category: 'research'
  },
  { 
    id: 8,
    time: '4:00 PM', 
    date: 'Oct 18, 2025',
    title: 'Grading Workshop', 
    desc: 'Faculty Lounge',
    course: 'Teaching Methodology',
    instructor: 'Prof. David Kim',
    duration: '120 minutes',
    type: 'workshop',
    attendees: 20,
    category: 'development'
  },
  { 
    id: 9,
    time: '11:30 AM', 
    date: 'Oct 20, 2025',
    title: 'Student Thesis Defense', 
    desc: 'Room 301, Graduate Building',
    course: 'Graduate Program',
    instructor: 'Defense Committee',
    duration: '180 minutes',
    type: 'defense',
    attendees: 10,
    category: 'academic'
  },
  { 
    id: 10,
    time: '2:30 PM', 
    date: 'Oct 22, 2025',
    title: 'Curriculum Review', 
    desc: 'Conference Room B',
    course: 'Curriculum Committee',
    instructor: 'Committee Members',
    duration: '120 minutes',
    type: 'review',
    attendees: 12,
    category: 'administrative'
  }
];

const eventTypes = [
  { id: 'all', labelKey: 'instructor.events.filters.all', icon: Calendar },
  { id: 'lecture', labelKey: 'instructor.events.filters.lectures', icon: BookOpen },
  { id: 'lab', labelKey: 'instructor.events.filters.labs', icon: GraduationCap },
  { id: 'meeting', labelKey: 'instructor.events.filters.meetings', icon: Users2 },
  { id: 'office-hours', labelKey: 'instructor.events.filters.officeHours', icon: Coffee },
  { id: 'webinar', labelKey: 'instructor.events.filters.webinars', icon: Video },
  { id: 'other', labelKey: 'instructor.events.filters.other', icon: Bell }
];

const getEventIcon = (type) => {
  const iconMap = {
    lecture: BookOpen,
    lab: GraduationCap,
    'office-hours': Coffee,
    meeting: Users2,
    consultation: MessageSquare,
    webinar: Video,
    presentation: User,
    workshop: Building,
    defense: GraduationCap,
    review: Calendar
  };
  return iconMap[type] || Calendar;
};

const getEventColor = (type) => {
  const colorMap = {
    lecture: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    lab: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    'office-hours': 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    meeting: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
    consultation: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
    webinar: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
    presentation: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    workshop: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    defense: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20',
    review: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
  };
  return colorMap[type] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
};

export default function Events() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { startTour } = useTour();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tour functionality
  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:instructor:events:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:instructor:events:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startEventsTour();
        localStorage.setItem(key, 'shown');
      }, 100);
    }
    
    // Handle tour launches from navigation (coming from dashboard in full tour)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startEventsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startEventsTour = () => {
    const steps = [
      { 
        target: '[data-tour="events-header"]', 
        title: t('instructor.tour.events.header.title', 'Events Overview'), 
        content: t('instructor.tour.events.header.desc', 'Welcome to the Events page. Here you can view and manage all your scheduled events, lectures, and activities.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="events-search"]', 
        title: t('instructor.tour.events.search.title', 'Search Events'), 
        content: t('instructor.tour.events.search.desc', 'Quickly find specific events by typing the event title, course, or description.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="events-filter"]', 
        title: t('instructor.tour.events.filter.title', 'Filter Events'), 
        content: t('instructor.tour.events.filter.desc', 'Filter events by type: lectures, labs, meetings, office hours, and more.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="events-view-toggle"]', 
        title: t('instructor.tour.events.viewToggle.title', 'View Options'), 
        content: t('instructor.tour.events.viewToggle.desc', 'Switch between grid view (cards) and list view (table) to see events in different layouts.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="events-grid"]', 
        title: t('instructor.tour.events.grid.title', 'Events Display'), 
        content: t('instructor.tour.events.grid.desc', 'Each event card shows details like time, location, attendees, and type. Click on events to navigate to related pages.'), 
        placement: 'top', 
        disableBeacon: true 
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('instructor:events:v1', steps);
  };

  // Filter events based on search and filter
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEventClick = (event) => {
    // Navigate based on event type
    switch (event.type) {
      case 'lecture':
      case 'lab':
        navigate('/instructor/courses');
        break;
      case 'office-hours':
      case 'consultation':
        navigate('/instructor/messages');
        break;
      case 'meeting':
      case 'review':
        navigate('/instructor/calendar');
        break;
      case 'webinar':
      case 'workshop':
        navigate('/instructor/materials');
        break;
      default:
        navigate('/instructor/calendar');
    }
  };

  const selectedFilterData = eventTypes.find(type => type.id === selectedFilter);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="instructor" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6" data-tour="events-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Calendar size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('instructor.events.title')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('instructor.events.subtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/instructor/dashboard')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t('instructor.events.backToDashboard')}
              </button>
            </div>
          </div>

          {/* Search, Filter, and View Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Search */}
            <div className="relative" data-tour="events-search">
              <Search size={20} className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" style={{ [isRTL ? 'right' : 'left']: '12px' }} />
              <input
                type="text"
                placeholder={t('instructor.events.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100`}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative dropdown-container" data-tour="events-filter">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <selectedFilterData.icon size={20} className="text-green-600 dark:text-green-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {t(selectedFilterData.labelKey)}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedFilter(type.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                        selectedFilter === type.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <type.icon size={20} className="text-green-600 dark:text-green-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {t(type.labelKey)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1" data-tour="events-view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid size={16} />
                <span className="text-sm font-medium">{t('instructor.events.gridView', 'Grid')}</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List size={16} />
                <span className="text-sm font-medium">{t('instructor.events.listView', 'List')}</span>
              </button>
            </div>
          </div>

          {/* Events Display */}
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="events-grid">
              {filteredEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                const colorClasses = getEventColor(event.type);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 group relative"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${colorClasses}`}>
                        <EventIcon size={24} />
                      </div>
                      <div className={`text-${isRTL ? 'left' : 'right'}`}>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{event.date}</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{event.time}</div>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={16} />
                        <span>{event.desc}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span>{event.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users2 size={16} />
                        <span>{event.attendees} {t('instructor.events.attendees')}</span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.course}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{event.instructor}</div>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <ExternalLink size={16} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('instructor.events.table.event', 'Event')}
                      </th>
                      <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('instructor.events.table.date', 'Date & Time')}
                      </th>
                      <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('instructor.events.table.location', 'Location')}
                      </th>
                      <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('instructor.events.table.course', 'Course')}
                      </th>
                      <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('instructor.events.table.attendees', 'Attendees')}
                      </th>
                      <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('instructor.events.table.duration', 'Duration')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEvents.map((event) => {
                      const EventIcon = getEventIcon(event.type);
                      const colorClasses = getEventColor(event.type);
                      
                      return (
                        <tr
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${colorClasses}`}>
                                <EventIcon size={20} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                  {event.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {event.instructor}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="font-medium">{event.date}</div>
                            <div className="text-gray-500 dark:text-gray-400">{event.time}</div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {event.desc}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {event.course}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                              {event.attendees}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {event.duration}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('instructor.events.noResults')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('instructor.events.noResultsDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 