import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Users2, Edit, Trash2, Plus, FileText, Video, Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const dummyCourses = [
  { id: 1, code: 'CS101', name: 'Intro to Computer Science', semester: 'Fall 2024', students: 45, weeks: [ { title: 'Week 1: Introduction', content: [ { type: 'pdf', name: 'Syllabus.pdf', url: '#', id: 1 }, { type: 'video', name: 'Welcome.mp4', url: '#', id: 2 } ] }, { title: 'Week 2: Programming Basics', content: [ { type: 'pdf', name: 'Lecture1.pdf', url: '#', id: 3 } ] } ], cover: '', lastUpdated: '2024-06-10' },
  { id: 2, code: 'ML305', name: 'Machine Learning', semester: 'Spring 2025', students: 38, weeks: [ { title: 'Week 1: ML Overview', content: [ { type: 'pdf', name: 'ML_Intro.pdf', url: '#', id: 4 } ] } ], cover: '', lastUpdated: '2024-06-08' },
  { id: 3, code: 'DS220', name: 'Data Structures', semester: 'Fall 2024', students: 52, weeks: [ { title: 'Week 1: Arrays & Lists', content: [ { type: 'pdf', name: 'Arrays.pdf', url: '#', id: 5 } ] }, { title: 'Week 2: Trees', content: [] } ], cover: '', lastUpdated: '2024-06-09' },
  { id: 4, code: 'AI410', name: 'Artificial Intelligence', semester: 'Spring 2025', students: 29, weeks: [ { title: 'Week 1: AI Basics', content: [ { type: 'video', name: 'AI_Intro.mp4', url: '#', id: 6 } ] } ], cover: '', lastUpdated: '2024-06-07' },
  { id: 5, code: 'WD150', name: 'Web Development', semester: 'Fall 2024', students: 41, weeks: [ { title: 'Week 1: HTML & CSS', content: [ { type: 'pdf', name: 'HTML_Basics.pdf', url: '#', id: 7 } ] }, { title: 'Week 2: JavaScript', content: [] } ], cover: '', lastUpdated: '2024-06-06' },
  { id: 6, code: 'DB330', name: 'Database Systems', semester: 'Spring 2025', students: 36, weeks: [ { title: 'Week 1: Relational DBs', content: [ { type: 'pdf', name: 'RelationalDBs.pdf', url: '#', id: 8 } ] } ], cover: '', lastUpdated: '2024-06-05' },
  { id: 7, code: 'SE210', name: 'Software Engineering', semester: 'Fall 2024', students: 33, weeks: [ { title: 'Week 1: SDLC', content: [ { type: 'pdf', name: 'SDLC.pdf', url: '#', id: 9 } ] } ], cover: '', lastUpdated: '2024-06-04' },
];

const fileIcons = { pdf: FileText, video: Video };

export default function MyCourses() {
  const { t } = useTranslation();
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
        target: '[data-tour="instructor-courses-grid"]',
        title: t('instructor.tour.courses.grid.title', 'Your Courses'),
        content: t('instructor.tour.courses.grid.desc', 'Browse and manage all your courses here.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-course-details"]',
        title: t('instructor.tour.courses.details.title', 'Course Details'),
        content: t('instructor.tour.courses.details.desc', 'Open a course to add materials or update weekly content.'),
        placement: 'left',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:courses:v1', steps);
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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('instructor.myCourses.title')}</h1>
        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-tour="instructor-courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition cursor-pointer" onClick={() => openCourse(course)}>
              <div className="flex items-center gap-3">
                <BookOpen size={36} className="text-blue-600 dark:text-blue-400" />
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
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition self-start" data-tour="instructor-course-details">{t('instructor.myCourses.viewEdit')}</button>
            </div>
          ))}
        </div>
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