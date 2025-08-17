import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, BookOpen, Award, FileText, Users, AlertCircle, Info, PieChart, LineChart, Target, Clock } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const ZoolaReport = () => {
	const { courseId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const { startTour } = useTour();
	const isRTL = i18n.dir() === 'rtl';
	const ms = isRTL ? 'ml-2' : 'mr-2';
	const sx = isRTL ? 'space-x-reverse' : '';
	const course = location.state?.course;

	const returnTo = location.state?.returnTo || (location.key ? -1 : '/student/courses');

	const startZoolaReportTour = () => {
		const steps = [
			{
				target: '[data-tour="zoola-report-header"]',
				title: t('student.tour.zoolaReport.header.title', 'Zoola Report'),
				content: t('student.tour.zoolaReport.header.desc', 'Welcome to the Zoola Report page. Here you can view comprehensive analytics about your course performance, learning progress, and VAE hours.'),
				placement: 'bottom',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-tabs"]',
				title: t('student.tour.zoolaReport.tabs.title', 'Navigation Tabs'),
				content: t('student.tour.zoolaReport.tabs.desc', 'Use these tabs to navigate between different report sections: VAE Hours, Overview, Performance, Analytics, Recommendations, and Progress.'),
				placement: 'bottom',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-overview"]',
				title: t('student.tour.zoolaReport.overview.title', 'Overview Section'),
				content: t('student.tour.zoolaReport.overview.desc', 'View your student information, overall summary, performance breakdown, and learning analytics at a glance.'),
				placement: 'top',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-performance"]',
				title: t('student.tour.zoolaReport.performance.title', 'Performance Section'),
				content: t('student.tour.zoolaReport.performance.desc', 'Analyze your detailed performance metrics and compare them with class averages and targets.'),
				placement: 'top',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-analytics"]',
				title: t('student.tour.zoolaReport.analytics.title', 'Analytics Section'),
				content: t('student.tour.zoolaReport.analytics.desc', 'Deep dive into your learning analytics including time spent, engagement metrics, and activity patterns.'),
				placement: 'top',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-recommendations"]',
				title: t('student.tour.zoolaReport.recommendations.title', 'Recommendations Section'),
				content: t('student.tour.zoolaReport.recommendations.desc', 'Get personalized recommendations based on your performance to improve your learning outcomes.'),
				placement: 'top',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-progress"]',
				title: t('student.tour.zoolaReport.progress.title', 'Progress Section'),
				content: t('student.tour.zoolaReport.progress.desc', 'Track your weekly progress trends and get insights about your learning trajectory.'),
				placement: 'top',
				disableBeacon: true
			},
			{
				target: '[data-tour="zoola-report-vae-hours"]',
				title: t('student.tour.zoolaReport.vaeHours.title', 'VAE Hours Section'),
				content: t('student.tour.zoolaReport.vaeHours.desc', 'View detailed breakdown of your VAE hours, activities, and time tracking for this course.'),
				placement: 'top',
				disableBeacon: true
			}
		].filter(s => document.querySelector(s.target));
		
		if (steps.length) startTour('student:zoola-report:v1', steps);
	};

	useEffect(() => {
		// Auto-start tour for new users
		const key = 'tour:student:zoola-report:v1:autostart';
		const hasSeenTour = localStorage.getItem(key);
		const tourCompleted = localStorage.getItem('tour:student:zoola-report:v1:state');
		
		if (!hasSeenTour && tourCompleted !== 'completed') {
			setTimeout(() => {
				startZoolaReportTour();
				localStorage.setItem(key, 'shown');
			}, 600);
		}
		
		// Handle tour launches from navigation (sidebar "Start Tour" button)
		const onLaunch = () => {
			const launch = localStorage.getItem('tour:launch');
			if (launch === 'student-full' || launch === 'student-resume') {
				localStorage.removeItem('tour:launch');
				setTimeout(() => startZoolaReportTour(), 200);
			}
		};
		
		window.addEventListener('tour:launch', onLaunch);
		return () => window.removeEventListener('tour:launch', onLaunch);
	}, []);

	const [reportData] = useState({
		courseId: courseId,
		courseTitle: course?.title || t('student.courses.title', 'Unknown Course'),
		generatedDate: new Date().toISOString(),
		academicPeriod: 'Fall 2024',
		studentId: 'STU2024001',
		studentName: 'John Doe',
		overallScore: 87.5,
		classRank: 12,
		totalStudents: 45,
		percentile: 73,
		performanceBreakdown: {
			assignments: { score: 89, weight: 0.4, grade: 'A-' },
			quizzes: { score: 85, weight: 0.2, grade: 'B+' },
			midterm: { score: 88, weight: 0.2, grade: 'A-' },
			participation: { score: 92, weight: 0.1, grade: 'A' },
			final: { score: null, weight: 0.1, grade: null }
		},
		learningAnalytics: {
			timeSpent: 156,
			assignmentsSubmitted: 8,
			assignmentsTotal: 10,
			quizzesTaken: 12,
			quizzesTotal: 15,
			attendanceRate: 94,
			lastActivity: '2024-03-19T14:30:00',
			averageResponseTime: 2.3,
			engagementScore: 88
		},
		comparativeAnalysis: {
			classAverage: 82.3,
			classMedian: 84.1,
			classStandardDeviation: 8.7,
			improvementTrend: '+5.2%',
			previousPeriod: 82.3,
			targetScore: 90.0
		},
		recommendations: [
			{ type: 'Improvement', title: 'Focus on Quiz Performance', description: 'Your quiz scores are slightly below your overall performance. Consider reviewing material more thoroughly before quizzes.', priority: 'Medium', impact: 'High' },
			{ type: 'Maintenance', title: 'Maintain Assignment Excellence', description: 'Your assignment performance is excellent. Continue this level of effort and attention to detail.', priority: 'Low', impact: 'Medium' },
			{ type: 'Enhancement', title: 'Increase Participation', description: 'While your participation is good, increasing class engagement could boost your overall grade.', priority: 'Low', impact: 'Medium' }
		],
		progressTracking: {
			week1: { score: 85, trend: 'stable' },
			week2: { score: 87, trend: 'up' },
			week3: { score: 86, trend: 'down' },
			week4: { score: 89, trend: 'up' },
			week5: { score: 88, trend: 'down' },
			week6: { score: 90, trend: 'up' },
			week7: { score: 89, trend: 'down' },
			week8: { score: 91, trend: 'up' }
		},
		vaeHours: (() => {
			const courseTitle = course?.title || t('student.courses.title', 'Unknown Course');
			if (courseTitle.toLowerCase().includes('cyber') || courseTitle.toLowerCase().includes('security')) {
				return [
					{ id: 1, activityName: 'Network Security Fundamentals - Firewall Configuration', timeSpent: '01:30:00', category: 'Practical Labs', date: '2024-10-21' },
					{ id: 2, activityName: 'Cryptography Basics - Encryption Algorithms', timeSpent: '02:15:30', category: 'Theory Sessions', date: '2024-10-20' },
					{ id: 3, activityName: 'Penetration Testing - Vulnerability Assessment', timeSpent: '00:00:00', category: 'Practical Labs', date: '2024-10-19' },
					{ id: 4, activityName: 'Incident Response - Security Breach Simulation', timeSpent: '01:45:20', category: 'Case Studies', date: '2024-10-18' },
					{ id: 5, activityName: 'Digital Forensics - Evidence Collection', timeSpent: '00:00:00', category: 'Practical Labs', date: '2024-10-17' },
					{ id: 6, activityName: 'Security Policies - Compliance Framework', timeSpent: '00:55:15', category: 'Policy Review', date: '2024-10-16' },
					{ id: 7, activityName: 'Threat Intelligence - Malware Analysis', timeSpent: '00:00:00', category: 'Research', date: '2024-10-15' },
					{ id: 8, activityName: 'Cloud Security - AWS Security Best Practices', timeSpent: '01:20:45', category: 'Cloud Labs', date: '2024-10-14' },
					{ id: 9, activityName: 'Social Engineering - Phishing Awareness', timeSpent: '00:40:30', category: 'Awareness Training', date: '2024-10-13' },
					{ id: 10, activityName: 'Security Architecture - Defense in Depth', timeSpent: '00:00:00', category: 'Design Review', date: '2024-10-12' }
				];
			} else if (courseTitle.toLowerCase().includes('legal') || courseTitle.toLowerCase().includes('research')) {
				return [
					{ id: 1, activityName: 'Legal Research Methodology - Case Law Analysis', timeSpent: '02:30:00', category: 'Research Methods', date: '2024-10-21' },
					{ id: 2, activityName: 'Statutory Interpretation - Legislative History', timeSpent: '01:45:15', category: 'Statute Review', date: '2024-10-20' },
					{ id: 3, activityName: 'Secondary Sources - Law Review Articles', timeSpent: '00:00:00', category: 'Literature Review', date: '2024-10-19' },
					{ id: 4, activityName: 'Database Research - Westlaw & LexisNexis', timeSpent: '01:20:30', category: 'Database Training', date: '2024-10-18' },
					{ id: 5, activityName: 'Citation Methods - Bluebook Formatting', timeSpent: '00:00:00', category: 'Citation Practice', date: '2024-10-17' },
					{ id: 6, activityName: 'Research Memo Writing - Legal Analysis', timeSpent: '02:15:45', category: 'Writing Practice', date: '2024-10-16' },
					{ id: 7, activityName: 'Comparative Law Research - International Sources', timeSpent: '00:00:00', category: 'International Law', date: '2024-10-15' },
					{ id: 8, activityName: 'Administrative Law Research - Agency Decisions', timeSpent: '01:10:20', category: 'Administrative Law', date: '2024-10-14' },
					{ id: 9, activityName: 'Fact Investigation - Evidence Gathering', timeSpent: '00:55:30', category: 'Investigation', date: '2024-10-13' },
					{ id: 10, activityName: 'Research Ethics - Professional Responsibility', timeSpent: '00:00:00', category: 'Ethics Training', date: '2024-10-12' }
				];
			} else if (courseTitle.toLowerCase().includes('contract')) {
				return [
					{ id: 1, activityName: 'Contract Formation - Offer and Acceptance', timeSpent: '02:15:30', category: 'Contract Theory', date: '2024-10-21' },
					{ id: 2, activityName: 'Consideration - Bargained-for Exchange', timeSpent: '01:40:15', category: 'Contract Elements', date: '2024-10-20' },
					{ id: 3, activityName: 'Contractual Capacity - Minors and Mental Incapacity', timeSpent: '00:00:00', category: 'Capacity Issues', date: '2024-10-19' },
					{ id: 4, activityName: 'Statute of Frauds - Writing Requirements', timeSpent: '01:25:45', category: 'Form Requirements', date: '2024-10-18' },
					{ id: 5, activityName: 'Parol Evidence Rule - Integration Clauses', timeSpent: '00:00:00', category: 'Evidence Rules', date: '2024-10-17' },
					{ id: 6, activityName: 'Breach of Contract - Material vs Minor Breach', timeSpent: '01:55:20', category: 'Breach Analysis', date: '2024-10-16' },
					{ id: 7, activityName: 'Remedies - Damages and Specific Performance', timeSpent: '00:00:00', category: 'Remedies', date: '2024-10-15' },
					{ id: 8, activityName: 'Third Party Rights - Assignment and Delegation', timeSpent: '01:30:10', category: 'Third Parties', date: '2024-10-14' },
					{ id: 9, activityName: 'Contract Interpretation - Plain Meaning Rule', timeSpent: '00:45:30', category: 'Interpretation', date: '2024-10-13' },
					{ id: 10, activityName: 'Unconscionability - Procedural and Substantive', timeSpent: '00:00:00', category: 'Defenses', date: '2024-10-12' }
				];
			}
			return [
				{ id: 1, activityName: 'Course Introduction and Syllabus Review', timeSpent: '00:45:00', category: 'Orientation', date: '2024-10-21' },
				{ id: 2, activityName: 'Core Concepts and Fundamental Principles', timeSpent: '01:30:15', category: 'Theory', date: '2024-10-20' },
				{ id: 3, activityName: 'Practical Applications and Case Studies', timeSpent: '00:00:00', category: 'Practical Work', date: '2024-10-19' },
				{ id: 4, activityName: 'Group Discussions and Peer Learning', timeSpent: '01:15:30', category: 'Collaboration', date: '2024-10-18' },
				{ id: 5, activityName: 'Assignment Preparation and Research', timeSpent: '00:00:00', category: 'Independent Study', date: '2024-10-17' },
				{ id: 6, activityName: 'Assessment and Feedback Review', timeSpent: '00:55:45', category: 'Assessment', date: '2024-10-16' },
				{ id: 7, activityName: 'Supplementary Materials and Resources', timeSpent: '00:00:00', category: 'Additional Resources', date: '2024-10-15' },
				{ id: 8, activityName: 'Course Reflection and Learning Journal', timeSpent: '00:40:20', category: 'Reflection', date: '2024-10-14' },
				{ id: 9, activityName: 'Final Project Planning and Development', timeSpent: '00:00:00', category: 'Project Work', date: '2024-10-13' },
				{ id: 10, activityName: 'Course Summary and Knowledge Integration', timeSpent: '01:10:15', category: 'Integration', date: '2024-10-12' }
			];
		})()
	});

	const [selectedSection, setSelectedSection] = useState('vae-hours');
	const [isLoading, setIsLoading] = useState(false);

	const calculateTotalVAEHours = () => {
		let totalSeconds = 0;
		reportData.vaeHours.forEach(activity => {
			if (activity.timeSpent !== '00:00:00') {
				const [hours, minutes, seconds] = activity.timeSpent.split(':').map(Number);
				totalSeconds += hours * 3600 + minutes * 60 + seconds;
			}
		});
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	const getGradeColor = (grade) => {
		if (!grade) return 'text-gray-500';
		if (grade.startsWith('A')) return 'text-green-600';
		if (grade.startsWith('B')) return 'text-blue-600';
		if (grade.startsWith('C')) return 'text-yellow-600';
		if (grade.startsWith('D')) return 'text-orange-600';
		return 'text-red-600';
	};

	const getTrendIcon = (trend) => {
		switch (trend) {
			case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
			case 'down': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
			default: return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
			case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
			case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
			default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400';
		}
	};

	const handleBackNavigation = () => {
		if (typeof returnTo === 'number') navigate(returnTo);
		else navigate(returnTo);
	};

	const handleRefreshReport = async () => {
		setIsLoading(true);
		await new Promise(resolve => setTimeout(resolve, 1500));
		setIsLoading(false);
	};

	const handleExportReport = () => {
		// Create a comprehensive report content
		const reportContent = `
${t('student.courses.modal.zoolaReport.title')}
${course.title}
${t('student.courses.modal.zoolaReport.generated', { date: new Date(reportData.generatedDate).toLocaleString() })}

=== ${t('student.courses.modal.zoolaReport.sections.studentInfo')} ===
${t('student.courses.modal.zoolaReport.labels.studentId')}: ${reportData.studentId}
${t('student.courses.modal.zoolaReport.labels.studentName')}: ${reportData.studentName}
${t('student.courses.modal.zoolaReport.labels.academicPeriod')}: ${reportData.academicPeriod}

=== ${t('student.courses.modal.zoolaReport.sections.overallSummary')} ===
${t('student.courses.modal.zoolaReport.labels.overallScore')}: ${reportData.overallScore}%
${t('student.courses.modal.zoolaReport.labels.classRank')}: ${reportData.classRank} ${t('student.courses.modal.zoolaReport.labels.of')} ${reportData.totalStudents}
${t('student.courses.modal.zoolaReport.labels.percentile')}: ${reportData.percentile} (${t('student.courses.modal.zoolaReport.labels.top')} ${100 - reportData.percentile}%)
${t('student.courses.modal.zoolaReport.labels.trend')}: ${reportData.comparativeAnalysis.improvementTrend} ${t('student.courses.modal.zoolaReport.labels.vsPrevious')}

=== ${t('student.courses.modal.zoolaReport.sections.performanceBreakdown')} ===
${Object.entries(reportData.performanceBreakdown).map(([category, data]) => 
	`${category.charAt(0).toUpperCase() + category.slice(1)}: ${data.score || 'N/A'} ${data.grade ? `(${data.grade})` : ''} - ${t('student.courses.modal.zoolaReport.labels.weight')}: ${(data.weight * 100).toFixed(0)}%`
).join('\n')}

=== ${t('student.courses.modal.zoolaReport.sections.learningAnalyticsOverview')} ===
${t('student.courses.modal.zoolaReport.labels.totalStudyTime')}: ${reportData.learningAnalytics.timeSpent}h
${t('student.courses.modal.zoolaReport.labels.attendanceRate')}: ${reportData.learningAnalytics.attendanceRate}%
${t('student.courses.modal.zoolaReport.labels.overallEngagement')}: ${reportData.learningAnalytics.engagementScore}%
${t('student.courses.modal.zoolaReport.labels.responseTime')}: ${reportData.learningAnalytics.averageResponseTime} ${t('student.courses.modal.zoolaReport.labels.days')}
${t('student.courses.modal.zoolaReport.labels.assignmentsSubmitted')}: ${reportData.learningAnalytics.assignmentsSubmitted}/${reportData.learningAnalytics.assignmentsTotal}
${t('student.courses.modal.zoolaReport.labels.quizzesCompleted')}: ${reportData.learningAnalytics.quizzesTaken}/${reportData.learningAnalytics.quizzesTotal}

=== ${t('student.courses.modal.zoolaReport.sections.personalizedRecommendations')} ===
${reportData.recommendations.map((rec, index) => 
	`${index + 1}. ${rec.title} (${rec.priority} ${t('student.courses.modal.zoolaReport.labels.prioritySuffix')})
   ${rec.description}
   ${t('student.courses.modal.zoolaReport.labels.impact')}: ${rec.impact}`
).join('\n\n')}

=== ${t('student.courses.modal.zoolaReport.sections.weeklyProgress')} ===
${Object.entries(reportData.progressTracking).map(([week, data]) => 
	`${week.charAt(0).toUpperCase() + week.slice(1)}: ${data.score}% (${data.trend})`
).join('\n')}

=== ${t('student.courses.modal.zoolaReport.vaeHoursTitle', { course: course.title })} ===
${t('student.courses.modal.zoolaReport.labels.totalActivities')}: ${reportData.vaeHours.length}
${t('student.courses.modal.zoolaReport.labels.activitiesWithTime')}: ${reportData.vaeHours.filter(a => a.timeSpent !== '00:00:00').length}
${t('student.courses.modal.zoolaReport.labels.categories')}: ${new Set(reportData.vaeHours.map(a => a.category)).size}
${t('student.courses.modal.zoolaReport.labels.total')}: ${calculateTotalVAEHours()}

${t('student.courses.modal.zoolaReport.labels.activityName')} | ${t('student.courses.modal.zoolaReport.labels.timeSpent')}
${'='.repeat(80)}
${reportData.vaeHours.map(activity => 
	`${activity.activityName} | ${activity.timeSpent}`
).join('\n')}
		`.trim();

		// Create and download the file
		const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${course.title.replace(/[^a-z0-9]/gi, '_')}_Zoola_Report_${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	if (!course) {
		return (
			<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
				<Sidebar />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{t('student.courses.modal.zoolaReport.notFound.title')}</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-4">{t('student.courses.modal.zoolaReport.notFound.desc')}</p>
						<button onClick={handleBackNavigation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							{t('student.courses.modal.zoolaReport.notFound.backToCourses')}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			<Sidebar />
			<div className="flex-1 overflow-y-auto">
				<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4" data-tour="zoola-report-header">
					<div className={`flex items-center justify-between ${sx}`}>
						<div className={`flex items-center space-x-4 ${sx}`}>
							<button onClick={handleBackNavigation} aria-label={t('common.back', 'Back')} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								<ArrowLeft className="h-5 w-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('student.courses.modal.zoolaReport.title')}</h1>
								<p className="text-gray-600 dark:text-gray-400">{course.title} • {t('student.courses.modal.zoolaReport.generated', { date: new Date(reportData.generatedDate).toLocaleString() })}</p>
							</div>
						</div>
						<div className={`flex items-center space-x-3 ${sx}`}>
							<button onClick={handleExportReport} className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 ${sx}`}>
								<FileText className="w-4 h-4" />
								<span>{t('student.courses.modal.zoolaReport.actions.exportPdf')}</span>
							</button>
							<button onClick={handleRefreshReport} disabled={isLoading} className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ${sx}`}>
								{isLoading ? (
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								) : (
									<BarChart3 className="w-4 h-4" />
								)}
								<span>{t('student.courses.modal.zoolaReport.actions.refresh')}</span>
							</button>
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" data-tour="zoola-report-tabs">
					<div className="px-6">
						<nav className={`flex space-x-8 ${sx}`}>
							{[
								{ id: 'vae-hours', label: t('student.courses.modal.zoolaReport.tabs.vaeHours'), icon: Clock },
								{ id: 'overview', label: t('student.courses.modal.zoolaReport.tabs.overview'), icon: BarChart3 },
								{ id: 'performance', label: t('student.courses.modal.zoolaReport.tabs.performance'), icon: TrendingUp },
								{ id: 'analytics', label: t('student.courses.modal.zoolaReport.tabs.analytics'), icon: PieChart },
								{ id: 'recommendations', label: t('student.courses.modal.zoolaReport.tabs.recommendations'), icon: Target },
								{ id: 'progress', label: t('student.courses.modal.zoolaReport.tabs.progress'), icon: LineChart }
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setSelectedSection(tab.id)}
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${sx} transition-colors ${selectedSection === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
								>
									<tab.icon className="w-4 h-4" />
									<span>{tab.label}</span>
								</button>
							))}
						</nav>
					</div>
				</div>

				<div className="p-6">
					{selectedSection === 'overview' && (
						<div className="space-y-6" data-tour="zoola-report-overview">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<Users className={`w-5 h-5 ${ms} text-blue-600`} />
									{t('student.courses.modal.zoolaReport.sections.studentInfo')}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('student.courses.modal.zoolaReport.labels.studentId')}</p>
										<p className="text-lg font-bold text-blue-900 dark:text-blue-100">{reportData.studentId}</p>
									</div>
									<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-green-600 dark:text-green-400">{t('student.courses.modal.zoolaReport.labels.studentName')}</p>
										<p className="text-lg font-bold text-green-900 dark:text-green-100">{reportData.studentName}</p>
									</div>
									<div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('student.courses.modal.zoolaReport.labels.academicPeriod')}</p>
										<p className="text-lg font-bold text-purple-900 dark:text-purple-100">{reportData.academicPeriod}</p>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<Award className={`w-5 h-5 ${ms} text-green-600`} />
									{t('student.courses.modal.zoolaReport.sections.overallSummary')}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg text-center">
										<p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('student.courses.modal.zoolaReport.labels.overallScore')}</p>
										<p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{reportData.overallScore}%</p>
										<p className="text-xs text-blue-500 dark:text-blue-300">{t('student.courses.modal.zoolaReport.labels.currentGrade')}</p>
									</div>
									<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg text-center">
										<p className="text-sm font-medium text-green-600 dark:text-green-400">{t('student.courses.modal.zoolaReport.labels.classRank')}</p>
										<p className="text-3xl font-bold text-green-900 dark:text-green-100">{reportData.classRank}</p>
										<p className="text-xs text-green-500 dark:text-green-300">{t('student.courses.modal.zoolaReport.labels.of')} {reportData.totalStudents}</p>
									</div>
									<div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg text-center">
										<p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('student.courses.modal.zoolaReport.labels.percentile')}</p>
										<p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{reportData.percentile}</p>
										<p className="text-xs text-purple-500 dark:text-purple-300">{t('student.courses.modal.zoolaReport.labels.top')} {100 - reportData.percentile}%</p>
									</div>
									<div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg text-center">
										<p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('student.courses.modal.zoolaReport.labels.trend')}</p>
										<p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{reportData.comparativeAnalysis.improvementTrend}</p>
										<p className="text-xs text-orange-500 dark:text-orange-300">{t('student.courses.modal.zoolaReport.labels.vsPrevious')}</p>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<PieChart className={`w-5 h-5 ${ms} text-purple-600`} />
									{t('student.courses.modal.zoolaReport.sections.performanceBreakdown')}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
									{Object.entries(reportData.performanceBreakdown).map(([category, data]) => (
										<div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
											<p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{category}</p>
											<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.score || 'N/A'}</p>
											{data.grade && (
												<p className={`text-sm font-medium ${getGradeColor(data.grade)}`}>{data.grade}</p>
											)}
											<p className="text-xs text-gray-500 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.weight')}: {(data.weight * 100).toFixed(0)}%</p>
										</div>
									))}
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<BookOpen className={`w-5 h-5 ${ms} text-indigo-600`} />
									{t('student.courses.modal.zoolaReport.sections.learningAnalyticsOverview')}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									<div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{t('student.courses.modal.zoolaReport.labels.totalStudyTime')}</p>
										<p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">{reportData.learningAnalytics.timeSpent}h</p>
										<p className="text-xs text-indigo-500 dark:text-indigo-300">{t('student.courses.modal.zoolaReport.sections.learningAnalyticsOverview')}</p>
									</div>
									<div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t('student.courses.modal.zoolaReport.labels.attendanceRate')}</p>
										<p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{reportData.learningAnalytics.attendanceRate}%</p>
										<p className="text-xs text-emerald-500 dark:text-emerald-300">{t('student.courses.modal.zoolaReport.labels.classAttendance')}</p>
									</div>
									<div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-amber-600 dark:text-amber-400">{t('student.courses.modal.zoolaReport.labels.overallEngagement')}</p>
										<p className="text-xl font-bold text-amber-900 dark:text-amber-100">{reportData.learningAnalytics.engagementScore}%</p>
										<p className="text-xs text-amber-500 dark:text-amber-300">{t('student.courses.modal.zoolaReport.labels.overallEngagement')}</p>
									</div>
									<div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-rose-600 dark:text-rose-400">{t('student.courses.modal.zoolaReport.labels.responseTime')}</p>
										<p className="text-xl font-bold text-rose-900 dark:text-rose-100">{reportData.learningAnalytics.averageResponseTime}{t('student.courses.modal.zoolaReport.labels.days')}</p>
										<p className="text-xs text-rose-500 dark:text-rose-300">{t('student.courses.modal.zoolaReport.labels.avgResponse')}</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{selectedSection === 'performance' && (
						<div className="space-y-6" data-tour="zoola-report-performance">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<TrendingUp className={`w-5 h-5 ${ms} text-green-600`} />
									{t('student.courses.modal.zoolaReport.sections.detailedPerformance')}
								</h2>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div className="space-y-4">
										<h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('student.courses.modal.zoolaReport.sections.performanceMetrics')}</h3>
										<div className="space-y-3">
											{Object.entries(reportData.performanceBreakdown).map(([category, data]) => (
												<div key={category} className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg`}>
													<div className={`flex items-center space-x-3 ${sx}`}>
														<span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{category}</span>
														{data.grade && (
															<span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(data.grade)} bg-opacity-20`}>{data.grade}</span>
														)}
													</div>
													<div className="text-right">
														<span className="text-lg font-bold text-gray-900 dark:text-gray-100">{data.score || 'N/A'}</span>
														<p className="text-xs text-gray-500 dark:text-gray-400">{(data.weight * 100).toFixed(0)}% {t('student.courses.modal.zoolaReport.labels.weight')}</p>
													</div>
												</div>
											))}
										</div>
									</div>
									<div className="space-y-4">
										<h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('student.courses.modal.zoolaReport.sections.comparativeAnalysis')}</h3>
										<div className="space-y-3">
											<div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('student.courses.modal.zoolaReport.labels.classRank')}</span>
													<span className="text-lg font-bold text-blue-800 dark:text-blue-200">{reportData.comparativeAnalysis.classAverage}%</span>
												</div>
											</div>
											<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.courses.modal.zoolaReport.labels.yourScore')}</span>
													<span className="text-lg font-bold text-green-800 dark:text-green-200">{reportData.overallScore}%</span>
												</div>
											</div>
											<div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('student.courses.modal.zoolaReport.labels.targetScore')}</span>
													<span className="text-lg font-bold text-purple-800 dark:text-purple-200">{reportData.comparativeAnalysis.targetScore}%</span>
												</div>
											</div>
											<div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-orange-700 dark:text-orange-300">{t('student.courses.modal.zoolaReport.labels.improvement')}</span>
													<span className="text-lg font-bold text-orange-800 dark:text-orange-200">{reportData.comparativeAnalysis.improvementTrend}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{selectedSection === 'analytics' && (
						<div className="space-y-6" data-tour="zoola-report-analytics">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<PieChart className={`w-5 h-5 ${ms} text-indigo-600`} />
									{t('student.courses.modal.zoolaReport.sections.analyticsDeepDive')}
								</h2>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div className="space-y-4">
										<h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('student.courses.modal.zoolaReport.sections.timeActivityAnalysis')}</h3>
										<div className="space-y-3">
											<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
												<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.totalStudyTime')}</span>
												<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{reportData.learningAnalytics.timeSpent} {t('student.courses.modal.zoolaReport.labels.days')}</span>
											</div>
											<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
												<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.assignmentsSubmitted')}</span>
												<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{reportData.learningAnalytics.assignmentsSubmitted}/{reportData.learningAnalytics.assignmentsTotal}</span>
											</div>
											<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
												<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.quizzesCompleted')}</span>
												<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{reportData.learningAnalytics.quizzesTaken}/{reportData.learningAnalytics.quizzesTotal}</span>
											</div>
											<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
												<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.lastActivity')}</span>
												<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(reportData.learningAnalytics.lastActivity).toLocaleString()}</span>
											</div>
										</div>
									</div>
									<div className="space-y-4">
										<h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('student.courses.modal.zoolaReport.sections.engagementMetrics')}</h3>
										<div className="space-y-3">
											<div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('student.courses.modal.zoolaReport.labels.engagementScore')}</span>
													<span className="text-lg font-bold text-blue-800 dark:text-blue-200">{reportData.learningAnalytics.engagementScore}%</span>
												</div>
											</div>
											<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.courses.modal.zoolaReport.labels.attendanceRate')}</span>
													<span className="text-lg font-bold text-green-800 dark:text-green-200">{reportData.learningAnalytics.attendanceRate}%</span>
												</div>
											</div>
											<div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('student.courses.modal.zoolaReport.labels.responseTime')}</span>
													<span className="text-lg font-bold text-purple-800 dark:text-purple-200">{reportData.learningAnalytics.averageResponseTime} {t('student.courses.modal.zoolaReport.labels.days')}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{selectedSection === 'recommendations' && (
						<div className="space-y-6" data-tour="zoola-report-recommendations">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<Target className={`w-5 h-5 ${ms} text-green-600`} />
									{t('student.courses.modal.zoolaReport.sections.personalizedRecommendations')}
								</h2>
								<div className="space-y-4">
									{reportData.recommendations.map((recommendation, index) => (
										<div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
											<div className={`flex items-start justify-between mb-3 ${sx}`}>
												<div className={`flex items-center space-x-3 ${sx}`}>
													<span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(recommendation.priority)}`}>{recommendation.priority} {t('student.courses.modal.zoolaReport.labels.prioritySuffix')}</span>
													<span className="text-sm font-medium text-gray-600 dark:text-gray-400">{recommendation.type}</span>
												</div>
												<span className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.impact')}: {recommendation.impact}</span>
											</div>
											<h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">{recommendation.title}</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{recommendation.description}</p>
											<div className={`flex items-center space-x-2 ${sx}`}>
												<Info className="w-4 h-4 text-blue-500" />
												<span className="text-xs text-blue-600 dark:text-blue-400">{t('student.courses.modal.zoolaReport.insights.recommendationNote')}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{selectedSection === 'progress' && (
						<div className="space-y-6" data-tour="zoola-report-progress">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
									<LineChart className={`w-5 h-5 ${ms} text-blue-600`} />
									{t('student.courses.modal.zoolaReport.sections.weeklyProgress')}
								</h2>
								<div className="space-y-4">
									{Object.entries(reportData.progressTracking).map(([week, data]) => (
										<div key={week} className={`flex items-center space-x-4 ${sx} p-3 bg-gray-50 dark:bg-gray-700 rounded-lg`}>
											<div className="flex-shrink-0 w-16 text-center">
												<p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{week}</p>
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between mb-1">
													<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.courses.modal.zoolaReport.labels.score')}</span>
													<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.score}%</span>
												</div>
												<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
													<div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${data.score}%` }} />
												</div>
											</div>
											<div className="flex-shrink-0">{getTrendIcon(data.trend)}</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('student.courses.modal.zoolaReport.sections.progressInsights')}</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
										<div className={`flex items-center space-x-2 ${sx} mb-2`}>
											<TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
											<span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('student.courses.modal.zoolaReport.insights.steadyImprovement.title')}</span>
										</div>
										<p className="text-sm text-blue-600 dark:text-blue-400">{t('student.courses.modal.zoolaReport.insights.steadyImprovement.text')}</p>
									</div>
									<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
										<div className={`flex items-center space-x-2 ${sx} mb-2`}>
											<Target className="w-4 h-4 text-green-600 dark:text-green-400" />
											<span className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.courses.modal.zoolaReport.insights.targetAchievement.title')}</span>
										</div>
										<p className="text-sm text-green-600 dark:text-green-400">{t('student.courses.modal.zoolaReport.insights.targetAchievement.text')}</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{selectedSection === 'vae-hours' && (
						<div className="space-y-6" data-tour="zoola-report-vae-hours">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<div className={`flex items-center justify-between mb-6 ${sx}`}>
									<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('student.courses.modal.zoolaReport.vaeHoursTitle', { course: course.title })}</h2>
									<div className={`flex items-center space-x-3 ${sx}`}>
										<button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
											</svg>
										</button>
									</div>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
										<thead className="bg-gray-50 dark:bg-gray-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('student.courses.modal.zoolaReport.labels.activityName')}</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('student.courses.modal.zoolaReport.labels.timeSpent')}</th>
											</tr>
										</thead>
										<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
											{reportData.vaeHours.map((activity) => (
												<tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
													<td className="px-6 py-4 whitespace-normal">
														<div className="text-sm text-gray-900 dark:text-gray-100">{activity.activityName}</div>
														<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.category} • {new Date(activity.date).toLocaleDateString()}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span className={`text-sm font-mono ${activity.timeSpent === '00:00:00' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{activity.timeSpent}</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
									<div className={`flex items-center justify-between ${sx}`}>
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('student.courses.modal.zoolaReport.labels.aggregate')}</span>
										<span className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('student.courses.modal.zoolaReport.labels.total')}: {calculateTotalVAEHours()}</span>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('student.courses.modal.zoolaReport.sections.vaeHoursSummary')}</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('student.courses.modal.zoolaReport.labels.totalActivities')}</p>
										<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{reportData.vaeHours.length}</p>
									</div>
									<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-green-600 dark:text-green-400">{t('student.courses.modal.zoolaReport.labels.activitiesWithTime')}</p>
										<p className="text-2xl font-bold text-green-900 dark:text-green-100">{reportData.vaeHours.filter(a => a.timeSpent !== '00:00:00').length}</p>
									</div>
									<div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
										<p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('student.courses.modal.zoolaReport.labels.categories')}</p>
										<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{new Set(reportData.vaeHours.map(a => a.category)).size}</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ZoolaReport;  