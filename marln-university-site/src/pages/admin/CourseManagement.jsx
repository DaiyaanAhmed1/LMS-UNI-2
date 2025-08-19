import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { courses as initialCourses, predefinedCourses } from '../../data/courses';
import { Plus, Edit, Eye, X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CourseManagement() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState(() => {
    const stored = localStorage.getItem('courses');
    return stored ? JSON.parse(stored) : initialCourses;
  });
  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', credits: '', hours: '', description: '' });
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || course.code.toLowerCase().includes(searchQuery.toLowerCase()) || course.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newCourse = { id: courses.length + 1, name: form.name, code: form.code, credits: parseInt(form.credits), hours: parseInt(form.hours), description: form.description, source: 'university' };
    setCourses([...courses, newCourse]);
    setShowAddModal(false);
    setForm({ name: '', code: '', credits: '', hours: '', description: '' });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setCourses(courses.map(c => c.id === selectedCourse.id ? { ...selectedCourse, ...form, credits: parseInt(form.credits), hours: parseInt(form.hours) } : c));
    setShowEditModal(false);
    setForm({ name: '', code: '', credits: '', hours: '', description: '' });
  };

  const openEditModal = (course) => { setSelectedCourse(course); setForm({ name: course.name, code: course.code, credits: course.credits, hours: course.hours, description: course.description }); setShowEditModal(true); };
  const openViewModal = (course) => { setSelectedCourse(course); setShowViewModal(true); };

  const addPredefinedCourse = (predef) => { if (courses.some(c => c.code === predef.code)) return; setCourses([...courses, { ...predef, id: courses.length + 1 }]); };
  const resetCoursesToDefault = () => { localStorage.removeItem('courses'); setCourses(initialCourses); };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.courseManagement.title', 'Course Management')}</h1>
            <div className="flex gap-2">
              <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mr-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <option value="all">{t('admin.courseManagement.filters.allLevels', 'All Levels')}</option>
                <option value="undergraduate">{t('admin.courseManagement.filters.undergraduate', 'Undergraduate')}</option>
                <option value="masters">{t('admin.courseManagement.filters.masters', 'Masters')}</option>
              </select>
              <input type="text" placeholder={t('admin.courseManagement.filters.searchPlaceholder', 'Search courses...')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" style={{ minWidth: 220 }} />
              <button onClick={resetCoursesToDefault} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600">
                {t('admin.courseManagement.filters.reset', 'Reset')}
              </button>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                <Plus size={20} />
                <span>{t('admin.courseManagement.filters.addNew', 'Add New Course')}</span>
              </button>
            </div>
          </div>

          {/* Course List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.courseManagement.table.name', 'Name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.courseManagement.table.code', 'Code')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.courseManagement.table.credits', 'Credits')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.courseManagement.table.hours', 'Hours')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.courseManagement.table.source', 'Source')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.courseManagement.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-700 dark:text-blue-400">{course.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-700 dark:text-green-400">{course.hours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">{course.source === 'nexushive' ? t('admin.courseManagement.source.marln', 'MarLn') : t('admin.courseManagement.source.university', 'University')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openViewModal(course)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><Eye size={18} /></button>
                      <button onClick={() => openEditModal(course)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"><Edit size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Predefined Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('admin.courseManagement.predefined.title', 'Predefined Courses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedCourses.map((predef) => (
                <div key={predef.id} className="border rounded-lg p-4 flex flex-col justify-between dark:border-gray-700">
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-400">{predef.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{predef.code}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">{predef.credits} {t('admin.courseManagement.table.credits', 'Credits')}, {predef.hours} {t('admin.courseManagement.table.hours', 'Hours')}</div>
                    <div className="text-xs text_gray-600 dark:text-gray-400 mb-2">{predef.description}</div>
                  </div>
                  <button onClick={() => addPredefinedCourse(predef)} className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400" disabled={courses.some(c => c.code === predef.code)}>
                    {courses.some(c => c.code === predef.code) ? t('admin.courseManagement.predefined.added', 'Added') : t('admin.courseManagement.predefined.addToUniversity', 'Add to university')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.courseManagement.addModal.title', 'Add Course')}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.addModal.fields.name', 'Course Name')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.addModal.fields.code', 'Course Code')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.addModal.fields.credits', 'Credits')}</label>
                  <input type="number" min={1} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.credits} onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.addModal.fields.hours', 'Hours')}</label>
                  <input type="number" min={1} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.addModal.fields.description', 'Description')}</label>
                <textarea className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.courseManagement.addModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">{t('admin.courseManagement.addModal.buttons.add', 'Add Course')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w_full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.courseManagement.editModal.title', 'Edit Course')}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={24} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.editModal.fields.name', 'Course Name')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.editModal.fields.code', 'Course Code')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.editModal.fields.credits', 'Credits')}</label>
                  <input type="number" min={1} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.credits} onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.editModal.fields.hours', 'Hours')}</label>
                  <input type="number" min={1} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.courseManagement.editModal.fields.description', 'Description')}</label>
                <textarea className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.courseManagement.editModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">{t('admin.courseManagement.editModal.buttons.save', 'Save Changes')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Course Modal */}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items_center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedCourse.name}{t('admin.courseManagement.viewModal.titleSuffix', ' - Details')}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={24} /></button>
            </div>
            <div className="mb-2"><span className="font-semibold dark:text-gray-300">{t('admin.courseManagement.viewModal.labels.code', 'Code')}:</span> {selectedCourse.code}</div>
            <div className="mb-2"><span className="font-semibold dark:text-gray-300">{t('admin.courseManagement.viewModal.labels.credits', 'Credits')}:</span> {selectedCourse.credits}</div>
            <div className="mb-2"><span className="font-semibold dark:text-gray-300">{t('admin.courseManagement.viewModal.labels.hours', 'Hours')}:</span> {selectedCourse.hours}</div>
            <div className="mb-2"><span className="font-semibold dark:text-gray-300">{t('admin.courseManagement.viewModal.labels.source', 'Source')}:</span> {selectedCourse.source === 'nexushive' ? t('admin.courseManagement.source.marln', 'MarLn') : t('admin.courseManagement.source.university', 'University')}</div>
            <div className="mb-2"><span className="font-semibold dark:text-gray-300">{t('admin.courseManagement.viewModal.labels.description', 'Description')}:</span> {selectedCourse.description}</div>
          </div>
        </div>
      )}
    </div>
  );
} 