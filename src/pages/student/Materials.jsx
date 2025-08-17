import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  FileText, 
  Download, 
  BookOpen, 
  Search,
  Filter,
  ChevronRight,
  File,
  FileType,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  Grid3X3,
  List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const materials = [
  {
    id: 1,
    title: 'Introduction to Programming Concepts',
    course: 'Introduction to Computer Science',
    code: 'CS101',
    type: 'lecture-notes',
    format: 'pdf',
    size: '2.4 MB',
    uploadedAt: '2024-03-15T10:30:00',
    description: 'Comprehensive notes covering basic programming concepts, variables, and control structures.',
    downloads: 145,
    instructor: 'Dr. Sarah Johnson'
  },
  {
    id: 2,
    title: 'Data Structures Overview',
    course: 'Data Structures and Algorithms',
    code: 'CS201',
    type: 'lecture-notes',
    format: 'pdf',
    size: '3.1 MB',
    uploadedAt: '2024-03-14T14:20:00',
    description: 'Detailed overview of fundamental data structures including arrays, linked lists, and trees.',
    downloads: 98,
    instructor: 'Prof. Michael Chen'
  },
  {
    id: 3,
    title: 'Web Development Project Template',
    course: 'Web Development',
    code: 'CS301',
    type: 'project',
    format: 'zip',
    size: '5.7 MB',
    uploadedAt: '2024-03-13T09:15:00',
    description: 'Starter template for the final web development project with basic structure and dependencies.',
    downloads: 76,
    instructor: 'Dr. Emily Brown'
  },
  {
    id: 4,
    title: 'Database Design Patterns',
    course: 'Database Systems',
    code: 'CS401',
    type: 'lecture-notes',
    format: 'pdf',
    size: '1.8 MB',
    uploadedAt: '2024-03-12T16:45:00',
    description: 'Common database design patterns and best practices for efficient data modeling.',
    downloads: 112,
    instructor: 'Dr. James Wilson'
  },
  {
    id: 5,
    title: 'Programming Assignment Solutions',
    course: 'Introduction to Computer Science',
    code: 'CS101',
    type: 'assignment',
    format: 'zip',
    size: '4.2 MB',
    uploadedAt: '2024-03-11T11:20:00',
    description: 'Sample solutions and explanations for the programming assignments.',
    downloads: 89,
    instructor: 'Dr. Sarah Johnson'
  }
];

