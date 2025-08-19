import React from 'react';
import { ShieldCheck, Info, FileText, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DataRetentionPolicy() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Compliance Checklist */}
          <div className="bg-green-50 dark:bg-green-900 rounded-xl p-5 mb-8 border-l-4 border-green-400 dark:border-green-600">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              <span className="font-bold text-lg text-green-800 dark:text-green-200">{t('admin.dataRetentionPolicy.compliance.title')}</span>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200 text-base">
              {t('admin.dataRetentionPolicy.compliance.intro')}
            </div>
            <ul className="pl-6 text-gray-700 dark:text-gray-200 text-sm space-y-1">
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.gdpr.label')}</b> <span className="ml-2 text-xs bg_green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.gdpr.status')}</span></li>
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.pdpl.label')}</b> <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.pdpl.status')}</span></li>
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.shariah.label')}</b> <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.shariah.status')}</span></li>
              <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600 dark:text-green-400" /> <b>{t('admin.dataRetentionPolicy.compliance.items.best.label')}</b> <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{t('admin.dataRetentionPolicy.compliance.items.best.status')}</span></li>
            </ul>
          </div>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full flex items-center justify-center">
              <ShieldCheck size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('admin.dataRetentionPolicy.header.title')}</h1>
              <div className="text-gray-500 dark:text-gray-300 text-base">{t('admin.dataRetentionPolicy.header.subtitle')}</div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 rounded p-4 mb-6">
            <Info size={24} className="text-blue-600 dark:text-blue-400 mt-1" />
            <div className="text-gray-700 dark:text-gray-200 text-sm">
              {t('admin.dataRetentionPolicy.info.text')}
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <FileText size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{t('admin.dataRetentionPolicy.tableCard.title')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-xl">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.area')}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.category')}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.purpose')}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.retention')}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.tableCard.table.headers.lawful')}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.area')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.category')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.purpose')}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.retention')}</span></td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.site.lawful.tag')}</span> {t('admin.dataRetentionPolicy.tableCard.table.rows.site.lawful.desc')}</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.area')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.category')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.purpose')}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.retention')}</span></td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.users.lawful.tag')}</span> {t('admin.dataRetentionPolicy.tableCard.table.rows.users.lawful.desc')}</td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.area')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.category')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.purpose')}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.retention')}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courseCategories.lawful')}</td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.area')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.category')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.purpose')}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.retention')}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.courses.lawful')}</td>
                  </tr>
                  {/* Row 5 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.area')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.category')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.purpose')}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.retention')}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.activityModules.lawful')}</td>
                  </tr>
                  {/* Row 6 */}
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-blue-50 hover:dark:bg-blue-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.area')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.category')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.purpose')}</td>
                    <td className="py-3 px-3"><span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.retention')}</span></td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.tableCard.table.rows.blocks.lawful')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanatory Notes */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-5 text-gray-700 dark:text-gray-200 text-sm border-l-4 border-blue-400 dark:border-blue-600 mb-8">
            <ul className="list-disc pl-6 mb-2">
              <li>{t('admin.dataRetentionPolicy.explanatoryNotes.siteUsers.desc')}</li>
              <li>{t('admin.dataRetentionPolicy.explanatoryNotes.courseCategories.desc')}</li>
              <li>{t('admin.dataRetentionPolicy.explanatoryNotes.courses.desc')}</li>
              <li>{t('admin.dataRetentionPolicy.explanatoryNotes.activityModules.desc')}</li>
              <li>{t('admin.dataRetentionPolicy.explanatoryNotes.blocks.desc')}</li>
            </ul>
            <p>{t('admin.dataRetentionPolicy.explanatoryNotes.note')}</p>
          </div>

          {/* Legal Alignment Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{t('admin.dataRetentionPolicy.legal.title')}</span>
            </div>
            <div className="mb-3 text-gray-600 dark:text-gray-300 text-sm">
              {t('admin.dataRetentionPolicy.legal.intro')}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-xl">
                <thead>
                  <tr className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200">
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.legal.table.headers.pdplPrinciple')}</th>
                    <th className="py-2 px-3 text-left">{t('admin.dataRetentionPolicy.legal.table.headers.shariah')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.lawful.pdpl')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.lawful.shariah')}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg_green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.purpose.pdpl')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.purpose.shariah')}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.min.pdpl')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.min.shariah')}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.rights.pdpl')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.rights.shariah')}</td>
                  </tr>
                  <tr className="even:bg-gray-50 even:dark:bg-gray-900 hover:bg-green-50 hover:dark:bg-green-900 transition">
                    <td className="py-3 px-3 font-semibold">{t('admin.dataRetentionPolicy.legal.table.rows.security.pdpl')}</td>
                    <td className="py-3 px-3">{t('admin.dataRetentionPolicy.legal.table.rows.security.shariah')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <b>{t('common.note', { defaultValue: 'Note:' })}</b> {t('admin.dataRetentionPolicy.legal.note')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 