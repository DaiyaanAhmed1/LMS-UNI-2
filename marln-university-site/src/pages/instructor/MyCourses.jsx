import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Users2, Edit, Trash2, Plus, FileText, Video, Upload, X, Grid, List, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const dummyCourses = [
  { id: 1, code: 'CS101', name: 'Intro to Computer Science', semester: 'Fall 2025', students: 45, weeks: [ { title: 'Week 1: Introduction', content: [ { type: 'pdf', name: 'Syllabus.pdf', url: '#', id: 1 }, { type: 'video', name: 'Welcome.mp4', url: '#', id: 2 } ] }, { title: 'Week 2: Programming Basics', content: [ { type: 'pdf', name: 'Lecture1.pdf', url: '#', id: 3 } ] } ], cover: '', lastUpdated: '2025-06-10', color: 'blue' },
  { id: 2, code: 'ML305', name: 'Machine Learning', semester: 'Spring 2025', students: 38, weeks: [ { title: 'Week 1: ML Overview', content: [ { type: 'pdf', name: 'ML_Intro.pdf', url: '#', id: 4 } ] } ], cover: '', lastUpdated: '2025-06-08', color: 'purple' },
  { id: 3, code: 'DS220', name: 'Data Structures', semester: 'Fall 2025', students: 52, weeks: [ { title: 'Week 1: Arrays & Lists', content: [ { type: 'pdf', name: 'Arrays.pdf', url: '#', id: 5 } ] }, { title: 'Week 2: Trees', content: [] } ], cover: '', lastUpdated: '2025-06-09', color: 'green' },
  { id: 4, code: 'AI410', name: 'Artificial Intelligence', semester: 'Spring 2025', students: 29, weeks: [ { title: 'Week 1: AI Basics', content: [ { type: 'video', name: 'AI_Intro.mp4', url: '#', id: 6 } ] } ], cover: '', lastUpdated: '2025-06-07', color: 'orange' },
  { id: 5, code: 'WD150', name: 'Web Development', semester: 'Fall 2025', students: 41, weeks: [ { title: 'Week 1: HTML & CSS', content: [ { type: 'pdf', name: 'HTML_Basics.pdf', url: '#', id: 7 } ] }, { title: 'Week 2: JavaScript', content: [] } ], cover: '', lastUpdated: '2025-06-06', color: 'indigo' },
  { id: 6, code: 'DB330', name: 'Database Systems', semester: 'Spring 2025', students: 36, weeks: [ { title: 'Week 1: Relational DBs', content: [ { type: 'pdf', name: 'RelationalDBs.pdf', url: '#', id: 8 } ] } ], cover: '', lastUpdated: '2025-06-05', color: 'teal' },
  { id: 7, code: 'SE210', name: 'Software Engineering', semester: 'Fall 2025', students: 33, weeks: [ { title: 'Week 1: SDLC', content: [ { type: 'pdf', name: 'SDLC.pdf', url: '#', id: 9 } ] } ], cover: '', lastUpdated: '2025-06-04', color: 'pink' },
];

const fileIcons = { pdf: FileText, video: Video };

// Function to get course-specific color classes
const getCourseColorClasses = (color) => {
  const colorMap = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200 dark:border-blue-700',
      icon: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
      hover: 'hover:shadow-blue-100 dark:hover:shadow-blue-900/20'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      border: 'border-purple-200 dark:border-purple-700',
      icon: 'text-purple-600 dark:text-purple-400',
      button: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700',
      hover: 'hover:shadow-purple-100 dark:hover:shadow-purple-900/20'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200 dark:border-green-700',
      icon: 'text-green-600 dark:text-green-400',
      button: 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700',
      hover: 'hover:shadow-green-100 dark:hover:shadow-green-900/20'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      border: 'border-orange-200 dark:border-orange-700',
      icon: 'text-orange-600 dark:text-orange-400',
      button: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700',
      hover: 'hover:shadow-orange-100 dark:hover:shadow-orange-900/20'
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
      border: 'border-indigo-200 dark:border-indigo-700',
      icon: 'text-indigo-600 dark:text-indigo-400',
      button: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700',
      hover: 'hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20'
    },
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20',
      border: 'border-teal-200 dark:border-teal-700',
      icon: 'text-teal-600 dark:text-teal-400',
      button: 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700',
      hover: 'hover:shadow-teal-100 dark:hover:shadow-teal-900/20'
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20',
      border: 'border-pink-200 dark:border-pink-700',
      icon: 'text-pink-600 dark:text-pink-400',
      button: 'bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700',
      hover: 'hover:shadow-pink-100 dark:hover:shadow-pink-900/20'
    }
  };
  
  return colorMap[color] || colorMap.blue; // Default to blue if color not found
};

