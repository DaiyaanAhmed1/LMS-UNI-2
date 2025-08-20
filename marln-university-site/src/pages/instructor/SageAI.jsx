import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bot, Sparkles, BookOpen, Lightbulb, Target, Zap, Lock, X, Send, MessageCircle, Plus, Mic, ArrowRight, Trash2, Paperclip, ChevronLeft, ChevronRight, Crown, PanelLeftClose, PanelLeftOpen, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import aiService from '../../utils/aiService';

const availablePrompts = [
  {
    id: 1,
    title: 'Generate Quiz',
    description: 'Create a 10-question quiz from given topics',
    icon: Target,
    prompt: 'Generate a 10-question mixed quiz (MCQ + short answer) for the following topics: '
  },
  {
    id: 2,
    title: 'Lecture Outline',
    description: 'Draft a 45-minute lecture outline with timings',
    icon: BookOpen,
    prompt: 'Draft a 45-minute lecture outline with section timings for: '
  },
  {
    id: 3,
    title: 'Assignment Idea',
    description: 'Propose a practical assignment with rubric',
    icon: Lightbulb,
    prompt: 'Propose a practical assignment (with rubric and learning outcomes) for: '
  },
  {
    id: 4,
    title: 'Grading Rubric',
    description: 'Create detailed grading criteria for assignments',
    icon: BookOpen,
    prompt: 'Create a detailed grading rubric for: '
  }
];

const proPrompts = [
  { id: 5, title: 'Detect Plagiarism Patterns', description: 'Guidance on spotting common plagiarism patterns', icon: Sparkles },
  { id: 6, title: 'Code Feedback', description: 'AI feedback suggestions for coding assignments', icon: Zap },
  { id: 7, title: 'Rubric Optimizer', description: 'Optimize rubric criteria and weights', icon: BookOpen },
  { id: 8, title: 'Student Analytics', description: 'Analyze student performance patterns', icon: Target }
];

