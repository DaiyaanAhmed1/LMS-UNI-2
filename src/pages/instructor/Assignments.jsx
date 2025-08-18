import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  BookOpen, 
  Users2, 
  ClipboardList, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  BarChart2,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const courses = [
  { id: 1, code: 'CS101', name: 'Introduction to Computer Science' },
  { id: 2, code: 'ML305', name: 'Machine Learning' },
  { id: 3, code: 'DS220', name: 'Data Structures' },
];

const initialAssignments = [
  {
    id: 1,
    title: 'Programming Assignment #1',
    course: 'CS101',
    dueDate: '2025-03-20',
    submissions: 45,
    totalStudents: 50,
    status: 'active',
    type: 'Programming',
    points: 100,
  },
  {
    id: 2,
    title: 'Machine Learning Project',
    course: 'ML305',
    dueDate: '2025-03-25',
    submissions: 30,
    totalStudents: 35,
    status: 'active',
    type: 'Project',
    points: 200,
  },
  {
    id: 3,
    title: 'Data Structures Quiz',
    course: 'DS220',
    dueDate: '2025-03-15',
    submissions: 40,
    totalStudents: 40,
    status: 'completed',
    type: 'Quiz',
    points: 50,
  },
];

export default function Assignments() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [assignmentsData, setAssignmentsData] = useState(initialAssignments);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // Create modal controlled fields
  const [createCourse, setCreateCourse] = useState(courses[0]?.code || '');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createDueDate, setCreateDueDate] = useState('');
  const [createPoints, setCreatePoints] = useState(100);
  const [createType, setCreateType] = useState('Programming');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiType, setAiType] = useState('Programming');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiPoints, setAiPoints] = useState(100);
  const [aiCourse, setAiCourse] = useState('');

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startAssignmentsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startAssignmentsTour = () => {
    const steps = [
      {
        target: '[data-tour="instructor-assignments-filter"]',
        title: t('instructor.tour.assignments.filters.title', 'Filter & Search'),
        content: t('instructor.tour.assignments.filters.desc', 'Search by title, filter by course and status.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-assignments-list"]',
        title: t('instructor.tour.assignments.list.title', 'Assignments List'),
        content: t('instructor.tour.assignments.list.desc', 'View due dates, submissions, points and actions.'),
        placement: 'top',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:assignments:v1', steps);
  };

  const filteredAssignments = assignmentsData.filter(assignment => {
    const matchesCourse = selectedCourse ? assignment.course === selectedCourse : true;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : assignment.status === filterStatus;
    return matchesCourse && matchesSearch && matchesStatus;
  });

  const generateAssignmentDraft = () => {
    const courseCode = aiCourse || (selectedCourse || 'CS101');
    const title = `${courseCode} • ${aiType} Assignment (${aiDifficulty})`;
    const outline = `Title: ${title}
Topic: ${aiTopic || 'General Topic'}
Points: ${aiPoints}

Objective:
- Demonstrate understanding of key concepts in the module
- Apply theory to a practical problem

Tasks:
1) Research/Design: Provide a brief plan before implementation
2) Implementation: Build the core solution with clean, commented code
3) Validation: Include tests or sample runs proving correctness

Requirements:
- Difficulty: ${aiDifficulty}
- Allowed tools/resources must be cited
- Submit source files and a short README (setup, how to run)

Assessment Rubric (100%):
- Correctness: 40%
- Code quality/structure: 25%
- Documentation and clarity: 20%
- Creativity/optimizations: 15%

Academic Integrity:
- Work must be your own; cite any external resources used.

Submission Instructions:
- Submit via LMS as a single archive (zip) with your name and ID.
- Late policy: standard course policy applies.`;
    return outline;
  };

  const handleRunAI = (e) => {
    e?.preventDefault?.();
    setAiGenerating(true);
    setAiDraft('');
    setTimeout(() => {
      setAiDraft(generateAssignmentDraft());
      setAiGenerating(false);
    }, 800);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: Date.now(),
      title: createTitle || `${createType} Assignment`,
      course: createCourse || (courses[0]?.code || ''),
      dueDate: createDueDate || new Date().toISOString().split('T')[0],
      submissions: 0,
      totalStudents: 0,
      status: 'active',
      type: createType,
      points: createPoints || 0,
    };
    setAssignmentsData([newAssignment, ...assignmentsData]);
    // Optionally focus filter to the created course so it's visible
    setSelectedCourse('');
    setShowCreateModal(false);
    setCreateTitle('');
    setCreateDescription('');
    setCreateDueDate('');
    setCreatePoints(100);
    setCreateType('Programming');
    setCreateCourse(courses[0]?.code || '');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.assignments.title')}</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
              {t('instructor.assignments.create')}
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6 p-4" data-tour="instructor-assignments-filter">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder={t('instructor.assignments.filters.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="">{t('instructor.assignments.filters.allCourses')}</option>
                {courses.map(course => (
                  <option key={course.id} value={course.code}>{course.code} - {course.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="all">{t('instructor.assignments.filters.allStatus')}</option>
                <option value="active">{t('instructor.assignments.filters.status.active')}</option>
                <option value="completed">{t('instructor.assignments.filters.status.completed')}</option>
                <option value="draft">{t('instructor.assignments.filters.status.draft')}</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100">
                <Filter size={20} />
                {t('instructor.assignments.filters.moreFilters')}
              </button>
            </div>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="instructor-assignments-list">
            {filteredAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{assignment.course}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === assignment.id ? null : assignment.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {showActionMenu === assignment.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Eye size={16} className="mr-2" />
                            {t('instructor.assignments.menu.viewDetails')}
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Edit size={16} className="mr-2" />
                            {t('instructor.assignments.menu.edit')}
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Download size={16} className="mr-2" />
                            {t('instructor.assignments.menu.download')}
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Trash2 size={16} className="mr-2" />
                            {t('instructor.assignments.menu.delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">{t('instructor.assignments.card.dueDate')}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-100">{assignment.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">{t('instructor.assignments.card.submissions')}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-100">{assignment.submissions}/{assignment.totalStudents}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">{t('instructor.assignments.card.type')}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-100">{assignment.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">{t('instructor.assignments.card.points')}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-100">{assignment.points}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        assignment.status === 'active' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300' :
                        assignment.status === 'completed' ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {t(`instructor.assignments.card.status.${assignment.status}`)}
                      </span>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 text-sm font-medium">
                        {t('instructor.assignments.card.viewSubmissions')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.assignments.modal.title')}</h2>
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="mr-auto ml-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  title={t('instructor.assignments.ai.assist', 'AI Assist')}
                >
                  <Sparkles size={16} /> {t('instructor.assignments.ai.assist', 'AI Assist')}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleCreateSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.course')}</label>
                  <select value={createCourse} onChange={(e) => setCreateCourse(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100">
                    {courses.map(course => (
                      <option key={course.id} value={course.code}>{course.code} - {course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.title')}</label>
                  <input
                    type="text"
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                    placeholder={t('instructor.assignments.modal.fields.titlePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.description')}</label>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                    rows="4"
                    value={createDescription}
                    onChange={(e) => setCreateDescription(e.target.value)}
                    placeholder={t('instructor.assignments.modal.fields.descriptionPlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.dueDate')}</label>
                    <input
                      type="date"
                      value={createDueDate}
                      onChange={(e) => setCreateDueDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.points')}</label>
                    <input
                      type="number"
                      value={createPoints}
                      onChange={(e) => setCreatePoints(Number(e.target.value) || 0)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                      placeholder={t('instructor.assignments.modal.fields.pointsPlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.type')}</label>
                  <select value={createType} onChange={(e) => setCreateType(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100">
                    <option value="Programming">Programming</option>
                    <option value="Project">Project</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Essay">Essay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.modal.fields.uploadFiles')}</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload size={24} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-300">{t('instructor.assignments.modal.fields.dragHint')}</p>
                    <input type="file" className="hidden" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    {t('instructor.assignments.modal.actions.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    {t('instructor.assignments.modal.actions.create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AI Assignment Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl">
            <div className="flex flex-col max-h-[85vh]">
              <div className="p-4 md:p-6 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Sparkles size={22} className="text-purple-600" />
                    {t('instructor.assignments.ai.title', 'AI Assignment Generator')}
                  </h2>
                  <button onClick={() => setShowAIGenerator(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                    <XCircle size={24} />
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6 overflow-y-auto">
                <form onSubmit={handleRunAI} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.ai.fields.course', 'Course')}</label>
                    <select value={aiCourse} onChange={(e) => setAiCourse(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-gray-100">
                      <option value="">{t('instructor.assignments.ai.anyCourse', 'Any')}</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.ai.fields.type', 'Type')}</label>
                    <select value={aiType} onChange={(e) => setAiType(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-gray-100">
                      <option>Programming</option>
                      <option>Project</option>
                      <option>Quiz</option>
                      <option>Essay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.ai.fields.topic', 'Topic')}</label>
                    <input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder={t('instructor.assignments.ai.placeholders.topic', 'e.g., Sorting algorithms, regression, cybersecurity basics')} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.ai.fields.difficulty', 'Difficulty')}</label>
                    <select value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-gray-100">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('instructor.assignments.ai.fields.points', 'Points')}</label>
                    <input type="number" value={aiPoints} onChange={(e) => setAiPoints(Number(e.target.value) || 0)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-gray-100" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      <Sparkles size={18} /> {aiGenerating ? t('instructor.assignments.ai.generating', 'Generating...') : t('instructor.assignments.ai.generate', 'Generate')}
                    </button>
                  </div>
                </form>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-3 min-h-[180px]">
                  {aiGenerating ? (
                    <div className="text-gray-500 dark:text-gray-300">{t('instructor.assignments.ai.generating', 'Generating...')}</div>
                  ) : aiDraft ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100">{aiDraft}</pre>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-300">{t('instructor.assignments.ai.empty', 'Fill in details and click Generate to create a draft assignment.')}</div>
                  )}
                </div>
              </div>
              <div className="p-4 sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button onClick={() => setShowAIGenerator(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100">{t('instructor.assignments.modal.actions.cancel')}</button>
                <button onClick={handleCopy} disabled={!aiDraft} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? t('instructor.assignments.ai.copied', 'Copied!') : t('instructor.assignments.ai.copy', 'Copy Draft')}
                </button>
                <button onClick={() => { if (!aiDraft) return; setCreateCourse(aiCourse || createCourse); setCreateType(aiType); setCreatePoints(aiPoints); setCreateTitle(`${aiType} – ${aiTopic || 'Assignment'}`); setCreateDescription(aiDraft); setShowAIGenerator(false); }} disabled={!aiDraft} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                  <Sparkles size={18} /> {t('instructor.assignments.ai.apply', 'Apply to form')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 