function Materials() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const { startTour } = useTour();

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' ? true : material.code === selectedCourse;
    const matchesType = selectedType === 'all' ? true : material.type === selectedType;
    return matchesSearch && matchesCourse && matchesType;
  });

  const getFileIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImage className="h-6 w-6 text-green-500" />;
      case 'mp4':
      case 'avi':
        return <FileVideo className="h-6 w-6 text-purple-500" />;
      case 'mp3':
      case 'wav':
        return <FileAudio className="h-6 w-6 text-yellow-500" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="h-6 w-6 text-gray-500" />;
      case 'js':
      case 'py':
      case 'java':
        return <FileCode className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    const key = type;
    // Map to translation key under student.materials.types
    return t(`student.materials.types.${key}`, type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
  };

  const startMaterialsTour = () => {
    const steps = [
      { 
        target: '#materials-search', 
        title: t('student.tour.materials.title', 'Find Materials'), 
        content: t('student.tour.materials.desc', 'Search for course materials by title, course name, or description.'),
        placement: 'left',
        disableBeacon: true
      },
      { 
        target: '[data-tour="materials-filters"]', 
        title: t('student.tour.materials.filtersTitle', 'Filter Options'), 
        content: t('student.tour.materials.filtersDesc', 'Filter materials by course or content type to find what you need.'),
        placement: 'left',
        disableBeacon: true
      },
      { 
        target: '[data-tour="materials-list"]', 
        title: t('student.tour.materials.listTitle', 'Materials Library'), 
        content: t('student.tour.materials.listDesc', 'Browse all available documents, projects, and course resources.'),
        placement: 'top-start',
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('student:materials:v1', steps);
  };

  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:student:materials:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:student:materials:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startMaterialsTour();
        localStorage.setItem(key, 'shown');
      }, 600);
    }
    
    // Handle tour launches from navigation
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'student-full' || launch === 'student-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startMaterialsTour(), 200);
      }
    };
    
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              {t('student.materials.title')}
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
                title={t('student.materials.view.grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
                title={t('student.materials.view.list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6 p-4" data-tour="materials-filters">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder={t('student.materials.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  id="materials-search"
                />
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                <option value="all">{t('student.materials.courses.all')}</option>
                <option value="CS101">CS101 - Introduction to Computer Science</option>
                <option value="CS201">CS201 - Data Structures and Algorithms</option>
                <option value="CS301">CS301 - Web Development</option>
                <option value="CS401">CS401 - Database Systems</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                <option value="all">{t('student.materials.types.all')}</option>
                <option value="lecture-notes">{t('student.materials.types.lecture-notes')}</option>
                <option value="assignment">{t('student.materials.types.assignment')}</option>
                <option value="project">{t('student.materials.types.project')}</option>
                <option value="resource">{t('student.materials.types.resource')}</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                <Filter size={20} />
                {t('student.materials.filters')}
              </button>
            </div>
          </div>

          {/* Materials Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6" data-tour="materials-list">
              {filteredMaterials.map(material => (
                <div
                  key={material.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        {getFileIcon(material.format)}
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{material.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-300">{material.course} ({material.code})</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {getTypeLabel(material.type)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{material.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FileType className="h-4 w-4 mr-2" />
                        <span>{material.format.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{material.size}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{material.instructor}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Download className="h-4 w-4 mr-2" />
                        <span>
                          {t('student.materials.labels.downloadCount_other', { count: material.downloads })}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('student.materials.labels.uploaded')}: {new Date(material.uploadedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedMaterial(material)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        data-tour="view-details-btn"
                      >
                        {t('student.materials.labels.viewDetails')}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden" data-tour="materials-list">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                        {t('student.materials.list.title')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.materials.list.course')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.materials.list.type')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.materials.list.format')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.materials.list.downloads')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        {t('student.materials.list.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMaterials.map(material => (
                      <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {getFileIcon(material.format)}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{material.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{material.instructor}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div>
                            <div className="font-medium">{material.code}</div>
                            <div className="text-gray-500 dark:text-gray-400 truncate">{material.course}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {getTypeLabel(material.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div>
                            <div className="font-medium">{material.format.toUpperCase()}</div>
                            <div className="text-gray-500 dark:text-gray-400">{material.size}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {t('student.materials.labels.downloadCount_other', { count: material.downloads })}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <button
                            onClick={() => setSelectedMaterial(material)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            data-tour="view-details-btn"
                          >
                            {t('student.materials.labels.viewDetails')}
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

      {/* Material Details Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              {getFileIcon(selectedMaterial.format)}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedMaterial.title}</h2>
                <p className="text-sm text-gray-500">{selectedMaterial.course} ({selectedMaterial.code})</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{t('student.materials.modal.description')}</h3>
                <p className="text-sm text-gray-600">{selectedMaterial.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('student.materials.modal.fileInfo')}</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600">
                      {t('student.materials.modal.format')}: {selectedMaterial.format.toUpperCase()}
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.materials.modal.size')}: {selectedMaterial.size}
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.materials.modal.downloads')}: {selectedMaterial.downloads}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('student.materials.modal.courseInfo')}</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600">
                      {t('student.materials.modal.instructor')}: {selectedMaterial.instructor}
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.materials.modal.type')}: {getTypeLabel(selectedMaterial.type)}
                    </li>
                    <li className="text-sm text-gray-600">
                      {t('student.materials.modal.uploaded')}: {new Date(selectedMaterial.uploadedAt).toLocaleString()}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('student.materials.modal.close')}
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('student.materials.modal.download')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials; 