import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Award, 
  BookOpen, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  ChevronRight,
  Info,
  Grid3X3,
  List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const courses = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    code: 'CS101',
    instructor: 'Dr. Sarah Johnson',
    grade: 85,
    assignments: [
      { name: 'Programming Assignment #1', grade: 90, maxPoints: 100, weight: 20 },
      { name: 'Midterm Exam', grade: 85, maxPoints: 100, weight: 30 },
      { name: 'Final Project', grade: 80, maxPoints: 100, weight: 50 },
    ],
    trend: 'up',
    semester: 'Spring 2024',
  },
  {
    id: 2,
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    instructor: 'Prof. Michael Chen',
    grade: 92,
    assignments: [
      { name: 'Linked List Implementation', grade: 95, maxPoints: 100, weight: 25 },
      { name: 'Tree Traversal Project', grade: 90, maxPoints: 100, weight: 25 },
      { name: 'Final Exam', grade: 90, maxPoints: 100, weight: 50 },
    ],
    trend: 'up',
    semester: 'Spring 2024',
  },
  {
    id: 3,
    name: 'Web Development',
    code: 'CS301',
    instructor: 'Dr. Emily Brown',
    grade: 78,
    assignments: [
      { name: 'HTML/CSS Project', grade: 85, maxPoints: 100, weight: 20 },
      { name: 'JavaScript Assignment', grade: 75, maxPoints: 100, weight: 30 },
      { name: 'Final Project', grade: 75, maxPoints: 100, weight: 50 },
    ],
    trend: 'down',
    semester: 'Spring 2024',
  },
];

function Grades() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const startGradesTour = () => {
    const steps = [
      { 
        target: '#grades-search', 
        title: t('student.tour.grades.searchTitle', 'Search Courses'), 
        content: t('student.tour.grades.searchDesc', 'Find courses by name or course code.'),
        placement: 'bottom-start',
        disableBeacon: true
      },
      { 
        target: '#grades-semester-filter', 
        title: t('student.tour.grades.filterTitle', 'Semester Filter'), 
        content: t('student.tour.grades.filterDesc', 'Switch between different semesters to view grades.'),
        placement: 'bottom-start',
        disableBeacon: true
      },
      { 
        target: '[data-tour="grades-overview"]', 
        title: t('student.tour.grades.overviewTitle', 'Grade Overview'), 
        content: t('student.tour.grades.overviewDesc', 'See your GPA and course completion status.'),
        placement: 'bottom-start',
        disableBeacon: true
      },
      { 
        target: '[data-tour="grades-course-list"]', 
        title: t('student.tour.grades.courseTitle', 'Course Grades'), 
        content: t('student.tour.grades.courseDesc', 'View individual course grades and performance trends.'),
        placement: 'top-start',
        disableBeacon: true
      },
      { 
        target: '[data-tour="view-course-details"]', 
        title: t('student.tour.grades.detailsTitle', 'Grade Details'), 
        content: t('student.tour.grades.detailsDesc', 'Click to see detailed assignment breakdowns.'),
        placement: 'left-start',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:grades:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:grades:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:grades:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startGradesTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startGradesTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = semesterFilter === 'all' ? true : course.semester === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="h-5 w-5 text-green-500" /> : 
      <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              {t('student.grades.title')}
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
                title={t('student.grades.view.grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
                title={t('student.grades.view.list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder={t('student.grades.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  id="grades-search"
                />
              </div>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                id="grades-semester-filter"
              >
                <option value="all">{t('student.grades.semesters.all')}</option>
                <option value="Spring 2024">{t('student.grades.semesters.spring2024')}</option>
                <option value="Fall 2023">{t('student.grades.semesters.fall2023')}</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                <Filter size={20} />
                {t('student.grades.filters')}
              </button>
            </div>
          </div>

          {/* Grades Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" data-tour="grades-overview">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{t('student.grades.overview.gpa')}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">3.5</p>
                </div>
                <Award className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{t('student.grades.overview.completed')}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">12</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{t('student.grades.overview.current')}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">5</p>
                </div>
                <BarChart2 className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Course Grades */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6" data-tour="grades-course-list">
              {filteredCourses.map(course => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{course.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{course.code} - {course.instructor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getGradeColor(course.grade)} dark:text-blue-400`}>
                          {course.grade}%
                        </span>
                        {getTrendIcon(course.trend)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {course.assignments.map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">{assignment.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600 dark:text-gray-300">{assignment.weight}%</span>
                            <span className={`font-medium ${getGradeColor(assignment.grade)} dark:text-blue-400`}>
                              {assignment.grade}/{assignment.maxPoints}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      data-tour="view-course-details"
                    >
                      {t('student.grades.viewDetails')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden" data-tour="grades-course-list">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                        {t('student.grades.list.course')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.grades.list.code')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
                        {t('student.grades.list.instructor')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.grades.list.grade')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.grades.list.trend')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.grades.list.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCourses.map(course => (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{course.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300 truncate">{course.semester}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {course.code}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate">
                          {course.instructor}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-lg font-bold ${getGradeColor(course.grade)} dark:text-blue-400`}>
                            {course.grade}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {getTrendIcon(course.trend)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            data-tour="view-course-details"
                          >
                            {t('student.grades.viewDetails')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedCourse.name}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{t('student.grades.modal.courseInfo')}</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm text-gray-600">
                      {t('student.grades.modal.courseCode')}: {selectedCourse.code}
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.grades.modal.instructor')}: {selectedCourse.instructor}
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.grades.modal.semester')}: {selectedCourse.semester}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{t('student.grades.modal.gradeSummary')}</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm text-gray-600">
                      {t('student.grades.modal.currentGrade')}: <span className={getGradeColor(selectedCourse.grade)}>{selectedCourse.grade}%</span>
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.grades.modal.trend')}: {selectedCourse.trend === 'up' ? t('student.grades.modal.trendImproving') : t('student.grades.modal.trendDeclining')}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">{t('student.grades.modal.assignmentDetails')}</h3>
                <div className="space-y-3">
                  {selectedCourse.assignments.map((assignment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{assignment.name}</span>
                        <span className={`font-medium ${getGradeColor(assignment.grade)}`}>
                          {assignment.grade}/{assignment.maxPoints}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{t('student.grades.modal.weight')}: {assignment.weight}%</span>
                        <span>{t('student.grades.modal.contribution')}: {(assignment.grade * assignment.weight / 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('student.grades.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grades; 