import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bot, Sparkles, BookOpen, Lightbulb, Target, Zap, Lock, X, Send, MessageCircle, Plus, Mic, ArrowRight, Trash2, Paperclip, ChevronLeft, ChevronRight, Crown, PanelLeftClose, PanelLeftOpen, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import aiService from '../../utils/aiService';
import fileAnalysisService from '../../utils/fileAnalysisService';
import ReactMarkdown from 'react-markdown';

const availablePrompts = [
  {
    id: 1,
    title: 'System Health Report',
    description: 'Generate comprehensive system performance analysis',
    icon: Target,
    prompt: 'Generate a comprehensive system health report for the LMS including: '
  },
  {
    id: 2,
    title: 'User Management Policy',
    description: 'Create user management policies and procedures',
    icon: BookOpen,
    prompt: 'Create a comprehensive user management policy document for: '
  },
  {
    id: 3,
    title: 'Course Analytics Report',
    description: 'Generate detailed course performance analytics',
    icon: Lightbulb,
    prompt: 'Generate a comprehensive course analytics report for: '
  },
  {
    id: 4,
    title: 'Security Audit Report',
    description: 'Create security audit and compliance reports',
    icon: BookOpen,
    prompt: 'Create a detailed security audit report for: '
  }
];

const proPrompts = [
  { id: 5, title: 'Advanced Analytics Dashboard', description: 'Create comprehensive analytics dashboards', icon: Sparkles },
  { id: 6, title: 'Database Performance Analysis', description: 'Analyze database performance and optimization', icon: Zap },
  { id: 7, title: 'Predictive Analytics', description: 'Predict trends and future system needs', icon: BookOpen },
  { id: 8, title: 'Compliance Report Generator', description: 'Generate regulatory compliance reports', icon: Target }
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

  return (
    <div className={`prose dark:prose-invert max-w-none markdown-content ${isRTL ? 'text-right' : 'text-left'} ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ReactMarkdown
        components={{
          p: ({node, children, ...props}) => (
            <p className="text-gray-900 dark:text-gray-100 mb-4 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          h1: ({node, children, ...props}) => (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6" {...props}>
              {children}
            </h1>
          ),
          h2: ({node, children, ...props}) => (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5" {...props}>
              {children}
            </h2>
          ),
          h3: ({node, children, ...props}) => (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4" {...props}>
              {children}
            </h3>
          ),
          h4: ({node, children, ...props}) => (
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3" {...props}>
              {children}
            </h4>
          ),
          h5: ({node, children, ...props}) => (
            <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3" {...props}>
              {children}
            </h5>
          ),
          h6: ({node, children, ...props}) => (
            <h6 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3" {...props}>
              {children}
            </h6>
          ),
          strong: ({node, children, ...props}) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </strong>
          ),
          em: ({node, children, ...props}) => (
            <em className="italic text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </em>
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
          ),
          th: ({node, ...props}) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700" {...props} />
          ),
          tr: ({node, ...props}) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" {...props} />
          ),
          code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto">
                <code className={`${className} text-gray-900 dark:text-gray-100`} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-900 dark:text-gray-100" {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({node, children, ...props}) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </blockquote>
          ),
          ul: ({node, children, ...props}) => (
            <ul className="list-disc list-inside space-y-2 my-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({node, children, ...props}) => (
            <ol className="list-decimal list-inside space-y-2 my-4" {...props}>
              {children}
            </ol>
          ),
          li: ({node, children, ...props}) => (
            <li className="text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </li>
          ),
        }}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default function AdminSageAI() {
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
  const [attachedFile, setAttachedFile] = useState(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Use a consistent user ID for rate limiting
  const userId = 'admin-user-789'; // Consistent user ID

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('admin-sageAI-chats');
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
      localStorage.setItem('admin-sageAI-chats', JSON.stringify(chats));
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
    // Prevent creating new chat if AI is responding
    if (isLoading || isTyping) return;
    
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

  // Update remaining messages count
  const updateRemainingMessages = () => {
    const userType = 'free';
    const remaining = aiService.getRemainingSageAIMessages(userId, userType);
    setRemainingMessages(remaining);
  };

  // Update remaining messages on component mount and after each message
  useEffect(() => {
    updateRemainingMessages();
  }, [chats]); // Update when chats change

  const deleteChat = (chatId) => {
    // Prevent deleting chat if AI is responding
    if (isLoading || isTyping) return;
    
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
    // Prevent updating title if AI is responding
    if (isLoading || isTyping) return;
    
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ));
  };

  const handlePromptClick = (prompt) => {
    // Prevent setting prompts if AI is responding
    if (isLoading || isTyping) return;
    
    setInputMessage(prompt);
    setShowChatHistory(false); // Close chat history when starting new conversation
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChatId || isLoading || isTyping) return;

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
    
    if (lower.includes('system') || lower.includes('health')) {
      return `**System Health Report** 📊\n\n**System Performance Metrics:**\n• **CPU Usage:** [Current CPU utilization]\n• **Memory Usage:** [RAM usage and availability]\n• **Disk Space:** [Storage capacity and usage]\n• **Network Performance:** [Bandwidth and latency]\n• **Database Performance:** [Query response times]\n\n**Key Findings:**\n• [Main performance indicators]\n• [Potential bottlenecks]\n• [Resource utilization trends]\n\n**Recommendations:**\n• **Immediate Actions:** [Critical issues to address]\n• **Short-term:** [Optimizations for next 30 days]\n• **Long-term:** [Strategic improvements]\n\n**Monitoring Alerts:**\n• [Set up alerts for critical thresholds]\n• [Performance baseline establishment]\n• [Regular health check schedule]`;
    }
    
    if (lower.includes('user') || lower.includes('management')) {
      return `**User Management Policy Document** 👥\n\n**Policy Overview:**\n• **Purpose:** [Clear statement of policy goals]\n• **Scope:** [Who this policy applies to]\n• **Effective Date:** [When policy takes effect]\n\n**User Account Management:**\n• **Account Creation:** [Process and requirements]\n• **Access Levels:** [Role-based permissions]\n• **Password Policies:** [Security requirements]\n• **Account Maintenance:** [Regular review procedures]\n\n**Security Protocols:**\n• **Authentication:** [Login requirements]\n• **Authorization:** [Access control measures]\n• **Data Protection:** [Privacy safeguards]\n\n**Compliance Requirements:**\n• **Regulatory Standards:** [Applicable laws]\n• **Audit Procedures:** [Monitoring and reporting]\n• **Incident Response:** [Security breach protocols]`;
    }
    
    if (lower.includes('course') || lower.includes('analytics')) {
      return `**Course Analytics Report** 📈\n\n**Performance Metrics:**\n• **Enrollment Trends:** [Student registration patterns]\n• **Completion Rates:** [Course success metrics]\n• **Engagement Levels:** [Student participation data]\n• **Assessment Results:** [Grade distributions]\n\n**Key Insights:**\n• [Top performing courses]\n• [Areas needing improvement]\n• [Student satisfaction scores]\n• [Instructor effectiveness]\n\n**Recommendations:**\n• **Content Optimization:** [Course material improvements]\n• **Teaching Methods:** [Pedagogical enhancements]\n• **Resource Allocation:** [Support and funding needs]\n\n**Action Items:**\n• [Immediate improvements]\n• [Long-term strategies]\n• [Success metrics tracking]`;
    }
    
    if (lower.includes('security') || lower.includes('audit')) {
      return `**Security Audit Report** 🔒\n\n**Audit Scope:**\n• **Systems Reviewed:** [LMS components assessed]\n• **Security Controls:** [Protection measures evaluated]\n• **Compliance Standards:** [Regulatory requirements]\n\n**Security Assessment:**\n• **Access Controls:** [User authentication review]\n• **Data Protection:** [Information security measures]\n• **Network Security:** [Infrastructure protection]\n• **Application Security:** [Software vulnerability assessment]\n\n**Risk Assessment:**\n• **High Risk:** [Critical security issues]\n• **Medium Risk:** [Moderate concerns]\n• **Low Risk:** [Minor improvements needed]\n\n**Compliance Status:**\n• **Regulatory Requirements:** [Legal compliance]\n• **Industry Standards:** [Best practices adherence]\n• **Internal Policies:** [Organizational compliance]\n\n**Remediation Plan:**\n• **Immediate Actions:** [Critical fixes required]\n• **Short-term:** [30-90 day improvements]\n• **Long-term:** [Strategic security enhancements]`;
    }
    
    return "I can help you generate system health reports, create user management policies, analyze course performance, and conduct security audits. Please specify the administrative area you'd like me to focus on.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Prevent sending message if AI is responding
      if (!isLoading && !isTyping) {
        handleSendMessage();
      }
    }
  };

  const handleVoiceInput = () => {
    // Prevent voice input if AI is responding
    if (isLoading || isTyping) return;
    
    // Voice input functionality (placeholder)
    alert('Voice input feature coming soon!');
  };

  const handleFileAttachment = () => {
    // Prevent file attachment if AI is responding
    if (isLoading || isTyping) return;
    
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpg,.jpeg,.png,.gif,.webp,.bmp,.pdf,.txt,.doc,.docx,.rtf,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.xml,.md';
    fileInput.style.display = 'none';
    
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        await handleFileUpload(file);
      }
      // Clean up
      document.body.removeChild(fileInput);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleFileUpload = async (file) => {
    // Prevent file upload if AI is responding
    if (isLoading || isTyping) return;
    
    try {
      setIsAnalyzingFile(true);
      setAttachedFile(file);
      
      // Create a user message for the file attachment
      const fileMessage = {
        id: Date.now(),
        type: 'user',
        content: `📎 Attached file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString(),
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      };
      
      // Add the file message to the current chat
      const currentChat = getCurrentChat();
      const updatedMessages = [...currentChat.messages, fileMessage];
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: updatedMessages }
          : chat
      ));
      
      // Update chat title if this is the first message
      if (currentChat.messages.length === 0) {
        updateChatTitle(currentChatId, `File Analysis: ${file.name}`);
      }
      
      // Now get AI response for the file analysis
      setIsLoading(true);
      
      try {
        // Analyze the file
        const analysis = await fileAnalysisService.analyzeFile(file, currentLanguage);
        
        // Get AI response for the file analysis
        const aiResponse = await aiService.getAIResponse(
          `Please analyze this file and provide insights: ${analysis.analysis}`,
          userId,
          'free',
          currentLanguage,
          true // This is a Sage AI request
        );
        
        // Create AI response message
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
          isTyping: false
        };
        
        // Add AI response to chat
        const finalMessages = [...updatedMessages, aiMessage];
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages }
            : chat
        ));
        
        // Update remaining messages count
        updateRemainingMessages();
        
      } catch (aiError) {
        // Show error message if AI analysis fails
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: `❌ File analysis failed: ${aiError.message}`,
          timestamp: new Date().toLocaleTimeString(),
          isTyping: false
        };
        
        const finalMessages = [...updatedMessages, errorMessage];
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages }
            : chat
        ));
      }
      
    } catch (error) {
      // Show error message
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: `❌ File upload failed: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        isTyping: false
      };
      
      const currentChat = getCurrentChat();
      const updatedMessages = [...currentChat.messages, errorMessage];
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: updatedMessages }
          : chat
      ));
    } finally {
      setIsAnalyzingFile(false);
      setIsLoading(false);
      setAttachedFile(null);
    }
  };

  const handleUpgradeToPro = () => {
    // Prevent upgrade action if AI is responding
    if (isLoading || isTyping) return;
    
    // Upgrade to Pro functionality (placeholder)
    alert('Upgrade to Pro to access unlimited chat history and advanced features!');
  };

  const currentChat = getCurrentChat();
  const visibleChats = isProUser ? chats : chats.slice(0, 2); // Limit to 2 chats for free users

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="admin" />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <button
              onClick={() => navigate('/admin/dashboard')}
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
              onClick={() => {
                console.log('🌐 Translation button clicked!');
                console.log('  - Current forceArabicResponse:', forceArabicResponse);
                setForceArabicResponse(!forceArabicResponse);
                console.log('  - New forceArabicResponse will be:', !forceArabicResponse);
              }}
              className={`p-2 rounded-lg transition-colors ${
                forceArabicResponse 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={forceArabicResponse ? t('admin.sageAI.arabicResponses.disable', 'Disable Arabic Responses') : t('admin.sageAI.arabicResponses.enable', 'Enable Arabic Responses')}
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
                  {isRTL ? "كيف يمكنني مساعدتك في الإدارة؟" : "How can I help you with administration?"}
                </h3>
                <p className={`text-gray-500 dark:text-gray-400 mb-6 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {isRTL ? "أنا هنا لمساعدتك في إدارة النظام والمستخدمين والدورات والأمان." : "I'm here to help you manage the system, users, courses, and security."}
                </p>
                
                {/* Arabic Response Indicator */}
                {forceArabicResponse && (
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className={`text-sm font-medium text-blue-700 dark:text-blue-300 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {t('admin.sageAI.arabicResponses.indicator', 'Responses will be in Arabic')}
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
                            <prompt.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <div>
                              <h4 className={`font-medium text-gray-600 dark:text-gray-400 text-sm ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>{prompt.title}</h4>
                                                              <p className={`text-gray-500 dark:text-gray-400 text-xs ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>{prompt.description}</p>
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
                  disabled={isAnalyzingFile}
                  className={`p-2 rounded-lg transition-colors ${
                    isAnalyzingFile 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 animate-pulse'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  title={
                    isAnalyzingFile 
                      ? t('instructor.sageAI.fileAnalysis.analyzingFile', 'Analyzing file...')
                      : isRTL ? "إرفاق ملف" : "Attach file"
                  }
                >
                  {isAnalyzingFile ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
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