export default function MyCourses() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { startTour } = useTour();
  const [courses, setCourses] = useState(dummyCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [uploadingWeek, setUploadingWeek] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [newFileType, setNewFileType] = useState('pdf');
  const [editTitle, setEditTitle] = useState('');
  const [editWeekIdx, setEditWeekIdx] = useState(null);
  const [showAddWeek, setShowAddWeek] = useState(false);
  const [newWeekTitle, setNewWeekTitle] = useState("");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startCoursesTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startCoursesTour = () => {
    const steps = [
      {
        target: '[data-tour="instructor-courses-header"]',
        title: t('instructor.tour.courses.header.title', 'Course Management'),
        content: t('instructor.tour.courses.header.desc', 'Welcome to your course management page. Here you can view, search, and manage all your courses.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-courses-search"]',
        title: t('instructor.tour.courses.search.title', 'Search Courses'),
        content: t('instructor.tour.courses.search.desc', 'Quickly find specific courses by typing the course name or code.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-courses-view-toggle"]',
        title: t('instructor.tour.courses.viewToggle.title', 'View Options'),
        content: t('instructor.tour.courses.viewToggle.desc', 'Switch between grid view (cards) and list view (table) to see your courses in different layouts.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-courses-grid"]',
        title: t('instructor.tour.courses.grid.title', 'Grid View'),
        content: t('instructor.tour.courses.grid.desc', 'Browse your courses in a card layout. Each card shows course details and quick access to management.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-courses-list"]',
        title: t('instructor.tour.courses.list.title', 'List View'),
        content: t('instructor.tour.courses.list.desc', 'View your courses in a detailed table format with all information organized in columns.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-course-details"]',
        title: t('instructor.tour.courses.details.title', 'Course Details'),
        content: t('instructor.tour.courses.details.desc', 'Click any course to open detailed management where you can add materials, edit weekly content, and manage course structure.'),
        placement: 'left',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:courses:v2', steps);
  };

  const openCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setExpandedWeek(null);
    setEditWeekIdx(null);
    setEditTitle('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setExpandedWeek(null);
    setEditWeekIdx(null);
    setEditTitle('');
  };

  const toggleWeek = (idx) => { setExpandedWeek(expandedWeek === idx ? null : idx); setEditWeekIdx(null); setEditTitle(''); };
  const startEditWeek = (idx, title) => { setEditWeekIdx(idx); setEditTitle(title); };
  const saveEditWeek = (idx) => { const updated = { ...selectedCourse }; updated.weeks[idx].title = editTitle; updateCourse(updated); setEditWeekIdx(null); setEditTitle(''); };
  const deleteContent = (weekIdx, contentIdx) => { const updated = { ...selectedCourse }; updated.weeks[weekIdx].content.splice(contentIdx, 1); updateCourse(updated); };
  const handleFileUpload = (weekIdx) => { if (!newFile) return; const updated = { ...selectedCourse }; updated.weeks[weekIdx].content.push({ type: newFileType, name: newFile.name, url: '#', id: Date.now() }); updateCourse(updated); setNewFile(null); setUploadingWeek(null); };
  const updateCourse = (updatedCourse) => { setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))); setSelectedCourse(updatedCourse); };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        {/* Header with title and controls */}
        <div className="flex items-center justify-between mb-8" data-tour="instructor-courses-header">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.myCourses.title')}</h1>
          </div>
          
          {/* View toggle and search */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative" data-tour="instructor-courses-search">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t('instructor.myCourses.searchPlaceholder', 'Search courses...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            {/* View toggle */}
            <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1" data-tour="instructor-courses-view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={t('instructor.myCourses.gridView', 'Grid View')}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={t('instructor.myCourses.listView', 'List View')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

                {/* Courses Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-tour="instructor-courses-grid">
            {filteredCourses.map((course) => {
              const colorClasses = getCourseColorClasses(course.color);
              return (
                <div 
                  key={course.id} 
                  className={`${colorClasses.bg} ${colorClasses.border} rounded-2xl shadow-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition cursor-pointer border-2`} 
                  onClick={() => openCourse(course)}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={36} className={colorClasses.icon} />
                    <div>
                      <div className="font-bold text-lg text-gray-800 dark:text-gray-100">{course.code}: {course.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{course.semester}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                    <span><Users2 size={16} className="inline mr-1" /> {t('instructor.myCourses.students', { count: course.students })}</span>
                    <span><FileText size={16} className="inline mr-1" /> {t('instructor.myCourses.weeks', { count: course.weeks.length })}</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('instructor.myCourses.lastUpdated', { date: course.lastUpdated })}</div>
                  <button 
                    className={`mt-2 px-4 py-2 text-white rounded-lg transition self-start font-medium shadow-sm hover:shadow-md ${colorClasses.button} active:scale-95`} 
                    data-tour="instructor-course-details"
                  >
                    {t('instructor.myCourses.viewEdit')}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" data-tour="instructor-courses-list">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('instructor.myCourses.table.course', 'Course')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('instructor.myCourses.table.semester', 'Semester')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('instructor.myCourses.table.students', 'Students')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('instructor.myCourses.table.weeks', 'Weeks')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('instructor.myCourses.table.lastUpdated', 'Last Updated')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('instructor.myCourses.table.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCourses.map((course) => {
                    const colorClasses = getCourseColorClasses(course.color);
                    return (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 align-top whitespace-normal">
                          <div className="flex items-start gap-3 max-w-xs">
                            <BookOpen size={24} className={`${colorClasses.icon} flex-shrink-0`} />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{course.code}: {course.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{course.description || t('instructor.myCourses.noDescription', 'No description available')}</div>
                            </div>
                          </div>
                        </td>
                      <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {course.semester}
                      </td>
                      <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2">
                          <Users2 size={16} className={`${colorClasses.icon} opacity-70`} />
                          <span>{course.students}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2">
                          <FileText size={16} className={`${colorClasses.icon} opacity-70`} />
                          <span>{course.weeks.length}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {course.lastUpdated}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => openCourse(course)}
                          className={`px-4 py-2 text-white rounded-lg transition font-medium shadow-sm hover:shadow-md ${colorClasses.button} active:scale-95`}
                          data-tour="instructor-course-details"
                        >
                          {t('instructor.myCourses.viewEdit')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Course Modal */}
        {showModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative animate-fadeIn">
              <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeModal}><X size={28} /></button>
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">{selectedCourse.code}: {selectedCourse.name}</h2>
              <div className="space-y-4">
                {selectedCourse.weeks.map((week, idx) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      {editWeekIdx === idx ? (
                        <div className="flex gap-2 items-center w-full">
                          <input className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 dark:bg-gray-800 dark:text-gray-100" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                          <button className="px-2 py-1 bg-blue-600 text-white rounded dark:bg-blue-700 dark:hover:bg-blue-800" onClick={() => saveEditWeek(idx)}>{t('instructor.myCourses.modal.save')}</button>
                          <button className="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded" onClick={() => setEditWeekIdx(null)}>{t('instructor.myCourses.modal.cancel')}</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{week.title}</span>
                          <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs" onClick={() => startEditWeek(idx, week.title)}><Edit size={16} /></button>
                        </div>
                      )}
                      <button className="ml-2 px-2 py-1 bg-green-600 text-white rounded flex items-center gap-1 text-xs dark:bg-green-700 dark:hover:bg-green-800" onClick={() => setUploadingWeek(idx)}><Upload size={16}/> {t('instructor.myCourses.modal.addContent')}</button>
                    </div>
                    {uploadingWeek === idx && (
                      <div className="mt-3 flex flex-col gap-2 bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                        <div className="flex gap-2 items-center">
                          <select value={newFileType} onChange={e => setNewFileType(e.target.value)} className="border rounded px-2 py-1">
                            <option value="pdf">{t('instructor.myCourses.modal.type.pdf')}</option>
                            <option value="video">{t('instructor.myCourses.modal.type.video')}</option>
                          </select>
                          <input type="file" accept={newFileType === 'pdf' ? '.pdf' : 'video/*'} onChange={e => setNewFile(e.target.files[0])} />
                          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleFileUpload(idx)}>{t('instructor.myCourses.modal.upload')}</button>
                          <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setUploadingWeek(null)}>{t('instructor.myCourses.modal.cancel')}</button>
                        </div>
                        {newFile && <div className="text-xs text-gray-500">{t('instructor.myCourses.modal.selected', { name: newFile.name })}</div>}
                      </div>
                    )}
                    <div className="mt-3 flex flex-col gap-2">
                      {week.content.length === 0 && <div className="text-gray-400 text-sm">{t('instructor.myCourses.modal.noContent')}</div>}
                      {week.content.map((item, cidx) => {
                        const Icon = fileIcons[item.type];
                        return (
                          <div key={item.id} className="flex items-center gap-3 bg-white rounded p-2 shadow-sm">
                            <Icon size={20} className={item.type === 'pdf' ? 'text-blue-600' : 'text-green-600'} />
                            <span className="flex-1 text-gray-800 text-sm">{item.name}</span>
                            <button className="text-red-500 hover:text-red-700" onClick={() => deleteContent(idx, cidx)}><Trash2 size={18} /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="mt-6">
                  {showAddWeek ? (
                    <div className="flex gap-2 items-center">
                      <input className="border rounded px-2 py-1 flex-1" placeholder={t('instructor.myCourses.addWeek.placeholder')} value={newWeekTitle} onChange={e => setNewWeekTitle(e.target.value)} autoFocus />
                      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { if (!newWeekTitle.trim()) return; const updated = { ...selectedCourse }; updated.weeks.push({ title: newWeekTitle.trim(), content: [] }); updateCourse(updated); setShowAddWeek(false); setNewWeekTitle(""); }}>{t('instructor.myCourses.addWeek.add')}</button>
                      <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => { setShowAddWeek(false); setNewWeekTitle(""); }}>{t('instructor.myCourses.addWeek.cancel')}</button>
                    </div>
                  ) : (
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition" onClick={() => setShowAddWeek(true)}>
                      {t('instructor.myCourses.addWeek.open')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 