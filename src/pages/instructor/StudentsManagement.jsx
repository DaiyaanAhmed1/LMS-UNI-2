import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { UserCircle, Mail, BarChart2, MessageCircle, Eye, CheckCircle, X, BookOpen, FileText, Sparkles, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
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
  const [currentInsightStudent, setCurrentInsightStudent] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [messageText, setMessageText] = useState('');



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

  // Regenerate insight when language changes
  useEffect(() => {
    if (currentInsightStudent && isInsightOpen) {
      console.log('Language changed, regenerating insight...');
      setInsightSummary(buildInsight(currentInsightStudent));
    }
  }, [i18n.language, currentInsightStudent, isInsightOpen]);

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
    // Debug: Check if translations are working
    console.log('Current language:', t('instructor.studentsInsights.title', 'Student Performance Analysis'));
    console.log('RTL status:', isRTL);
    console.log('Current i18n language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    console.log('Testing simple translation:', t('instructor.studentsManagement.title', 'Students Management'));
    
    const performance = s.progress >= 85 ? t('instructor.studentsInsights.performance.excellent', 'excellent') : s.progress >= 70 ? t('instructor.studentsInsights.performance.good', 'good') : t('instructor.studentsInsights.performance.needsImprovement', 'needs improvement');
    const attendanceBand = s.attendance >= 90 ? t('instructor.studentsInsights.attendance.veryStrong', 'very strong') : s.attendance >= 80 ? t('instructor.studentsInsights.attendance.solid', 'solid') : t('instructor.studentsInsights.attendance.low', 'low');
    const noteText = s.notes && s.notes.trim().length > 0 ? s.notes : t('instructor.studentsInsights.noNotes', 'No instructor notes available yet.');
    
    const progressStatus = s.progress >= 85 ? '✅' : s.progress >= 70 ? '⚠️' : '❌';
    const attendanceStatus = s.attendance >= 90 ? '✅' : s.attendance >= 80 ? '⚠️' : '❌';
    const engagementStatus = (s.lastActive.includes('Today') || s.lastActive.includes('Yesterday')) ? '✅' : '⚠️';
    
    const progressInsight = s.progress >= 85 ? 
      t('instructor.studentsInsights.progressInsight.excellent', 'Strong academic performance with consistent progress') : 
      s.progress >= 70 ? 
      t('instructor.studentsInsights.progressInsight.good', 'Good progress with room for improvement') : 
      t('instructor.studentsInsights.progressInsight.needsSupport', 'Needs additional support and intervention');
    
    const attendanceInsight = s.attendance >= 90 ? 
      t('instructor.studentsInsights.attendanceInsight.excellent', 'Excellent attendance demonstrates commitment') : 
      s.attendance >= 80 ? 
      t('instructor.studentsInsights.attendanceInsight.acceptable', 'Attendance is acceptable but could improve') : 
      t('instructor.studentsInsights.attendanceInsight.needsAttention', 'Attendance needs immediate attention');
    
    const engagementInsight = (s.lastActive.includes('Today') || s.lastActive.includes('Yesterday')) ? 
      t('instructor.studentsInsights.engagementInsight.active', 'Student is actively engaged with course materials') : 
      t('instructor.studentsInsights.engagementInsight.disengaged', 'Recent activity suggests some disengagement');
    
    const progressAction = s.progress < 80 ? 
      t('instructor.studentsInsights.actions.progress.low', 'Schedule individual meeting to discuss academic challenges and create improvement plan') : 
      t('instructor.studentsInsights.actions.progress.high', 'Maintain current support level and encourage continued excellence');
    
    const attendanceAction = s.attendance < 85 ? 
      t('instructor.studentsInsights.actions.attendance.low', 'Send personalized attendance reminder and offer additional support resources') : 
      t('instructor.studentsInsights.actions.attendance.high', 'Acknowledge good attendance and encourage continued participation');
    
    const engagementAction = s.lastActive.includes('days') ? 
      t('instructor.studentsInsights.actions.engagement.low', 'Reach out via message to check on student engagement and offer assistance') : 
      t('instructor.studentsInsights.actions.engagement.high', 'Continue monitoring engagement and provide positive reinforcement');
    
    const focusArea1 = s.progress < 80 ? 
      t('instructor.studentsInsights.focusAreas.progress.low', 'Target specific weak areas in upcoming assignments') : 
      t('instructor.studentsInsights.focusAreas.progress.high', 'Challenge with advanced topics to maintain engagement');
    
    const focusArea2 = s.attendance < 85 ? 
      t('instructor.studentsInsights.focusAreas.attendance.low', 'Implement attendance tracking and follow-up system') : 
      t('instructor.studentsInsights.focusAreas.attendance.high', 'Encourage leadership in class discussions and group activities');
    
    return `${t('instructor.studentsInsights.title', 'Student Performance Analysis')}

${t('instructor.studentsInsights.academicProgress', 'Academic Progress')}
${s.progress}% ${t('instructor.studentsInsights.completionRate', 'completion rate')} - ${performance} ${t('instructor.studentsInsights.performanceLevel', 'performance level')}
${s.attendance}% ${t('instructor.studentsInsights.attendanceRate', 'attendance rate')} - ${attendanceBand} ${t('instructor.studentsInsights.engagement', 'engagement')}
${t('instructor.studentsInsights.lastActivity', 'Last activity')}: ${s.lastActive}

${t('instructor.studentsInsights.instructorObservations', 'Instructor Observations')}
${noteText}

${t('instructor.studentsInsights.keyInsights', 'Key Insights')}
${progressStatus} ${progressInsight}
${attendanceStatus} ${attendanceInsight}
${engagementStatus} ${engagementInsight}

${t('instructor.studentsInsights.recommendedActions', 'Recommended Actions')}
1. ${progressAction}
2. ${attendanceAction}
3. ${engagementAction}

${t('instructor.studentsInsights.focusAreas', 'Focus Areas for Next Week')}
• ${focusArea1}
• ${focusArea2}
• ${t('instructor.studentsInsights.focusAreas.feedback', 'Provide timely feedback on all submitted work to maintain momentum')}`;
  };

  const openInsight = (s) => {
    setInsightTitle(`${s.name} — ${selectedCourse}`);
    setIsInsightOpen(true);
    setInsightGenerating(false);
    setCurrentInsightStudent(s);
    
    // Test translation before building insight
    console.log('=== TRANSLATION TEST ===');
    console.log('Current language:', i18n.language);
    console.log('RTL status:', isRTL);
    console.log('Test translation 1:', t('instructor.studentsManagement.title', 'Students Management'));
    console.log('Test translation 2:', t('instructor.studentsInsights.title', 'Student Performance Analysis'));
    console.log('Test translation 3:', t('instructor.studentsInsights.performance.excellent', 'excellent'));
    console.log('=== END TEST ===');
    
    setInsightSummary(buildInsight(s));
    setProLockInsight(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
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
                    <button 
                      className="inline-flex items-center gap-1 text-fuchsia-700 dark:text-fuchsia-300 hover:text-fuchsia-900 dark:hover:text-fuchsia-100 px-2 py-1 rounded relative group" 
                      title={t('instructor.studentsManagement.actions.aiInsight', 'AI Insight')} 
                      onClick={() => openInsight(s)}
                    >
                      <Sparkles size={16} />
                      <span className="hidden md:inline">{t('instructor.studentsManagement.actions.aiInsight', 'Insight')}</span>
                      
                      {/* Subtle upgrade glint */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    </button>
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
        onClose={() => { 
          setIsInsightOpen(false); 
          setInsightSummary(''); 
        }}
        videoTitle={insightTitle}
        summary={insightSummary}
        isGenerating={insightGenerating}
        proLock={proLockInsight}
      />
    </div>
  );
} 