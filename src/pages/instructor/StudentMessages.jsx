import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Send, Trash2, Plus, MessageSquare, User, Search, Clock, Reply, MoreVertical, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const dummyStudents = [
  { id: 1, name: 'Alice Johnson', course: 'CS101 - Intro to Computer Science', avatar: 'AJ', unread: 2, lastMessage: '2025-06-01T10:00:00' },
  { id: 2, name: 'Bob Smith', course: 'ML305 - Machine Learning', avatar: 'BS', unread: 0, lastMessage: '2025-06-02T11:00:00' },
  { id: 3, name: 'Charlie Brown', course: 'DS220 - Data Structures', avatar: 'CB', unread: 1, lastMessage: '2025-06-03T12:00:00' },
  { id: 4, name: 'Diana Prince', course: 'AI410 - Artificial Intelligence', avatar: 'DP', unread: 0, lastMessage: '2025-06-04T09:00:00' },
  { id: 5, name: 'Eve Wilson', course: 'WD150 - Web Development', avatar: 'EW', unread: 3, lastMessage: '2025-06-05T14:00:00' },
];

const dummyMessages = [
  { id: 1, studentId: 1, message: 'Hello, I have a question about the assignment.', timestamp: '2025-06-01T10:00:00', type: 'received' },
  { id: 2, studentId: 1, message: 'The deadline is confusing me.', timestamp: '2025-06-01T10:30:00', type: 'received' },
  { id: 3, studentId: 1, message: 'The assignment is due next Friday at 11:59 PM. Let me know if you need any clarification!', timestamp: '2025-06-01T11:00:00', type: 'sent' },
  { id: 4, studentId: 2, message: 'Can you clarify the due date for the quiz?', timestamp: '2025-06-02T11:00:00', type: 'received' },
  { id: 5, studentId: 2, message: 'The quiz is due this Wednesday at 3 PM. Good luck!', timestamp: '2025-06-02T11:15:00', type: 'sent' },
  { id: 6, studentId: 3, message: 'Thank you for the help!', timestamp: '2025-06-03T12:00:00', type: 'received' },
  { id: 7, studentId: 4, message: 'I need help with the AI project.', timestamp: '2025-06-04T09:00:00', type: 'received' },
  { id: 8, studentId: 5, message: 'When is the next office hours?', timestamp: '2025-06-05T14:00:00', type: 'received' },
  { id: 9, studentId: 5, message: 'I have a question about the final project.', timestamp: '2025-06-05T14:30:00', type: 'received' },
  { id: 10, studentId: 5, message: 'Office hours are every Tuesday and Thursday from 2-4 PM.', timestamp: '2025-06-05T15:00:00', type: 'sent' },
];

export default function StudentMessages() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { startTour } = useTour();
  const [messages, setMessages] = useState(dummyMessages);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(dummyStudents[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startMessagesTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startMessagesTour = () => {
    const steps = [
      { target: '[data-tour="instructor-messages-list"]', title: t('instructor.tour.messages.list.title', 'Conversations'), content: t('instructor.tour.messages.list.desc', 'Search, select, and review student conversations.'), placement: 'top', disableBeacon: true },
      { target: '[data-tour="instructor-messages-compose"]', title: t('instructor.tour.messages.compose.title', 'Compose'), content: t('instructor.tour.messages.compose.desc', 'Create or edit a message to students.'), placement: 'left', disableBeacon: true }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:messages:v1', steps);
  };

  const openAddMessage = () => {
    setModalMessage({ studentId: selectedStudent, message: '', timestamp: new Date().toISOString() });
    setShowModal(true);
  };

  const openEditMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage(null);
  };

  const saveMessage = () => {
    if (modalMessage.id) {
      setMessages(messages.map(m => m.id === modalMessage.id ? modalMessage : m));
    } else {
      setMessages([...messages, { ...modalMessage, id: Date.now() }]);
    }
    setShowModal(false);
    setModalMessage(null);
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const filteredStudents = dummyStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudentData = dummyStudents.find(s => s.id === selectedStudent);
  const studentMessages = messages.filter(m => m.studentId === selectedStudent);
  const sortedMessages = [...studentMessages].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
  });

  const filteredMessages = sortedMessages.filter(message => {
    if (filterType === 'all') return true;
    if (filterType === 'received') return message.type === 'received';
    if (filterType === 'sent') return message.type === 'sent';
    return true;
  });

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      studentId: selectedStudent,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'sent'
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return t('instructor.studentMessages.yesterday', 'Yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.studentMessages.title')}</h1>
            </div>
            <button onClick={openAddMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors" data-tour="instructor-messages-compose">
              <Plus size={18} /> {t('instructor.studentMessages.new')}
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={18} />
              <input 
                type="text" 
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('instructor.studentMessages.searchPlaceholder', 'Search students or courses...')} 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <select 
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">{t('instructor.studentMessages.filters.all', 'All Messages')}</option>
              <option value="received">{t('instructor.studentMessages.filters.received', 'Received')}</option>
              <option value="sent">{t('instructor.studentMessages.filters.sent', 'Sent')}</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100 transition-colors"
            >
              {sortOrder === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />}
              {t(`instructor.studentMessages.sort.${sortOrder}`, sortOrder === 'newest' ? 'Newest First' : 'Oldest First')}
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Students List */}
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto" data-tour="instructor-messages-list">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('instructor.studentMessages.students', 'Students')}</h2>
              <div className="space-y-2">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStudent === student.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                          {student.avatar}
                        </div>
                        {student.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {student.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 dark:text-gray-100 truncate">{student.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{student.course}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{formatTime(student.lastMessage)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
            {selectedStudentData ? (
              <>
                {/* Chat Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                      {selectedStudentData.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudentData.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{selectedStudentData.course}</div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {filteredMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'sent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className={`text-sm ${message.type === 'sent' ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                          {message.message}
                        </p>
                        <p className={`text-xs mt-1 ${message.type === 'sent' ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && sendMessage()}
                      placeholder={t('instructor.studentMessages.inputPlaceholder', 'Type your message...')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare size={48} className="mx-auto mb-4" />
                  <p>{t('instructor.studentMessages.selectStudent', 'Select a student to start messaging')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {showModal && modalMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
              <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeModal}><Trash2 size={28} /></button>
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{modalMessage.id ? t('instructor.studentMessages.modal.editTitle') : t('instructor.studentMessages.modal.newTitle')}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.studentMessages.modal.fieldMessage')}</label>
                <textarea className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-900 dark:text-gray-100" rows={4} value={modalMessage.message} onChange={e => setModalMessage({ ...modalMessage, message: e.target.value })} />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" onClick={saveMessage}>{modalMessage.id ? t('instructor.studentMessages.actions.saveChanges') : t('instructor.studentMessages.actions.send')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 