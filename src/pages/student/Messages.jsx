import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  File,
  Smile,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTour } from '../../context/TourContext.jsx';

const conversations = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Instructor',
    course: 'Introduction to Computer Science',
    lastMessage: 'Please submit your assignment by Friday.',
    time: '10:30 AM',
    unread: 2,
    avatar: 'SJ',
    online: true
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    role: 'Instructor',
    course: 'Data Structures and Algorithms',
    lastMessage: 'Great work on the last project!',
    time: 'Yesterday',
    unread: 0,
    avatar: 'MC',
    online: false
  },
  {
    id: 3,
    name: 'Emily Brown',
    role: 'Student',
    course: 'Web Development',
    lastMessage: 'Can you help me with the React components?',
    time: '2 days ago',
    unread: 0,
    avatar: 'EB',
    online: true
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    role: 'Instructor',
    course: 'Database Systems',
    lastMessage: 'The exam schedule has been updated.',
    time: '3 days ago',
    unread: 0,
    avatar: 'JW',
    online: false
  }
];

const initialMessages = {
  1: [
    { id: 1, sender: 'Dr. Sarah Johnson', content: 'Hello John, how are you doing with the programming assignment?', time: '10:15 AM', isInstructor: true },
    { id: 2, sender: 'You', content: 'Hi Dr. Johnson, I\'m working on it. I have a question about the array implementation.', time: '10:20 AM', isInstructor: false },
    { id: 3, sender: 'Dr. Sarah Johnson', content: 'Sure, what\'s your question?', time: '10:25 AM', isInstructor: true },
    { id: 4, sender: 'You', content: 'I\'m not sure how to handle the edge cases in the sorting algorithm.', time: '10:28 AM', isInstructor: false },
    { id: 5, sender: 'Dr. Sarah Johnson', content: 'Please submit your assignment by Friday.', time: '10:30 AM', isInstructor: true }
  ],
  2: [
    { id: 1, sender: 'Prof. Michael Chen', content: 'Hi John, your last project submission was excellent!', time: 'Yesterday, 2:10 PM', isInstructor: true },
    { id: 2, sender: 'You', content: 'Thank you, Professor! I enjoyed working on it.', time: 'Yesterday, 2:12 PM', isInstructor: false },
    { id: 3, sender: 'Prof. Michael Chen', content: 'Keep up the good work. Let me know if you have any questions about the next assignment.', time: 'Yesterday, 2:15 PM', isInstructor: true }
  ],
  3: [
    { id: 1, sender: 'Emily Brown', content: 'Hey John, are you coming to the study group later?', time: '2 days ago, 4:00 PM', isInstructor: true },
    { id: 2, sender: 'You', content: 'Yes! I\'ll be there at 5 PM.', time: '2 days ago, 4:05 PM', isInstructor: false },
    { id: 3, sender: 'Emily Brown', content: 'Great! Can you help me with the React components before we start?', time: '2 days ago, 4:10 PM', isInstructor: true },
    { id: 4, sender: 'You', content: 'Of course, see you soon!', time: '2 days ago, 4:12 PM', isInstructor: false }
  ],
  4: [
    { id: 1, sender: 'Dr. James Wilson', content: 'Hello John, the exam schedule has been updated. Please check the portal.', time: '3 days ago, 9:00 AM', isInstructor: true },
    { id: 2, sender: 'You', content: 'Thank you, Dr. Wilson! I will check it now.', time: '3 days ago, 9:05 AM', isInstructor: false },
    { id: 3, sender: 'Dr. James Wilson', content: 'Let me know if you have any questions about the syllabus.', time: '3 days ago, 9:10 AM', isInstructor: true }
  ]
};

