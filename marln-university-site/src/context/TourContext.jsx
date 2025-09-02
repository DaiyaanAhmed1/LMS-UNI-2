import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useTranslation } from 'react-i18next';

const TourContext = createContext(null);

export function TourProvider({ children }) {
	const { i18n, t } = useTranslation();
	const [run, setRun] = useState(false);
	const [steps, setSteps] = useState([]);
	const [tourId, setTourId] = useState(null);
	const [continuePrompt, setContinuePrompt] = useState(false);
	const [completePrompt, setCompletePrompt] = useState(false);
	const [nextPath, setNextPath] = useState(null);
	const [pendingQueue, setPendingQueue] = useState(null);
	const [showClose, setShowClose] = useState(false);

	const isRTL = i18n.dir() === 'rtl';

	// Simplified tour management
	const startTour = useCallback((id, nextSteps) => {
		if (!Array.isArray(nextSteps) || nextSteps.length === 0) return;
		setSteps(nextSteps);
		setTourId(id);
		setRun(true);
		setShowClose(true);
		localStorage.setItem(`tour:${id}:state`, 'inProgress');
	}, []);

	const stopTour = useCallback(() => {
		setRun(false);
		setShowClose(false);
		// Clean up localStorage
		localStorage.removeItem('tour:queue');
		localStorage.removeItem('tour:mode');
		localStorage.removeItem('tour:launch');
	}, []);



	const restartTour = useCallback((id) => {
		setTourId(id);
		setRun(true);
		setShowClose(true);
		localStorage.setItem(`tour:${id}:state`, 'inProgress');
	}, []);

	// Improved navigation with better error handling
	const navigateTo = useCallback((path) => {
		try {
			window.history.pushState({}, '', path);
			window.dispatchEvent(new Event('popstate'));
			// Preserve role when resuming
			let launchEvent;
			if (path.startsWith('/admin')) {
				launchEvent = 'admin-resume';
			} else if (path.startsWith('/instructor')) {
				launchEvent = 'instructor-resume';
			} else {
				launchEvent = 'student-resume';
			}
			localStorage.setItem('tour:launch', launchEvent);
			// Increased delay for better page loading and element availability
			setTimeout(() => window.dispatchEvent(new CustomEvent('tour:launch')), 400);
		} catch (error) {
			console.warn('Tour navigation failed:', error);
		}
	}, []);

	// Simplified callback handling 
	const handleCallback = useCallback((data) => {
		const { status } = data;
		
		// Handle tour completion
		if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
			setRun(false);
			setShowClose(false);
			
			if (tourId) {
				localStorage.setItem(`tour:${tourId}:state`, status === STATUS.FINISHED ? 'completed' : 'skipped');
			}
			
			try {
				const mode = localStorage.getItem('tour:mode');
				const rawQueue = JSON.parse(localStorage.getItem('tour:queue') || '[]');
				const currentPath = window.location.pathname;
				console.log('Tour completion - Mode:', mode, 'Raw Queue:', rawQueue, 'Current Path:', currentPath);
				
				const allowedStudent = [
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
				const allowedInstructor = [
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
				const allowedAdmin = [
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
				const allowed = [...allowedStudent, ...allowedInstructor, ...allowedAdmin];
				const queue = Array.isArray(rawQueue) ? rawQueue.filter(p => allowed.includes(p)) : [];
				
				// Handle full tour with more pages
				if (mode === 'full' && Array.isArray(queue) && queue.length > 0) {
					// Filter out the current page to avoid restarting the same page
					const currentPath = window.location.pathname;
					const filteredQueue = queue.filter(page => page !== currentPath);
					
					if (filteredQueue.length > 0) {
						const [next, ...rest] = filteredQueue;
						console.log('Tour: Continuing to next page:', next, 'Remaining:', rest, 'Current:', currentPath);
						setPendingQueue(rest);
						setNextPath(next);
						setContinuePrompt(true);
						return;
					}
				}
				
				// Handle single page tour - just end cleanly, no prompts
				if (mode === 'single') {
					// Clean up and finish silently
					localStorage.removeItem('tour:queue');
					localStorage.removeItem('tour:mode');
					localStorage.removeItem('tour:launch');
					return;
				}
				
				// Only show completion prompt for full tour that's finished
				if (mode === 'full') {
					// Ensure cleanup so no stray restarts occur
					localStorage.removeItem('tour:queue');
					localStorage.removeItem('tour:launch');
					setCompletePrompt(true);
				}
			} catch (error) {
				console.warn('Tour completion handling failed:', error);
				// For errors, just clean up and finish silently
				localStorage.removeItem('tour:queue');
				localStorage.removeItem('tour:mode');
				localStorage.removeItem('tour:launch');
			}
		}
	}, [tourId]);

	// Memoized context value
	const value = useMemo(() => ({
		startTour,
		stopTour,
		restartTour,
		setSteps
	}), [startTour, stopTour, restartTour]);

	// Determine tour audience for completion copy
	const isInstructorTour = (() => {
		try {
			const full = JSON.parse(localStorage.getItem('tour:full:sequence') || '[]');
			return Array.isArray(full) && full.some(p => typeof p === 'string' && p.startsWith('/instructor/'));
		} catch { return false; }
	})();

	const isAdminTour = (() => {
		try {
			const full = JSON.parse(localStorage.getItem('tour:full:sequence') || '[]');
			return Array.isArray(full) && full.some(p => typeof p === 'string' && p.startsWith('/admin/'));
		} catch { return false; }
	})();

	return (
		<TourContext.Provider value={value}>
			{children}
			<Joyride
				run={run}
				steps={steps}
				continuous
				showProgress={isAdminTour}
				showSkipButton
				disableBeacon={true}
				scrollToFirstStep={true}
				scrollOffset={120}
				spotlightClicks={false}
				disableOverlayClose={true}
				disableCloseOnEsc={true}
				hideCloseButton={true}
				// Better timing for smooth transitions
				stepInteraction={false}
				scrollDuration={800}
				disableScrolling={false}
				locale={{ back: t('common.back', 'Back'), next: t('common.next', 'Next'), last: t('common.finish', 'Finish'), skip: t('common.skip', 'Skip'), close: t('common.close', 'Close') }}
				styles={{
					options: { 
						zIndex: 20000, 
						primaryColor: '#6d28d9', 
						overlayColor: 'rgba(0,0,0,0.6)',
						width: 350,
						borderRadius: 12
					},
					tooltip: { 
						// Smooth transitions
						transition: 'all 300ms ease-out',
						borderRadius: 12,
						padding: 20,
						fontSize: 14,
						lineHeight: 1.6,
						boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
					},
					spotlight: { 
						// Gentle spotlight transitions
						transition: 'all 400ms ease-out',
						borderRadius: '8px'
					},
					overlay: {
						// Smooth overlay
						transition: 'opacity 300ms ease-out'
					},
					tooltipTitle: {
						fontSize: 16,
						fontWeight: 600,
						marginBottom: 8,
						color: '#1f2937'
					},
					tooltipContent: {
						fontSize: 14,
						lineHeight: 1.6,
						color: '#4b5563',
						marginBottom: 12
					},
					buttonNext: {
						transition: 'all 200ms ease',
						borderRadius: 6,
						padding: '8px 16px',
						fontSize: 14
					},
					buttonBack: {
						transition: 'all 200ms ease',
						borderRadius: 6,
						padding: '8px 16px',
						fontSize: 14
					},
					buttonSkip: {
						transition: 'all 200ms ease',
						fontSize: 14
					},
					buttonClose: {
						transition: 'all 200ms ease',
						fontSize: 14
					}
				}}
				spotlightPadding={12}
				floaterProps={{ 
					placement: isRTL ? 'left' : 'right', 
					disableAnimation: false
				}}
				callback={handleCallback}
			/>
			{showClose && (
				<button
					onClick={() => { stopTour(); localStorage.removeItem('tour:queue'); localStorage.removeItem('tour:mode'); localStorage.removeItem('tour:launch'); }}
					className="fixed top-4 right-4 z-[21060] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100 rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-gray-50"
					aria-label={t('common.cancel', 'Cancel')}
				>
					<span className="block w-3.5 h-3.5 relative">
						<span className="absolute inset-0 before:content-[''] before:absolute before:w-3.5 before:h-0.5 before:bg-gray-500 before:rotate-45 before:top-1/2 before:left-0 after:content-[''] after:absolute after:w-3.5 after:h-0.5 after:bg-gray-500 after:-rotate-45 after:top-1/2 after:left-0" />
					</span>
				</button>
			)}
			{continuePrompt && (
				<div className="fixed inset-0 z-[21050] flex items-center justify-center p-4 animate-fadeIn">
					<div className="absolute inset-0 bg-black/40 transition-opacity duration-300" onClick={() => setContinuePrompt(false)} />
					<div className="relative w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-4 transform transition-all duration-300 ease-out animate-slideInUp">
						<h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
							{isAdminTour ? t('admin.tour.nextPrompt.title', 'Continue to next admin page?') : 
							 isInstructorTour ? t('instructor.tour.nextPrompt.title', 'Continue to next instructor page?') : 
							 t('student.tour.nextPrompt.title', 'Continue to next page?')}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
							{isAdminTour ? t('admin.tour.nextPrompt.desc', 'You finished this admin page tour. Continue to explore the next management feature.') :
							 isInstructorTour ? t('instructor.tour.nextPrompt.desc', 'You finished this instructor page tour. Continue to explore the next teaching feature.') : 
							 t('student.tour.nextPrompt.desc', 'You finished this page tour. You can continue with the next page or close now.')}
						</p>
						<div className="flex gap-2 justify-end">
							<button onClick={() => { setContinuePrompt(false); setPendingQueue(null); setNextPath(null); }} className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
								{t('common.cancel', 'Cancel')}
							</button>
							<button onClick={() => { 
								console.log('Continue prompt - Next clicked. Pending Queue:', pendingQueue, 'Next Path:', nextPath);
								if (pendingQueue) localStorage.setItem('tour:queue', JSON.stringify(pendingQueue)); 
								const dest = nextPath; 
								setContinuePrompt(false); 
								setPendingQueue(null); 
								setNextPath(null); 
								if (dest) {
									console.log('Navigating to:', dest);
									navigateTo(dest);
								}
							}} className="px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200">
								{t('common.next', 'Next')}
							</button>
						</div>
					</div>
				</div>
			)}
			{completePrompt && (
				<div className="fixed inset-0 z-[21050] flex items-center justify-center p-4 animate-fadeIn">
					<div className="absolute inset-0 bg-black/40 transition-opacity duration-300" onClick={() => setCompletePrompt(false)} />
					<div className="relative w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-4 transform transition-all duration-300 ease-out animate-slideInUp">
						<h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
							{isAdminTour ? 'Admin Onboarding Tour Complete!' : 
							 isInstructorTour ? 'Instructor Onboarding Tour Complete!' : 
							 'Onboarding Tour Complete!'}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
							{isAdminTour ? 'You have completed the admin tour and explored all the key management features. You\'re ready to manage the LMS system!' :
							 isInstructorTour ? 'You have completed the instructor tour and explored the key teaching features. You\'re ready to go!' : 
							 'You have completed the onboarding tour and explored all the key features of your LMS. You\'re ready to start your learning journey!'}
						</p>
						<div className="flex gap-2 justify-end">
							<button onClick={() => setCompletePrompt(false)} className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
								{t('common.close', 'Close')}
							</button>
							<button onClick={() => { 
								const full = JSON.parse(localStorage.getItem('tour:full:sequence') || '[]'); 
								localStorage.setItem('tour:mode', 'full'); 
								localStorage.setItem('tour:queue', JSON.stringify(Array.isArray(full) && full.length ? full : [])); 
								
								let launch, dash;
								if (isAdminTour) {
									launch = 'admin-full';
									dash = '/admin/dashboard';
								} else if (isInstructorTour) {
									launch = 'instructor-full';
									dash = '/instructor/dashboard';
								} else {
									launch = 'student-full';
									dash = '/student/dashboard';
								}
								
								localStorage.setItem('tour:launch', launch); 
								setCompletePrompt(false); 
								navigateTo(dash); 
							}} className="px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200">
								{t('common.restart', 'Restart tour')}
							</button>
						</div>
					</div>
				</div>
			)}
		</TourContext.Provider>
	);
}

export const useTour = () => useContext(TourContext); 