import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Calendar, Clock, BookOpen, Users, MapPin, ChevronLeft, ChevronRight, PlusCircle, Video, Grid, GraduationCap, Clock3, CalendarCheck, Bell, TrendingUp, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTour } from '../../context/TourContext.jsx';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const classColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100'];

const scheduleData = [
  { id: 1, course: 'Cyber Security', instructor: 'Dr. Sarah Johnson', day: 'Monday', start: '10:00', end: '11:30', room: 'Room 101', online: true },
  { id: 2, course: 'Data Structures', instructor: 'Prof. Michael Chen', day: 'Tuesday', start: '14:00', end: '15:30', room: 'Room 203', online: false },
  { id: 3, course: 'Web Development', instructor: 'Dr. Emily Brown', day: 'Wednesday', start: '13:00', end: '14:30', room: 'Room 305', online: true },
  { id: 4, course: 'Cyber Security', instructor: 'Dr. Sarah Johnson', day: 'Thursday', start: '10:00', end: '11:30', room: 'Room 101', online: false },
  { id: 5, course: 'Data Structures', instructor: 'Prof. Michael Chen', day: 'Thursday', start: '14:00', end: '15:30', room: 'Room 203', online: true },
  { id: 6, course: 'Web Development', instructor: 'Dr. Emily Brown', day: 'Friday', start: '13:00', end: '14:30', room: 'Room 305', online: false },
  { id: 7, course: 'Machine Learning', instructor: 'Dr. Alex Wong', day: 'Thursday', start: '09:00', end: '10:30', room: 'Room 405', online: true },
  { id: 8, course: 'Database Systems', instructor: 'Prof. Lisa Park', day: 'Thursday', start: '16:00', end: '17:30', room: 'Room 202', online: true }
];

