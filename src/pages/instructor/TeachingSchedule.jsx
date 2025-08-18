import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Calendar, BookOpen, ClipboardList, Users2, Plus, X, Edit, Trash2, AlertTriangle, ChevronLeft, ChevronRight, Clock, MapPin, Filter, Search, Grid, List, Eye, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTour } from '../../context/TourContext.jsx';

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
const ksaFixedHolidays = [ { gMonth: 2, gDay: 22 }, { gMonth: 9, gDay: 23 } ];
const ksaHijriHolidays = [ { hMonth: 10, hDays: [1,2,3] }, { hMonth: 12, hDays: [10,11,12,13] } ];
function isKsaHoliday(date) {
	const gMonth = date.getMonth() + 1; const gDay = date.getDate();
	if (ksaFixedHolidays.some(h => h.gMonth === gMonth && h.gDay === gDay)) return true;
	const h = gregorianToHijri(date);
	return ksaHijriHolidays.some(hh => hh.hMonth === h.m && hh.hDays.includes(h.d));
}

// Jumu'ah window (Riyadh typical). Keep simple and configurable.
const JUMUAH_START = '12:00';
const JUMUAH_END = '13:30';
function minutesFromHHMM(hhmm) {
	if (!hhmm) return null;
	const [h, m] = hhmm.split(':').map(Number);
	return h * 60 + m;
}
function isJumuahConflict(dateStr, timeStr) {
	if (!dateStr || !timeStr) return false;
	const d = new Date(dateStr);
	if (d.getDay() !== 5) return false; // Friday
	const t = minutesFromHHMM(timeStr);
	const s = minutesFromHHMM(JUMUAH_START);
	const e = minutesFromHHMM(JUMUAH_END);
	return t >= s && t <= e;
}

