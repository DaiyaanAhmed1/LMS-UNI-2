import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Users2, Edit, Lock, X, ArrowUpCircle, Ban, CheckCircle, Archive, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@university.edu', role: 'student', status: 'active', program: 'Computer Science', credentialsCreated: true },
  { id: 2, name: 'Bob Lee', email: 'bob@university.edu', role: 'student', status: 'suspended', program: 'Mathematics', credentialsCreated: false },
  { id: 3, name: 'Dr. Carol Jones', email: 'carol@university.edu', role: 'instructor', status: 'active', program: '', credentialsCreated: true },
  { id: 4, name: 'David Kim', email: 'david@university.edu', role: 'student', status: 'active', program: 'Physics', credentialsCreated: false },
  { id: 5, name: 'Prof. Eva Green', email: 'eva@university.edu', role: 'instructor', status: 'active', program: '', credentialsCreated: true },
];

// Add mock deleted users
const mockDeletedUsers = [
  { id: 6, name: 'John Wilson', email: 'john@university.edu', role: 'student', status: 'deleted', program: 'Computer Science' },
  { id: 7, name: 'Sarah Parker', email: 'sarah@university.edu', role: 'student', status: 'deleted', program: 'Biology' },
  { id: 8, name: 'Dr. Michael Brown', email: 'michael@university.edu', role: 'instructor', status: 'deleted', program: '' },
  { id: 9, name: 'Emma Davis', email: 'emma@university.edu', role: 'student', status: 'deleted', program: 'Chemistry' },
];

const programs = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

