import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Plus, Send, X, Mail, User, Users, CheckCircle, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

// Example initial queries
const initialQueries = [
  {
    id: 1,
    sender: 'student1@university.edu',
    role: 'student',
    message: 'When will the exam schedule be released?',
    date: '2025-06-01',
    status: 'open',
    reply: ''
  },
  {
    id: 2,
    sender: 'instructor1@university.edu',
    role: 'instructor',
    message: 'Can I get access to last year\'s syllabus?',
    date: '2025-06-02',
    status: 'open',
    reply: ''
  }
];

const recipientOptions = [
  { value: 'all', labelKey: 'admin.notifications.sendModal.recipientOptions.all', icon: Users },
  { value: 'students', labelKey: 'admin.notifications.sendModal.recipientOptions.students', icon: User },
  { value: 'instructors', labelKey: 'admin.notifications.sendModal.recipientOptions.instructors', icon: User },
  { value: 'custom', labelKey: 'admin.notifications.sendModal.recipientOptions.custom', icon: Mail }
];

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'admin-full' || launch === 'admin-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startAdminNotificationsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startAdminNotificationsTour = () => {
    const isRTL = i18n.dir() === 'rtl';
    const pr = (ltr, rtl) => (isRTL ? rtl : ltr);
    const steps = [
      {
        target: '[data-tour="admin-notifications-header"]',
        title: t('admin.tour.notifications.header.title', 'Notifications & Queries Overview'),
        content: t('admin.tour.notifications.header.desc', 'Manage all university communications, respond to student and instructor queries, and send announcements to the entire community.'),
        placement: pr('bottom', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-notifications-send"]',
        title: t('admin.tour.notifications.send.title', 'Send Notifications'),
        content: t('admin.tour.notifications.send.desc', 'Create and send notifications to all users, specific groups, or individual recipients. Keep everyone informed about important updates and announcements.'),
        placement: pr('bottom', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-notifications-queries"]',
        title: t('admin.tour.notifications.queries.title', 'Query Management'),
        content: t('admin.tour.notifications.queries.desc', 'View and respond to questions from students and instructors. Track query status and maintain open communication channels with the university community.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-notifications-sent"]',
        title: t('admin.tour.notifications.sent.title', 'Notification History'),
        content: t('admin.tour.notifications.sent.desc', 'Review all sent notifications with recipient information and dates. Track communication history and ensure important messages were delivered.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-notifications-actions"]',
        title: t('admin.tour.notifications.actions.title', 'Communication Actions'),
        content: t('admin.tour.notifications.actions.desc', 'Reply to queries, send notifications, and manage all university communications from one centralized location.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('admin:notifications:v1', steps);
  };
  // Queries state
  const [queries, setQueries] = useState(() => {
    const stored = localStorage.getItem('queries');
    return stored ? JSON.parse(stored) : initialQueries;
  });
  useEffect(() => {
    localStorage.setItem('queries', JSON.stringify(queries));
  }, [queries]);

  // Reply modal state
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [activeQuery, setActiveQuery] = useState(null);

  // Notification state
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifForm, setNotifForm] = useState({ recipient: '', email: '', message: '' });

  // Handle reply to query
  const openReplyModal = (query) => {
    setActiveQuery(query);
    setReplyText(query.reply || '');
    setShowReplyModal(true);
  };
  const handleReply = (e) => {
    e.preventDefault();
    setQueries(queries.map(q => q.id === activeQuery.id ? { ...q, reply: replyText, status: 'closed' } : q));
    setShowReplyModal(false);
    setActiveQuery(null);
    setReplyText('');
  };

  // Handle send notification
  const openNotifModal = () => {
    setNotifForm({ recipient: '', email: '', message: '' });
    setShowNotifModal(true);
  };
  const handleSendNotif = (e) => {
    e.preventDefault();
    setNotifications([
      ...notifications,
      {
        id: notifications.length + 1,
        recipient: notifForm.recipient,
        email: notifForm.recipient === 'custom' ? notifForm.email : '',
        message: notifForm.message,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setShowNotifModal(false);
    setNotifForm({ recipient: '', email: '', message: '' });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div data-tour="admin-notifications-header" className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.notifications.title', 'Notifications & Queries')}</h1>
            <button
              data-tour="admin-notifications-send"
              onClick={openNotifModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>{t('admin.notifications.actions.sendNotification', 'Send Notification')}</span>
            </button>
          </div>

          {/* Queries Section */}
          <div data-tour="admin-notifications-queries" className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2"><MessageSquare size={20}/> {t('admin.notifications.queries.title', 'Queries')}</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.queries.table.sender', 'Sender')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.queries.table.role', 'Role')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.queries.table.message', 'Message')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.queries.table.date', 'Date')}</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.queries.table.status', 'Status')}</th>
                    <th data-tour="admin-notifications-actions" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.queries.table.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {queries.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{q.sender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize dark:text-gray-300">{q.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{q.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-300">{q.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {q.status === 'open' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{t('admin.notifications.queries.status.open', 'Open')}</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t('admin.notifications.queries.status.closed', 'Closed')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openReplyModal(q)}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
                          disabled={q.status === 'closed'}
                        >
                          {t('admin.notifications.actions.reply', 'Reply')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications Sent Section */}
          <div data-tour="admin-notifications-sent" className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2"><Send size={20}/> {t('admin.notifications.sent.title', 'Notifications Sent')}</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.sent.table.recipient', 'Recipient')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.sent.table.email', 'Email')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.sent.table.message', 'Message')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.notifications.sent.table.date', 'Date')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map(n => (
                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{t(recipientOptions.find(o => o.value === n.recipient)?.labelKey || '')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{n.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{n.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-300">{n.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && activeQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.notifications.queries.replyModal.title', 'Reply to Query')}</h2>
              <button onClick={() => setShowReplyModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"><X size={24} /></button>
            </div>
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.notifications.queries.replyModal.query', 'Query')}</label>
                <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">{activeQuery.message}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.notifications.queries.replyModal.yourReply', 'Your Reply')}</label>
                <textarea className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300" rows={3} required value={replyText} onChange={e => setReplyText(e.target.value)} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowReplyModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.notifications.actions.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">{t('admin.notifications.actions.sendReply', 'Send Reply')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.notifications.sendModal.title', 'Send Notification')}</h2>
              <button onClick={() => setShowNotifModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"><X size={24} /></button>
            </div>
            <form onSubmit={handleSendNotif} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.notifications.sendModal.fields.recipient', 'Recipient')}</label>
                <select className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300" required value={notifForm.recipient} onChange={e => setNotifForm(f => ({ ...f, recipient: e.target.value }))}>
                  <option value="">{t('admin.notifications.sendModal.fields.selectRecipient', 'Select Recipient')}</option>
                  {recipientOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey, opt.value)}</option>)}
                </select>
              </div>
              {notifForm.recipient === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.notifications.sendModal.fields.email', 'Email')}</label>
                  <input type="email" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300" required value={notifForm.email} onChange={e => setNotifForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.notifications.sendModal.fields.message', 'Message')}</label>
                <textarea className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300" rows={3} required value={notifForm.message} onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowNotifModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.notifications.actions.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">{t('admin.notifications.actions.send', 'Send')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 