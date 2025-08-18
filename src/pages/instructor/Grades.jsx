import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { BookOpen, BarChart2, UserCircle, Edit, CheckCircle, X, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const dummyCourses = [
  { id: 1, code: 'CS101', name: 'Introduction to Computer Science' },
  { id: 2, code: 'ML305', name: 'Machine Learning' },
  { id: 3, code: 'DS220', name: 'Data Structures' },
];

const dummyGrades = {
  CS101: [
    { id: 1, name: 'Sarah Lee', email: 'sarah.lee@example.com', assignments: [90, 85], final: 88, feedback: 'Great work!' },
    { id: 2, name: 'David Kim', email: 'david.kim@example.com', assignments: [70, 75], final: 73, feedback: 'Needs improvement.' },
    { id: 3, name: 'Eva Green', email: 'eva.green@example.com', assignments: [95, 98], final: 97, feedback: 'Outstanding!' },
  ],
  ML305: [
    { id: 4, name: 'Tom White', email: 'tom.white@example.com', assignments: [80], final: 80, feedback: '' },
    { id: 5, name: 'Uma Black', email: 'uma.black@example.com', assignments: [88], final: 88, feedback: 'Very engaged.' },
  ],
  DS220: [
    { id: 6, name: 'Paul Gray', email: 'paul.gray@example.com', assignments: [78], final: 78, feedback: '' },
    { id: 7, name: 'Grace Black', email: 'grace.black@example.com', assignments: [82], final: 82, feedback: '' },
  ],
};

export default function Grades() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [selectedCourse, setSelectedCourse] = useState(dummyCourses[0].code);
  const [showModal, setShowModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [editFinal, setEditFinal] = useState('');
  const [editFeedback, setEditFeedback] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startGradesTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startGradesTour = () => {
    const steps = [
      {
        target: '[data-tour="instructor-grades-table"]',
        title: t('instructor.tour.grades.table.title', 'Grades Overview'),
        content: t('instructor.tour.grades.table.desc', 'Review and edit final grades and feedback.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:grades:v1', steps);
  };

  const students = dummyGrades[selectedCourse] || [];

  const openModal = (student) => {
    setActiveStudent(student);
    setEditFinal(student.final);
    setEditFeedback(student.feedback || '');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setActiveStudent(null);
    setEditFinal('');
    setEditFeedback('');
  };
  const saveGrade = () => {
    if (activeStudent) {
      activeStudent.final = editFinal;
      activeStudent.feedback = editFeedback;
    }
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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <BarChart2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.grades.title')}</h1>
        </div>
        {/* Course Selector */}
        <div className="mb-6 flex items-center gap-4">
          <BarChart2 size={24} className="text-blue-600 dark:text-blue-400" />
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-lg dark:bg-gray-900 dark:text-gray-100">
            {dummyCourses.map(c => <option key={c.code} value={c.code}>{c.code}: {c.name}</option>)}
          </select>
        </div>
        {/* Grades Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-x-auto" data-tour="instructor-grades-table">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">{t('instructor.grades.table.student')}</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">{t('instructor.grades.table.email')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.grades.table.assignments')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.grades.table.final')}</th>
                <th className="py-3 px-4 text-center text-gray-700 dark:text-gray-200">{t('instructor.grades.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <UserCircle size={28} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{s.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.email}</td>
                  <td className="py-3 px-4 text-center">
                    {s.assignments.map((g, i) => (
                      <span key={i} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 rounded px-2 py-1 text-xs font-semibold mr-1">{g}</span>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-lg text-blue-700 dark:text-blue-400">{s.final}</td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mr-2" title={t('instructor.grades.actions.editGrade')} onClick={() => openModal(s)}><Edit size={18} /></button>
                    <button 
                      onClick={() => openMessageModal(s)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200" 
                      title={t('instructor.grades.actions.message')}
                    >
                      <MessageCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grade Modal */}
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
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2"><BarChart2 size={18}/> {t('instructor.grades.modal.assignmentGrades')}</div>
                <div className="flex gap-2 flex-wrap">
                  {activeStudent.assignments.map((g, i) => (
                    <span key={i} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 rounded px-2 py-1 text-xs font-semibold">{t('instructor.grades.modal.assignmentLabel', { index: i + 1, grade: g })}</span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2"><CheckCircle size={18}/> {t('instructor.grades.modal.finalGrade')}</div>
                <input type="number" className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 text-center text-lg font-bold dark:bg-gray-900 dark:text-gray-100" value={editFinal} onChange={e => setEditFinal(e.target.value)} />
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2"><Edit size={18}/> {t('instructor.grades.modal.feedback')}</div>
                <textarea className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-900 dark:text-gray-100" rows={3} value={editFeedback} onChange={e => setEditFeedback(e.target.value)} placeholder={t('instructor.grades.modal.feedbackPlaceholder')} />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" onClick={saveGrade}>{t('instructor.grades.modal.save')}</button>
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
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {t('instructor.grades.messageModal.subject', 'Message')}
                </label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t('instructor.grades.messageModal.placeholder', 'Type your message here...')}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeMessageModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  {t('instructor.grades.messageModal.cancel', 'Cancel')}
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('instructor.grades.messageModal.send', 'Send Message')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 