import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, Plus, Filter, Download, MoreVertical, X, Upload, Edit, Trash2, BarChart2, BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { students as initialStudents, programs, years } from '../../data/students';
import * as XLSX from 'xlsx';
import users from '../../data/user';
import { useTranslation } from 'react-i18next';

// Mock data for student results
const mockResults = {
  overallGPA: 3.8,
  attendance: 92,
  courses: [
    { name: 'Data Science', grade: 'A', score: 95 },
    { name: 'Machine Learning', grade: 'A-', score: 88 },
    { name: 'Database Systems', grade: 'B+', score: 87 },
    { name: 'Web Development', grade: 'A', score: 92 },
    { name: 'Cloud Computing', grade: 'B+', score: 85 }
  ],
  progress: [
    { semester: 'Fall 2023', gpa: 3.7 },
    { semester: 'Spring 2024', gpa: 3.8 },
    { semester: 'Fall 2024', gpa: 3.9 }
  ]
};

export default function StudentsManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem('students');
    return stored ? JSON.parse(stored) : initialStudents;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    program: '',
    year: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    nationality: ''
  });
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (e) => {
    e.preventDefault();
    const student = {
      id: students.length + 1,
      ...newStudent,
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    setStudents([...students, student]);
    // Add user for login
    users.push({
      id: users.length + 1,
      email: newStudent.email,
      password: 'student123',
      role: 'student'
    });
    setShowAddModal(false);
    setNewStudent({
      name: '',
      email: '',
      program: '',
      year: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      nationality: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate the data
        const validData = data.filter(row => {
          return row.name && row.email && row.program && row.year;
        });

        if (validData.length === 0) {
          setUploadError(t('admin.studentsManagement.uploadModal.messages.noValidData'));
          return;
        }

        // Add new students and users
        const newStudents = validData.map((row, index) => {
          // Add user for login
          users.push({
            id: users.length + 1,
            email: row.email,
            password: 'student123',
            role: 'student'
          });
          return {
            id: students.length + index + 1,
            name: row.name,
            email: row.email,
            program: row.program,
            year: row.year.toString(),
            status: 'Active',
            enrollmentDate: new Date().toISOString().split('T')[0],
            phone: row.phone || '',
            address: row.address || '',
            dateOfBirth: row.dateOfBirth || '',
            gender: row.gender || '',
            nationality: row.nationality || ''
          };
        });

        setStudents([...students, ...newStudents]);
        setUploadSuccess(t('admin.studentsManagement.uploadModal.messages.success', { count: newStudents.length }));
        setUploadError('');
        setShowUploadModal(false);
      } catch (error) {
        setUploadError(t('admin.studentsManagement.uploadModal.messages.processingError'));
        console.error('Error processing file:', error);
      }
    };

    reader.onerror = () => {
      setUploadError(t('admin.studentsManagement.uploadModal.messages.readingError'));
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        program: 'Computer Science',
        year: '2023',
        phone: '+1 234-567-8901',
        address: '123 University Ave',
        dateOfBirth: '2000-01-01',
        gender: 'Male',
        nationality: 'USA'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'student_template.xlsx');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || student.status.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Export filtered students to Excel
  const handleExport = () => {
    if (filteredStudents.length === 0) return;
    const exportData = filteredStudents.map(({ id, ...rest }) => rest); // Remove id for export
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_export.xlsx');
  };

  const handleActionClick = (studentId) => {
    setShowActionMenu(showActionMenu === studentId ? null : studentId);
  };

  const handleEdit = (student) => {
    setEditStudent({ ...student });
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setStudents((prev) => prev.map((s) => (s.id === editStudent.id ? { ...editStudent } : s)));
    setShowEditModal(false);
    setEditStudent(null);
  };

  const handleDelete = (student) => {
    setDeleteStudent(student);
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  const confirmDelete = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
    setShowDeleteModal(false);
    setDeleteStudent(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteStudent(null);
  };

  const handleViewResults = (student) => {
    setSelectedStudent(student);
    setShowResultsModal(true);
    setShowActionMenu(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{t('admin.studentsManagement.title', 'Student Management')}</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-800"
            >
              <Upload size={20} />
              <span>{t('admin.studentsManagement.buttons.upload', 'Upload Students')}</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus size={20} />
              <span>{t('admin.studentsManagement.buttons.addNew', 'Add New Student')}</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder={t('admin.studentsManagement.searchPlaceholder', 'Search students...')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">{t('admin.studentsManagement.filters.all', 'All Students')}</option>
                <option value="active">{t('admin.studentsManagement.filters.active', 'Active')}</option>
                <option value="inactive">{t('admin.studentsManagement.filters.inactive', 'Inactive')}</option>
                <option value="graduated">{t('admin.studentsManagement.filters.graduated', 'Graduated')}</option>
              </select>
              <button className="border rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter size={20} />
                <span>{t('admin.studentsManagement.buttons.moreFilters', 'More Filters')}</span>
              </button>
              <button className="border rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={handleExport}>
                <Download size={20} />
                <span>{t('admin.studentsManagement.buttons.export', 'Export')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.name', 'Name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.email', 'Email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.program', 'Program')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.year', 'Year')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.status', 'Status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.enrollmentDate', 'Enrollment Date')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.studentsManagement.table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{student.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      student.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {t(`admin.studentsManagement.status.${student.status.toLowerCase()}`, student.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.enrollmentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button 
                        onClick={() => handleActionClick(student.id)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {showActionMenu === student.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                          <div className="py-1">
                            <button
                              onClick={() => handleEdit(student)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                            >
                              <Edit size={16} className="mr-2" />
                              {t('admin.studentsManagement.actionMenu.edit', 'Edit')}
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400"
                            >
                              <Trash2 size={16} className="mr-2" />
                              {t('admin.studentsManagement.actionMenu.delete', 'Delete')}
                            </button>
                            <button
                              onClick={() => handleViewResults(student)}
                              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-400"
                            >
                              <BarChart2 size={16} className="mr-2" />
                              {t('admin.studentsManagement.actionMenu.viewResults', 'View Results')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-600 dark:text-gray-300">
					<div>{t('admin.studentsManagement.pagination.summary', { from: 1, to: filteredStudents.length, total: filteredStudents.length, defaultValue: `Showing 1 to ${filteredStudents.length} of ${filteredStudents.length} entries` })}</div>
					<div className="space-x-2">
						<button className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.studentsManagement.pagination.previous', 'Previous')}</button>
						<button className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.studentsManagement.pagination.next', 'Next')}</button>
					</div>
				</div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('admin.studentsManagement.addModal.title', 'Add New Student')}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.fullName', 'Full Name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.email', 'Email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={newStudent.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.program', 'Program')}</label>
                  <select
                    name="program"
                    value={newStudent.program}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  >
                    <option value="">{t('admin.studentsManagement.addModal.fields.selectProgram', 'Select Program')}</option>
                    {programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.year', 'Year')}</label>
                  <select
                    name="year"
                    value={newStudent.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  >
                    <option value="">{t('admin.studentsManagement.addModal.fields.selectYear', 'Select Year')}</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.phone', 'Phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newStudent.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.dateOfBirth', 'Date of Birth')}</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={newStudent.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.gender', 'Gender')}</label>
                  <select
                    name="gender"
                    value={newStudent.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  >
                    <option value="">{t('admin.studentsManagement.addModal.fields.selectGender', 'Select Gender')}</option>
                    <option value="Male">{t('admin.studentsManagement.addModal.fields.male', 'Male')}</option>
                    <option value="Female">{t('admin.studentsManagement.addModal.fields.female', 'Female')}</option>
                    <option value="Other">{t('admin.studentsManagement.addModal.fields.other', 'Other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.nationality', 'Nationality')}</label>
                  <input
                    type="text"
                    name="nationality"
                    value={newStudent.nationality}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.address', 'Address')}</label>
                  <textarea
                    name="address"
                    value={newStudent.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('admin.studentsManagement.buttons.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('admin.studentsManagement.buttons.add', 'Add Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Students Modal */}
			{showUploadModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('admin.studentsManagement.uploadModal.title', 'Upload Students')}</h2>
							<button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
								<X size={24} />
							</button>
						</div>
						<div className="border-2 border-dashed rounded-lg p-6 text-center">
							<div className="flex justify-center mb-2">
								<Upload size={28} className="text-blue-600" />
							</div>
							<span>{t('admin.studentsManagement.uploadModal.chooseOrDrag', 'Choose a file or drag it here')}</span>
							<div className="mt-2 text-xs text-gray-500">{t('admin.studentsManagement.uploadModal.supportedFormats', 'Supported formats: .xlsx, .xls, .csv')}</div>
							<input type="file" accept=".xlsx,.xls,.csv" className="hidden" id="uploadInput" onChange={handleFileUpload} />
							<label htmlFor="uploadInput" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">{t('admin.studentsManagement.buttons.upload', 'Upload Students')}</label>
						</div>
						<div className="mt-4 flex items-center justify-between">
							<button className="text-blue-600 hover:underline">
								<Download size={16} className="inline mr-1" />
								<span>{t('admin.studentsManagement.uploadModal.downloadTemplate', 'Download Template')}</span>
							</button>
							<button onClick={() => setShowUploadModal(false)} className="px-4 py-2 border rounded">
								{t('admin.studentsManagement.buttons.cancel', 'Cancel')}
							</button>
						</div>
					</div>
				</div>
			)}

      {/* Results Modal */}
      {showResultsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('admin.studentsManagement.resultsModal.title', { name: selectedStudent.name })}</h2>
              <button onClick={() => setShowResultsModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{t('admin.studentsManagement.resultsModal.overview.overallGPA')}</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{mockResults.overallGPA}</p>
                  </div>
                  <Award className="text-blue-500 dark:text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">{t('admin.studentsManagement.resultsModal.overview.attendance')}</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{mockResults.attendance}%</p>
                  </div>
                  <Clock className="text-green-500 dark:text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{t('admin.studentsManagement.resultsModal.overview.courses')}</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{mockResults.courses.length}</p>
                  </div>
                  <BookOpen className="text-purple-500 dark:text-purple-400" size={24} />
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('admin.studentsManagement.resultsModal.overview.progress')}</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">↑ 0.2</p>
                  </div>
                  <TrendingUp className="text-yellow-500 dark:text-yellow-400" size={24} />
                </div>
              </div>
            </div>

            {/* Course Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('admin.studentsManagement.resultsModal.sections.coursePerformance')}</h3>
              <div className="space-y-4">
                {mockResults.courses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.name}</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{course.grade}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" 
                          style={{ width: `${course.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium text-gray-600 dark:text-gray-400">{course.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPA Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('admin.studentsManagement.resultsModal.sections.gpaProgress')}</h3>
              <div className="h-64">
                <div className="flex items-end h-48 space-x-4">
                  {mockResults.progress.map((semester, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-600 dark:bg-blue-400 rounded-t-lg"
                        style={{ height: `${(semester.gpa / 4) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{semester.semester}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('admin.studentsManagement.actionMenu.edit')} {t('admin.studentsManagement.title').split(' ')[0]}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.fullName')}</label>
                  <input
                    type="text"
                    name="name"
                    value={editStudent.name}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={editStudent.email}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.program')}</label>
                  <select
                    name="program"
                    value={editStudent.program}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  >
                    <option value="">{t('admin.studentsManagement.addModal.fields.selectProgram')}</option>
                    {programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.year')}</label>
                  <select
                    name="year"
                    value={editStudent.year}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  >
                    <option value="">{t('admin.studentsManagement.addModal.fields.selectYear')}</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editStudent.phone}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.dateOfBirth')}</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editStudent.dateOfBirth}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.gender')}</label>
                  <select
                    name="gender"
                    value={editStudent.gender}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  >
                    <option value="">{t('admin.studentsManagement.addModal.fields.selectGender')}</option>
                    <option value="Male">{t('admin.studentsManagement.addModal.fields.male')}</option>
                    <option value="Female">{t('admin.studentsManagement.addModal.fields.female')}</option>
                    <option value="Other">{t('admin.studentsManagement.addModal.fields.other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.nationality')}</label>
                  <input
                    type="text"
                    name="nationality"
                    value={editStudent.nationality}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.studentsManagement.addModal.fields.address')}</label>
                  <textarea
                    name="address"
                    value={editStudent.address}
                    onChange={handleEditInputChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                >
                  {t('admin.studentsManagement.buttons.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {t('admin.studentsManagement.buttons.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {showDeleteModal && deleteStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('admin.studentsManagement.buttons.delete')} {t('admin.studentsManagement.title').split(' ')[0]}</h2>
              <button onClick={cancelDelete} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="mb-6 text-gray-700 dark:text-gray-300">
              {t('admin.studentsManagement.deleteModal.confirm', { name: deleteStudent.name })}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                {t('admin.studentsManagement.buttons.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {t('admin.studentsManagement.buttons.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 