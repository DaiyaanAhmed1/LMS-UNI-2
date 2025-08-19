import React from 'react';
import { ShieldCheck, Info, FileText, CheckCircle, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function DataRetentionPolicy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
          </div>
          {/* Compliance Checklist */}
          <div className="bg-green-50 dark:bg-green-900 rounded-xl p-5 mb-8 border-l-4 border-green-400 dark:border-green-600">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              <span className="font-bold text-lg text-green-800 dark:text-green-200">{t('admin.dataRetentionPolicy.compliance.title', { defaultValue: 'Compliance Checklist' })}</span>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200 text-base">
              {t('admin.dataRetentionPolicy.compliance.intro', { defaultValue: 'Marln LMS is committed to full compliance with all relevant data protection laws and best practices. We regularly review and update our policies to ensure ongoing alignment.' })}
            </div>
            <ul className="pl-6 text-gray-700 dark:text-gray-200 text-sm space-y-1">
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.gdpr.label', { defaultValue: 'GDPR (EU General Data Protection Regulation)' })}</b> <span className="ml-2 text-xs bg_green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.gdpr.status', { defaultValue: 'Compliant' })}</span></li>
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.pdpl.label', { defaultValue: 'Saudi Arabia PDPL (Personal Data Protection Law)' })}</b> <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.pdpl.status', { defaultValue: 'Compliant' })}</span></li>
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.shariah.label', { defaultValue: 'Shariah Principles' })}</b> <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.shariah.status', { defaultValue: 'Aligned' })}</span></li>
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.best.label', { defaultValue: 'Best Practices in Data Privacy' })}</b> <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.best.status', { defaultValue: 'Adopted' })}</span></li>
            </ul>
          </div>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full flex items-center justify-center">
              <ShieldCheck size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('admin.dataRetentionPolicy.header.title', { defaultValue: 'Data Retention Policy' })}</h1>
              <div className="text-gray-500 dark:text-gray-300 text-base">{t('admin.dataRetentionPolicy.header.subtitle', { defaultValue: 'How we manage and retain your data in Marln LMS' })}</div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 rounded p-4 mb-6">
            <Info size={24} className="text-blue-600 dark:text-blue-400 mt-1" />
            <div className="text-gray-700 dark:text-gray-200 text-sm">
              {t('admin.dataRetentionPolicy.info.text', { defaultValue: 'This page summarizes how user and course data is retained and managed in compliance with legal obligations (GDPR). For questions, contact your administrator.' })}
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <FileText size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{t('admin.dataRetentionPolicy.tableCard.title', { defaultValue: 'Retention Details' })}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-xl">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.area', { defaultValue: 'Area' })}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.category', { defaultValue: 'Category' })}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.purpose', { defaultValue: 'Purpose' })}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.retention', { defaultValue: 'Retention Period' })}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.lawful', { defaultValue: 'Lawful Bases & Notes' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.area', { defaultValue: 'Site' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.category', { defaultValue: 'Site Settings' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.purpose', { defaultValue: 'Site configuration and settings' })}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.retention', { defaultValue: 'Indefinite' })}</span></td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.lawful.tag', { defaultValue: 'Legitimate Interest' })}</span> {t('admin.dataRetentionPolicy.tableCard.table.rows.site.lawful.desc', { defaultValue: 'Essential for platform operation' })}</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.area', { defaultValue: 'Users' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.category', { defaultValue: 'User Accounts' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.purpose', { defaultValue: 'User authentication and management' })}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.retention', { defaultValue: 'Indefinite' })}</span></td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.lawful.tag', { defaultValue: 'Contract' })}</span> {t('admin.dataRetentionPolicy.tableCard.table.rows.users.lawful.desc', { defaultValue: 'Required for service provision' })}</td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.area', { defaultValue: 'Course Categories' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.category', { defaultValue: 'Course Organization' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.purpose', { defaultValue: 'Course categorization and organization' })}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.retention', { defaultValue: 'Indefinite' })}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.lawful', { defaultValue: 'Legitimate Interest - Educational organization' })}</td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.area', { defaultValue: 'Courses' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.category', { defaultValue: 'Course Content' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.purpose', { defaultValue: 'Educational content and materials' })}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.retention', { defaultValue: 'Indefinite' })}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.lawful', { defaultValue: 'Legitimate Interest - Educational content' })}</td>
                  </tr>
                  {/* Row 5 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.area', { defaultValue: 'Activity Modules' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.category', { defaultValue: 'Learning Activities' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.purpose', { defaultValue: 'Interactive learning activities and assessments' })}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.retention', { defaultValue: 'Indefinite' })}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.lawful', { defaultValue: 'Legitimate Interest - Educational activities' })}</td>
                  </tr>
                  {/* Row 6 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.area', { defaultValue: 'Blocks' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.category', { defaultValue: 'Content Blocks' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.purpose', { defaultValue: 'Content blocks and widgets' })}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.retention', { defaultValue: 'Indefinite' })}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.lawful', { defaultValue: 'Legitimate Interest - Content management' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanatory Notes */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-5 text-gray-700 dark:text-gray-200 text-sm border-l-4 border-blue-400 dark:border-blue-600 mb-8">
            <ul className="list-disc pl-6 mb-2">
              <li>Site and Users: Retained indefinitely as they are essential for platform operation and user account management.</li>
              <li>Course Categories: Retained indefinitely for educational organization and course management purposes.</li>
              <li>Courses: Retained indefinitely as they contain valuable educational content and materials.</li>
              <li>Activity Modules: Retained indefinitely for educational activities and assessment purposes.</li>
              <li>Blocks: Retained indefinitely for content management and platform functionality.</li>
            </ul>
            <p>All data retention periods are subject to legal requirements and may be adjusted based on regulatory changes or institutional policies.</p>
          </div>

          {/* Legal Alignment Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{t('admin.dataRetentionPolicy.legal.title', { defaultValue: 'Legal Alignment: Saudi Arabia\'s PDPL & Shariah Principles' })}</span>
            </div>
            <div className="mb-3 text-gray-600 dark:text-gray-300 text-sm">
              {t('admin.dataRetentionPolicy.legal.intro', { defaultValue: 'Marln LMS aligns with international and local data protection standards. Below is a mapping of Saudi Arabia\'s Personal Data Protection Law (PDPL) principles to corresponding Shariah concepts, ensuring both legal and cultural compliance.' })}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-xl">
                <thead>
                  <tr className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200">
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.legal.table.headers.pdplPrinciple', { defaultValue: 'PDPL Principle' })}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.legal.table.headers.shariah', { defaultValue: 'Shariah Alignment' })}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.lawful.pdpl', { defaultValue: 'Lawful Processing' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.lawful.shariah', { defaultValue: 'Halal (Permissible) - Data processing must be lawful and beneficial' })}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg_green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.purpose.pdpl', { defaultValue: 'Purpose Limitation' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.purpose.shariah', { defaultValue: 'Maqasid (Objectives) - Data use must serve legitimate educational purposes' })}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.min.pdpl', { defaultValue: 'Data Minimization' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.min.shariah', { defaultValue: 'Iqtisad (Economy) - Only collect necessary data for educational purposes' })}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.rights.pdpl', { defaultValue: 'Individual Rights' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.rights.shariah', { defaultValue: 'Huquq (Rights) - Respect for individual privacy and dignity' })}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.security.pdpl', { defaultValue: 'Security & Accountability' })}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.security.shariah', { defaultValue: 'Amanah (Trust) - Secure handling and responsible stewardship of data' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <b>{t('common.note', { defaultValue: 'Note:' })}</b> {t('admin.dataRetentionPolicy.legal.note', { defaultValue: 'This alignment ensures that Marln LMS operates in accordance with both Saudi Arabian legal requirements and Islamic ethical principles, providing a comprehensive framework for data protection that respects both legal and cultural values.' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 