// Markdown renderer component
const MarkdownRenderer = ({ content, isTyping = false }) => {
  const { isRTL } = useLanguage();
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isTyping) {
      if (currentIndex < content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(content.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 20); // Typing speed
        return () => clearTimeout(timer);
      }
    } else {
      setDisplayedContent(content);
      setCurrentIndex(content.length);
    }
  }, [content, currentIndex, isTyping]);

  const renderMarkdown = (text) => {
    // Detect if content is primarily English or Arabic
    const isEnglishContent = /^[a-zA-Z\s\d\-\.,!?()[\]{}:;'"`~@#$%^&*+=|\\/<>]+$/.test(text.replace(/\n/g, ' ').substring(0, 100));
    
    // Basic markdown rendering
    return text
      .split('\n')
      .map((line, index) => {
        // Bold text
        if (line.includes('**')) {
          line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          const alignment = isEnglishContent ? 'text-left' : (isRTL ? 'text-right' : 'text-left');
          const fontClass = isEnglishContent ? '' : (isRTL ? 'font-arabic' : '');
          return `<h3 class="text-lg font-semibold mb-2 ${alignment} ${fontClass}">${line.replace(/\*\*/g, '')}</h3>`;
        }
        // Lists
        if (line.trim().startsWith('•')) {
          const alignment = isEnglishContent ? 'ml-4 text-left' : (isRTL ? 'mr-4 text-right' : 'ml-4 text-left');
          const fontClass = isEnglishContent ? '' : (isRTL ? 'font-arabic' : '');
          return `<li class="${alignment} ${fontClass}">${line.trim().substring(1)}</li>`;
        }
        // Code blocks
        if (line.includes('```')) {
          const alignment = isEnglishContent ? 'text-left' : (isRTL ? 'text-right' : 'text-left');
          const fontClass = isEnglishContent ? '' : (isRTL ? 'font-arabic' : '');
          return `<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto ${alignment} ${fontClass}"><code>${line.replace(/```/g, '')}</code></pre>`;
        }
        // Regular paragraphs
        if (line.trim() === '') {
          return '<br>';
        }
        const alignment = isEnglishContent ? 'text-left' : (isRTL ? 'text-right' : 'text-left');
        const fontClass = isEnglishContent ? '' : (isRTL ? 'font-arabic' : '');
        return `<p class="mb-2 ${alignment} ${fontClass}">${line}</p>`;
      })
      .join('');
  };

  return (
    <div 
      className={`prose dark:prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'} ${isRTL ? 'font-arabic' : ''}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedContent) }}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ direction: 'auto' }}
    />
  );
};

export default function InstructorSageAI() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isProUser, setIsProUser] = useState(false); // Set to false for free users
  const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false);
  const [hasUpgradeMessage, setHasUpgradeMessage] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [remainingMessages, setRemainingMessages] = useState(aiService.sageAILimits.free); // Track remaining messages
  const [forceArabicResponse, setForceArabicResponse] = useState(false); // Force all responses in Arabic
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Use a consistent user ID for rate limiting
  const userId = 'instructor-user-456'; // Consistent user ID

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('instructor-sageAI-chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    } else {
      // Create initial chat
      createNewChat();
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('instructor-sageAI-chats', JSON.stringify(chats));
    }
  }, [chats]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputMessage]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  // Auto-scroll during AI typing
  useEffect(() => {
    if (isTyping && chatContainerRef.current) {
      const scrollToBottom = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      };
      
      // Scroll immediately when typing starts
      scrollToBottom();
      
      // Continue scrolling during typing animation
      const interval = setInterval(scrollToBottom, 100);
      
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setInputMessage('');
    setHasShownInitialHelp(false); // Reset for new chat
    setHasUpgradeMessage(false); // Reset upgrade message flag for new chat
    setMessageCount(0); // Reset message count for new chat
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      if (chats.length > 1) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setCurrentChatId(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId);
  };

  const updateChatTitle = (chatId, firstMessage) => {
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ));
  };

  const handlePromptClick = (prompt) => {
    setInputMessage(prompt);
    setShowChatHistory(false); // Close chat history when starting new conversation
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChatId) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    const currentChat = getCurrentChat();
    const updatedMessages = [...currentChat.messages, userMessage];
    
    // Update chat with user message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: updatedMessages }
        : chat
    ));

    // Update title if this is the first message
    if (currentChat.messages.length === 0) {
      updateChatTitle(currentChatId, inputMessage);
    }

    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Increment message count
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);

    try {
      // Use consistent user ID for rate limiting
      const userType = 'free'; // Free tier for demo
      const language = forceArabicResponse ? 'ar' : (currentLanguage === 'ar' ? 'ar' : 'en');

      console.log('🔍 SageAI Debug Info:');
      console.log('  - forceArabicResponse:', forceArabicResponse);
      console.log('  - currentLanguage:', currentLanguage);
      console.log('  - selected language:', language);
      console.log('  - user input:', currentInput);

      // Get AI response
      const aiResponseText = await aiService.getAIResponse(
        currentInput, 
        userId, 
        userType, 
        language,
        true // isSageAI = true
      );

      // Create AI response
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
        isProUpgrade: aiResponseText.includes('Upgrade to PRO')
      };

      // Update remaining messages count
      const remainingRequests = aiService.getRemainingSageAIMessages(userId, userType);
      setRemainingMessages(remainingRequests);

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, aiResponse] }
          : chat
      ));
      setIsLoading(false);
      setIsTyping(true);
      
      // Simulate typing animation
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, errorResponse] }
          : chat
      ));
      setIsLoading(false);
    }
  };

  const generateAIResponse = (message) => {
    const lower = message.toLowerCase();
    
    if (lower.includes('quiz')) {
      return `**10-Question Mixed Quiz** 📝\n\n**Multiple Choice Questions (5 questions):**\n\n1. **Question:** [Your topic here]\n   A) Option A\n   B) Option B\n   C) Option C\n   D) Option D\n   **Answer:** C\n   **Points:** 2\n\n2. **Question:** [Your topic here]\n   A) Option A\n   B) Option B\n   C) Option C\n   D) Option D\n   **Answer:** A\n   **Points:** 2\n\n**Short Answer Questions (5 questions):**\n\n6. **Question:** [Your topic here]\n   **Expected Answer:** [Detailed answer]\n   **Points:** 5\n   **Key Points:** [Important concepts to look for]\n\n7. **Question:** [Your topic here]\n   **Expected Answer:** [Detailed answer]\n   **Points:** 5\n   **Key Points:** [Important concepts to look for]\n\n**Total Points:** 35\n**Time Limit:** 45 minutes\n\n**Grading Rubric:**\n• **Excellent (90-100%):** All key concepts covered, clear explanations\n• **Good (80-89%):** Most concepts covered, minor omissions\n• **Satisfactory (70-79%):** Basic understanding shown\n• **Needs Improvement (60-69%):** Significant gaps in knowledge\n• **Unsatisfactory (<60%):** Major misunderstandings or incomplete answers`;
    }
    
    if (lower.includes('lecture')) {
      return `**45-Minute Lecture Outline** 📚\n\n**1. Introduction (5 minutes)**\n• Welcome and agenda overview\n• Learning objectives\n• Hook/engaging opening\n\n**2. Main Content - Part 1 (15 minutes)**\n• Key concept introduction\n• Real-world examples\n• Interactive element (poll/discussion)\n\n**3. Main Content - Part 2 (15 minutes)**\n• Advanced concepts\n• Case study or demonstration\n• Student participation activity\n\n**4. Summary and Q&A (10 minutes)**\n• Key takeaways review\n• Questions from students\n• Preview of next session\n\n**Teaching Tips:**\n• Use visual aids and multimedia\n• Include 2-3 interactive moments\n• Prepare backup content for time management\n• Have discussion questions ready\n\n**Assessment Check:**\n• Quick comprehension check at 20-minute mark\n• Exit ticket or reflection question`;
    }
    
    if (lower.includes('assignment')) {
      return `**Practical Assignment Proposal** 💡\n\n**Assignment Title:** [Your topic] Project\n\n**Learning Outcomes:**\n• Students will demonstrate understanding of [concept]\n• Students will apply [skill] in practical scenarios\n• Students will analyze and evaluate [topic]\n\n**Assignment Description:**\n[Detailed description of what students need to do]\n\n**Deliverables:**\n• Written report (5-7 pages)\n• Presentation (10-15 minutes)\n• Supporting materials (code, diagrams, etc.)\n\n**Grading Rubric:**\n\n**Content Quality (40%)**\n• Excellent (36-40): Comprehensive coverage, deep insights\n• Good (32-35): Good coverage, some insights\n• Satisfactory (28-31): Basic coverage, limited insights\n• Needs Improvement (24-27): Incomplete coverage\n• Unsatisfactory (0-23): Major gaps or errors\n\n**Technical Skills (30%)**\n• Excellent (27-30): Advanced techniques, clean implementation\n• Good (24-26): Good techniques, mostly clean\n• Satisfactory (21-23): Basic techniques, functional\n• Needs Improvement (18-20): Limited techniques\n• Unsatisfactory (0-17): Poor implementation\n\n**Presentation (20%)**\n• Excellent (18-20): Clear, engaging, professional\n• Good (16-17): Clear, mostly engaging\n• Satisfactory (14-15): Generally clear\n• Needs Improvement (12-13): Unclear at times\n• Unsatisfactory (0-11): Poor presentation\n\n**Creativity (10%)**\n• Excellent (9-10): Highly innovative approach\n• Good (8): Some innovation\n• Satisfactory (7): Basic creativity\n• Needs Improvement (6): Limited creativity\n• Unsatisfactory (0-5): No creativity shown\n\n**Total Points:** 100\n**Due Date:** [Specify date]\n**Submission:** [Platform/method]`;
    }
    
    if (lower.includes('rubric')) {
      return `**Detailed Grading Rubric** 📊\n\n**Rubric Structure:**\n\n**Criterion 1: [Specific Skill/Knowledge] (25%)**\n• **Excellent (23-25 points):** [Detailed description]\n• **Good (20-22 points):** [Detailed description]\n• **Satisfactory (18-19 points):** [Detailed description]\n• **Needs Improvement (15-17 points):** [Detailed description]\n• **Unsatisfactory (0-14 points):** [Detailed description]\n\n**Criterion 2: [Specific Skill/Knowledge] (25%)**\n• **Excellent (23-25 points):** [Detailed description]\n• **Good (20-22 points):** [Detailed description]\n• **Satisfactory (18-19 points):** [Detailed description]\n• **Needs Improvement (15-17 points):** [Detailed description]\n• **Unsatisfactory (0-14 points):** [Detailed description]\n\n**Criterion 3: [Specific Skill/Knowledge] (25%)**\n• **Excellent (23-25 points):** [Detailed description]\n• **Good (20-22 points):** [Detailed description]\n• **Satisfactory (18-19 points):** [Detailed description]\n• **Needs Improvement (15-17 points):** [Detailed description]\n• **Unsatisfactory (0-14 points):** [Detailed description]\n\n**Criterion 4: [Specific Skill/Knowledge] (25%)**\n• **Excellent (23-25 points):** [Detailed description]\n• **Good (20-22 points):** [Detailed description]\n• **Satisfactory (18-19 points):** [Detailed description]\n• **Needs Improvement (15-17 points):** [Detailed description]\n• **Unsatisfactory (0-14 points):** [Detailed description]\n\n**Total Points:** 100\n\n**Grading Scale:**\n• A: 90-100 points\n• B: 80-89 points\n• C: 70-79 points\n• D: 60-69 points\n• F: 0-59 points\n\n**Feedback Guidelines:**\n• Provide specific, actionable feedback\n• Highlight strengths and areas for improvement\n• Use constructive, encouraging language\n• Reference specific rubric criteria`;
    }
    
    return "I can help you generate quizzes, create lecture outlines, design assignments, and develop grading rubrics. Please specify the topic or course context you'd like me to focus on.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    // Voice input functionality (placeholder)
    alert('Voice input feature coming soon!');
  };

  const handleFileAttachment = () => {
    // File attachment functionality (placeholder)
    alert('File attachment feature coming soon!');
  };

  const handleUpgradeToPro = () => {
    // Upgrade to Pro functionality (placeholder)
    alert('Upgrade to Pro to access unlimited chat history and advanced features!');
  };

  const currentChat = getCurrentChat();
  const visibleChats = isProUser ? chats : chats.slice(0, 2); // Limit to 2 chats for free users

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="instructor" />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <button
              onClick={() => navigate('/instructor/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isRTL ? "العودة إلى لوحة التحكم" : "Back to Dashboard"}
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {currentChat?.title || 'Sage AI'}
            </span>
          </div>
          
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            {/* Remaining Messages Display or PRO Upgrade */}
            {!isProUser && (
              remainingMessages > 0 ? (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {isRTL ? `${remainingMessages} رسالة متبقية` : `${remainingMessages} messages left`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    {isRTL ? "ترقية إلى PRO" : "Upgrade to PRO"}
                  </span>
                  <button
                                          onClick={() => {
                        aiService.resetSageAILimits();
                        setRemainingMessages(aiService.sageAILimits.free);
                        alert('Sage AI limits reset! You can now chat with AI again.');
                      }}
                    className="ml-2 p-1 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200 rounded transition-colors"
                    title={isRTL ? "إعادة تعيين للاختبار" : "Reset for testing"}
                  >
                    <Zap className="w-3 h-3" />
                  </button>
                </div>
              )
            )}
            
            {/* New Chat Button */}
            <button
              onClick={createNewChat}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isRTL ? "بدء محادثة جديدة" : "Start New Chat"}
            >
              <Plus className="w-5 h-5" />
            </button>
            
            {/* Chat History Toggle */}
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={showChatHistory ? (isRTL ? 'إخفاء سجل المحادثات' : 'Hide Chat History') : (isRTL ? 'عرض سجل المحادثات' : 'Show Chat History')}
            >
              {showChatHistory ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            
            {/* Arabic Response Toggle */}
            <button
              onClick={() => setForceArabicResponse(!forceArabicResponse)}
              className={`p-2 rounded-lg transition-colors ${
                forceArabicResponse 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={forceArabicResponse ? t('instructor.sageAI.arabicResponses.disable', 'Disable Arabic Responses') : t('instructor.sageAI.arabicResponses.enable', 'Enable Arabic Responses')}
            >
              <Languages className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          {currentChat?.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full pt-6">
              <div className="text-center max-w-2xl mx-auto px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-blue-500/20 animate-pulse hover:animate-none hover:scale-110 transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-500/30 border border-blue-200/50 dark:border-blue-500/30">
                  <Bot className="w-10 h-10 text-blue-600 dark:text-blue-300 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {isRTL ? "كيف يمكنني مساعدتك في التدريس؟" : "How can I help you with teaching?"}
                </h3>
                <p className={`text-gray-500 dark:text-gray-400 mb-6 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {isRTL ? "أنا هنا لمساعدتك في إنشاء الاختبارات والمحاضرات والمهام." : "I'm here to help you create quizzes, lectures, and assignments."}
                </p>
                
                {/* Arabic Response Indicator */}
                {forceArabicResponse && (
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className={`text-sm font-medium text-blue-700 dark:text-blue-300 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {t('instructor.sageAI.arabicResponses.indicator', 'Responses will be in Arabic')}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {availablePrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptClick(prompt.prompt)}
                      className={`p-3 ${isRTL ? 'text-right' : 'text-left'} border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group`}
                    >
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                        <prompt.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h4 className={`font-medium text-gray-900 dark:text-gray-100 text-sm ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>{prompt.title}</h4>
                          <p className={`text-gray-500 dark:text-gray-400 text-xs ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>{prompt.description}</p>
                        </div>
                        <ArrowRight className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* PRO Features Section */}
                <div className="mt-6">
                  <h4 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? "الميزات المتقدمة (PRO)" : "Advanced Features (PRO)"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {proPrompts.map((prompt) => (
                      <div key={prompt.id} className="relative">
                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60">
                          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                            <prompt.icon className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                            <div>
                              <h4 className={`font-medium text-gray-600 dark:text-gray-400 text-sm ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>{prompt.title}</h4>
                              <p className={`text-gray-500 dark:text-gray-500 text-xs ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>{prompt.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="px-3 py-1 rounded-full shadow-md font-semibold text-xs flex items-center gap-1 border border-purple-600 text-purple-700 bg-white/95 dark:bg-purple-700 dark:text-white">
                            <Lock className="w-3 h-3" />
                            PRO
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`py-6 px-4 ${
                    message.type === 'user' 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className={`max-w-3xl mx-auto flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : message.isProUpgrade ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-500'
                    }`}>
                      {message.type === 'user' ? (
                        <div className="w-5 h-5 text-white text-sm font-medium">I</div>
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {message.type === 'ai' ? (
                        <div>
                          <MarkdownRenderer 
                            content={message.content} 
                            isTyping={isTyping && message.id === currentChat.messages[currentChat.messages.length - 1]?.id}
                          />
                          {message.isProUpgrade && (
                            <div className="mt-4 pt-3 border-t border-purple-300/30">
                              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Upgrade to PRO
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed ${isRTL ? 'text-right' : 'text-left'} ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} style={{ direction: 'auto' }}>
                          {message.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="py-6 px-4 bg-gray-50 dark:bg-gray-900">
                  <div className={`max-w-3xl mx-auto flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRTL ? "رسالة إلى Sage AI..." : "Message Sage AI..."}
                className={`w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'pr-4 pl-24' : 'pr-24'}`}
                rows={1}
                style={{ minHeight: '52px', maxHeight: '200px' }}
              />
              
              {/* Action Buttons */}
              <div className={`absolute bottom-2 flex items-center ${isRTL ? 'left-2 space-x-reverse space-x-1' : 'right-2 space-x-1'}`}>
                <button
                  onClick={handleFileAttachment}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title={isRTL ? "إرفاق ملف" : "Attach file"}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={handleVoiceInput}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title={isRTL ? "إدخال صوتي" : "Voice input"}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title={isRTL ? "إرسال الرسالة" : "Send message"}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {isRTL ? "قد يرتكب Sage AI أخطاء. يُنصح بمراجعة المعلومات المهمة." : "Sage AI can make mistakes. Consider checking important information."}
            </p>
          </div>
        </div>
      </div>

      {/* Chat History Sidebar - Right Side */}
      {showChatHistory && (
        <div className={`w-80 bg-white dark:bg-gray-800 flex flex-col ${isRTL ? 'border-r border-gray-200 dark:border-gray-700' : 'border-l border-gray-200 dark:border-gray-700'}`}>
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            {visibleChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <div className={`flex items-center ${isRTL ? 'justify-between' : 'justify-between'}`}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-gray-900 dark:text-gray-100 truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                      {chat.title}
                    </p>
                    <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    title={isRTL ? "حذف المحادثة" : "Delete chat"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Pro Upgrade Prompt */}
            {!isProUser && (chats.length > 2 || hasUpgradeMessage) && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-2`}>
                    <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {isRTL ? "الترقية إلى النسخة المميزة" : "Upgrade to Pro"}
                    </span>
                  </div>
                  <p className={`text-xs text-gray-600 dark:text-gray-400 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {hasUpgradeMessage 
                      ? (isRTL ? "استمر في محادثتك مع مساعدة ذكية غير محدودة" : "Continue your conversation with unlimited AI assistance")
                      : (isRTL ? "احصل على سجل محادثات غير محدود وميزات متقدمة" : "Access unlimited chat history and advanced features")
                    }
                  </p>
                  <button
                    onClick={handleUpgradeToPro}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    {isRTL ? "ترقية الآن" : "Upgrade Now"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Chat Button - Bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={createNewChat}
              className={`w-full flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200`}
            >
              <Plus className="w-5 h-5" />
              <span>{isRTL ? "محادثة جديدة" : "New Chat"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 