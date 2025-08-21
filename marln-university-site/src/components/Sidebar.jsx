import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users2, 
  UserCircle, 
  BookOpen, 
  Bell, 
  BarChart3, 
  LogOut,
  Settings,
  Building2,
  GraduationCap,
  FileText,
  Calendar,
  ClipboardList,
  MessageSquare,
  BookMarked,
  Award,
  Library,
  Sun,
  Moon,
  Bot,
  HelpCircle,
  Lock,
  MessageCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/marln-logo.png';

const adminMenuItems = [
  { id: 'dashboard', labelKey: 'sidebar.menu.admin.dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'students', labelKey: 'sidebar.menu.admin.students', icon: Users2, path: '/admin/students' },
  { id: 'instructors', labelKey: 'sidebar.menu.admin.instructors', icon: UserCircle, path: '/admin/instructors' },
  { id: 'programs', labelKey: 'sidebar.menu.admin.programs', icon: BookOpen, path: '/admin/programs' },
  // { id: 'departments', labelKey: 'sidebar.menu.admin.departments', icon: Building2, path: '/admin/departments' },
  { id: 'courses', labelKey: 'sidebar.menu.admin.courses', icon: GraduationCap, path: '/admin/courses' },
  { id: 'documents', labelKey: 'sidebar.menu.admin.documents', icon: FileText, path: '/admin/documents' },
  { id: 'calendar', labelKey: 'sidebar.menu.admin.calendar', icon: Calendar, path: '/admin/calendar' },
  { id: 'notifications', labelKey: 'sidebar.menu.admin.notifications', icon: Bell, path: '/admin/notifications' },
  { id: 'reports', labelKey: 'sidebar.menu.admin.reports', icon: BarChart3, path: '/admin/reports' },
  { id: 'users', labelKey: 'sidebar.menu.admin.users', icon: Users2, path: '/admin/users' },
  { id: 'settings', labelKey: 'sidebar.menu.admin.settings', icon: Settings, path: '/admin/settings' },
];

const instructorMenuItems = [
  { id: 'dashboard', labelKey: 'sidebar.menu.instructor.dashboard', icon: LayoutDashboard, path: '/instructor/dashboard' },
  { id: 'courses', labelKey: 'sidebar.menu.instructor.courses', icon: BookOpen, path: '/instructor/courses' },
  { id: 'students', labelKey: 'sidebar.menu.instructor.students', icon: Users2, path: '/instructor/students' },
  { id: 'assignments', labelKey: 'sidebar.menu.instructor.assignments', icon: ClipboardList, path: '/instructor/assignments' },
  { id: 'grades', labelKey: 'sidebar.menu.instructor.grades', icon: GraduationCap, path: '/instructor/grades' },
  { id: 'calendar', labelKey: 'sidebar.menu.instructor.calendar', icon: Calendar, path: '/instructor/calendar' },
  { id: 'materials', labelKey: 'sidebar.menu.instructor.materials', icon: FileText, path: '/instructor/materials' },
  { id: 'messages', labelKey: 'sidebar.menu.instructor.messages', icon: MessageSquare, path: '/instructor/messages' },
  { id: 'notifications', labelKey: 'sidebar.menu.instructor.notifications', icon: Bell, path: '/instructor/notifications' },
];

const studentMenuItems = [
  { id: 'dashboard', labelKey: 'sidebar.menu.student.dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { id: 'my-courses', labelKey: 'sidebar.menu.student.my-courses', icon: BookOpen, path: '/student/courses' },
  { id: 'assignments', labelKey: 'sidebar.menu.student.assignments', icon: ClipboardList, path: '/student/assignments' },
  { id: 'grades', labelKey: 'sidebar.menu.student.grades', icon: Award, path: '/student/grades' },
  { id: 'schedule', labelKey: 'sidebar.menu.student.schedule', icon: Calendar, path: '/student/schedule' },
  { id: 'materials', labelKey: 'sidebar.menu.student.materials', icon: Library, path: '/student/materials' },
  { id: 'messages', labelKey: 'sidebar.menu.student.messages', icon: MessageSquare, path: '/student/messages' },
  { id: 'notifications', labelKey: 'sidebar.menu.student.notifications', icon: Bell, path: '/student/notifications' },
  { id: 'ecollab', labelKey: 'sidebar.menu.student.ecollab', icon: BookMarked, path: '/student/ecollab' },
];

export default function Sidebar({ role: propRole }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { role: authRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const sidebarRef = useRef(null);

  // Use the role from props if provided, otherwise use the role from auth context
  const role = propRole || authRole;

  // Auto-scroll to active menu item only when navigating to a new page
  const [lastPath, setLastPath] = useState(location.pathname);
  
  useEffect(() => {
    // Only scroll if we're actually navigating to a different page
    if (location.pathname !== lastPath) {
      setLastPath(location.pathname);
      
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        if (sidebarRef.current) {
          const activeButton = sidebarRef.current.querySelector('[aria-current="page"]');
          if (activeButton) {
            activeButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }
      }, 100);
    }
  }, [location.pathname, lastPath]);

  const menuItems = role === 'admin' ? adminMenuItems : 
                   role === 'instructor' ? instructorMenuItems :
                   role === 'student' ? studentMenuItems : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine active tab based on current path
  const activeTab = menuItems.find(item => location.pathname.startsWith(item.path))?.id;

  // Get user display name based on role
  const getUserDisplayName = () => {
    switch (role) {
      case 'instructor':
        return 'Dr. Emily Carter';
      case 'student':
        return 'John Smith';
      case 'admin':
        return 'Alex Johnson';
      default:
        return t('sidebar.roles.user');
    }
  };

  // Get profile path based on role
  const getProfilePath = () => {
    switch (role) {
      case 'admin':
        return '/admin/profile';
      case 'instructor':
        return '/instructor/profile';
      case 'student':
        return '/student/profile';
      default:
        return '/';
    }
  };

  const startStudentFullTourFromSidebar = () => {
    if (role !== 'student') return; // Scope to student for now
    localStorage.setItem('tour:hint:sidebar:shown', '1');
    window.dispatchEvent(new CustomEvent('tour:open-launcher'));
  };

  const startInstructorFullTourFromSidebar = () => {
    if (role !== 'instructor') return;
    localStorage.setItem('tour:hint:sidebar:shown', '1');
    window.dispatchEvent(new CustomEvent('tour:open-launcher'));
  };

  const isSageAIStudent = location.pathname === '/student/sage-ai';
  const isSageAIInstructor = location.pathname === '/instructor/sage-ai';

  return (
    <div id="sidebar-nav" className="w-64 h-screen bg-[#11296F] dark:bg-gray-900 text-white dark:text-gray-100 flex flex-col" data-tour="sidebar">
      {/* Logo */}
      <div className="p-4 border-b border-[#0a1f4d] dark:border-gray-800">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-gray-100/80 rounded-lg flex items-center justify-center backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <img src={logo} alt="MarLn" className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">{t('sidebar.brand')}</h1>
        </div>
      </div>

      {/* User Info */}
      <button
        className="p-4 border-b border-[#0a1f4d] dark:border-gray-800 w-full text-left hover:bg-[#223a7a] dark:hover:bg-gray-800 transition-colors"
        onClick={() => navigate(getProfilePath())}
        aria-label={t('sidebar.profile.ariaEdit')}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
            {getUserDisplayName().split(' ').map(word => word[0]).join('')}
          </div>
          <div>
            <p className="font-medium">{getUserDisplayName()}</p>
            <p className="text-sm text-[#4a6baa] dark:text-blue-300">{t(`sidebar.roles.${role}`)}</p>
          </div>
        </div>
      </button>

      {/* Menu Items */}
      <div ref={sidebarRef} className="flex-1 overflow-y-auto py-4">
        {(role === 'student' ? studentMenuItems : role === 'instructor' ? instructorMenuItems : adminMenuItems).map(item => (
          <button
            key={item.id}
            onClick={() => {
              // Only scroll to top if navigating to a different page
              if (location.pathname !== item.path) {
                navigate(item.path);
                // Scroll to top when navigating to a new page
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-[#0a1f4d] dark:hover:bg-gray-800 transition-colors ${location.pathname === item.path ? 'bg-[#0a1f4d] dark:bg-gray-800' : ''}`}
            data-tour={`sidebar-link-${item.id}`}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <item.icon size={20} />
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Sage AI Button */}
      <button
        onClick={() => {
          if (role === 'admin') {
            // Admin role - button is locked/disabled
            return;
          }
          const sageAIPath = role === 'instructor' ? '/instructor/sage-ai' : '/student/sage-ai';
          if (location.pathname !== sageAIPath) {
            navigate(sageAIPath);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors border-t border-[#0a1f4d] dark:border-gray-800 ${
          role === 'admin' 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[#0a1f4d] dark:hover:bg-gray-800'
        } ${
          (role === 'instructor' && location.pathname === '/instructor/sage-ai') || 
          (role === 'student' && location.pathname === '/student/sage-ai') 
            ? 'bg-[#0a1f4d] dark:bg-gray-800' 
            : ''
        }`}
        aria-current={(role === 'instructor' && location.pathname === '/instructor/sage-ai') || (role === 'student' && location.pathname === '/student/sage-ai') ? 'page' : undefined}
        disabled={role === 'admin'}
        title={role === 'admin' ? t('sidebar.sageAI.proFeature', 'Pro Feature - Coming Soon') : undefined}
      >
        {role === 'admin' ? <Lock size={20} /> : <Bot size={20} />}
        <span>{t(`sidebar.menu.${role}.sage-ai`)}</span>
      </button>

      {/* Talk Bright Button - Only for Students */}
      {role === 'student' && (
        <button
          onClick={() => {
            window.open('https://fanciful-manatee-e9960b.netlify.app', '_blank');
          }}
          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-[#0a1f4d] dark:hover:bg-gray-800 transition-colors border-t border-[#0a1f4d] dark:border-gray-800"
          title="Open Talk Bright in new tab"
        >
          <MessageCircle size={20} />
          <span>{t('sidebar.menu.student.talk-bright')}</span>
        </button>
      )}

      {/* Language Switcher */}
      <div className="border-t border-[#0a1f4d] dark:border-gray-800">
        <LanguageSwitcher />
      </div>

      {/* Start Tour - Student */}
      {role === 'student' && (
        <button
          onClick={isSageAIStudent ? undefined : startStudentFullTourFromSidebar}
          disabled={isSageAIStudent}
          className={`p-4 border-t border-[#0a1f4d] dark:border-gray-800 flex items-center space-x-3 transition-colors ${isSageAIStudent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0a1f4d] dark:hover:bg-gray-800'}`}
          title={isSageAIStudent ? t('student.tour.cta.disabled', 'Tour not available on Sage AI') : t('student.tour.cta.try', 'Start Tour')}
          aria-label={t('student.tour.cta.try', 'Start Tour')}
          aria-disabled={isSageAIStudent}
        >
          <HelpCircle size={20} />
          <span>{t('student.tour.cta.try', 'Start Tour')}</span>
          {!isSageAIStudent && !localStorage.getItem('tour:hint:sidebar:shown') && (
            <span className="ml-auto flex items-center gap-2 text-xs text-yellow-200">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {t('student.tour.cta.hint', 'Click here')}
            </span>
          )}
        </button>
      )}

      {/* Start Tour - Instructor */}
      {role === 'instructor' && (
        <button
          onClick={isSageAIInstructor ? undefined : startInstructorFullTourFromSidebar}
          disabled={isSageAIInstructor}
          className={`p-4 border-t border-[#0a1f4d] dark:border-gray-800 flex items-center space-x-3 transition-colors ${isSageAIInstructor ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0a1f4d] dark:hover:bg-gray-800'}`}
          title={isSageAIInstructor ? t('student.tour.cta.disabled', 'Tour not available on Sage AI') : t('student.tour.cta.try', 'Start Tour')}
          aria-label={t('student.tour.cta.try', 'Start Tour')}
          aria-disabled={isSageAIInstructor}
        >
          <HelpCircle size={20} />
          <span>{t('student.tour.cta.try', 'Start Tour')}</span>
          {!isSageAIInstructor && !localStorage.getItem('tour:hint:sidebar:shown') && (
            <span className="ml-auto flex items-center gap-2 text-xs text-yellow-200">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {t('student.tour.cta.hint', 'Click here')}
            </span>
          )}
        </button>
      )}

      {/* Theme Switch Button */}
      <button
        onClick={toggleTheme}
        className="p-4 border-t border-[#0a1f4d] dark:border-gray-800 flex items-center space-x-3 hover:bg-[#0a1f4d] dark:hover:bg-gray-800 transition-colors"
        style={{ borderBottom: 'none' }}
        aria-label={t('sidebar.theme.toggleAria')}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        <span>{theme === 'light' ? t('sidebar.theme.dark') : t('sidebar.theme.light')}</span>
      </button>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="p-4 border-t border-[#0a1f4d] dark:border-gray-800 flex items-center space-x-3 hover:bg-[#0a1f4d] dark:hover:bg-gray-800 transition-colors"
      >
        <LogOut size={20} />
        <span>{t('sidebar.logout')}</span>
      </button>
    </div>
  );
}
