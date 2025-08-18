import { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { UserCircle, Mail, BarChart2, MessageCircle, Eye, CheckCircle, X, BookOpen, FileText, Sparkles, Lock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SageAISummaryPanel from '../../components/SageAISummaryPanel';
import { useTour } from '../../context/TourContext.jsx';

const dummyCourses = [
  { id: 1, code: 'CS101', name: 'Introduction to Computer Science' },
  { id: 2, code: 'ML305', name: 'Machine Learning' },
  { id: 3, code: 'DS220', name: 'Data Structures' },
];

const dummyStudents = {
  CS101: [
    { id: 1, name: 'Sarah Lee', email: 'sarah.lee@example.com', year: 'Sophomore', avatar: '', progress: 85, attendance: 92, lastActive: '2 days ago', notes: 'Excellent participation.' },
    { id: 2, name: 'David Kim', email: 'david.kim@example.com', year: 'Freshman', avatar: '', progress: 70, attendance: 80, lastActive: '1 day ago', notes: 'Needs help with assignments.' },
    { id: 3, name: 'Eva Green', email: 'eva.green@example.com', year: 'Junior', avatar: '', progress: 95, attendance: 98, lastActive: 'Today', notes: 'Top performer.' },
  ],
  ML305: [
    { id: 4, name: 'Tom White', email: 'tom.white@example.com', year: 'Senior', avatar: '', progress: 60, attendance: 75, lastActive: '3 days ago', notes: '' },
    { id: 5, name: 'Uma Black', email: 'uma.black@example.com', year: 'Junior', avatar: '', progress: 88, attendance: 90, lastActive: 'Today', notes: 'Very engaged.' },
  ],
  DS220: [
    { id: 6, name: 'Paul Gray', email: 'paul.gray@example.com', year: 'Sophomore', avatar: '', progress: 78, attendance: 85, lastActive: 'Yesterday', notes: '' },
    { id: 7, name: 'Grace Black', email: 'grace.black@example.com', year: 'Freshman', avatar: '', progress: 82, attendance: 88, lastActive: 'Today', notes: '' },
  ],
};

function getAttendanceColor(att) {
  if (att >= 90) return 'bg-green-500';
  if (att >= 75) return 'bg-yellow-400';
  return 'bg-red-500';
}

export default function StudentsManagement() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [selectedCourse, setSelectedCourse] = useState(dummyCourses[0].code);
  const [showModal, setShowModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [note, setNote] = useState('');
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [insightSummary, setInsightSummary] = useState('');
  const [insightGenerating, setInsightGenerating] = useState(false);
  const [insightTitle, setInsightTitle] = useState('');
  const [proLockInsight, setProLockInsight] = useState(false);
  const previewTimerRef = useRef(null);
  const [previewUsed, setPreviewUsed] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [messageText, setMessageText] = useState('');

  // Persist previewUsed per session in localStorage
  useEffect(() => {
    const used = localStorage.getItem('instructor:insight:previewUsed');
    if (used === '1') setPreviewUsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('instructor:insight:previewUsed', previewUsed ? '1' : '0');
  }, [previewUsed]);

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startStudentsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startStudentsTour = () => {
    const steps = [
      {
        target: '[data-tour="instructor-students-table"]',
        title: t('instructor.tour.students.table.title', 'Students Roster'),
        content: t('instructor.tour.students.table.desc', 'View progress, attendance, and manage student notes.'),
        placement: 'top',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-ai-insight"]',
        title: t('instructor.tour.students.aiInsight.title', 'AI Insight (Preview)'),
        content: t('instructor.tour.students.aiInsight.desc', 'First insight shows for 10 seconds, then locks to PRO for future.'),
        placement: 'left',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:students:v1', steps);
  };

  const students = dummyStudents[selectedCourse] || [];

  const openModal = (student) => {
    setActiveStudent(student);
    setNote(student.notes || '');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setActiveStudent(null);
    setNote('');
  };
  const saveNote = () => {
    if (activeStudent) activeStudent.notes = note;
    setShowModal(false);
  };

  const openMessageModal = (student) => {
    setMessageRecipient(student);
    setMessageText('');
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageRecipient(null);
    setMessageText('');
  };

  const sendMessage = () => {
    // Here you would typically send the message to the backend
    console.log(`Sending message to ${messageRecipient.name}: ${messageText}`);
    closeMessageModal();
  };

  const buildInsight = (s) => {
    const performance = s.progress >= 85 ? 'excellent' : s.progress >= 70 ? 'good' : 'needs improvement';
    const attendanceBand = s.attendance >= 90 ? 'very strong' : s.attendance >= 80 ? 'solid' : 'low';
    const noteText = s.notes && s.notes.trim().length > 0 ? s.notes : 'No instructor notes available yet.';
    return (
      `AI summary for ${s.name} in ${selectedCourse}:

Progress: ${s.progress}% (${performance}).
Attendance: ${s.attendance}% (${attendanceBand}).
Last active: ${s.lastActive}.

Notes: ${noteText}

Suggested actions:
- Focus next week on topics with lower quiz scores or incomplete assignments.
- Offer targeted support and brief 1:1 check-in if needed.
- Encourage consistent attendance and timely submissions.`
    );
  };

  const openInsight = (s, previewFirst = false) => {
    setInsightTitle(`${s.name} — ${selectedCourse}`);
    setIsInsightOpen(true);
    // Clear any previous timer
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    if (previewFirst && !previewUsed) {
      // Show summary immediately, then lock after 5s
      setInsightGenerating(false);
      setInsightSummary(buildInsight(s));
      setProLockInsight(false);
      previewTimerRef.current = setTimeout(() => {
        setProLockInsight(true);
        setPreviewUsed(true);
      }, 10000);
    } else {
      // Locked view (PRO upsell)
      setInsightSummary('');
      setInsightGenerating(false);
      setProLockInsight(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.studentsManagement.title')}</h1>
        </div>
        {/* Course Selector */}
        <div className="mb-6 flex items-center gap-4">
          <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-lg dark:bg-gray-900 dark:text-gray-100">
            {dummyCourses.map(c => <option key={c.code} value={c.code}>{c.code}: {c.name}</option>)}
          </select>
        </div>
        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-x-auto" data-tour="instructor-students-table">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.student')}</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.email')}</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.year')}</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.progress')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.aiInsight', 'AI Insight')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.attendance')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.lastActive')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.studentsManagement.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <UserCircle size={28} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{s.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.email}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.year}</td>
                  <td className="py-3 px-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${s.progress}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{s.progress}%</div>
                  </td>
                  <td className="py-3 px-4 text-center" data-tour="instructor-ai-insight">
                    {idx === 0 ? (
                      <button className="inline-flex items-center gap-1 text-fuchsia-700 dark:text-fuchsia-300 hover:text-fuchsia-900 dark:hover:text-fuchsia-100 px-2 py-1 rounded" title={t('instructor.studentsManagement.actions.aiInsight', 'AI Insight')} onClick={() => openInsight(s, true)}>
                        <Sparkles size={16} />
                        <span className="hidden md:inline">{t('instructor.studentsManagement.actions.aiInsight', 'Insight')}</span>
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-300 px-2 py-1 rounded opacity-70" title={t('instructor.studentsManagement.actions.aiInsight', 'AI Insight')} onClick={() => openInsight(s, false)}>
                        <Lock size={16} />
                        <span className="hidden md:inline">{t('instructor.studentsManagement.actions.aiInsight', 'Insight')}</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${getAttendanceColor(s.attendance)}`}></span>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">{s.attendance}%</span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-300">{s.lastActive}</td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mr-2" title={t('instructor.studentsManagement.actions.viewDetails')} onClick={() => openModal(s)}><Eye size={18} /></button>
                    <button 
                      onClick={() => openMessageModal(s)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 mr-2" 
                      title={t('instructor.studentsManagement.actions.message')}
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200" title={t('instructor.studentsManagement.actions.addNote')} onClick={() => openModal(s)}><FileText size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Detail Modal */}
        {showModal && activeStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
              <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeModal}><X size={28} /></button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UserCircle size={48} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{activeStudent.name}</div>
                  <div className="text-gray-500 dark:text-gray-300">{activeStudent.email}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">{activeStudent.year}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2"><BarChart2 size={18}/> {t('instructor.studentsManagement.modal.progress')}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${activeStudent.progress}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{t('instructor.studentsManagement.modal.progressCompleted', { value: activeStudent.progress })}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2"><CheckCircle size={18}/> {t('instructor.studentsManagement.modal.attendance')}</div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-4 h-4 rounded-full ${getAttendanceColor(activeStudent.attendance)}`}></span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{activeStudent.attendance}%</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2"><FileText size={18}/> {t('instructor.studentsManagement.modal.instructorNotes')}</div>
                <textarea className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-900 dark:text-gray-100" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder={t('instructor.studentsManagement.modal.notesPlaceholder')} />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" onClick={saveNote}>{t('instructor.studentsManagement.actions.saveNote')}</button>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && messageRecipient && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
              <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeMessageModal}><X size={28} /></button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UserCircle size={48} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{messageRecipient.name}</div>
                  <div className="text-gray-500 dark:text-gray-300">{messageRecipient.email}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">{messageRecipient.year}</div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {t('instructor.studentsManagement.messageModal.subject', 'Message')}
                </label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t('instructor.studentsManagement.messageModal.placeholder', 'Type your message here...')}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeMessageModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  {t('instructor.studentsManagement.messageModal.cancel', 'Cancel')}
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('instructor.studentsManagement.messageModal.send', 'Send Message')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SageAISummaryPanel
        isOpen={isInsightOpen}
        onClose={() => { setIsInsightOpen(false); setInsightSummary(''); if (!previewUsed) setProLockInsight(false); if (previewTimerRef.current) { clearTimeout(previewTimerRef.current); previewTimerRef.current = null; } }}
        videoTitle={insightTitle}
        summary={insightSummary}
        isGenerating={insightGenerating}
        proLock={proLockInsight}
        onSummaryTyped={() => {
          if (!proLockInsight && insightSummary) {
            if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
            previewTimerRef.current = setTimeout(() => { setProLockInsight(true); setPreviewUsed(true); }, 10000);
          }
        }}
      />
    </div>
  );
} 