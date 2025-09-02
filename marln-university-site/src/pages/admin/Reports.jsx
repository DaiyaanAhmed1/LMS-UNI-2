import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Calendar, BarChart3, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

// Mock analytics data
const mockCourses = [
  { id: 1, name: 'Intro to Programming', completions: 120, enrollments: 150, type: 'university' },
  { id: 2, name: 'MarLn: Data Science', completions: 90, enrollments: 100, type: 'nexushive' },
  { id: 3, name: 'Calculus I', completions: 80, enrollments: 110, type: 'university' },
  { id: 4, name: 'MarLn: AI Fundamentals', completions: 60, enrollments: 70, type: 'nexushive' },
  { id: 5, name: 'English Literature', completions: 95, enrollments: 120, type: 'university' },
];

export default function Reports() {
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'admin-full' || launch === 'admin-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startAdminReportsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startAdminReportsTour = () => {
    const isRTL = i18n.dir() === 'rtl';
    const pr = (ltr, rtl) => (isRTL ? rtl : ltr);
    const steps = [
      {
        target: '[data-tour="admin-reports-header"]',
        title: t('admin.tour.reports.header.title', 'Reports & Analytics Overview'),
        content: t('admin.tour.reports.header.desc', 'Access comprehensive analytics and performance reports for the entire university. Monitor student progress, course performance, and institutional metrics.'),
        placement: pr('bottom', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-reports-date-filter"]',
        title: t('admin.tour.reports.dateFilter.title', 'Date Range Filter'),
        content: t('admin.tour.reports.dateFilter.desc', 'Filter reports by specific date ranges to analyze performance over time periods. Compare data across different academic terms and years.'),
        placement: pr('bottom', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-reports-summary-cards"]',
        title: t('admin.tour.reports.summaryCards.title', 'Key Performance Indicators'),
        content: t('admin.tour.reports.summaryCards.desc', 'View critical metrics at a glance: total enrollments, course completions, and MarLn platform performance. Track institutional success indicators.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-reports-analytics-table"]',
        title: t('admin.tour.reports.analyticsTable.title', 'Detailed Course Analytics'),
        content: t('admin.tour.reports.analyticsTable.desc', 'Examine individual course performance with enrollment and completion data. Compare university courses with MarLn offerings to identify trends.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-reports-marln-performance"]',
        title: t('admin.tour.reports.marlnPerformance.title', 'MarLn Platform Insights'),
        content: t('admin.tour.reports.marlnPerformance.desc', 'Monitor the performance of MarLn courses separately from university offerings. Track completion rates and student engagement with external content.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('admin:reports:v1', steps);
  };

  // Filtered data (mock: no real date filtering, but structure is ready)
  const filteredCourses = mockCourses; // In real app, filter by dateRange
  const totalEnrollments = filteredCourses.reduce((sum, c) => sum + c.enrollments, 0);
  const totalCompletions = filteredCourses.reduce((sum, c) => sum + c.completions, 0);
  const nexusHiveCourses = filteredCourses.filter(c => c.type === 'nexushive');
  const nexusHivePerformance = nexusHiveCourses.reduce((sum, c) => sum + c.completions, 0);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div data-tour="admin-reports-header" className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.reports.title', 'Reports & Analytics')}</h1>
            <div data-tour="admin-reports-date-filter" className="flex items-center gap-2">
              <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 mr-2 dark:bg-gray-700 dark:text-gray-100"
                value={dateRange.start}
                onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
              />
              <span className="mx-1 text-gray-500 dark:text-gray-300">{t('admin.reports.dateRange.to', 'to')}</span>
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
                value={dateRange.end}
                onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div data-tour="admin-reports-summary-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-4">
              <BarChart3 size={32} className="text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t('admin.reports.cards.totalEnrollments', 'Total Enrollments')}</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalEnrollments}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-4">
              <Award size={32} className="text-green-600 dark:text-green-400" />
              <div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t('admin.reports.cards.courseCompletions', 'Course Completions')}</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{totalCompletions}</div>
              </div>
            </div>
            <div data-tour="admin-reports-marln-performance" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-4">
              <BarChart3 size={32} className="text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  {t('admin.reports.cards.marlnPerformance', 'MarLn Performance')}
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs font-semibold ml-2">MarLn</span>
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{nexusHivePerformance}</div>
              </div>
            </div>
          </div>

          {/* Course Analytics Table */}
          <div data-tour="admin-reports-analytics-table" className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.reports.table.courseName', 'Course Name')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.reports.table.enrollments', 'Enrollments')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.reports.table.completions', 'Completions')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.reports.table.type', 'Type')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      {course.name}
                      {course.type === 'nexushive' && (
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs font-semibold ml-2">MarLn</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-700 dark:text-blue-300">{course.enrollments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-700 dark:text-green-300">{course.completions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm capitalize text-gray-900 dark:text-gray-300">{course.type === 'nexushive' ? t('admin.courseManagement.source.marln', 'MarLn') : t('admin.courseManagement.source.university', 'University')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 