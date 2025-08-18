import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FileText, Upload, Edit, Trash2, Plus, Grid, List, Search, Eye, Image, File, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const dummyCourses = [
  { id: 1, name: 'CS101' },
  { id: 2, name: 'CS102' },
  { id: 3, name: 'CS103' },
];

const dummyMaterials = [
  { id: 1, titleKey: 'syllabus', type: 'syllabus', file: 'syllabus.pdf', uploadDate: '2025-06-01', courseId: 1 },
  { id: 2, titleKey: 'studyGuide', type: 'study', file: 'study_guide.pdf', uploadDate: '2025-06-02', courseId: 1 },
  { id: 3, titleKey: 'assignment1', type: 'assignment', file: 'assignment1.pdf', uploadDate: '2025-06-03', courseId: 2 },
  { id: 4, titleKey: 'quiz1', type: 'quiz', file: 'quiz1.pdf', uploadDate: '2025-06-04', courseId: 3 },
];

export default function CourseMaterials() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { startTour } = useTour();
  const [materials, setMaterials] = useState(dummyMaterials);
  const [showModal, setShowModal] = useState(false);
  const [modalMaterial, setModalMaterial] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(dummyCourses[0].id);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startMaterialsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startMaterialsTour = () => {
    const steps = [
      {
        target: '[data-tour="instructor-materials-header"]',
        title: t('instructor.tour.materials.header.title', 'Course Materials Management'),
        content: t('instructor.tour.materials.header.desc', 'Welcome to your course materials management page. Here you can upload, organize, and manage all your course resources.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-materials-search"]',
        title: t('instructor.tour.materials.search.title', 'Search Materials'),
        content: t('instructor.tour.materials.search.desc', 'Quickly find specific materials by typing the title, file name, or type.'),
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="instructor-materials-view-toggle"]',
        title: t('instructor.tour.materials.viewToggle.title', 'View Options'),
        content: t('instructor.tour.materials.viewToggle.desc', 'Switch between grid view (cards) and list view (table) to see your materials in different layouts.'),
        placement: 'bottom',
        disableBeacon: true
      },
      { 
        target: '[data-tour="instructor-materials-upload"]', 
        title: t('instructor.tour.materials.upload.title', 'Upload Materials'), 
        content: t('instructor.tour.materials.upload.desc', 'Add new PDFs, quizzes, or resources for your course.'), 
        placement: 'left', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="instructor-materials-list"]', 
        title: t('instructor.tour.materials.list.title', 'Materials Library'), 
        content: t('instructor.tour.materials.list.desc', 'Manage uploaded files and edit details.'), 
        placement: 'top', 
        disableBeacon: true 
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:materials:v1', steps);
  };

  const openAddMaterial = () => {
    setModalMaterial({ title: '', type: 'syllabus', file: '', uploadDate: new Date().toISOString().split('T')[0], courseId: selectedCourse });
    setShowModal(true);
  };

  const openEditMaterial = (material) => {
    setModalMaterial(material);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMaterial(null);
  };

  const saveMaterial = () => {
    if (modalMaterial.id) {
      setMaterials(materials.map(m => m.id === modalMaterial.id ? modalMaterial : m));
    } else {
      setMaterials([...materials, { ...modalMaterial, id: Date.now() }]);
    }
    setShowModal(false);
    setModalMaterial(null);
  };

  const deleteMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalMaterial({ ...modalMaterial, file: file.name });
    }
  };

  const openPreview = (material) => {
    setPreviewMaterial(material);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewMaterial(null);
  };

  const handleDownload = () => {
    setShowDownloadPopup(true);
  };

  const closeDownloadPopup = () => {
    setShowDownloadPopup(false);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return <Image size={14} className="text-green-500" />;
    }
    return <File size={14} className="text-blue-500" />;
  };



  // Filter materials based on search term and selected course
  const filteredMaterials = materials.filter(material => 
    material.courseId === selectedCourse && 
    (t(`instructor.courseMaterials.sampleMaterials.${material.titleKey}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          {/* Header with title and controls */}
          <div className="flex items-center justify-between mb-6" data-tour="instructor-materials-header">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.courseMaterials.title')}</h1>
            </div>
            
            {/* View toggle and search */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative" data-tour="instructor-materials-search">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  placeholder={t('instructor.courseMaterials.searchPlaceholder', 'Search materials...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              {/* View toggle */}
              <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1" data-tour="instructor-materials-view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title={t('instructor.courseMaterials.gridView', 'Grid View')}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title={t('instructor.courseMaterials.listView', 'List View')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Course Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('instructor.courseMaterials.selectCourse')}</label>
            <select 
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={selectedCourse} 
              onChange={e => setSelectedCourse(Number(e.target.value))}
            >
              {dummyCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          {/* Add Material Button */}
          <div className="mb-6">
            <button 
              onClick={openAddMaterial} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2 transition-colors" 
              data-tour="instructor-materials-upload"
            >
              <Plus size={18} /> {t('instructor.courseMaterials.add')}
            </button>
          </div>

          {/* Materials Content */}
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tour="instructor-materials-list">
              {filteredMaterials.map(material => (
                <div key={material.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t(`instructor.courseMaterials.sampleMaterials.${material.titleKey}`)}</h2>
                    <div className="flex gap-2">
                      <button onClick={() => openEditMaterial(material)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteMaterial(material.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-300">
                    <p><span className="font-medium">{t('instructor.courseMaterials.card.type')}:</span> {t(`instructor.courseMaterials.modal.types.${material.type}`)}</p>
                    <p><span className="font-medium">{t('instructor.courseMaterials.card.file')}:</span> {material.file}</p>
                    <p><span className="font-medium">{t('instructor.courseMaterials.card.uploaded')}:</span> {material.uploadDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" data-tour="instructor-materials-list">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('instructor.courseMaterials.table.material', 'Material')}
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('instructor.courseMaterials.table.type', 'Type')}
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('instructor.courseMaterials.table.file', 'File')}
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('instructor.courseMaterials.table.uploaded', 'Uploaded')}
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('instructor.courseMaterials.table.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 align-top whitespace-normal">
                          <div className="flex items-start gap-3 max-w-xs">
                            <FileText size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{t(`instructor.courseMaterials.sampleMaterials.${material.titleKey}`)}</div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t(`instructor.courseMaterials.modal.types.${material.type}`)}
                        </td>
                        <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-center gap-2">
                            {getFileIcon(material.file)}
                            <span className="truncate max-w-32">{material.file}</span>
                            <button
                              onClick={() => openPreview(material)}
                              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title={t('instructor.courseMaterials.previewFile', 'Preview file')}
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {material.uploadDate}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditMaterial(material)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                            >
                              {t('instructor.courseMaterials.actions.edit', 'Edit')}
                            </button>
                            <button
                              onClick={() => deleteMaterial(material.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                            >
                              {t('instructor.courseMaterials.actions.delete', 'Delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {showModal && modalMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
                              <button className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100`} onClick={closeModal}><X size={28} /></button>
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{modalMaterial.id ? t('instructor.courseMaterials.modal.editTitle') : t('instructor.courseMaterials.modal.newTitle')}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.courseMaterials.modal.fields.title')}</label>
                <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-900 dark:text-gray-100" value={modalMaterial.title} onChange={e => setModalMaterial({ ...modalMaterial, title: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.courseMaterials.modal.fields.type')}</label>
                <select className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-900 dark:text-gray-100" value={modalMaterial.type} onChange={e => setModalMaterial({ ...modalMaterial, type: e.target.value })}>
                  <option value="syllabus">{t('instructor.courseMaterials.modal.types.syllabus')}</option>
                  <option value="study">{t('instructor.courseMaterials.modal.types.study')}</option>
                  <option value="assignment">{t('instructor.courseMaterials.modal.types.assignment')}</option>
                  <option value="quiz">{t('instructor.courseMaterials.modal.types.quiz')}</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.courseMaterials.modal.fields.file')}</label>
                <input type="file" className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-900 dark:text-gray-100" onChange={handleFileChange} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.courseMaterials.modal.fields.uploadDate')}</label>
                <input type="date" className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-900 dark:text-gray-100" value={modalMaterial.uploadDate} onChange={e => setModalMaterial({ ...modalMaterial, uploadDate: e.target.value })} />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" onClick={saveMaterial}>{modalMaterial.id ? t('instructor.courseMaterials.modal.actions.save') : t('instructor.courseMaterials.modal.actions.add')}</button>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {showPreviewModal && previewMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {t('instructor.courseMaterials.previewTitle', 'File Preview')} - {t(`instructor.courseMaterials.sampleMaterials.${previewMaterial.titleKey}`)}
                  </h2>
                  <button
                    onClick={closePreviewModal}
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* File Information */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {t('instructor.courseMaterials.fileInfo', 'File Information')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">{t('instructor.courseMaterials.card.file')}:</span>
                        <span className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium text-gray-800 dark:text-gray-100`}>{previewMaterial.file}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">{t('instructor.courseMaterials.card.type')}:</span>
                        <span className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium text-gray-800 dark:text-gray-100`}>{t(`instructor.courseMaterials.modal.types.${previewMaterial.type}`)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">{t('instructor.courseMaterials.card.uploaded')}:</span>
                        <span className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium text-gray-800 dark:text-gray-100`}>{previewMaterial.uploadDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">{t('instructor.courseMaterials.fileSize', 'File Size')}:</span>
                        <span className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium text-gray-800 dark:text-gray-100`}>2.4 MB</span>
                      </div>
                    </div>
                  </div>

                  {/* File Preview */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      {t('instructor.courseMaterials.preview', 'Preview')}
                    </h3>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                      {(() => {
                        const extension = previewMaterial.file.split('.').pop()?.toLowerCase();
                        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
                          return (
                            <div className="text-center">
                              <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                                <Image className="w-16 h-16 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('instructor.courseMaterials.imagePreview', 'Image preview would be displayed here. In a real application, you would see the actual image.')}
                              </p>
                            </div>
                          );
                        } else if (['pdf'].includes(extension)) {
                          return (
                            <div className="text-center">
                              <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-16 h-16 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('instructor.courseMaterials.pdfPreview', 'PDF preview would be displayed here. In a real application, you would see the actual PDF content.')}
                              </p>
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-center">
                              <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                                <File className="w-16 h-16 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('instructor.courseMaterials.filePreview', 'File preview would be displayed here. In a real application, you would see the actual file content.')}
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-3`}>
                    <button
                      onClick={closePreviewModal}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {t('instructor.courseMaterials.close', 'Close')}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {t('instructor.courseMaterials.download', 'Download')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Not Available Popup */}
        {showDownloadPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t('instructor.courseMaterials.downloadNotAvailableTitle', 'Download Not Available')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('instructor.courseMaterials.downloadNotAvailableMessage', 'Download functionality is not available in this demo version. In a real application, you would be able to download course material files.')}
                </p>
                <div className={`flex ${isRTL ? 'justify-start' : 'justify-center'} gap-3`}>
                  <button
                    onClick={closeDownloadPopup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {t('instructor.courseMaterials.understand', 'I Understand')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 