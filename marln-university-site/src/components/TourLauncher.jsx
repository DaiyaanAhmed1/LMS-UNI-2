import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle, RefreshCw, Map, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TourLauncher() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const handler = () => setOpen(true);
		window.addEventListener('tour:open-launcher', handler);
		return () => window.removeEventListener('tour:open-launcher', handler);
	}, []);

	if (!open) return null;

	const close = () => setOpen(false);

	// Student full tour sequence (sanitized)
	const studentFullSequence = [
		'/student/courses',
		'/student/assignments',
		'/student/grades',
		'/student/materials',
		'/student/schedule',
		'/student/messages',
		'/student/notifications',
		'/student/ecollab',
		'/student/profile'
	];

	// Instructor full tour sequence (exclude Sage AI)
	const instructorFullSequence = [
		'/instructor/courses',
		'/instructor/students',
		'/instructor/assignments',
		'/instructor/grades',
		'/instructor/calendar',
		'/instructor/materials',
		'/instructor/messages',
		'/instructor/notifications',
		'/instructor/profile'
	];

	// Admin full tour sequence
	const adminFullSequence = [
		'/admin/dashboard',
		'/admin/students',
		'/admin/instructors',
		'/admin/programs',
		'/admin/courses',
		'/admin/documents',
		'/admin/calendar',
		'/admin/notifications',
		'/admin/reports',
		'/admin/users',
		'/admin/settings',
		'/admin/profile'
	];

	const isInstructor = location.pathname.startsWith('/instructor');
	const isAdmin = location.pathname.startsWith('/admin');

	const allowedPaths = new Set([...
		studentFullSequence,
		...instructorFullSequence,
		...adminFullSequence
	]);

	const getFullSequence = () => {
		try {
			const stored = JSON.parse(localStorage.getItem('tour:full:sequence') || '[]');
			const cleaned = (Array.isArray(stored) ? stored : []).filter(p => allowedPaths.has(p));
			if (cleaned.length) return cleaned;
			if (isAdmin) return adminFullSequence;
			if (isInstructor) return instructorFullSequence;
			return studentFullSequence;
		} catch { 
			if (isAdmin) return adminFullSequence;
			if (isInstructor) return instructorFullSequence;
			return studentFullSequence;
		}
	};

	const restartFull = () => {
		let full, launchEvent, dash;
		if (isAdmin) {
			full = adminFullSequence;
			launchEvent = 'admin-full';
			dash = '/admin/dashboard';
		} else if (isInstructor) {
			full = instructorFullSequence;
			launchEvent = 'instructor-full';
			dash = '/instructor/dashboard';
		} else {
			full = studentFullSequence;
			launchEvent = 'student-full';
			dash = '/student/dashboard';
		}
		
		// Filter out the current page to avoid restarting the same page
		const currentPath = location.pathname;
		const filteredQueue = full.filter(page => page !== currentPath);
		
		localStorage.setItem('tour:mode', 'full');
		localStorage.setItem('tour:full:sequence', JSON.stringify(full));
		localStorage.setItem('tour:queue', JSON.stringify(filteredQueue));
		localStorage.setItem('tour:launch', launchEvent);
		setOpen(false);
		
		// Always navigate to dashboard first, then start tour automatically
		if (location.pathname !== dash) {
			console.log('TourLauncher: Navigating to dashboard first, then starting tour');
			navigate(dash);
			// Wait for navigation to complete, then start tour
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent('tour:launch'));
			}, 500);
		} else {
			console.log('TourLauncher: Already on dashboard, starting tour immediately');
			window.dispatchEvent(new CustomEvent('tour:launch'));
		}
	};

	const pageOnly = () => {
		const full = getFullSequence();
		if (!localStorage.getItem('tour:full:sequence')) localStorage.setItem('tour:full:sequence', JSON.stringify(full));
		localStorage.setItem('tour:mode', 'single');
		localStorage.setItem('tour:queue', JSON.stringify([]));
		
		let launchEvent;
		if (isAdmin) {
			launchEvent = 'admin-resume';
		} else if (isInstructor) {
			launchEvent = 'instructor-resume';
		} else {
			launchEvent = 'student-resume';
		}
		
		localStorage.setItem('tour:launch', launchEvent);
		setOpen(false);
		
		// For page-only tours, start immediately on current page
		console.log('TourLauncher: Starting page-only tour on current page');
		window.dispatchEvent(new CustomEvent('tour:launch'));
	};

	return (
		<div className="fixed inset-0 z-[21000] flex items-center justify-center p-4 animate-fadeIn">
			<div className="absolute inset-0 bg-black/40 transition-opacity duration-300" onClick={close} />
			<div className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-300 ease-out animate-slideInUp">
				<div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
					<div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
						<HelpCircle size={18} />
						<span className="font-semibold">{t('student.tour.startPrompt.title', 'Choose your tour')}</span>
					</div>
					<button onClick={close} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"><X size={18} /></button>
				</div>
				<div className="p-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
					<p>{t('student.tour.startPrompt.desc', 'Take the full guided tour or just this page.')}</p>
					<button onClick={restartFull} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 transform hover:scale-[1.02]">
						<Map size={16} /> {t('student.tour.full', 'Full tour (recommended)')}
					</button>
					<button onClick={pageOnly} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02]">
						<RefreshCw size={16} /> {t('student.tour.pageOnly', 'Tour for this page')}
					</button>
				</div>
			</div>
		</div>
	);
} 