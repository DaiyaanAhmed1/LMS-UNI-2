import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Users2, UserCircle, BookOpen, Award, BarChart2, DollarSign, MessageCircle, Calendar, Bell, TrendingUp, PieChart, CheckCircle, FileText, Plus, Settings, Activity, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stats = [
  { labelKey: 'admin.dashboard.stats.students', value: '5,699', icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900' },
  { labelKey: 'admin.dashboard.stats.instructors', value: '297', icon: UserCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900' },
  { labelKey: 'admin.dashboard.stats.courses', value: '128', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900' },
  { labelKey: 'admin.dashboard.stats.revenue', value: '$87,395', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900' },
];

const quickActions = [
  { labelKey: 'admin.dashboard.quickActions.addCourse', icon: Plus, color: 'bg-blue-100 dark:bg-blue-800', href: '/admin/courses' },
  { labelKey: 'admin.dashboard.quickActions.manageUsers', icon: Users2, color: 'bg-green-100 dark:bg-green-800', href: '/admin/users' },
  { labelKey: 'admin.dashboard.quickActions.viewReports', icon: BarChart2, color: 'bg-purple-100 dark:bg-purple-800', href: '/admin/reports' },
  { labelKey: 'admin.dashboard.quickActions.systemSettings', icon: Settings, color: 'bg-yellow-100 dark:bg-yellow-800', href: '/admin/settings' },
];

const recentActivity = [
  { icon: CheckCircle, desc: 'Student Sarah Thompson enrolled in "Advanced Calculus".', time: '2 min ago', color: 'text-blue-600' },
  { icon: Award, desc: 'Instructor Mark Collins published new course material.', time: '10 min ago', color: 'text-green-600' },
  { icon: Bell, desc: 'Support ticket created by Lisa Ray.', time: '30 min ago', color: 'text-yellow-600' },
  { icon: FileText, desc: 'Admin updated system settings.', time: '1 hr ago', color: 'text-purple-600' },
];

const announcements = [
  { title: 'Summer Semester Registration', desc: 'Registration for summer semester is now open.', date: 'Jun 10, 2024', by: 'Registrar', views: 1200 },
  { title: 'New Library Resources', desc: 'Explore new e-books and journals in the library.', date: 'Jun 8, 2024', by: 'Library', views: 725 },
  { title: 'Faculty Meeting', desc: 'Monthly faculty meeting this Friday at 2 PM.', date: 'Jun 5, 2024', by: 'Dean Office', views: 98 },
];

const pendingApprovals = [
  { type: 'Course', name: 'Machine Learning 101', submittedBy: 'Dr. Emily Carter', date: 'Jun 9, 2024' },
  { type: 'Instructor', name: 'Dr. John Doe', submittedBy: 'HR', date: 'Jun 8, 2024' },
];

const enrollmentTrends = [1200, 1250, 1300, 1350, 1400, 1450, 1500];
const courseCompletions = [200, 250, 300, 350, 400, 450, 500];

const systemHealth = { server: 'Online', uptime: '99.98%', api: 'Healthy', activeUsers: 312, peakTime: '2:00 PM' };

const topCourses = [
  { name: 'Data Structures', enrollments: 320 },
  { name: 'Machine Learning', enrollments: 295 },
  { name: 'Organic Chemistry', enrollments: 270 },
  { name: 'Business Analytics', enrollments: 250 },
];

const feedbackTickets = [
  { user: 'Lisa Ray', type: 'Feedback', msg: 'Loving the new dashboard!', time: '1 hr ago' },
  { user: 'John Smith', type: 'Support', msg: 'Issue with course enrollment.', time: '2 hrs ago' },
  { user: 'Sarah Johnson', type: 'Support', msg: 'Unable to download materials.', time: '3 hrs ago' },
];

const upcomingEvents = [
  { date: 'Jun 15', title: 'Faculty Meeting', desc: 'Monthly meeting for all faculty.' },
  { date: 'Jun 18', title: 'Course Registration Deadline', desc: 'Last day for summer course registration.' },
  { date: 'Jun 20', title: 'Webinar: EdTech Trends', desc: 'Open to all staff and students.' },
];

const instructorLeaderboard = [
  { name: 'Dr. Emily Carter', rating: 4.9, completions: 120 },
  { name: 'Prof. Mark Collins', rating: 4.8, completions: 110 },
  { name: 'Dr. John Doe', rating: 4.7, completions: 105 },
];

const studentProgress = [
  { label: 'Excelling', value: 40, color: 'bg-green-500' },
  { label: 'On Track', value: 45, color: 'bg-blue-500' },
  { label: 'At Risk', value: 15, color: 'bg-yellow-500' },
];

const quickLinks = [
  { labelKey: 'admin.dashboard.quickLinks.helpCenter', href: '#', icon: MessageCircle },
  { labelKey: 'admin.dashboard.quickLinks.adminDocs', href: '#', icon: FileText },
  { labelKey: 'admin.dashboard.quickLinks.lmsRoadmap', href: '#', icon: TrendingUp },
];

const systemAnnouncements = [
  { msg: 'System maintenance scheduled for June 22, 12:00 AM - 2:00 AM.', date: 'Jun 12, 2024' },
  { msg: 'New feature: Bulk user import now available!', date: 'Jun 10, 2024' },
];

const recentLogins = [
  { name: 'Alex Johnson', role: 'Admin', time: '5 min ago' },
  { name: 'Emily Chen', role: 'Student', time: '10 min ago' },
  { name: 'Dr. Emily Carter', role: 'Instructor', time: '15 min ago' },
  { name: 'Sarah Johnson', role: 'Student', time: '20 min ago' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Welcome Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">AJ</div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('admin.dashboard.welcome', { name: 'Alex Johnson' })}</div>
                <div className="text-gray-500 dark:text-gray-300 mb-2">{t('admin.dashboard.roleDept')}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{t('admin.dashboard.profileCompletion')}: 80%</div>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.labelKey} className={`rounded-xl shadow p-6 flex items-center gap-4 ${stat.bg}`}>
                  <stat.icon size={36} className={stat.color} />
                  <div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</div>
                    <div className="text-gray-500 dark:text-gray-300 text-sm">{t(stat.labelKey)}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-wrap gap-4 items-center">
              {quickActions.map((action) => (
                <a key={action.labelKey} href={action.href} className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm ${action.color} hover:bg-opacity-80 transition w-32`}>
                  <action.icon size={28} className="mb-1 text-blue-700 dark:text-blue-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-100 text-sm text-center">{t(action.labelKey)}</span>
                </a>
              ))}
            </div>
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><BarChart2 size={18}/> {t('admin.dashboard.charts.enrollmentTrends')}</div>
                <svg viewBox="0 0 320 100" className="w-full h-28">
                  <polyline fill="none" stroke="#2563eb" strokeWidth="3" points="0,90 50,80 100,70 150,60 200,50 250,40 300,30" />
                  <circle cx="300" cy="30" r="6" fill="#2563eb" />
                  <text x="310" y="28" fontSize="12" fill="#2563eb">1500</text>
                </svg>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Award size={18}/> {t('admin.dashboard.charts.courseCompletions')}</div>
                <svg viewBox="0 0 320 100" className="w-full h-28">
                  {courseCompletions.map((val, i) => (
                    <rect key={i} x={20 + i * 40} y={100 - val / 4} width="24" height={val / 4} fill="#22c55e" />
                  ))}
                </svg>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Activity size={18}/> {t('admin.dashboard.recentActivity')}</div>
              <div className="flex flex-col gap-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <a.icon size={22} className={a.color} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{a.desc}</div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-300 whitespace-nowrap">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Announcements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Bell size={18}/> {t('admin.dashboard.announcements.title')}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-300">
                      <th className="py-2 px-2 text-left">{t('admin.dashboard.announcements.table.title')}</th>
                      <th className="py-2 px-2 text-left">{t('admin.dashboard.announcements.table.by')}</th>
                      <th className="py-2 px-2 text-left">{t('admin.dashboard.announcements.table.date')}</th>
                      <th className="py-2 px-2 text-right">{t('admin.dashboard.announcements.table.views')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((n, i) => (
                      <tr key={i} className="border-t dark:border-gray-700">
                        <td className="py-2 px-2 font-semibold text-blue-700 dark:text-blue-400">{n.title}</td>
                        <td className="py-2 px-2">{n.by}</td>
                        <td className="py-2 px-2">{n.date}</td>
                        <td className="py-2 px-2 text-right">{n.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pending Approvals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> {t('admin.dashboard.pendingApprovals.title')}</div>
              <div className="flex flex-col gap-3">
                {pendingApprovals.length === 0 && <div className="text-gray-500 dark:text-gray-300">{t('admin.dashboard.pendingApprovals.none')}</div>}
                {pendingApprovals.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="inline-block px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs font-semibold">{item.type}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{item.name}</span>
                    <span className="text-gray-500 dark:text-gray-300 text-xs">{t('admin.dashboard.pendingApprovals.by')} {item.submittedBy}</span>
                    <span className="text-gray-400 dark:text-gray-300 text-xs ml-auto">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* System Health & Usage */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Activity size={18}/> {t('admin.dashboard.systemHealth.title')}</div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-gray-300">{t('admin.dashboard.systemHealth.server')}</span><span className="font-bold text-green-600">{systemHealth.server}</span></div>
              <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-gray-300">{t('admin.dashboard.systemHealth.uptime')}</span><span className="font-bold text-blue-600">{systemHealth.uptime}</span></div>
              <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-gray-300">{t('admin.dashboard.systemHealth.api')}</span><span className="font-bold text-green-600">{systemHealth.api}</span></div>
              <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-gray-300">{t('admin.dashboard.systemHealth.activeUsers')}</span><span className="font-bold text-purple-600">{systemHealth.activeUsers}</span></div>
              <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-gray-300">{t('admin.dashboard.systemHealth.peakTime')}</span><span className="font-bold text-yellow-600">{systemHealth.peakTime}</span></div>
            </div>
          </div>
          {/* Top Performing Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><BookOpen size={18}/> {t('admin.dashboard.topCourses')}</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {topCourses.map((c, i) => (
                <li key={i} className="py-2 flex justify-between"><span>{c.name}</span><span className="font-bold text-blue-700 dark:text-blue-400">{c.enrollments}</span></li>
              ))}
            </ul>
          </div>
          {/* Recent User Feedback & Support Tickets */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><MessageCircle size={18}/> {t('admin.dashboard.feedbackSupport')}</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {feedbackTickets.map((tkt, i) => (
                <li key={i} className="py-2 flex flex-col"><span className="font-bold text-gray-800 dark:text-gray-100">{tkt.user}</span><span className="text-xs text-gray-500 dark:text-gray-300">{tkt.type} - {tkt.time}</span><span>{tkt.msg}</span></li>
              ))}
            </ul>
          </div>
          {/* Upcoming Events & Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Calendar size={18}/> {t('admin.dashboard.upcomingEvents')}</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingEvents.map((e, i) => (
                <li key={i} className="py-2 flex flex-col"><span className="font-bold text-blue-700 dark:text-blue-400">{e.date}</span><span className="font-semibold text-gray-800 dark:text-gray-100">{e.title}</span><span className="text-xs text-gray-500 dark:text-gray-300">{e.desc}</span></li>
              ))}
            </ul>
          </div>
          {/* Instructor Leaderboard */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><UserCircle size={18}/> {t('admin.dashboard.instructorLeaderboard')}</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {instructorLeaderboard.map((i, idx) => (
                <li key={idx} className="py-2 flex justify-between items-center"><span>{i.name}</span><span className="text-green-600 font-bold">{i.rating}★</span><span className="text-blue-700 dark:text-blue-400 font-semibold">{t('admin.dashboard.completions', { count: i.completions })}</span></li>
              ))}
            </ul>
          </div>
          {/* Student Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6 flex flex-col items-center">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><PieChart size={18}/> {t('admin.dashboard.studentProgress')}</div>
            <div className="w-full flex flex-col gap-2">
              {studentProgress.map((s, i) => (
                <div key={i} className="flex items-center gap-2 w-full">
                  <span className={`inline-block w-3 h-3 rounded-full ${s.color}`}></span>
                  <span className="font-semibold w-24">{s.label}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-2">
                    <div className={`${s.color} h-2 rounded-full`} style={{ width: `${s.value}%` }}></div>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-100">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Quick Links/Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6 flex flex-col gap-2">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Settings size={18}/> {t('admin.dashboard.quickLinks.title')}</div>
            <div className="flex gap-4 flex-wrap">
              {quickLinks.map((l, i) => (
                <a key={i} href={l.href} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-700 dark:text-blue-400 font-semibold hover:underline"><l.icon size={18}/>{t(l.labelKey)}</a>
              ))}
            </div>
          </div>
          {/* System Announcements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6 flex flex-col gap-2">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><Bell size={18}/> {t('admin.dashboard.systemAnnouncements')}</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {systemAnnouncements.map((a, i) => (
                <li key={i} className="py-2 flex flex-col"><span className="font-semibold text-gray-800 dark:text-gray-100">{a.msg}</span><span className="text-xs text-gray-500 dark:text-gray-300">{a.date}</span></li>
              ))}
            </ul>
          </div>
          {/* Recent Logins */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6 flex flex-col gap-2">
            <div className="font-semibold text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2"><UserCircle size={18}/> {t('admin.dashboard.recentLogins')}</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentLogins.map((u, i) => (
                <li key={i} className="py-2 flex justify-between items-center"><span>{u.name}</span><span className="text-xs text-gray-500 dark:text-gray-300">{u.role}</span><span className="text-xs text-gray-400 dark:text-gray-300">{u.time}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