export default function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState(mockUsers);
  const [deletedUsers, setDeletedUsers] = useState(mockDeletedUsers);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeUser, setUpgradeUser] = useState(null);
  const [newProgram, setNewProgram] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentialsUser, setCredentialsUser] = useState(null);
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  // Helper to generate random password
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    return pass;
  };

  // Suspend/Unsuspend
  const toggleSuspend = (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  // Open upgrade modal
  const openUpgradeModal = (user) => {
    setUpgradeUser(user);
    setNewProgram(user.program);
    setShowUpgradeModal(true);
  };
  const handleUpgrade = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === upgradeUser.id ? { ...u, program: newProgram } : u));
    setShowUpgradeModal(false);
    setUpgradeUser(null);
    setNewProgram('');
  };

  // Open reset modal
  const openResetModal = (user) => {
    setResetUser(user);
    setShowResetModal(true);
  };
  const handleReset = (e) => {
    e.preventDefault();
    setShowResetModal(false);
    setResetUser(null);
    // In real app, trigger password reset email
    alert(t('admin.userManagement.alerts.resetSent', { email: resetUser.email }));
  };

  // Delete user
  const handleDelete = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
    setDeletedUsers([...deletedUsers, user]);
  };

  // Restore user
  const handleRestore = (user) => {
    setDeletedUsers(deletedUsers.filter(u => u.id !== user.id));
    setUsers([...users, user]);
  };

  // Open credentials modal
  const handleCreateCredentials = (user) => {
    setCredentialsUser(user);
    setGeneratedUsername(user.email);
    setGeneratedPassword(generatePassword());
    setMustChangePassword(true);
    setEmailSent(false);
    setShowCredentialsModal(true);
  };

  // Confirm creation
  const handleConfirmCreateCredentials = () => {
    setUsers(users.map(u => u.id === credentialsUser.id ? { ...u, credentialsCreated: true } : u));
    setShowCredentialsModal(false);
    alert(t('admin.userManagement.alerts.credentialsCreated', { name: credentialsUser.name }));
  };

  // Send credentials via email (mock)
  const handleSendEmail = () => {
    setEmailSent(true);
    alert(t('admin.userManagement.alerts.emailSentTo', { email: credentialsUser.email }));
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.userManagement.title', 'User Management')}</h1>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Users2 size={18} />
                {t('admin.userManagement.tabs.active', 'Active Users')}
                {users.length > 0 && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                    {users.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('deleted')}
                className={`${
                  activeTab === 'deleted'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Archive size={18} />
                {t('admin.userManagement.tabs.deleted', 'Deleted Users')}
                {deletedUsers.length > 0 && (
                  <span className="ml-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 py-0.5 px-2 rounded-full text-xs">
                    {deletedUsers.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Active Users Table */}
          {activeTab === 'active' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.name', 'Name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.email', 'Email')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.role', 'Role')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.status', 'Status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.program', 'Program')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.credentials', 'Credentials')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.headers.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text_gray-700 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{t(`admin.userManagement.roles.${user.role}`, user.role)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300">{t('admin.userManagement.statuses.active', 'Active')}</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300">{t('admin.userManagement.statuses.suspended', 'Suspended')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-400">{user.program}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.credentialsCreated ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300">{t('admin.userManagement.credentials.created', 'Created')}</span>
                        ) : (
                          <button onClick={() => handleCreateCredentials(user)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-700">{t('admin.userManagement.credentials.create', 'Create')}</button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => openResetModal(user)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" title={t('admin.userManagement.actions.resetPassword', 'Reset Password')}><Lock size={18} /></button>
                        <button onClick={() => toggleSuspend(user)} className={user.status === 'active' ? 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200' : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200'} title={user.status === 'active' ? t('admin.userManagement.actions.suspend', 'Suspend') : t('admin.userManagement.actions.unsuspend', 'Unsuspend')}>
                          {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                        </button>
                        {user.role === 'student' && (
                          <button onClick={() => openUpgradeModal(user)} className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200" title={t('admin.userManagement.actions.upgradeProgram', 'Upgrade Program')}><ArrowUpCircle size={18} /></button>
                        )}
                        <button onClick={() => handleDelete(user)} className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400" title={t('admin.userManagement.actions.deleteUser', 'Delete User')}><X size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Deleted Users Table */}
          {activeTab === 'deleted' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {deletedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Archive size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{t('admin.userManagement.emptyDeleted.title', 'No deleted users')}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{t('admin.userManagement.emptyDeleted.subtitle', 'Deleted users will appear here after removal.')}</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.deletedHeaders.name', 'Name')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.deletedHeaders.email', 'Email')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text_gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.deletedHeaders.role', 'Role')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.deletedHeaders.program', 'Program')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.deletedHeaders.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {deletedUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{t(`admin.userManagement.roles.${user.role}`, user.role)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-400">{user.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRestore(user)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <RotateCcw size={16} className="mr-1.5" />
                            {t('admin.userManagement.actions.restore', 'Restore')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Program Modal */}
      {showUpgradeModal && upgradeUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.userManagement.upgradeModal.title', 'Upgrade Program')}</h2>
              <button onClick={() => setShowUpgradeModal(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpgrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('admin.userManagement.upgradeModal.selectNewProgram', 'Select new program')}</label>
                <select className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" required value={newProgram} onChange={e => setNewProgram(e.target.value)}>
                  <option value="">{t('admin.userManagement.upgradeModal.selectProgram', 'Select Program')}</option>
                  {programs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.userManagement.upgradeModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">{t('admin.userManagement.upgradeModal.buttons.upgrade', 'Upgrade')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && resetUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.userManagement.resetModal.title', 'Reset Password')}</h2>
              <button onClick={() => setShowResetModal(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"><X size={24} /></button>
            </div>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <p className="text-gray-700 dark:text-gray-200">{t('admin.userManagement.resetModal.prompt', { email: resetUser.email, defaultValue: `Send reset link to ${resetUser.email}?` })}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.userManagement.resetModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('admin.userManagement.resetModal.buttons.sendLink', 'Send Link')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && credentialsUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.userManagement.credentialsModal.title', 'Create Credentials')}</h2>
              <button onClick={() => setShowCredentialsModal(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('admin.userManagement.credentialsModal.fields.usernameEmail', 'Username / Email')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" value={generatedUsername} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('admin.userManagement.credentialsModal.fields.password', 'Password')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" value={generatedPassword} readOnly />
              </div>
              <div className="flex items-center">
                <input id="mustChangePassword" type="checkbox" checked={mustChangePassword} onChange={e => setMustChangePassword(e.target.checked)} className="mr-2" />
                <label htmlFor="mustChangePassword" className="text-sm text-gray-700 dark:text-gray-200">{t('admin.userManagement.credentialsModal.requireChange', 'Require password change on next login')}</label>
              </div>
              <div className="flex items-center gap-4">
                <button type="button" onClick={handleSendEmail} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('admin.userManagement.credentialsModal.sendEmail', 'Send via Email')}</button>
                {emailSent && <span className="text-green-600 text-sm">{t('admin.userManagement.credentialsModal.emailSent', 'Email sent!')}</span>}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowCredentialsModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.userManagement.credentialsModal.buttons.cancel', 'Cancel')}</button>
                <button type="button" onClick={handleConfirmCreateCredentials} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{t('admin.userManagement.credentialsModal.buttons.create', 'Create')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 