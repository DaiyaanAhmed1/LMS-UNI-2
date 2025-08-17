import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FileText, Upload, Edit, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const dummyCourses = [
  { id: 1, name: 'CS101' },
  { id: 2, name: 'CS102' },
  { id: 3, name: 'CS103' },
];

const dummyMaterials = [
  { id: 1, title: 'Syllabus', type: 'syllabus', file: 'syllabus.pdf', uploadDate: '2024-06-01', courseId: 1 },
  { id: 2, title: 'Study Guide', type: 'study', file: 'study_guide.pdf', uploadDate: '2024-06-02', courseId: 1 },
  { id: 3, title: 'Assignment 1', type: 'assignment', file: 'assignment1.pdf', uploadDate: '2024-06-03', courseId: 2 },
  { id: 4, title: 'Quiz 1', type: 'quiz', file: 'quiz1.pdf', uploadDate: '2024-06-04', courseId: 3 },
];

export default function CourseMaterials() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [materials, setMaterials] = useState(dummyMaterials);
  const [showModal, setShowModal] = useState(false);
  const [modalMaterial, setModalMaterial] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(dummyCourses[0].id);

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
      { target: '[data-tour="instructor-materials-upload"]', title: t('instructor.tour.materials.upload.title', 'Upload Materials'), content: t('instructor.tour.materials.upload.desc', 'Add new PDFs, quizzes, or resources for your course.'), placement: 'left', disableBeacon: true },
      { target: '[data-tour="instructor-materials-list"]', title: t('instructor.tour.materials.list.title', 'Materials Library'), content: t('instructor.tour.materials.list.desc', 'Manage uploaded files and edit details.'), placement: 'top', disableBeacon: true }
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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.courseMaterials.title')}</h1>
            <button onClick={openAddMaterial} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2" data-tour="instructor-materials-upload">
              <Plus size={18} /> {t('instructor.courseMaterials.add')}
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.courseMaterials.selectCourse')}</label>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-900 dark:text-gray-100" value={selectedCourse} onChange={e => setSelectedCourse(Number(e.target.value))}>
              {dummyCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tour="instructor-materials-list">
            {materials.filter(m => m.courseId === selectedCourse).map(material => (
              <div key={material.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{material.title}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => openEditMaterial(material)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"><Edit size={18} /></button>
                    <button onClick={() => deleteMaterial(material.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"><Trash2 size={18} /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-300">{t('instructor.courseMaterials.card.type')}: {t(`instructor.courseMaterials.modal.types.${material.type}`)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">{t('instructor.courseMaterials.card.file')}: {material.file}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">{t('instructor.courseMaterials.card.uploaded')}: {material.uploadDate}</p>
              </div>
            ))}
          </div>
        </div>
        {showModal && modalMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
              <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeModal}><Trash2 size={28} /></button>
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
      </div>
    </div>
  );
} 