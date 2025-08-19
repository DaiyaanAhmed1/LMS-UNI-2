import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  BookMarked, 
  Users2, 
  Star, 
  Eye, 
  Lock, 
  Share2, 
  Sparkles, 
  MessageCircle, 
  Send, 
  UserCircle, 
  FolderOpen, 
  Users, 
  Award, 
  Link2,
  TrendingUp,
  Heart,
  MoreHorizontal,
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Flag,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const demoPosts = [
	{
		id: 1,
		user: { name: 'John Smith', avatar: '', role: 'Student' },
		time: '2 hours ago',
		content: 'Does anyone have tips for presenting a portfolio project to a potential employer?',
		likes: 12,
		replies: [
			{ id: 1, user: { name: 'Emily Brown', avatar: '', role: 'Student' }, time: '1 hour ago', content: 'Practice your pitch and focus on the impact of your work!', likes: 5 },
			{ id: 2, user: { name: 'Dr. Sarah Johnson', avatar: '', role: 'Mentor' }, time: '45 min ago', content: 'Showcase your problem-solving process and results.', likes: 8 }
		]
	},
	{
		id: 2,
		user: { name: 'Emily Brown', avatar: '', role: 'Student' },
		time: '1 day ago',
		content: 'I just published my web dev project in my eCollab portfolio! Feedback welcome.',
		likes: 8,
		replies: [
			{ id: 1, user: { name: 'John Smith', avatar: '', role: 'Student' }, time: '22 hours ago', content: 'Looks great! I like your UI.', likes: 3 }
		]
	}
];

const quickLinks = [
	{ icon: FolderOpen, label: 'myPortfolio', href: '#', color: 'blue', count: 5, description: 'View and manage your portfolio projects' },
	{ icon: Users, label: 'sharedWithMe', href: '#', color: 'green', count: 12, description: 'Projects and resources shared by others' },
	{ icon: Award, label: 'mentorConnect', href: '#', color: 'purple', count: 3, description: 'Connect with mentors and schedule sessions' },
	{ icon: Link2, label: 'resourceHub', href: '#', color: 'orange', count: 8, description: 'Access learning resources and materials' }
];

const recentActivity = [
	{ id: 1, type: 'portfolio', user: 'Sarah Johnson', action: 'shared a new project', time: '2 hours ago', color: 'blue' },
	{ id: 2, type: 'feedback', user: 'Mike Chen', action: 'gave feedback on your work', time: '4 hours ago', color: 'green' },
	{ id: 3, type: 'mentor', user: 'Dr. Emily Brown', action: 'scheduled a session', time: '1 day ago', color: 'purple' },
	{ id: 4, type: 'resource', user: 'System', action: 'new resources available', time: '2 days ago', color: 'orange' }
];

