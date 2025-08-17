import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { documents as initialDocuments, categories } from '../../data/documents';
import { Plus, Trash2, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DocumentManagement() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState(() => {
    const stored = localStorage.getItem('documents');
    return stored ? JSON.parse(stored) : initialDocuments;
  });
  useEffect(() => { localStorage.setItem('documents', JSON.stringify(documents)); }, [documents]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', description: '', file: null });
  const fileInputRef = useRef();

  const handleUpload = (e) => {
    e.preventDefault();
    if (!form.file) return;
    const newDoc = { id: documents.length + 1, title: form.title, filename: form.file.name, category: form.category, uploadedBy: 'Admin', uploadDate: new Date().toISOString().split('T')[0], url: '', description: form.description };
    setDocuments([...documents, newDoc]);
    setShowUploadModal(false);
    setForm({ title: '', category: '', description: '', file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (doc) => {
    const blob = new Blob([`This is a placeholder for ${doc.filename}`], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id) => { setDocuments(documents.filter(d => d.id !== id)); };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.documentManagement.title', 'Document Management')}</h1>
            <button onClick={() => setShowUploadModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              <span>{t('admin.documentManagement.uploadButton', 'Upload Document')}</span>
            </button>
          </div>

          {/* Document List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.documentManagement.table.title', 'Title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.documentManagement.table.category', 'Category')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.documentManagement.table.uploadedBy', 'Uploaded By')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.documentManagement.table.uploadDate', 'Upload Date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.documentManagement.table.file', 'File')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.documentManagement.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{doc.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-400">{doc.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{doc.uploadedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{doc.uploadDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{doc.filename}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleDownload(doc)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" title={t('admin.documentManagement.actions.download', 'Download')}><Download size={18} /></button>
                      <button onClick={() => handleDelete(doc.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200" title={t('admin.documentManagement.actions.delete', 'Delete')}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.documentManagement.uploadModal.title', 'Upload Document')}</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.documentManagement.uploadModal.fields.title', 'Title')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.documentManagement.uploadModal.fields.category', 'Category')}</label>
                <select className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">{t('admin.documentManagement.uploadModal.fields.category', 'Select Category')}</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.documentManagement.uploadModal.fields.description', 'Description')}</label>
                <textarea className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.documentManagement.uploadModal.fields.file', 'File')}</label>
                <input type="file" className="mt-1 block w-full" required ref={fileInputRef} onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.documentManagement.uploadModal.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">{t('admin.documentManagement.uploadModal.buttons.upload', 'Upload')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 