import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { programs as initialPrograms } from '../../data/programs';
import { courses as initialCourses } from '../../data/courses';
import { Plus, Edit, Eye, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

export default function ProgramManagement() {
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'admin-full' || launch === 'admin-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startAdminProgramsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startAdminProgramsTour = () => {
    const isRTL = i18n.dir() === 'rtl';
    const pr = (ltr, rtl) => (isRTL ? rtl : ltr);
    const steps = [
      {
        target: '[data-tour="admin-programs-header"]',
        title: t('admin.tour.programs.header.title', 'Program Management Overview'),
        content: t('admin.tour.programs.header.desc', 'Create and manage academic programs, define their structure, duration, and course requirements. This is the foundation for student enrollment and course planning.'),
        placement: pr('bottom', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-programs-add"]',
        title: t('admin.tour.programs.add.title', 'Create New Programs'),
        content: t('admin.tour.programs.add.desc', 'Add new academic programs with customizable duration, specialization areas, and term-based structure. Each program can have multiple terms with assigned courses.'),
        placement: pr('bottom', 'top'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-programs-table"]',
        title: t('admin.tour.programs.table.title', 'Program Directory'),
        content: t('admin.tour.programs.table.desc', 'View all academic programs with their key details. Use the action buttons to view detailed structure, edit program information, or manage course assignments.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-programs-structure"]',
        title: t('admin.tour.programs.structure.title', 'Program Structure'),
        content: t('admin.tour.programs.structure.desc', 'Each program is organized into terms or semesters. View the complete structure, manage course assignments per term, and ensure proper academic progression.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      },
      {
        target: '[data-tour="admin-programs-courses"]',
        title: t('admin.tour.programs.courses.title', 'Course Management'),
        content: t('admin.tour.programs.courses.desc', 'Assign courses to specific terms within programs. Manage the curriculum flow, ensure prerequisites are met, and maintain academic standards across all programs.'),
        placement: pr('top', 'bottom'),
        disableBeacon: true
      }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('admin:programs:v1', steps);
  };
  // Load programs from localStorage or static file
  const [programs, setPrograms] = useState(() => {
    const stored = localStorage.getItem('programs');
    return stored ? JSON.parse(stored) : initialPrograms;
  });
  useEffect(() => {
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs]);

  const [courses] = useState(() => {
    const stored = localStorage.getItem('courses');
    return stored ? JSON.parse(stored) : initialCourses;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [form, setForm] = useState({ name: '', duration: '', specialization: '' });

  // Manage Courses Modal
  const [showManageCourses, setShowManageCourses] = useState(false);
  const [selectedTermIdx, setSelectedTermIdx] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const newProgram = {
      id: programs.length + 1,
      name: form.name,
      duration: parseInt(form.duration),
      specialization: form.specialization,
      terms: Array.from({ length: parseInt(form.duration) * 2 }, (_, i) => ({ term: i + 1, courses: [] }))
    };
    setPrograms([...programs, newProgram]);
    setShowAddModal(false);
    setForm({ name: '', duration: '', specialization: '' });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setPrograms(programs.map(p => p.id === selectedProgram.id ? { ...selectedProgram, ...form, duration: parseInt(form.duration) } : p));
    setShowEditModal(false);
    setForm({ name: '', duration: '', specialization: '' });
  };

  const openEditModal = (program) => {
    setSelectedProgram(program);
    setForm({ name: program.name, duration: program.duration, specialization: program.specialization });
    setShowEditModal(true);
  };

  const openViewModal = (program) => {
    setSelectedProgram(program);
    setShowViewModal(true);
  };

  // Open Manage Courses Modal for a term
  const openManageCourses = (termIdx) => {
    setSelectedTermIdx(termIdx);
    setShowManageCourses(true);
  };

  // Add course to term
  const addCourseToTerm = (courseId) => {
    setPrograms(programs.map(p => {
      if (p.id !== selectedProgram.id) return p;
      const updatedTerms = p.terms.map((t, idx) => {
        if (idx !== selectedTermIdx) return t;
        if (!t.courses.includes(courseId)) {
          return { ...t, courses: [...t.courses, courseId] };
        }
        return t;
      });
      return { ...p, terms: updatedTerms };
    }));
  };

  // Remove course from term
  const removeCourseFromTerm = (courseId) => {
    setPrograms(programs.map(p => {
      if (p.id !== selectedProgram.id) return p;
      const updatedTerms = p.terms.map((t, idx) => {
        if (idx !== selectedTermIdx) return t;
        return { ...t, courses: t.courses.filter(id => id !== courseId) };
      });
      return { ...p, terms: updatedTerms };
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div data-tour="admin-programs-header" className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.programManagement.title', 'Program Management')}</h1>
            <button
              data-tour="admin-programs-add"
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>{t('admin.programManagement.buttons.addNew', 'Add New Program')}</span>
            </button>
          </div>

          {/* Program List */}
          <div data-tour="admin-programs-table" className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.programManagement.table.name', 'Name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.programManagement.table.durationYears', 'Duration (Years)')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.programManagement.table.specialization', 'Specialization')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.programManagement.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {programs.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{program.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{program.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{program.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openViewModal(program)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><Eye size={18} /></button>
                      <button onClick={() => openEditModal(program)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"><Edit size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.programManagement.addModal.title', 'Add New Program')}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.programManagement.addModal.fields.name', 'Program Name')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.programManagement.addModal.fields.durationYears', 'Duration (Years)')}</label>
                <input type="number" min={1} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.programManagement.addModal.fields.specialization', 'Specialization')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.programManagement.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">{t('admin.programManagement.buttons.add', 'Add Program')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.programManagement.editModal.title', 'Edit Program')}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.programManagement.editModal.fields.name', 'Program Name')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.programManagement.editModal.fields.durationYears', 'Duration (Years)')}</label>
                <input type="number" min={1} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.programManagement.editModal.fields.specialization', 'Specialization')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.programManagement.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">{t('admin.programManagement.buttons.save', 'Save Changes')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Program Modal */}
      {showViewModal && selectedProgram && (
        <div data-tour="admin-programs-structure" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedProgram.name}{t('admin.programManagement.viewModal.titleSuffix', ' - Details')}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"><X size={24} /></button>
            </div>
            <div className="space-y-2">
              {selectedProgram.terms.map((term, idx) => (
                <div key={term.term} className="border rounded p-3 flex items-center justify-between">
                  <span className="font-semibold">{t('admin.programManagement.viewModal.termLabel', { term: term.term, defaultValue: `Term/Semester ${term.term}` })}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-300">{t('admin.programManagement.viewModal.coursesCount', { count: term.courses.length, defaultValue: `Courses: ${term.courses.length}` })}</span>
                    <button onClick={() => openManageCourses(idx)} className="text-blue-600 hover:underline text-sm dark:text-blue-400 dark:hover:text-blue-300">{t('admin.programManagement.viewModal.manageCourses', 'Manage Courses')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manage Courses Modal */}
      {showManageCourses && selectedProgram && selectedTermIdx !== null && (() => {
        // Always get the latest program and term from state
        const latestProgram = programs.find(p => p.id === selectedProgram.id);
        const latestTerm = latestProgram?.terms[selectedTermIdx];
        return (
          <div data-tour="admin-programs-courses" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('admin.programManagement.manageCoursesModal.title', { program: latestProgram.name, term: latestTerm.term, defaultValue: `${latestProgram.name} - Term ${latestTerm.term}` })}</h2>
                <button onClick={() => setShowManageCourses(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"><X size={24} /></button>
              </div>
              <div className="mb-4">
                <div className="font-semibold mb-2">{t('admin.programManagement.manageCoursesModal.currentCourses', 'Current Courses')}</div>
                {latestTerm.courses.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-300">{t('admin.programManagement.manageCoursesModal.noCourses', 'No courses added.')}</div>
                ) : (
                  <ul className="list-disc ml-6">
                    {latestTerm.courses.map(cid => {
                      const course = courses.find(c => c.id === cid || c.id === String(cid));
                      return course ? (
                        <li key={cid} className="flex items-center justify-between">
                          <span>{course.name} ({course.code})</span>
                          <button onClick={() => removeCourseFromTerm(course.id)} className="ml-2 text-red-600 hover:underline text-xs dark:text-red-400 dark:hover:text-red-300">{t('admin.programManagement.manageCoursesModal.remove')}</button>
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
              <div className="mb-2 font-semibold">{t('admin.programManagement.manageCoursesModal.addCourse', 'Add Course')}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.filter(c => !latestTerm.courses.includes(c.id)).map(course => (
                  <div key={course.id} className={`border rounded-lg p-4 flex flex-col justify-between bg-white dark:bg-gray-700 shadow-sm`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg">{course.name}</span>
                      {course.source === 'nexushive' && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white dark:bg-blue-700 dark:text-white">{t('admin.courseManagement.source.marln', 'MarLn')}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{t('admin.courseManagement.table.code', 'Code')}: {course.code}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('admin.courseManagement.table.credits', 'Credits')}: {course.credits} | {t('admin.courseManagement.table.hours', 'Hours')}: {course.hours}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">{course.description}</div>
                    <button onClick={() => addCourseToTerm(course.id)} className="self-end mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-xs">{t('admin.programManagement.manageCoursesModal.add', 'Add')}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
} 