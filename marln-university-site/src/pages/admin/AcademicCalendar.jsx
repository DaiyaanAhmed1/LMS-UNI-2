import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { calendarEvents as initialEvents } from '../../data/calendar';
import { Plus, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

// Minimal Hijri conversion (demo) - Fixed to year 1447
function gregorianToHijri(date) {
	function floor(n) { return Math.floor(n); }
	function jdFromDate(d) {
		const a = floor((14 - (d.getMonth() + 1)) / 12);
		const y = d.getFullYear() + 4800 - a;
		const m = (d.getMonth() + 1) + 12 * a - 3;
		return (d.getDate() + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - floor(y / 100) + floor(y / 400) - 32045);
	}
	const jd = jdFromDate(date);
	const islamicDays = jd - 1948439 + 10632;
	const n = floor((islamicDays - 1) / 10631);
	const r = islamicDays - 10631 * n;
	const j = floor((r - 1) / 354.36667);
	const y = 30 * n + j;
	const k = r - floor(354.36667 * j);
	const m = floor((k - 1) / 29.5) + 1;
	const d = k - floor(29.5 * (m - 1));
	return { y: 1447, m, d }; // Force year to 1447
}
const hijriMonthNames = ['Muharram','Safar','Rabiʿ I','Rabiʿ II','Jumada I','Jumada II','Rajab','Shaʿban','Ramadan','Shawwal','Dhu al‑Qaʿdah','Dhu al‑Hijjah'];

const eventTypes = [
  { value: 'event', label: 'Event' },
  { value: 'exam', label: 'Exam' },
  { value: 'holiday', label: 'Holiday' }
];

export default function AcademicCalendar() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('calendarEvents');
    return stored ? JSON.parse(stored) : initialEvents;
  });
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', type: '', description: '' });
  const [useHijri, setUseHijri] = useState(currentLanguage === 'ar');

  const handleAdd = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length ? Math.max(...events.map(ev => ev.id)) + 1 : 1,
      ...form
    };
    setEvents([...events, newEvent]);
    setShowAddModal(false);
    setForm({ title: '', date: '', type: '', description: '' });
  };

  const handleDelete = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.academicCalendar.title', 'Academic Calendar')}</h1>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                <span>{t('student.schedule.dateSystem.label')}</span>
                <button onClick={() => setUseHijri(false)} className={`px-2 py-0.5 rounded ${!useHijri ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{t('student.schedule.dateSystem.gregorian')}</button>
                <button onClick={() => setUseHijri(true)} className={`px-2 py-0.5 rounded ${useHijri ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{t('student.schedule.dateSystem.hijri')}</button>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>{t('admin.academicCalendar.buttons.addEvent', 'Add Event')}</span>
              </button>
            </div>
          </div>

          {/* Event List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.academicCalendar.table.title', 'Title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.academicCalendar.table.date', 'Date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.academicCalendar.table.type', 'Type')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.academicCalendar.table.description', 'Description')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.academicCalendar.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{ev.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-blue-700 dark:text-blue-400">{ev.date}</div>
                      {useHijri && (() => { const d=new Date(ev.date); if (isNaN(d)) return null; const h = gregorianToHijri(d); return <div className="text-[11px] text-gray-500">{h.d} {hijriMonthNames[h.m-1]} 1447</div>; })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      <span className={
                        ev.type === 'exam' ? 'text-red-600 dark:text-red-400' :
                        ev.type === 'holiday' ? 'text-green-600 dark:text-green-400' :
                        'text-gray-700 dark:text-gray-200'
                      }>
                        {t(`admin.academicCalendar.types.${ev.type}`, ev.type.charAt(0).toUpperCase() + ev.type.slice(1))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ev.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(ev.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.academicCalendar.addModal.title', 'Add Academic Event')}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.academicCalendar.addModal.fields.title', 'Title')}</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.academicCalendar.addModal.fields.date', 'Date')}</label>
                <input type="date" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                {form.date && (() => { const d = new Date(form.date); const isFriday = d.getDay()===5; const h = useHijri ? gregorianToHijri(d) : null; return (
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                    {isFriday && <span className="text-green-700">{t('student.schedule.fridayHint')}</span>}
                    {useHijri && <span>{h.d} {hijriMonthNames[h.m-1]} 1447</span>}
                  </div>
                ); })()}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.academicCalendar.addModal.fields.type', 'Type')}</label>
                <select className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="">{t('admin.academicCalendar.addModal.fields.selectType', 'Select Type')}</option>
                  {eventTypes.map(ti => <option key={ti.value} value={ti.value}>{t(`admin.academicCalendar.types.${ti.value}`, ti.label)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.academicCalendar.addModal.fields.description', 'Description')}</label>
                <textarea className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-700 dark:text-gray-100" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('admin.academicCalendar.buttons.cancel', 'Cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('admin.academicCalendar.buttons.add', 'Add Event')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 