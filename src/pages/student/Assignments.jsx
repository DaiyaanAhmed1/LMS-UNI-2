import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const assignments = [
  {
    id: 1,
    title: 'Programming Assignment #1',
    course: 'Introduction to Computer Science',
    dueDate: '2025-03-20T23:59:59',
    status: 'pending',
    type: 'Programming',
    points: 100,
    description: 'Implement a basic calculator using Python with support for basic arithmetic operations.',
    submittedAt: null,
  },
  {
    id: 2,
    title: 'Machine Learning Project',
    course: 'Data Structures and Algorithms',
    dueDate: '2025-03-25T23:59:59',
    status: 'submitted',
    type: 'Project',
    points: 200,
    description: 'Develop a machine learning model to predict student performance based on historical data.',
    submittedAt: '2025-03-18T14:30:00',
  },
  {
    id: 3,
    title: 'Data Structures Quiz',
    course: 'Web Development',
    dueDate: '2025-03-15T23:59:59',
    status: 'overdue',
    type: 'Quiz',
    points: 50,
    description: 'Quiz covering basic data structures and their implementations.',
    submittedAt: null,
  },
];

export default function StudentAssignments() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const startAssignmentsTour = () => {
    const steps = [
      { 
        target: '#assignments-search', 
        title: t('student.tour.assignments.searchTitle', 'Find Assignments'), 
        content: t('student.tour.assignments.searchDesc', 'Search for assignments by title or course name.'),
        placement: 'left',
        disableBeacon: true
      },
      { 
        target: '#assignments-status-filter', 
        title: t('student.tour.assignments.filterTitle', 'Filter by Status'), 
        content: t('student.tour.assignments.filterDesc', 'View all assignments or filter by pending, submitted, or overdue.'),
        placement: 'left',
        disableBeacon: true
      },
      { 
        target: '[data-tour="assignments-grid"]', 
        title: t('student.tour.assignments.gridTitle', 'Assignment Overview'), 
        content: t('student.tour.assignments.gridDesc', 'Each card shows due date, assignment type, and total points.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:assignments:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:assignments:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:assignments:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startAssignmentsTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startAssignmentsTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              {t('student.assignments.title')}
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
                title={t('student.assignments.view.grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
                title={t('student.assignments.view.list')}
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
                  placeholder={t('student.assignments.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  id="assignments-search"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                id="assignments-status-filter"
              >
                <option value="all">{t('student.assignments.status.all')}</option>
                <option value="pending">{t('student.assignments.status.pending')}</option>
                <option value="submitted">{t('student.assignments.status.submitted')}</option>
                <option value="overdue">{t('student.assignments.status.overdue')}</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-100">
                <Filter size={20} />
                {t('student.assignments.filters')}
              </button>
            </div>
          </div>

          {/* Assignments Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="assignments-grid">
              {filteredAssignments.map(assignment => (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{assignment.course}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(assignment.status)} dark:bg-opacity-80`}>
                        {t(`student.assignments.status.${assignment.status}`)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{t('student.assignments.list.due')}: {new Date(assignment.dueDate).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{t('student.assignments.list.type')}: {assignment.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        <span>{t('student.assignments.list.points')}: {assignment.points}</span>
                      </div>
                      {assignment.submittedAt && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>{t('student.assignments.list.submitted')}: {new Date(assignment.submittedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      data-tour="open-assignment"
                    >
                      {assignment.status === 'pending' ? t('student.assignments.buttons.submit') : t('student.assignments.buttons.viewDetails')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden" data-tour="assignments-list">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                        {t('student.assignments.list.assignment')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
                        {t('student.assignments.list.course')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.assignments.list.due')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.assignments.list.status')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">
                        {t('student.assignments.list.points')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.assignments.list.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAssignments.map(assignment => (
                      <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{assignment.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300 truncate">{assignment.type}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate">
                          {assignment.course}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment.status)} dark:bg-opacity-80`}>
                            {t(`student.assignments.status.${assignment.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                          {assignment.points}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            data-tour="open-assignment"
                          >
                            {assignment.status === 'pending' ? t('student.assignments.buttons.submit') : t('student.assignments.buttons.viewDetails')}
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

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{selectedAssignment.title}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('student.assignments.modal.details')}</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{t('student.assignments.list.type')}: {selectedAssignment.type}</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{t('student.assignments.modal.dueDate')}: {new Date(selectedAssignment.dueDate).toLocaleString()}</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      <span>{t('student.assignments.list.points')}: {selectedAssignment.points}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('student.assignments.modal.submission')}</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm text-gray-600 dark:text-gray-300">
                      {t('student.assignments.modal.status')}: {t(`student.assignments.status.${selectedAssignment.status}`)}
                    </li>
                    {selectedAssignment.submittedAt && (
                      <li className="text-sm text-gray-600 dark:text-gray-300">
                        {t('student.assignments.modal.submitted')}: {new Date(selectedAssignment.submittedAt).toLocaleString()}
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {selectedAssignment.status === 'pending' && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('student.assignments.buttons.submit')}</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{t('student.assignments.modal.dropHint')}</p>
                    <input type="file" className="hidden" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('student.assignments.modal.close')}
              </button>
              {selectedAssignment.status === 'pending' && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('student.assignments.modal.submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 