export default function Ecollab() {
	const { t } = useTranslation();
	const [posts, setPosts] = useState(demoPosts);
	const [newPost, setNewPost] = useState('');
	const [replyingTo, setReplyingTo] = useState(null);
	const [newReply, setNewReply] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('all');
	const [likedPosts, setLikedPosts] = useState(new Set());
	const [likedReplies, setLikedReplies] = useState(new Set());
	const [showPopup, setShowPopup] = useState(false);
	const [popupData, setPopupData] = useState({ title: '', message: '', type: 'success' });
	const [showPostMenu, setShowPostMenu] = useState(null);
	const { startTour } = useTour();

	const showCustomPopup = (title, message, type = 'success') => {
		setPopupData({ title, message, type });
		setShowPopup(true);
		setTimeout(() => setShowPopup(false), 3000);
	};

	const handlePost = () => {
		if (newPost.trim()) {
			setPosts([
				{
					id: Date.now(),
					user: { name: t('student.ecollab.you'), avatar: '', role: 'Student' },
					time: t('student.ecollab.justNow'),
					content: newPost,
					likes: 0,
					replies: []
				},
				...posts
			]);
			setNewPost('');
			showCustomPopup(t('student.ecollab.popups.postPublished'), t('student.ecollab.popups.postPublishedMessage'), 'success');
		}
	};

	const handleReply = (postId) => {
		if (newReply.trim()) {
			setPosts(posts.map(post =>
				post.id === postId
					? { 
						...post, 
						replies: [...post.replies, { 
							id: Date.now(), 
							user: { name: t('student.ecollab.you'), avatar: '', role: 'Student' }, 
							time: t('student.ecollab.justNow'), 
							content: newReply,
							likes: 0
						}] 
					}
					: post
			));
			setNewReply('');
			setReplyingTo(null);
			showCustomPopup(t('student.ecollab.popups.replyPosted'), t('student.ecollab.popups.replyPostedMessage'), 'success');
		}
	};

	const handleLike = (postId) => {
		setLikedPosts(prev => {
			const newLiked = new Set(prev);
			if (newLiked.has(postId)) {
				newLiked.delete(postId);
				showCustomPopup(t('student.ecollab.popups.postUnliked'), t('student.ecollab.popups.postUnlikedMessage'), 'info');
			} else {
				newLiked.add(postId);
				showCustomPopup(t('student.ecollab.popups.postLiked'), t('student.ecollab.popups.postLikedMessage'), 'success');
			}
			return newLiked;
		});
	};

	const handleReplyLike = (postId, replyId) => {
		setLikedReplies(prev => {
			const newLiked = new Set(prev);
			const key = `${postId}-${replyId}`;
			if (newLiked.has(key)) {
				newLiked.delete(key);
			} else {
				newLiked.add(key);
			}
			return newLiked;
		});
	};

	const handleShare = (post) => {
		const shareText = `${post.user.name}: ${post.content}`;
		if (navigator.share) {
			navigator.share({
				title: 'eCollab Post',
				text: shareText,
				url: window.location.href
			});
		} else {
			navigator.clipboard.writeText(shareText);
			showCustomPopup(t('student.ecollab.popups.postShared'), t('student.ecollab.popups.postSharedMessage'), 'success');
		}
	};

	const handleReport = (postId) => {
		showCustomPopup(t('student.ecollab.popups.reportSubmitted'), t('student.ecollab.popups.reportSubmittedMessage'), 'success');
		setShowPostMenu(null);
	};

	const handleQuickLink = (link) => {
		showCustomPopup(
			`${t(`student.ecollab.quickLinks.${link.label}`)}`, 
			t('student.ecollab.popups.openingMessage', { description: link.description.toLowerCase() }), 
			'info'
		);
		// In a real app, this would navigate to the actual page
		setTimeout(() => {
			showCustomPopup(
				`${t(`student.ecollab.quickLinks.${link.label}`)}`, 
				t('student.ecollab.popups.itemsAvailable', { description: link.description, count: link.count }), 
				'success'
			);
		}, 1000);
	};

	const filteredPosts = posts.filter(post => {
		const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
							post.user.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || 
							(selectedFilter === 'questions' && post.content.includes('?')) ||
							(selectedFilter === 'projects' && post.content.toLowerCase().includes('project'));
		return matchesSearch && matchesFilter;
	});

	const startEcollabTour = () => {
		const steps = [
			{ 
				target: '#ecollab-intro', 
				title: t('student.tour.ecollab.title', 'What is eCollab?'), 
				content: t('student.tour.ecollab.desc', 'A collaborative space to showcase work, get feedback, and connect with mentors.'),
				placement: 'bottom-start',
				disableBeacon: true
			},
			{ 
				target: '#ecollab-post-input', 
				title: t('student.tour.ecollab.postTitle', 'Share Updates'), 
				content: t('student.tour.ecollab.postDesc', 'Post your ideas, questions, or work for peer review.'),
				placement: 'top-start',
				disableBeacon: true
			},
			{ 
				target: '[data-tour="ecollab-posts"]', 
				title: t('student.tour.ecollab.feedTitle', 'Discussion Feed'), 
				content: t('student.tour.ecollab.feedDesc', 'See posts from classmates and join conversations.'),
				placement: 'top-start',
				disableBeacon: true
			},
			{ 
				target: '[data-tour="reply-link"]', 
				title: t('student.tour.ecollab.replyTitle', 'Join Discussions'), 
				content: t('student.tour.ecollab.replyDesc', 'Reply to posts to engage in meaningful discussions.'),
				placement: 'left-start',
				disableBeacon: true
			},
			{ 
				target: '[data-tour="quick-links"]', 
				title: t('student.tour.ecollab.quickTitle', 'Quick Access'), 
				content: t('student.tour.ecollab.quickDesc', 'Access your portfolio, shared resources, and mentor connections.'),
				placement: 'left-start',
				disableBeacon: true
			},
			{ 
				target: '[data-tour="highlights"]', 
				title: t('student.tour.ecollab.highlightsTitle', 'Activity Highlights'), 
				content: t('student.tour.ecollab.highlightsDesc', 'Stay updated with recent collaborative activities.'),
				placement: 'left-start',
				disableBeacon: true
			}
		].filter(s => document.querySelector(s.target));
		
		if (steps.length) startTour('student:ecollab:v1', steps);
	};

	useEffect(() => {
		// Auto-start tour for new users
		const key = 'tour:student:ecollab:v1:autostart';
		const hasSeenTour = localStorage.getItem(key);
		const tourCompleted = localStorage.getItem('tour:student:ecollab:v1:state');
		
		if (!hasSeenTour && tourCompleted !== 'completed') {
			setTimeout(() => {
				startEcollabTour();
				localStorage.setItem(key, 'shown');
			}, 600);
		}
		
		// Handle tour launches from navigation
		const onLaunch = () => {
			const launch = localStorage.getItem('tour:launch');
			if (launch === 'student-full' || launch === 'student-resume') {
				localStorage.removeItem('tour:launch');
				setTimeout(() => startEcollabTour(), 200);
			}
		};
		
		window.addEventListener('tour:launch', onLaunch);
		return () => window.removeEventListener('tour:launch', onLaunch);
	}, []);

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			<Sidebar role="student" />
			<div className="flex-1 overflow-auto">
				<div className="max-w-7xl mx-auto p-6">
					{/* Enhanced Header Section */}
					<div className="mb-8">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
									<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
										<BookMarked className="w-8 h-8 text-blue-600 dark:text-blue-400" />
									</div>
									{t('student.ecollab.title')}
								</h1>
								<div className="mt-4">
									<div className="flex flex-wrap gap-2">
										<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">{t('student.ecollab.tags.portfolioShowcase')}</span>
										<span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">{t('student.ecollab.tags.peerFeedback')}</span>
										<span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">{t('student.ecollab.tags.mentorConnect')}</span>
										<span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">{t('student.ecollab.tags.resourceHub')}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Enhanced Features Overview */}
					<div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('student.ecollab.features.whyChooseTitle')}</h2>
							<p className="text-gray-600 dark:text-gray-400">{t('student.ecollab.features.whyChooseSubtitle')}</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
										<BookMarked className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('student.ecollab.features.portfolioBuilding')}</h3>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{t('student.ecollab.features.portfolioBuildingDesc')}
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
										<MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
									</div>
									<h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('student.ecollab.features.peerCollaboration')}</h3>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{t('student.ecollab.features.peerCollaborationDesc')}
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
										<Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
									</div>
									<h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('student.ecollab.features.mentorGuidance')}</h3>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{t('student.ecollab.features.mentorGuidanceDesc')}
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
										<Link2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
									</div>
									<h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('student.ecollab.features.resourceSharing')}</h3>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{t('student.ecollab.features.resourceSharingDesc')}
								</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Main Content Area */}
						<div className="lg:col-span-3 space-y-6">
							{/* Enhanced Post Creation */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
										<MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
									</div>
									<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('student.ecollab.discussion.title')}</h2>
								</div>
								
								<div className="space-y-4">
									<div className="flex gap-3">
										<UserCircle className="w-10 h-10 text-blue-400 dark:text-blue-300 flex-shrink-0 mt-2" />
										<div className="flex-1">
											<textarea
												value={newPost}
												onChange={e => setNewPost(e.target.value)}
												placeholder={t('student.ecollab.discussion.placeholder')}
												className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 resize-none"
												rows={3}
												id="ecollab-post-input"
											/>
											<div className="flex items-center justify-between mt-3">
												<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
													<Lock className="w-4 h-4" />
													<span>{t('student.ecollab.privacy.onlyVisibleToClassmates')}</span>
												</div>
												<button
													onClick={handlePost}
													className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
													id="ecollab-post-button"
												>
													<Send size={18} />
													{t('student.ecollab.discussion.postButton')}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Enhanced Search and Filters */}
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
								<div className="flex flex-col md:flex-row gap-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
										<input
											type="text"
											placeholder={t('student.ecollab.search.placeholder')}
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
										/>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => setSelectedFilter('all')}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
												selectedFilter === 'all' 
													? 'bg-blue-600 text-white' 
													: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
											}`}
										>
											{t('student.ecollab.filters.all')}
										</button>
										<button
											onClick={() => setSelectedFilter('questions')}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
												selectedFilter === 'questions' 
													? 'bg-blue-600 text-white' 
													: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
											}`}
										>
											{t('student.ecollab.filters.questions')}
										</button>
										<button
											onClick={() => setSelectedFilter('projects')}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
												selectedFilter === 'projects' 
													? 'bg-blue-600 text-white' 
													: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
											}`}
										>
											{t('student.ecollab.filters.projects')}
										</button>
									</div>
								</div>
							</div>

							{/* Enhanced Posts Feed */}
							<div className="space-y-4" data-tour="ecollab-posts">
								{filteredPosts.map(post => (
									<div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
										{/* Post Header */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												{post.user.avatar ? (
													<img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
												) : (
													<UserCircle className="w-10 h-10 text-blue-400 dark:text-blue-300" />
												)}
												<div>
													<div className="font-semibold text-gray-900 dark:text-gray-100">{post.user.name}</div>
													<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
														<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
															{post.user.role}
														</span>
														<span>•</span>
														<span>{post.time}</span>
													</div>
												</div>
											</div>
											<div className="relative">
												<button 
													onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
													className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
												>
													<MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-gray-500" />
												</button>
												{showPostMenu === post.id && (
													<div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[150px]">
														<button
															onClick={() => handleShare(post)}
															className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
														>
															<Share2 className="w-4 h-4" />
															{t('student.ecollab.actions.share')}
														</button>
														<button
															onClick={() => handleReport(post.id)}
															className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
														>
															<Flag className="w-4 h-4" />
															{t('student.ecollab.actions.report')}
														</button>
													</div>
												)}
											</div>
										</div>

										{/* Post Content */}
										<div className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
											{post.content}
										</div>

										{/* Post Actions */}
										<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
											<div className="flex items-center gap-4">
												<button
													onClick={() => handleLike(post.id)}
													className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
														likedPosts.has(post.id)
															? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
															: 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
													}`}
												>
													<Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
													<span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
												</button>
												<button
													onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setNewReply(''); }}
													className="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
													data-tour="reply-link"
												>
													<MessageCircle className="w-4 h-4" />
													<span className="text-sm">{post.replies.length}</span>
												</button>
												<button 
													onClick={() => handleShare(post)}
													className="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
												>
													<Share2 className="w-4 h-4" />
													<span className="text-sm">{t('student.ecollab.actions.share')}</span>
												</button>
											</div>
										</div>

										{/* Replies Section */}
										{post.replies.length > 0 && (
											<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
												<div className="space-y-3">
													{post.replies.map(reply => (
														<div key={reply.id} className="flex gap-3">
															{reply.user.avatar ? (
																<img src={reply.user.avatar} alt={reply.user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
															) : (
																<UserCircle className="w-8 h-8 text-purple-400 dark:text-purple-300 flex-shrink-0" />
															)}
															<div className="flex-1">
																<div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
																	<div className="flex items-center gap-2 mb-1">
																		<span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{reply.user.name}</span>
																		<span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
																			{reply.user.role}
																		</span>
																		<span className="text-xs text-gray-400 dark:text-gray-500">{reply.time}</span>
																	</div>
																	<p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{reply.content}</p>
																	<div className="flex items-center gap-3">
																		<button
																			onClick={() => handleReplyLike(post.id, reply.id)}
																			className={`flex items-center gap-1 text-xs transition-colors ${
																				likedReplies.has(`${post.id}-${reply.id}`)
																					? 'text-red-600 dark:text-red-400'
																					: 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
																			}`}
																		>
																			<Heart className={`w-3 h-3 ${likedReplies.has(`${post.id}-${reply.id}`) ? 'fill-current' : ''}`} />
																			<span>{reply.likes + (likedReplies.has(`${post.id}-${reply.id}`) ? 1 : 0)}</span>
																		</button>
																		<button
																			onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setNewReply(''); }}
																			className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
																		>
																			{t('student.ecollab.actions.reply')}
																		</button>
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Reply Input */}
										{replyingTo === post.id && (
											<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
												<div className="flex gap-3">
													<UserCircle className="w-8 h-8 text-blue-400 dark:text-blue-300 flex-shrink-0" />
													<div className="flex-1">
														<textarea
															value={newReply}
															onChange={e => setNewReply(e.target.value)}
															placeholder={t('student.ecollab.reply.placeholder')}
															className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:bg-gray-800 dark:text-gray-100 resize-none"
															rows={2}
														/>
														<div className="flex items-center gap-2 mt-2">
															<button
																onClick={() => handleReply(post.id)}
																className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-4 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
															>
																<Send size={16} />
																{t('student.ecollab.reply.button')}
															</button>
															<button
																onClick={() => { setReplyingTo(null); setNewReply(''); }}
																className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
															>
																{t('student.ecollab.reply.cancel')}
															</button>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								))}
								
								{filteredPosts.length === 0 && (
									<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
										<div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
											<MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
										</div>
										<p className="text-gray-500 dark:text-gray-400 font-medium mb-2">{t('student.ecollab.emptyState')}</p>
										<p className="text-gray-400 dark:text-gray-500 text-sm">{t('student.ecollab.emptyStateMessage')}</p>
									</div>
								)}
							</div>
						</div>

						{/* Enhanced Sidebar */}
						<div className="space-y-6">
							{/* Quick Stats */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
										<TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('student.ecollab.activity.overview')}</h3>
								</div>
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
											<MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
										</div>
										<div>
											<p className="text-sm text-gray-600 dark:text-gray-400">{t('student.ecollab.activity.activeDiscussions')}</p>
											<p className="text-xl font-bold text-gray-900 dark:text-gray-100">{posts.length}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
											<Users2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="text-sm text-gray-600 dark:text-gray-400">{t('student.ecollab.activity.collaborators')}</p>
											<p className="text-xl font-bold text-gray-900 dark:text-gray-100">24</p>
										</div>
									</div>
								</div>
							</div>

							{/* Quick Links */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" data-tour="quick-links">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
										<Users2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('student.ecollab.quickLinks.title')}</h3>
								</div>
								<div className="space-y-3">
									{quickLinks.map(link => (
										<button 
											key={link.label} 
											onClick={() => handleQuickLink(link)}
											className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
										>
											<div className="flex items-center gap-3">
												<div className={`p-2 rounded-lg bg-${link.color}-100 dark:bg-${link.color}-900/30`}>
													<link.icon className={`w-5 h-5 text-${link.color}-600 dark:text-${link.color}-400`} />
												</div>
												<span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
													{t(`student.ecollab.quickLinks.${link.label}`)}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
													{link.count}
												</span>
												<ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Recent Activity */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" data-tour="highlights">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
										<Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
									</div>
									<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('student.ecollab.highlights.title')}</h3>
								</div>
								<div className="space-y-3">
									{recentActivity.map(activity => (
										<div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
											<div className={`w-2 h-2 rounded-full bg-${activity.color}-500 mt-2 flex-shrink-0`}></div>
											<div className="flex-1 min-w-0">
												<p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
													{activity.user}
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{activity.action}
												</p>
												<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
													{activity.time}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Collaboration Stats */}
							<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-xl">
										<Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('student.ecollab.stats.collaborationStats')}</h3>
								</div>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.ecollab.stats.postsThisWeek')}</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">12</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.ecollab.stats.repliesGiven')}</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">8</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.ecollab.stats.projectsShared')}</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">3</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">{t('student.ecollab.stats.mentorSessions')}</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">2</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Popup Modal */}
			{showPopup && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowPopup(false)}></div>
					<div className={`relative transform transition-all duration-300 ease-out ${
						showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
					}`}>
						<div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full mx-4 ${
							popupData.type === 'success' ? 'border-l-4 border-l-green-500' :
							popupData.type === 'info' ? 'border-l-4 border-l-blue-500' :
							'border-l-4 border-l-yellow-500'
						}`}>
							{/* Close Button */}
							<button
								onClick={() => setShowPopup(false)}
								className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							>
								<svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>

							{/* Icon */}
							<div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
								popupData.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
								popupData.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' :
								'bg-yellow-100 dark:bg-yellow-900/30'
							}`}>
								{popupData.type === 'success' ? (
									<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
									</svg>
								) : popupData.type === 'info' ? (
									<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								) : (
									<svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
									</svg>
								)}
							</div>

							{/* Content */}
							<div className="pr-8">
								<h3 className={`text-lg font-bold mb-2 ${
									popupData.type === 'success' ? 'text-green-800 dark:text-green-200' :
									popupData.type === 'info' ? 'text-blue-800 dark:text-blue-200' :
									'text-yellow-800 dark:text-yellow-200'
								}`}>
									{popupData.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
									{popupData.message}
								</p>
							</div>

							{/* Progress Bar */}
							<div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<div className={`h-full transition-all duration-3000 ease-linear ${
									popupData.type === 'success' ? 'bg-green-500' :
									popupData.type === 'info' ? 'bg-blue-500' :
									'bg-yellow-500'
								}`} style={{ width: '100%' }}></div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
} 