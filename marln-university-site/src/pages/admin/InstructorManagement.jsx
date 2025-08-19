import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { instructors as initialInstructors, departments } from '../../data/instructors';
import { Plus, Edit, Trash2, X, Users, BookOpen, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InstructorManagement() {
  const { t } = useTranslation();
  const [instructors, setInstructors] = useState(initialInstructors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', department: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const newInstructor = { 
      id: instructors.length + 1, 
      name: form.name, 
      email: form.email, 
      department: form.department, 
      courses: [], 
      assignedBatches: [], 
      engagement: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setInstructors([...instructors, newInstructor]);
    setShowAddModal(false);
    setForm({ name: '', email: '', department: '' });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setInstructors(instructors.map(i => i.id === selectedInstructor.id ? { ...selectedInstructor, ...form } : i));
    setShowEditModal(false);
    setForm({ name: '', email: '', department: '' });
  };

  const openEditModal = (instructor) => { setSelectedInstructor(instructor); setForm({ name: instructor.name, email: instructor.email, department: instructor.department }); setShowEditModal(true); };

  const handleDelete = (instructor) => { if (window.confirm(t('admin.instructorManagement.actions.delete') + '?')) { setInstructors(instructors.filter(i => i.id !== instructor.id)); } };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.instructorManagement.title', 'Instructor Management')}</h1>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              <span>{t('admin.instructorManagement.addNew', 'Add New')}</span>
            </button>
          </div>

          {/* Instructor List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.name', 'Name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.email', 'Email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.department', 'Department')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.courses', 'Courses')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.batches', 'Batches')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.engagement', 'Engagement')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.instructorManagement.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{instructor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{instructor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{instructor.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-700 dark:text-blue-400">
                      <div className="flex flex-col items-center">
                        <BookOpen size={18} className="inline-block mb-1" />
                        {instructor.courses ? instructor.courses.length : 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-700 dark:text-green-400">
                      <div className="flex flex-col items-center">
                        <Users size={18} className="inline-block mb-1" />
                        {instructor.assignedBatches ? instructor.assignedBatches.length : 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center">
                        <BarChart3 size={18} className="inline-block mr-1 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{instructor.engagement || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => openEditModal(instructor)} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200" title={t('admin.instructorManagement.actions.edit', 'Edit')}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(instructor)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200" title={t('admin.instructorManagement.actions.delete', 'Delete')}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.instructorManagement.addModal.title', 'Add Instructor')}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.instructorManagement.addModal.fields.name', 'Name')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.instructorManagement.addModal.fields.email', 'Email')}</label>
                <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.instructorManagement.addModal.fields.department', 'Department')}</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">{t('admin.instructorManagement.addModal.fields.selectDepartment', 'Select Department')}</option>
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">{t('admin.instructorManagement.addModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">{t('admin.instructorManagement.addModal.buttons.add', 'Add Instructor')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Instructor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.instructorManagement.editModal.title', 'Edit Instructor')}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.instructorManagement.editModal.fields.name', 'Name')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.instructorManagement.editModal.fields.email', 'Email')}</label>
                <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.instructorManagement.editModal.fields.department', 'Department')}</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">{t('admin.instructorManagement.editModal.fields.selectDepartment', 'Select Department')}</option>
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">{t('admin.instructorManagement.editModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">{t('admin.instructorManagement.editModal.buttons.save', 'Save Changes')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 