function Messages() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [isReplying, setIsReplying] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const { startTour } = useTour();
  const moreMenuRef = useRef(null);

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const convId = selectedConversation.id;
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg = {
        id: (chatMessages[convId]?.length || 0) + 1,
        sender: 'You',
        content: newMessage,
        time,
        isInstructor: false
      };
      setChatMessages(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), userMsg]
      }));
      setNewMessage('');
      setIsReplying(true);
      // Simulate a reply after 1s
      setTimeout(() => {
        const replyMsg = getAutoReply(selectedConversation);
        setChatMessages(prev => ({
          ...prev,
          [convId]: [...(prev[convId] || []), replyMsg]
        }));
        setIsReplying(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCall = () => {
    if (selectedConversation) {
      setIsCallActive(true);
      // Simulate call functionality
      setActionMessage(`Calling ${selectedConversation.name}...`);
      setShowActionPopup(true);
      // In a real app, this would integrate with a calling service
      setTimeout(() => {
        setIsCallActive(false);
        setShowActionPopup(false);
        setActionMessage('');
      }, 3000);
    }
  };

  const handleVideoCall = () => {
    if (selectedConversation) {
      setIsVideoActive(true);
      // Simulate video call functionality
      setActionMessage(`Starting video call with ${selectedConversation.name}...`);
      setShowActionPopup(true);
      // In a real app, this would integrate with a video calling service
      setTimeout(() => {
        setIsVideoActive(false);
        setShowActionPopup(false);
        setActionMessage('');
      }, 3000);
    }
  };

  const handleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handleMoreMenuAction = (action) => {
    setShowMoreMenu(false);
    let message = '';
    switch (action) {
      case 'block':
        message = `Blocked ${selectedConversation.name}`;
        break;
      case 'report':
        message = `Reported ${selectedConversation.name}`;
        break;
      case 'clear':
        if (selectedConversation) {
          setChatMessages(prev => ({
            ...prev,
            [selectedConversation.id]: []
          }));
          message = 'Chat cleared successfully';
        }
        break;
      case 'export':
        message = 'Exporting conversation...';
        break;
      default:
        break;
    }
    if (message) {
      setActionMessage(message);
      setShowActionPopup(true);
    }
  };

  const closeActionPopup = () => {
    setShowActionPopup(false);
    setActionMessage('');
  };

  // Generate a demo reply based on the conversation
  function getAutoReply(conversation) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const replies = {
      1: [
        "Thanks for your message, I'll review it soon.",
        "Let me know if you need any more help!",
        "I'll get back to you after my next class.",
        "Good question! I'll explain in the next lecture."
      ],
      2: [
        "You're welcome! Keep up the good work.",
        "Let me know if you need any clarification.",
        "I'll post the next assignment soon.",
        "Great to hear from you!"
      ],
      3: [
        "See you at the study group!",
        "Thanks for helping with React!",
        "Let's catch up before class.",
        "I'll bring my notes."
      ],
      4: [
        "You're welcome, John!",
        "Let me know if you have any questions.",
        "Check the portal for updates.",
        "Good luck with your studies!"
      ]
    };
    const convId = conversation.id;
    const replyText = replies[convId][Math.floor(Math.random() * replies[convId].length)];
    return {
      id: (chatMessages[convId]?.length || 0) + 2,
      sender: conversation.name,
      content: replyText,
      time,
      isInstructor: true
    };
  }

  const startMessagesTour = () => {
    const steps = [
      { 
        target: '#messages-search', 
        title: t('student.tour.messages.title', 'Find Conversations'), 
        content: t('student.tour.messages.desc', 'Search for conversations by person name or course.'),
        placement: 'bottom-start',
        disableBeacon: true
      },
      { 
        target: '[data-tour="conversations-list"]', 
        title: t('student.tour.messages.listTitle', 'Message Threads'), 
        content: t('student.tour.messages.listDesc', 'View all your conversations with unread message indicators.'),
        placement: 'right-start',
        disableBeacon: true
      },
      { 
        target: '[data-tour="open-conversation"]', 
        title: t('student.tour.messages.openTitle', 'Open Chat'), 
        content: t('student.tour.messages.openDesc', 'Click on any conversation to start chatting.'),
        placement: 'right-start',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:messages:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:messages:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:messages:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startMessagesTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startMessagesTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  // Handle clicking outside more menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar role="student" />
      <div className="flex-1 flex min-h-0">
        {/* Conversations List */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder={t('student.messages.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                id="messages-search"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" data-tour="conversations-list">
            {filteredConversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                data-tour="open-conversation"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{conversation.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{conversation.time}</span>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{conversation.course}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                      {selectedConversation.avatar}
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900 dark:text-gray-100">{selectedConversation.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedConversation.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCall}
                    disabled={isCallActive}
                    className={`p-2 rounded-full transition-colors ${
                      isCallActive 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    title={isCallActive ? 'End Call' : 'Call'}
                  >
                    <Phone size={20} />
                  </button>
                  <button 
                    onClick={handleVideoCall}
                    disabled={isVideoActive}
                    className={`p-2 rounded-full transition-colors ${
                      isVideoActive 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    title={isVideoActive ? 'End Video Call' : 'Video Call'}
                  >
                    <Video size={20} />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={handleMoreMenu}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
                      title="More options"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {/* More Menu Dropdown */}
                    {showMoreMenu && (
                      <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-20`} ref={moreMenuRef}>
                        <button
                          onClick={() => handleMoreMenuAction('block')}
                          className={`w-full px-4 py-2 ${isRTL ? 'text-right' : 'text-left'} text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          {t('student.messages.menu.blockUser')}
                        </button>
                        <button
                          onClick={() => handleMoreMenuAction('report')}
                          className={`w-full px-4 py-2 ${isRTL ? 'text-right' : 'text-left'} text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          {t('student.messages.menu.reportUser')}
                        </button>
                        <button
                          onClick={() => handleMoreMenuAction('clear')}
                          className={`w-full px-4 py-2 ${isRTL ? 'text-right' : 'text-left'} text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          {t('student.messages.menu.clearChat')}
                        </button>
                        <button
                          onClick={() => handleMoreMenuAction('export')}
                          className={`w-full px-4 py-2 ${isRTL ? 'text-right' : 'text-left'} text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          {t('student.messages.menu.exportChat')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-0">
                <div className="max-w-3xl mx-auto space-y-4">
                  {chatMessages[selectedConversation.id]?.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isInstructor ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isInstructor
                            ? 'bg-white dark:bg-gray-800 border dark:border-gray-700'
                            : 'bg-blue-600 text-white'
                        }`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-medium">
                            {message.isInstructor ? message.sender : t('student.messages.you')}
                          </span>
                          <span className="text-xs opacity-75">{message.time}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isReplying && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] rounded-lg p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 opacity-60 italic text-gray-400 dark:text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>
                        {t('student.messages.typing')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex-shrink-0 relative">
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <button
                      onClick={() => setShowAttachments(!showAttachments)}
                      className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400`}
                      id="toggle-attachments"
                    >
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="text"
                      placeholder={t('student.messages.inputPlaceholder')}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`w-full ${isRTL ? 'pr-10 pl-24' : 'pl-10 pr-24'} py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100`}
                      id="message-input"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 flex items-center gap-2`}>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
                        <Smile size={20} />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        id="send-message"
                      >
                        <Send size={16} />
                        {t('student.messages.send')}
                      </button>
                    </div>
                  </div>

                  {/* Attachments Menu */}
                  {showAttachments && (
                    <div className={`absolute bottom-full ${isRTL ? 'right-0' : 'left-0'} mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-2 z-10`}>
                      <div className="grid grid-cols-4 gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex flex-col items-center gap-1">
                          <ImageIcon size={20} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{t('student.messages.attachments.image')}</span>
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex flex-col items-center gap-1">
                          <File size={20} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{t('student.messages.attachments.file')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('student.messages.empty.title')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('student.messages.empty.subtitle')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Popup */}
      {showActionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeActionPopup}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('student.messages.actionStatus.title')}</h3>
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

export default Messages; 