function getToday() {
  const jsDay = new Date().getDay();
  // JS: 0=Sun, 1=Mon, ..., 6=Sat; our weekDays: 0=Mon, ..., 4=Fri
  return weekDays[jsDay - 1] || 'Monday';
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Minimal Hijri converter (approx, demo only) - Fixed to year 1447
function gregorianToHijri(date) {
  const GREGORIAN_EPOCH = 1721425.5;
  const ISLAMIC_EPOCH = 1948439.5;
  function floor(n) { return Math.floor(n); }
  function jdFromDate(d) {
    const a = floor((14 - (d.getMonth() + 1)) / 12);
    const y = d.getFullYear() + 4800 - a;
    const m = (d.getMonth() + 1) + 12 * a - 3;
    return (d.getDate() + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - floor(y / 100) + floor(y / 400) - 32045);
  }
  const jd = jdFromDate(date);
  const islamicDays = jd - 1948439 + 10632;
  const n = floor((islamicDays - 1) / 10631);
  const r = islamicDays - 10631 * n;
  const j = floor((r - 1) / 354.36667);
  const y = 30 * n + j;
  const k = r - floor(354.36667 * j);
  const m = floor((k - 1) / 29.5) + 1;
  const d = k - floor(29.5 * (m - 1));
  return { y: 1447, m, d }; // Force year to 1447
}

const hijriMonthNames = ['Muharram','Safar','Rabiʿ I','Rabiʿ II','Jumada I','Jumada II','Rajab','Shaʿban','Ramadan','Shawwal','Dhu al‑Qaʿdah','Dhu al‑Hijjah'];

// Basic KSA holidays (demo)
const ksaFixedHolidays = [
  { gMonth: 2, gDay: 22, label: 'Saudi Founding Day' },
  { gMonth: 9, gDay: 23, label: 'Saudi National Day' },
];
const ksaHijriHolidays = [
  { hMonth: 10, hDays: [1,2,3], label: 'Eid al‑Fitr' },
  { hMonth: 12, hDays: [10,11,12,13], label: 'Eid al‑Adha' },
];

function getHolidayBadge(date) {
  const gMonth = date.getMonth() + 1; const gDay = date.getDate();
  if (ksaFixedHolidays.some(h => h.gMonth === gMonth && h.gDay === gDay)) return 'KSA';
  const h = gregorianToHijri(date);
  if (ksaHijriHolidays.some(hh => hh.hMonth === h.m && hh.hDays.includes(h.d))) return 'KSA';
  return '';
}

export default function Schedule() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { startTour } = useTour();
  const [selectedDay, setSelectedDay] = useState(getToday());
  const [viewMode, setViewMode] = useState('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [useHijri, setUseHijri] = useState(currentLanguage === 'ar');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: '', message: '', type: 'success' });
  
  const today = getToday();
  const todayClasses = scheduleData.filter(cls => cls.day === today);
  const filteredClasses = scheduleData.filter(cls => cls.day === selectedDay);

  const totalClasses = scheduleData.length;
  const onlineClasses = scheduleData.filter(cls => cls.online).length;
  const totalHours = scheduleData.reduce((acc, cls) => {
    const start = parseInt(cls.start.split(':')[0]);
    const end = parseInt(cls.end.split(':')[0]);
    return acc + (end - start);
  }, 0);

  // Week helpers (start of week = Monday)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7; // days since Monday
    d.setDate(d.getDate() - diff);
    d.setHours(0,0,0,0);
    return d;
  }
  function getDateForSelectedDay(anchorDate, selectedDayLabel) {
    const start = getStartOfWeek(anchorDate);
    const idx = weekDays.indexOf(selectedDayLabel);
    const result = new Date(start);
    result.setDate(start.getDate() + idx);
    return result;
  }

  const showCustomPopup = (title, message, type = 'success') => {
    setPopupData({ title, message, type });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const startScheduleTour = () => {
    const steps = [
      { 
        target: '#schedule-view-toggle', 
        title: t('student.tour.schedule.viewTitle', 'View Options'), 
        content: t('student.tour.schedule.viewDesc', 'Switch between weekly and monthly calendar views.'),
        placement: 'bottom',
        disableBeacon: true
      },
      { 
        target: '#date-system-toggle', 
        title: t('student.tour.schedule.dateSystemTitle', 'Calendar System'), 
        content: t('student.tour.schedule.dateSystemDesc', 'Toggle between Gregorian and Hijri calendar systems.'),
        placement: 'bottom',
        disableBeacon: true
      },
      { 
        target: '[data-tour="today-classes"]', 
        title: t('student.tour.schedule.todayTitle', 'Today\'s Schedule'), 
        content: t('student.tour.schedule.todayDesc', 'View today\'s classes and quickly join online sessions.'),
        placement: 'right',
        disableBeacon: true
      },
      { 
        target: '[data-tour="schedule-actions"]', 
        title: t('student.tour.schedule.actionsTitle', 'Quick Actions'), 
        content: t('student.tour.schedule.actionsDesc', 'Join online classes, set reminders, or sync with your calendar.'),
        placement: 'left',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:schedule:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:schedule:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:schedule:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startScheduleTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startScheduleTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('student.schedule.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{t('student.schedule.subtitle')}</p>
              </div>
              
              {/* Enhanced View Toggle */}
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-1 border border-gray-200 dark:border-gray-700" id="schedule-view-toggle">
                  <button
                    onClick={() => setViewMode('weekly')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'weekly' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4" />
                      {t('student.schedule.views.weekly')}
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('monthly')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'monthly' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('student.schedule.views.monthly')}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Enhanced Today's Classes Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800" data-tour="today-classes">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('student.schedule.todayTitle')}</h2>
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {formatDate(new Date())}
                      {useHijri && (
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          ({(() => {
                            const h = gregorianToHijri(new Date());
                            return `${h.d} ${hijriMonthNames[h.m-1]} 1447`;
                          })()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Date System Toggle */}
                <div className="flex items-center gap-3" id="date-system-toggle">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('student.schedule.dateSystem.label')}</span>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => setUseHijri(false)} 
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        !useHijri 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      {t('student.schedule.dateSystem.gregorian')}
                    </button>
                    <button 
                      onClick={() => setUseHijri(true)} 
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        useHijri 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      {t('student.schedule.dateSystem.hijri')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Today's Classes Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayClasses.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">{t('student.schedule.noToday')}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Enjoy your free time!</p>
                    </div>
                  </div>
                ) : (
                  todayClasses.map((cls, idx) => (
                    <div key={cls.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">{cls.course}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{cls.instructor}</p>
                        </div>
                        {cls.online && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-700 dark:text-green-400 text-xs font-medium">Online</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{cls.start} - {cls.end}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{cls.room}</span>
                        </div>
                      </div>

                                             <div className="flex gap-2">
                         {cls.online && (
                           <button 
                             onClick={() => showCustomPopup(t('student.schedule.popups.joiningClass'), t('student.schedule.popups.joiningClassMessage', { course: cls.course }), 'success')}
                             className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                           >
                             <Video className="w-4 h-4" />
                             Join
                           </button>
                         )}
                         <button 
                           onClick={() => showCustomPopup(t('student.schedule.popups.calendarUpdated'), t('student.schedule.popups.calendarUpdatedMessage', { course: cls.course }), 'success')}
                           className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                         >
                           <PlusCircle className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('student.schedule.stats.totalClasses')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{totalClasses}</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{t('student.schedule.stats.thisSemester')}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('student.schedule.stats.onlineClasses')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{onlineClasses}</p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-1">{t('student.schedule.stats.availableOnline')}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('student.schedule.stats.totalHours')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{totalHours}h</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mt-1">{t('student.schedule.stats.weeklyHours')}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Clock3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('student.schedule.stats.attendance')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">92%</p>
                    <p className="text-orange-600 dark:text-orange-400 text-sm mt-1">{t('student.schedule.stats.currentRate')}</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <CalendarCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Day Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day, idx) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedDay === day 
                        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                    } ${day === 'Friday' ? 'ring-2 ring-green-400/60 dark:ring-green-300/60' : ''}`}
                    title={day === 'Friday' ? t('student.schedule.fridayHint') : ''}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{day.slice(0, 3)}</span>
                      {day === 'Friday' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Schedule Content */}
            {viewMode === 'weekly' ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {t('student.schedule.weekly.header', { day: selectedDay })}
                    </h2>
                    {useHijri && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {(() => { 
                          const d = getDateForSelectedDay(currentDate, selectedDay); 
                          const h = gregorianToHijri(d); 
                          return `${h.d} ${hijriMonthNames[h.m-1]} 1447`; 
                        })()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredClasses.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {t('student.schedule.weekly.noClasses', { day: selectedDay })}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">No classes scheduled for this day</p>
                    </div>
                  ) : (
                    filteredClasses.map((cls, idx) => (
                      <div key={cls.id} className={`flex items-center gap-6 p-6 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-4 border-blue-500`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{cls.course}</h3>
                            {cls.online && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                Online Available
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              <span>{cls.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              <span className="font-medium">{cls.start} - {cls.end}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              <span>{cls.room}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {cls.online && (
                            <button 
                              onClick={() => showCustomPopup(t('student.schedule.popups.joiningClass'), t('student.schedule.popups.joiningClassMessage', { course: cls.course }), 'success')}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              Join Online
                            </button>
                          )}
                          <button 
                            onClick={() => showCustomPopup(t('student.schedule.popups.calendarUpdated'), t('student.schedule.popups.calendarUpdatedMessage', { course: cls.course }), 'success')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Add to Calendar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {useHijri 
                        ? `${hijriMonthNames[gregorianToHijri(currentDate).m - 1]} 1447` 
                        : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      }
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
                    <div key={day} className={`p-3 text-center font-semibold text-sm ${day === 'fri' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {t(`student.schedule.days.short.${day}`)}
                    </div>
                  ))}
                  {[...Array(getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()))].map((_, index) => (
                    <div key={`empty-${index}`} className="p-2 text-center" />
                  ))}
                  {[...Array(getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()))].map((_, index) => {
                    const day = index + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isFriday = date.getDay() === 5;
                    const holiday = getHolidayBadge(date);
                    const dayClasses = scheduleData.filter(cls => {
                      const classDay = weekDays.indexOf(cls.day);
                      return classDay === (date.getDay() - 1);
                    });

                    return (
                      <div
                        key={day}
                        className={`p-3 min-h-[120px] border border-gray-100 dark:border-gray-600 rounded-lg ${
                          isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                        } ${isFriday ? 'bg-green-50/40 dark:bg-green-900/20' : ''}`}
                      >
                        <div className={`flex items-center justify-between mb-2 ${
                          isToday ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          <span className="text-sm">{day}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {useHijri ? (() => { const h = gregorianToHijri(date); return `${h.d} ${hijriMonthNames[h.m-1]}`; })() : ''}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {dayClasses.map((cls, idx) => (
                            <div
                              key={cls.id}
                              className={`text-xs p-1 rounded ${classColors[idx % classColors.length]} text-gray-800 dark:text-gray-900`}
                            >
                              {cls.course}
                              <div className="text-gray-600 dark:text-gray-400">{cls.start}</div>
                            </div>
                          ))}
                          {holiday && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded inline-block">
                              {t('student.schedule.holidayKSA')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enhanced Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" data-tour="schedule-actions">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                {t('student.schedule.actions.title')}
              </h3>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button 
                   onClick={() => {
                     const nextClass = todayClasses.find(cls => cls.online) || todayClasses[0];
                     if (nextClass) {
                       showCustomPopup(t('student.schedule.popups.joiningNextClass'), t('student.schedule.popups.joiningNextClassMessage', { course: nextClass.course, time: nextClass.start }), 'success');
                     } else {
                       showCustomPopup(t('student.schedule.popups.noClasses'), t('student.schedule.popups.noClassesMessage'), 'info');
                     }
                   }}
                   className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200 group"
                 >
                   <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl group-hover:scale-110 transition-transform">
                     <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                   </div>
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                     {t('student.schedule.actions.joinNext')}
                   </span>
                 </button>
                 <button 
                   onClick={() => showCustomPopup(t('student.schedule.popups.remindersSet'), t('student.schedule.popups.remindersSetMessage'), 'success')}
                   className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200 group"
                 >
                   <div className="p-3 bg-green-100 dark:bg-green-800 rounded-xl group-hover:scale-110 transition-transform">
                     <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
                   </div>
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                     {t('student.schedule.actions.setReminder')}
                   </span>
                 </button>
                 <button 
                   onClick={() => showCustomPopup(t('student.schedule.popups.calendarSynced'), t('student.schedule.popups.calendarSyncedMessage'), 'success')}
                   className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-200 group"
                 >
                   <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-xl group-hover:scale-110 transition-transform">
                     <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                   </div>
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                     {t('student.schedule.actions.syncCalendar')}
                   </span>
                 </button>
                 <button 
                   onClick={() => showCustomPopup(t('student.schedule.popups.openingMap'), t('student.schedule.popups.openingMapMessage'), 'info')}
                   className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/30 dark:hover:to-orange-700/30 transition-all duration-200 group"
                 >
                   <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-xl group-hover:scale-110 transition-transform">
                     <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                   </div>
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                     {t('student.schedule.actions.viewMap')}
                   </span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowPopup(false)}></div>
          <div className={`relative transform transition-all duration-300 ease-out ${
            showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full mx-4 ${
              popupData.type === 'success' ? 'border-l-4 border-l-green-500' :
              popupData.type === 'info' ? 'border-l-4 border-l-blue-500' :
              'border-l-4 border-l-yellow-500'
            }`}>
              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className={`absolute top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentLanguage === 'ar' ? 'left-4' : 'right-4'
                }`}
              >
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                popupData.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                popupData.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' :
                'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                {popupData.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : popupData.type === 'info' ? (
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className={`${currentLanguage === 'ar' ? 'pl-8' : 'pr-8'}`}>
                <h3 className={`text-lg font-bold mb-2 ${
                  popupData.type === 'success' ? 'text-green-800 dark:text-green-200' :
                  popupData.type === 'info' ? 'text-blue-800 dark:text-blue-200' :
                  'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {popupData.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {popupData.message}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-3000 ease-linear ${
                  popupData.type === 'success' ? 'bg-green-500' :
                  popupData.type === 'info' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`} style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 