// Generate instructor dummy events from student calendar references (moved to 2025)
import { calendarEvents } from '../../data/calendar';
const mappedFromStudent = calendarEvents.map((e, idx) => {
	const d = new Date(e.date);
	const y = 2025; // shift to 2025
	const date = `${y}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
	const mapType = e.type === 'holiday' ? 'holiday' : e.type === 'exam' ? 'activity' : 'university';
	return {
		id: 200 + idx,
		date,
		type: mapType,
		title: e.title,
		time: e.type === 'exam' ? '10:00' : '',
		desc: e.description
	};
});

// Additional Saudi-relevant 2025 demo events
const saudiDemo = [
	{ id: 300, date: '2025-02-22', type: 'holiday', title: 'Founding Day (KSA)', time: '', desc: 'Public holiday' },
	{ id: 301, date: '2025-03-01', type: 'activity', title: 'Saudi Teachers Forum', time: '10:00', desc: 'Riyadh Exhibition Center' },
	// Approximate Ramadan start (subject to moon sighting; demo only)
	{ id: 302, date: '2025-03-01', type: 'activity', title: 'Ramadan Preparations', time: '12:00', desc: 'Adjust schedules for Ramadan' },
	// Eid al-Fitr (approximate range demo)
	{ id: 303, date: '2025-03-31', type: 'holiday', title: 'Eid al-Fitr Holiday', time: '', desc: 'Campus closed (demo)' },
	{ id: 304, date: '2025-04-01', type: 'holiday', title: 'Eid al-Fitr Holiday', time: '', desc: 'Campus closed (demo)' },
	{ id: 305, date: '2025-04-02', type: 'holiday', title: 'Eid al-Fitr Holiday', time: '', desc: 'Campus closed (demo)' },
	// Hajj / Eid al-Adha (approximate)
	{ id: 306, date: '2025-06-06', type: 'holiday', title: 'Eid al-Adha Holiday', time: '', desc: 'Campus closed (demo)' },
	{ id: 307, date: '2025-06-07', type: 'holiday', title: 'Eid al-Adha Holiday', time: '', desc: 'Campus closed (demo)' },
	{ id: 308, date: '2025-06-08', type: 'holiday', title: 'Eid al-Adha Holiday', time: '', desc: 'Campus closed (demo)' },
];

const dummyEvents = [
	{ id: 101, date: '2025-01-15', type: 'class', title: 'CS101 Lecture', time: '09:00', desc: 'Room 204, Main Building' },
	{ id: 105, date: '2025-04-09', type: 'class', title: 'ML305 Lab', time: '11:00', desc: 'Lab 3, Science Block' },
	{ id: 109, date: '2025-08-26', type: 'assignment', title: 'Assignment 2 Due', time: '23:59', desc: 'ML305: Regression' },
	{ id: 111, date: '2025-10-07', type: 'class', title: 'CS101 Lecture', time: '09:00', desc: 'Room 204, Main Building' },
	...mappedFromStudent,
	...saudiDemo,
	// Fill August 2025 for demo density
	{ id: 410, date: '2025-08-01', type: 'class', title: 'Intro Lecture', time: '12:15', desc: 'Auditorium A (demo conflict)' }, // Friday conflict
	{ id: 411, date: '2025-08-01', type: 'activity', title: 'Advising Walk-ins', time: '15:00', desc: 'Dept Office' },
	{ id: 412, date: '2025-08-05', type: 'university', title: 'Lab Safety Briefing', time: '10:00', desc: 'Lab 1' },
	{ id: 413, date: '2025-08-08', type: 'class', title: 'Project Kickoff', time: '12:05', desc: 'Room 120 (demo conflict)' }, // Friday conflict
	{ id: 414, date: '2025-08-08', type: 'assignment', title: 'Syllabus Quiz Due', time: '20:00', desc: 'Online' },
	{ id: 415, date: '2025-08-12', type: 'activity', title: 'Faculty Meeting', time: '14:00', desc: 'Conference Room' },
	{ id: 416, date: '2025-08-15', type: 'class', title: 'Data Structures', time: '12:20', desc: 'Room 210 (demo conflict)' }, // Friday conflict
	{ id: 417, date: '2025-08-15', type: 'activity', title: 'Student Club Fair', time: '17:00', desc: 'Courtyard' },
	{ id: 418, date: '2025-08-18', type: 'class', title: 'Networks Lab', time: '11:00', desc: 'Lab 5' },
	{ id: 419, date: '2025-08-20', type: 'university', title: 'Guest Lecture', time: '13:30', desc: 'Main Hall' },
	{ id: 420, date: '2025-08-22', type: 'class', title: 'Algorithms Seminar', time: '12:10', desc: 'Seminar Room (demo conflict)' }, // Friday conflict
	{ id: 421, date: '2025-08-22', type: 'activity', title: 'Mentor Connect', time: '16:00', desc: 'Advising Office' },
	{ id: 422, date: '2025-08-23', type: 'class', title: 'Make-up Session', time: '09:30', desc: 'Room 204' },
	{ id: 423, date: '2025-08-23', type: 'university', title: 'Sports Trial', time: '11:00', desc: 'Sports Complex' },
	{ id: 424, date: '2025-08-29', type: 'class', title: 'Midterm Review', time: '12:25', desc: 'Room 101 (demo conflict)' }, // Friday conflict
];

const eventColors = {
	class: 'bg-blue-500',
	assignment: 'bg-green-500',
	activity: 'bg-yellow-500',
	holiday: 'bg-red-500',
	university: 'bg-purple-600',
};

function getMonthDays(year, month) {
	const days = [];
	const firstDay = new Date(year, month, 1).getDay();
	const lastDate = new Date(year, month + 1, 0).getDate();
	let day = 1 - firstDay;
	for (let i = 0; i < 6; i++) {
		const week = [];
		for (let j = 0; j < 7; j++, day++) {
			week.push(day > 0 && day <= lastDate ? day : null);
		}
		days.push(week);
	}
	return days;
}

export default function TeachingSchedule() {
	const { t } = useTranslation();
	const { currentLanguage, isRTL } = useLanguage();
	const { startTour } = useTour();
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());
	const [selectedDate, setSelectedDate] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalEvent, setModalEvent] = useState(null);
	const [events, setEvents] = useState(dummyEvents);
	const [useHijri, setUseHijri] = useState(currentLanguage === 'ar');
	const [viewMode, setViewMode] = useState('calendar');
	const [filterType, setFilterType] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		// Auto-start tour for new users
		const key = 'tour:instructor:calendar:v1:autostart';
		const hasSeenTour = localStorage.getItem(key);
		const tourCompleted = localStorage.getItem('tour:instructor:calendar:v1:state');
		
		if (!hasSeenTour && tourCompleted !== 'completed') {
			setTimeout(() => {
				startCalendarTour();
				localStorage.setItem(key, 'shown');
			}, 100);
		}
		
		// Handle tour launches from navigation
		const onLaunch = () => {
			const launch = localStorage.getItem('tour:launch');
			if (launch === 'instructor-resume') {
				localStorage.removeItem('tour:launch');
				setTimeout(() => startCalendarTour(), 200);
			}
		};
		window.addEventListener('tour:launch', onLaunch);
		return () => window.removeEventListener('tour:launch', onLaunch);
	}, []);

	const startCalendarTour = () => {
		const steps = [
			{ target: '[data-tour="instructor-calendar-header"]', title: t('instructor.tour.calendar.header.title', 'Teaching Schedule'), content: t('instructor.tour.calendar.header.desc', 'Welcome to your teaching schedule page. Manage your classes, assignments, and events in one comprehensive calendar view.'), placement: 'bottom', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-view-toggle"]', title: t('instructor.tour.calendar.viewToggle.title', 'View Options'), content: t('instructor.tour.calendar.viewToggle.desc', 'Switch between calendar view and list view to see your events in different layouts.'), placement: 'bottom', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-hijri-toggle"]', title: t('instructor.tour.calendar.hijri.title', 'Hijri/Gregorian'), content: t('instructor.tour.calendar.hijri.desc', 'Toggle between Hijri and Gregorian date systems for your convenience.'), placement: 'left', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-search"]', title: t('instructor.tour.calendar.search.title', 'Search Events'), content: t('instructor.tour.calendar.search.desc', 'Quickly find specific events by typing the title or description.'), placement: 'bottom', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-filter"]', title: t('instructor.tour.calendar.filter.title', 'Filter Events'), content: t('instructor.tour.calendar.filter.desc', 'Filter events by type: classes, assignments, activities, holidays, or university events.'), placement: 'bottom', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-add-event"]', title: t('instructor.tour.calendar.addEvent.title', 'Add New Event'), content: t('instructor.tour.calendar.addEvent.desc', 'Create new events, classes, or assignments. Click this button to add events to your schedule.'), placement: 'bottom', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-nav"]', title: t('instructor.tour.calendar.nav.title', 'Navigate Months'), content: t('instructor.tour.calendar.nav.desc', 'Move between months and switch date systems.'), placement: 'bottom', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-grid"]', title: t('instructor.tour.calendar.grid.title', 'Calendar Grid'), content: t('instructor.tour.calendar.grid.desc', 'Click a day to add an event; colored pills show events. Friday conflicts with prayer times are highlighted.'), placement: 'top', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-upcoming"]', title: t('instructor.tour.calendar.upcoming.title', 'Upcoming Events'), content: t('instructor.tour.calendar.upcoming.desc', 'Quick overview of your next 5 upcoming events. Click on any event to view or edit details.'), placement: 'left', disableBeacon: true },
			{ target: '[data-tour="instructor-calendar-prayer-panel"]', title: t('instructor.tour.calendar.prayer.title', 'Prayer Times (Demo)'), content: t('instructor.tour.calendar.prayer.desc', 'Demo panel with prayer times; Friday conflicts are highlighted to help you avoid scheduling conflicts.'), placement: 'left', disableBeacon: true }
		].filter(s => document.querySelector(s.target));
		if (steps.length) startTour('instructor:calendar:v1', steps);
	};

	const monthDays = getMonthDays(year, month);
	const monthStr = useHijri ? `${hijriMonthNames[gregorianToHijri(new Date(year, month, 1)).m - 1]} 1447` : new Date(year, month).toLocaleString('default', { month: 'long' });

	const goToPrevMonth = () => {
		if (month === 0) {
			setMonth(11);
			setYear(y => y - 1);
		} else {
			setMonth(m => m - 1);
		}
	};
	const goToNextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear(y => y + 1);
		} else {
			setMonth(m => m + 1);
		}
	};

	const openEvent = (event) => {
		setModalEvent(event);
		setShowModal(true);
	};
	const closeModal = () => {
		setShowModal(false);
		setModalEvent(null);
	};
	const openAddEvent = (date) => {
		setModalEvent({ date, type: 'class', title: '', time: '', desc: '' });
		setShowModal(true);
	};
	const saveEvent = () => {
		if (modalEvent.id) {
			setEvents(events.map(e => e.id === modalEvent.id ? modalEvent : e));
		} else {
			setEvents([...events, { ...modalEvent, id: Date.now() }]);
		}
		setShowModal(false);
		setModalEvent(null);
	};
	const deleteEvent = () => {
		if (modalEvent?.id) {
			setEvents(events.filter(e => e.id !== modalEvent.id));
			setShowModal(false);
			setModalEvent(null);
		}
	};

	const eventsForDay = (d) => events.filter(e => {
		const [y, m, day] = e.date.split('-').map(Number);
		return y === year && m === month + 1 && day === d;
	});
	
	const filteredEvents = events.filter(event => {
		const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 event.desc.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterType === 'all' || event.type === filterType;
		return matchesSearch && matchesFilter;
	});
	
	const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date(year, month, 1))
		.sort((a, b) => new Date(a.date) - new Date(b.date))
		.slice(0, 5);

	const hasJumuahConflict = isJumuahConflict(modalEvent?.date, modalEvent?.time);

	const getEventTypeIcon = (type) => {
		switch (type) {
			case 'class': return <BookOpen size={16} className="text-white" />;
			case 'assignment': return <ClipboardList size={16} className="text-white" />;
			case 'activity': return <Users2 size={16} className="text-white" />;
			case 'holiday': return <AlertTriangle size={16} className="text-white" />;
			case 'university': return <Calendar size={16} className="text-white" />;
			default: return <Calendar size={16} className="text-white" />;
		}
	};

	const formatEventTime = (time) => {
		if (!time) return '';
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	const getEventTypeLabel = (type) => {
		switch (type) {
			case 'class': return t('instructor.teachingSchedule.types.class', 'Class');
			case 'assignment': return t('instructor.teachingSchedule.types.assignment', 'Assignment');
			case 'activity': return t('instructor.teachingSchedule.types.activity', 'Activity');
			case 'holiday': return t('instructor.teachingSchedule.types.holiday', 'Holiday');
			case 'university': return t('instructor.teachingSchedule.types.university', 'University');
			default: return type;
		}
	};

	return (
		<div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
			<Sidebar role="instructor" />
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
					<div className="flex justify-between items-center mb-4" data-tour="instructor-calendar-header">
						<div className="flex items-center gap-3">
							<Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('instructor.teachingSchedule.title')}</h1>
						</div>
						<div className="flex items-center gap-4">
							{/* View Toggle */}
							<div className="flex items-center gap-2" data-tour="instructor-calendar-view-toggle">
								<button
									onClick={() => setViewMode('calendar')}
									className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
								>
									<Grid size={18} />
								</button>
								<button
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
								>
									<List size={18} />
								</button>
							</div>
							{/* Hijri/Gregorian toggle */}
							<div className="hidden md:flex items-center gap-1 text-xs text-gray-500" data-tour="instructor-calendar-hijri-toggle">
								<span>{t('student.schedule.dateSystem.label')}</span>
								<button onClick={() => setUseHijri(false)} className={`px-2 py-0.5 rounded ${!useHijri ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{t('student.schedule.dateSystem.gregorian')}</button>
								<button onClick={() => setUseHijri(true)} className={`px-2 py-0.5 rounded ${useHijri ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{t('student.schedule.dateSystem.hijri')}</button>
							</div>
						</div>
					</div>
					
					{/* Search and Filters */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
						<div className="relative" data-tour="instructor-calendar-search">
							<Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={18} />
							<input 
								type="text" 
								className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
								placeholder={t('instructor.teachingSchedule.searchPlaceholder', 'Search events...')} 
								value={searchTerm} 
								onChange={e => setSearchTerm(e.target.value)} 
							/>
						</div>
						<select 
							className={`border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
							value={filterType}
							onChange={e => setFilterType(e.target.value)}
							data-tour="instructor-calendar-filter"
						>
							<option value="all">{t('instructor.teachingSchedule.filters.all', 'All Events')}</option>
							<option value="class">{t('instructor.teachingSchedule.filters.class', 'Classes')}</option>
							<option value="assignment">{t('instructor.teachingSchedule.filters.assignment', 'Assignments')}</option>
							<option value="activity">{t('instructor.teachingSchedule.filters.activity', 'Activities')}</option>
							<option value="holiday">{t('instructor.teachingSchedule.filters.holiday', 'Holidays')}</option>
							<option value="university">{t('instructor.teachingSchedule.filters.university', 'University')}</option>
						</select>
						<button 
							onClick={() => openAddEvent(`${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)}
							className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							data-tour="instructor-calendar-add-event"
						>
							<Plus size={18} />
							{t('instructor.teachingSchedule.addEvent', 'Add Event')}
						</button>
					</div>
				</div>

				<div className="flex-1 flex flex-col lg:flex-row gap-8 p-6 overflow-hidden">
					{/* Main Content */}
					<div className="flex-1 overflow-auto">
						{viewMode === 'calendar' ? (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6" data-tour="instructor-calendar-grid">
								<div className="flex justify-between items-center mb-6" data-tour="instructor-calendar-nav">
									<div className="flex items-center gap-4">
										<button onClick={goToPrevMonth} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
											<ChevronLeft size={20} />
										</button>
										<span className="font-semibold text-xl text-gray-800 dark:text-gray-100">{monthStr} {year}</span>
										<button onClick={goToNextMonth} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
											<ChevronRight size={20} />
										</button>
									</div>
								</div>
					<table className="w-full text-center select-none" dir={isRTL ? 'rtl' : 'ltr'}>
						<thead>
							<tr className="text-gray-500 dark:text-gray-300">
								<th className={isRTL ? 'text-right' : 'text-left'}>{t('instructor.teachingSchedule.days.sun')}</th>
								<th className={isRTL ? 'text-right' : 'text-left'}>{t('instructor.teachingSchedule.days.mon')}</th>
								<th className={isRTL ? 'text-right' : 'text-left'}>{t('instructor.teachingSchedule.days.tue')}</th>
								<th className={isRTL ? 'text-right' : 'text-left'}>{t('instructor.teachingSchedule.days.wed')}</th>
								<th className={isRTL ? 'text-right' : 'text-left'}>{t('instructor.teachingSchedule.days.thu')}</th>
								<th className={`text-green-700 dark:text-green-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t('instructor.teachingSchedule.days.fri')}</th>
								<th className={isRTL ? 'text-right' : 'text-left'}>{t('instructor.teachingSchedule.days.sat')}</th>
							</tr>
						</thead>
						<tbody>
							{monthDays.map((week, i) => (
								<tr key={i}>
									{week.map((d, j) => (
										<td key={j} className={`h-24 w-24 align-top border border-gray-200 dark:border-gray-700 ${d ? 'bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => d && openAddEvent(`${year}-` + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'))}>
											<div className={`flex items-center justify-between text-sm font-semibold ${d && new Date(year, month, d).toDateString() === today.toDateString() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
												<span>{d || ''}</span>
												{d && useHijri && (() => { const h = gregorianToHijri(new Date(year, month, d)); return <span className="text-[10px] text-gray-500">{h.d}</span>; })()}
											</div>
											<div className="flex flex-col gap-1 mt-1">
												{d && eventsForDay(d).map(ev => {
													const conflict = isJumuahConflict(ev.date, ev.time);
													return (
														<div key={ev.id} className={`rounded px-2 py-1 text-xs text-white ${eventColors[ev.type]} cursor-pointer flex items-center gap-1`} onClick={e => { e.stopPropagation(); openEvent(ev); }}>
															{conflict && <AlertTriangle size={12} className="text-amber-300" title={t('instructor.teachingSchedule.jumuahWarning.title')} />}
															<span className="truncate">{ev.title}</span>
														</div>
													);
												})}
												{d && isKsaHoliday(new Date(year, month, d)) && (
													<div className="text-[10px] text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 px-1 py-0.5 rounded inline-block">{t('student.schedule.holidayKSA')}</div>
												)}
											</div>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('instructor.teachingSchedule.listView.title', 'All Events')}</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
							{filteredEvents.map(event => (
								<div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center gap-2">
											{getEventTypeIcon(event.type)}
											<div className={`px-2 py-1 text-xs font-medium rounded-full ${eventColors[event.type]} text-white`}>
												{getEventTypeLabel(event.type)}
											</div>
										</div>
										<div className="flex gap-1">
											<button onClick={() => openEvent(event)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
												<Eye size={16} />
											</button>
											<button onClick={() => openEvent(event)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
												<Edit size={16} />
											</button>
										</div>
									</div>
									
									<h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{event.title}</h3>
									
									<div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
										<div className="flex items-center gap-2">
											<Calendar size={14} />
											<span>{event.date}</span>
										</div>
										{event.time && (
											<div className="flex items-center gap-2">
												<Clock size={14} />
												<span>{formatEventTime(event.time)}</span>
											</div>
										)}
										{event.desc && (
											<div className="flex items-start gap-2">
												<MapPin size={14} className="mt-0.5" />
												<span>{event.desc}</span>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						
						{filteredEvents.length === 0 && (
							<div className="text-center py-12">
								<Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
								<p className="text-gray-500 dark:text-gray-400">{t('instructor.teachingSchedule.noEvents', 'No events found')}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
		
		{/* Sidebar */}
		<div className="w-full lg:w-80 flex-shrink-0 overflow-auto">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6" data-tour="instructor-calendar-upcoming">
				<div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
					<Calendar size={18}/> 
					{t('instructor.teachingSchedule.sidebar.upcoming')}
				</div>
				<div className="flex flex-col gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
					{upcomingEvents.length === 0 && (
						<div className="text-gray-400 dark:text-gray-500 text-sm">
							{t('instructor.teachingSchedule.sidebar.none')}
						</div>
					)}
					{upcomingEvents.map(ev => (
						<div key={ev.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
							<div className="flex items-start justify-between mb-2">
								<div className="flex items-center gap-2">
									{getEventTypeIcon(ev.type)}
									<div className={`px-2 py-1 text-xs font-medium rounded-full ${eventColors[ev.type]} text-white`}>
										{getEventTypeLabel(ev.type)}
									</div>
								</div>
								<button onClick={() => openEvent(ev)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
									<Eye size={14} />
								</button>
							</div>
							<h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">{ev.title}</h4>
							<div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
								<div className="flex items-center gap-1">
									<Calendar size={12} />
									<span>{ev.date}</span>
								</div>
								{ev.time && (
									<div className="flex items-center gap-1">
										<Clock size={12} />
										<span>{formatEventTime(ev.time)}</span>
									</div>
								)}
								{ev.desc && (
									<div className="flex items-start gap-1">
										<MapPin size={12} className="mt-0.5" />
										<span className="truncate">{ev.desc}</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
			
			{/* Prayer times (placeholder demo) */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6" data-tour="instructor-calendar-prayer-panel">
				<div className="font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('instructor.teachingSchedule.prayer.title', 'Prayer Times (Demo)')}</div>
				<ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
					<li>{t('instructor.teachingSchedule.prayer.fajr', 'Fajr')}: 05:02</li>
					<li>{t('instructor.teachingSchedule.prayer.dhuhr', 'Dhuhr')}: 12:07</li>
					<li>{t('instructor.teachingSchedule.prayer.asr', 'Asr')}: 15:28</li>
					<li>{t('instructor.teachingSchedule.prayer.maghrib', 'Maghrib')}: 18:08</li>
					<li>{t('instructor.teachingSchedule.prayer.isha', 'Isha')}: 19:38</li>
				</ul>
				<div className="text-xs text-gray-500 mt-2">{t('instructor.teachingSchedule.prayer.footer', 'Connected to external prayer times API (to integrate)')}</div>
			</div>
		</div>
		</div>
		
		{/* Event Modal */}
		{showModal && modalEvent && (
					<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
							<button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" onClick={closeModal}><X size={28} /></button>
							<h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-6">{modalEvent.id ? t('instructor.teachingSchedule.modal.editTitle') : t('instructor.teachingSchedule.modal.newTitle')}</h2>
							
							<div className="space-y-6">
								<div>
									<label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('instructor.teachingSchedule.modal.fields.title')}</label>
									<input 
										type="text" 
										className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`} 
										value={modalEvent.title} 
										onChange={e => setModalEvent({ ...modalEvent, title: e.target.value })} 
									/>
								</div>
								
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('instructor.teachingSchedule.modal.fields.type')}</label>
										<select 
											className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`} 
											value={modalEvent.type} 
											onChange={e => setModalEvent({ ...modalEvent, type: e.target.value })}
										>
											<option value="class">{t('instructor.teachingSchedule.modal.types.class')}</option>
											<option value="assignment">{t('instructor.teachingSchedule.modal.types.assignment')}</option>
											<option value="activity">{t('instructor.teachingSchedule.modal.types.activity')}</option>
											<option value="holiday">{t('instructor.teachingSchedule.modal.types.holiday')}</option>
											<option value="university">{t('instructor.teachingSchedule.modal.types.university')}</option>
										</select>
									</div>
									
									<div>
										<label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('instructor.teachingSchedule.modal.fields.time')}</label>
										<input 
											type="time" 
											className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`} 
											value={modalEvent.time} 
											onChange={e => setModalEvent({ ...modalEvent, time: e.target.value })} 
										/>
									</div>
								</div>
								
								<div>
									<label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('instructor.teachingSchedule.modal.fields.date')}</label>
									<input 
										type="date" 
										className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`} 
										value={modalEvent.date} 
										onChange={e => setModalEvent({ ...modalEvent, date: e.target.value })} 
									/>
								</div>
								
								<div>
									<label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('instructor.teachingSchedule.modal.fields.description')}</label>
									<textarea 
										className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`} 
										rows={3} 
										value={modalEvent.desc} 
										onChange={e => setModalEvent({ ...modalEvent, desc: e.target.value })} 
									/>
								</div>
								
								{hasJumuahConflict && (
									<div className="text-xs text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30 rounded-lg px-3 py-2">
										<strong>{t('instructor.teachingSchedule.jumuahWarning.title')}</strong>
										<div>{t('instructor.teachingSchedule.jumuahWarning.desc', { start: JUMUAH_START, end: JUMUAH_END })}</div>
									</div>
								)}
							</div>
							
							<div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-3 mt-8`}>
								<button 
									onClick={closeModal}
									className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									{t('common.cancel', 'Cancel')}
								</button>
								<button 
									className={`px-4 py-2 rounded-lg text-white transition-colors ${hasJumuahConflict ? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}`} 
									onClick={saveEvent}
								>
									{modalEvent.id ? t('instructor.teachingSchedule.modal.actions.save') : t('instructor.teachingSchedule.modal.actions.add')}
								</button>
								{modalEvent.id && (
									<button 
										className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors inline-flex items-center gap-2" 
										onClick={deleteEvent}
									>
										<Trash2 size={16} /> {t('instructor.teachingSchedule.modal.actions.delete')}
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
} 