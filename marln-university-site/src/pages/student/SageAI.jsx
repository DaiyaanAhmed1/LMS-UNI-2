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
    title: 'Course Summary',
    description: 'Get a comprehensive summary of any course topic',
    icon: BookOpen,
    prompt: "Please provide a comprehensive summary of the course topic I'm studying. Include key concepts, main points, and important details."
  },
  {
    id: 2,
    title: 'Study Tips',
    description: 'Receive personalized study strategies and tips',
    icon: Lightbulb,
    prompt: 'I need personalized study strategies and tips for my current subject. Please provide effective study methods and techniques.'
  },
  {
    id: 3,
    title: 'Practice Questions',
    description: 'Generate practice questions for any subject',
    icon: Target,
    prompt: 'Please generate practice questions for my current subject to help me test my understanding and prepare for exams.'
  },
  {
    id: 4,
    title: 'Exam Roadmapping',
    description: 'Get study roadmaps for networking certifications',
    icon: BookOpen,
    prompt: 'exam-roadmapping'
  }
];

const proPrompts = [
  { id: 4, title: 'Advanced Analysis', description: 'Deep dive analysis of complex topics', icon: Sparkles },
  { id: 5, title: 'Code Review', description: 'Get detailed code reviews and suggestions', icon: Zap }
];

const certificationRoadmaps = [
  {
    id: 1,
    title: 'Cisco CCNA',
    subtitle: 'Cisco Certified Network Associate – 200-301',
    icon: BookOpen,
    description: 'Master networking fundamentals, IP connectivity, security, and automation',
    topics: ['Network Fundamentals', 'IP Connectivity', 'IP Services', 'Security Fundamentals', 'Automation & Programmability'],
    duration: '3-6 months',
    difficulty: 'Intermediate'
  },
  {
    id: 2,
    title: 'CompTIA Network+',
    subtitle: 'N10-008',
    icon: BookOpen,
    description: 'Essential networking concepts for IT professionals',
    topics: ['Networking Concepts', 'Infrastructure', 'Network Operations', 'Network Security', 'Network Troubleshooting'],
    duration: '2-4 months',
    difficulty: 'Beginner to Intermediate'
  },
  {
    id: 3,
    title: 'Juniper JNCIA-Junos',
    subtitle: 'JN0-104',
    icon: BookOpen,
    description: 'Juniper Networks Certified Associate - Junos',
    topics: ['Junos OS Fundamentals', 'User Interface Options', 'Configuration Basics', 'Operational Monitoring', 'Routing Fundamentals'],
    duration: '2-3 months',
    difficulty: 'Beginner'
  },
  {
    id: 4,
    title: 'More courses',
    subtitle: '',
    icon: BookOpen,
    description: 'Additional certification courses available with PRO',
    topics: ['Cloud Computing', 'Cybersecurity', 'Data Science', 'DevOps', 'Machine Learning'],
    duration: 'Varies',
    difficulty: 'All Levels',
    isPro: true
  }
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
    <div className={`prose dark:prose-invert max-w-none markdown-content ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
            <ol className="list-decimal list-inside space-y-4 my-4" {...props}>
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

export default function SageAI() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showExamSelection, setShowExamSelection] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isProUser, setIsProUser] = useState(false); // Set to false for free users
  const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false);
  const [hasUpgradeMessage, setHasUpgradeMessage] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(aiService.sageAILimits.free); // Track remaining messages
  const [forceArabicResponse, setForceArabicResponse] = useState(false); // Force all responses in Arabic
  const [attachedFile, setAttachedFile] = useState(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('sageAI-chats');
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
      localStorage.setItem('sageAI-chats', JSON.stringify(chats));
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
  };

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
    
    if (prompt === 'exam-roadmapping') {
      setShowExamSelection(true);
    } else {
      setInputMessage(prompt);
    }
  };

  const handleRoadmapClick = (certification) => {
    // Prevent setting roadmap if AI is responding
    if (isLoading || isTyping) return;
    
    const roadmapPrompt = `I want to prepare for the ${certification.title} (${certification.subtitle}) certification. Can you help me create a study roadmap covering these topics: ${certification.topics.join(', ')}? The certification typically takes ${certification.duration} to complete and is ${certification.difficulty} level.`;
    setInputMessage(roadmapPrompt);
    setShowExamSelection(false);
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

    try {
      // Use consistent user ID for rate limiting
      const userType = 'free'; // Free tier for demo
      const language = forceArabicResponse ? 'ar' : (currentLanguage === 'ar' ? 'ar' : 'en');

      console.log('🔍 Student SageAI Debug Info:');
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

      // Check remaining Sage AI requests
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
    const responses = {
      'course summary': "Here's a comprehensive summary of your course topic:\n\n**Key Concepts:**\n• Fundamental principles and theories\n• Core methodologies and approaches\n• Essential frameworks and models\n\n**Main Points:**\n• Critical learning objectives\n• Important definitions and terminology\n• Key relationships between concepts\n\n**Important Details:**\n• Practical applications and examples\n• Common challenges and solutions\n• Best practices and recommendations\n\nThis summary covers the essential aspects of your course material. Would you like me to elaborate on any specific topic?",
      'study tips': 'Here are personalized study strategies for your subject:\n\n**Active Learning Techniques:**\n• Create mind maps and concept diagrams\n• Use the Feynman technique (explain to others)\n• Practice with flashcards and spaced repetition\n\n**Time Management:**\n• Use the Pomodoro technique (25-min focused sessions)\n• Schedule regular review sessions\n• Break complex topics into smaller chunks\n\n**Memory Enhancement:**\n• Connect new information to existing knowledge\n• Use mnemonic devices and acronyms\n• Practice retrieval through self-quizzing\n\n**Environment Optimization:**\n• Find a quiet, distraction-free study space\n• Use consistent study times\n• Take regular breaks to maintain focus',
      'practice questions': "Here are Python programming practice questions to test your understanding:\n\n**Multiple Choice Questions:**\n1. What is the output of `print(type([]))`?\n   A) <class 'list'>\n   B) <class 'array'>\n   C) <class 'sequence'>\n   D) <class 'collection'>\n\n2. Which method is used to add an element to the end of a list?\n   A) list.insert()\n   B) list.append()\n   C) list.add()\n   D) list.push()\n\n**Code Analysis Questions:**\n3. What will this code output?\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```\n\n4. Explain the difference between `==` and `is` in Python.\n\n**Problem-Solving Questions:**\n5. Write a function that finds the second largest number in a list.\n\n6. Create a program that counts the frequency of each character in a string.\n\n7. Implement a function to check if a string is a palindrome.\n\n**Debugging Questions:**\n8. Find and fix the bug in this code:\n```python\ndef calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)\n\nresult = calculate_average([1, 2, 3, 4, 5])\nprint(result)\n```\n\n**Concept Questions:**\n9. Explain the difference between a tuple and a list in Python.\n\n10. What are list comprehensions and provide an example?\n\n**Advanced Questions:**\n11. Write a decorator that measures the execution time of a function.\n\n12. Explain the concept of generators and create a simple generator function.\n\nWould you like me to provide the answers or create more specific questions for your Python topic?"
    };

    const certificationResponses = {
      'cisco ccna': `**Cisco CCNA (200-301) Study Roadmap** 🌟

**📋 Exam Overview:**
• **Duration:** 120 minutes
• **Questions:** 100-120 questions
• **Passing Score:** 825/1000
• **Cost:** $300 USD

**📚 Study Plan (3-6 months):**

**Month 1: Network Fundamentals**
• OSI Model (7 layers) and TCP/IP stack
• IPv4 addressing and subnetting
• Network media types and topologies
• Ethernet switching concepts
• **Practice:** Subnetting exercises daily

**Month 2: Network Access & IP Connectivity**
• VLANs and trunking
• Inter-VLAN routing
• Static and dynamic routing
• OSPF configuration and troubleshooting
• **Practice:** Packet Tracer labs

**Month 3: IP Services & Security**
• DHCP, DNS, NTP, SNMP
• Access Control Lists (ACLs)
• Security fundamentals
• Wireless concepts
• **Practice:** Security lab scenarios

**Month 4: Automation & Programmability**
• Network automation concepts
• REST APIs and JSON
• Python basics for networking
• SDN and cloud concepts
• **Practice:** Automation scripts

**🎯 Key Topics to Master:**
• **Subnetting:** Practice until you can do it in your sleep
• **OSPF:** Understand areas, LSAs, and neighbor states
• **VLANs:** Know trunking protocols and inter-VLAN routing
• **ACLs:** Standard vs Extended, placement strategies
• **Troubleshooting:** Systematic approach to network issues

**📖 Recommended Resources:**
• Official Cisco CCNA Official Cert Guide
• Cisco Packet Tracer (free)
• Boson ExSim practice exams
• CBT Nuggets or INE video courses
• Reddit r/ccna community

**💡 Pro Tips:**
• Join study groups and forums
• Use multiple learning resources
• Practice with real equipment when possible
• Take practice exams regularly
• Focus on understanding concepts, not just memorizing

**🚀 Next Steps After CCNA:**
• CCNP Enterprise or Security
• Specialize in wireless, security, or automation
• Gain hands-on experience in networking roles`,

      'comptia network+': `**CompTIA Network+ (N10-008) Study Roadmap** 🌟

**📋 Exam Overview:**
• **Duration:** 90 minutes
• **Questions:** 90 questions
• **Passing Score:** 720/900
• **Cost:** $338 USD

**📚 Study Plan (2-4 months):**

**Month 1: Networking Concepts**
• OSI model and TCP/IP protocols
• Network topologies and architectures
• Cloud concepts and virtualization
• Network services and applications
• **Practice:** Network diagramming

**Month 2: Infrastructure & Operations**
• Cabling standards and media types
• Network devices and their functions
• Routing and switching concepts
• Network monitoring and management
• **Practice:** Network simulation tools

**Month 3: Security & Troubleshooting**
• Network security concepts
• Common threats and vulnerabilities
• Troubleshooting methodologies
• Documentation and change management
• **Practice:** Security scenarios

**🎯 Key Topics to Master:**
• **Network Protocols:** TCP, UDP, ICMP, ARP, DHCP, DNS
• **Cabling:** Copper vs fiber, standards, and testing
• **Network Devices:** Routers, switches, firewalls, access points
• **Security:** Authentication, encryption, VPNs, firewalls
• **Troubleshooting:** Systematic approach to network issues

**📖 Recommended Resources:**
• CompTIA Network+ Official Study Guide
• Professor Messer's free video course
• Jason Dion's practice exams
• Network+ subreddit and forums
• Packet Tracer or GNS3 for labs

**💡 Pro Tips:**
• Focus on vendor-neutral concepts
• Understand the "why" behind concepts
• Practice with network simulation tools
• Join CompTIA study groups
• Take multiple practice exams

**🚀 Next Steps After Network+:**
• CompTIA Security+ for cybersecurity
• CCNA for Cisco-specific knowledge
• Specialize in wireless or security
• Pursue vendor-specific certifications`,

      'juniper jncia': `**Juniper JNCIA-Junos (JN0-104) Study Roadmap** 🌟

**📋 Exam Overview:**
• **Duration:** 90 minutes
• **Questions:** 65 questions
• **Passing Score:** 70%
• **Cost:** $200 USD

**📚 Study Plan (2-3 months):**

**Month 1: Junos OS Fundamentals**
• Junos OS architecture and features
• User interface options (CLI, J-Web, API)
• Configuration basics and hierarchy
• Operational monitoring and logging
• **Practice:** vSRX virtual lab environment

**Month 2: Routing & Security**
• Routing fundamentals and protocols
• Static and dynamic routing
• Firewall filters and security policies
• Network Address Translation (NAT)
• **Practice:** Routing lab scenarios

**🎯 Key Topics to Master:**
• **Junos CLI:** Navigation, configuration modes, commit process
• **Configuration Hierarchy:** Understanding the tree structure
• **Routing Protocols:** OSPF, BGP, static routing
• **Security:** Firewall filters, security policies, NAT
• **Troubleshooting:** Show commands, logging, monitoring

**📖 Recommended Resources:**
• Juniper Learning Portal (free courses)
• JNCIA-Junos Official Study Guide
• vSRX virtual lab environment
• Juniper Day One books (free)
• Juniper community forums

**💡 Pro Tips:**
• Use the free Juniper Learning Portal extensively
• Practice with vSRX virtual routers
• Understand Junos configuration hierarchy
• Focus on operational commands
• Join Juniper certification communities

**🚀 Next Steps After JNCIA-Junos:**
• JNCIS-ENT for enterprise routing
• JNCIS-SEC for security specialization
• JNCIP and JNCIE for advanced levels
• Combine with other vendor certifications`
    };

    const lowerMessage = message.toLowerCase();
    
    // Check for certification roadmap requests
    if (lowerMessage.includes('cisco ccna') || lowerMessage.includes('200-301')) {
      return certificationResponses['cisco ccna'];
    }
    if (lowerMessage.includes('comptia network+') || lowerMessage.includes('n10-008')) {
      return certificationResponses['comptia network+'];
    }
    if (lowerMessage.includes('juniper jncia') || lowerMessage.includes('jn0-104')) {
      return certificationResponses['juniper jncia'];
    }
    
    // Check for other requests
    if (lowerMessage.includes('summary')) return responses['course summary'];
    if (lowerMessage.includes('study') || lowerMessage.includes('tip')) return responses['study tips'];
    if (lowerMessage.includes('practice') || lowerMessage.includes('question')) return responses['practice questions'];
    
    // Check if this is a follow-up message after initial help
    if (hasShownInitialHelp) {
      setHasUpgradeMessage(true); // Set flag when upgrade message is sent
      return `**Upgrade to Pro Version** 🌟

I'd love to help you further with your studies! However, to continue our conversation and access unlimited AI assistance, you'll need to upgrade to our Pro version.

**Pro Version Benefits:**
• **Unlimited Conversations** - Chat as much as you want
• **Advanced AI Features** - More detailed and personalized responses
• **Chat History** - Access to all your previous conversations
• **Priority Support** - Get help faster when you need it
• **Advanced Analytics** - Track your learning progress

**Upgrade Now** to unlock the full potential of Sage AI and take your studies to the next level! 🚀

*Click the "Upgrade to Pro" button in the chat history to get started.*`;
    }
    
    // Initial help message
    setHasShownInitialHelp(true);
    return "I understand you're asking about your studies. I'm here to help with course summaries, study tips, practice questions, certification roadmaps, and general academic support. Could you please be more specific about what you need help with?";
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

  // Use a consistent user ID for rate limiting
  const userId = 'student-user-123'; // Consistent user ID

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

  const currentChat = getCurrentChat();
  const visibleChats = isProUser ? chats : chats.slice(0, 2); // Limit to 2 chats for free users

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="student" />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isRTL ? "العودة إلى لوحة التحكم" : "Back to Dashboard"}
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
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
                      // Prevent reset if AI is responding
                      if (isLoading || isTyping) return;
                      
                      aiService.resetSageAILimits();
                      setRemainingMessages(aiService.sageAILimits.free);
                      alert('Rate limits reset! You can now chat with AI again.');
                    }}
                    disabled={isLoading || isTyping}
                    className={`ml-2 p-1 rounded transition-colors ${
                      isLoading || isTyping
                        ? 'text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed'
                        : 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200'
                    }`}
                    title={
                      isLoading || isTyping
                        ? (isRTL ? "AI يستجيب..." : "AI is responding...")
                        : isRTL ? "إعادة تعيين للاختبار" : "Reset for testing"
                    }
                  >
                    <Zap className="w-3 h-3" />
                  </button>
                </div>
              )
            )}
            
            {/* New Chat Button */}
            <button
              onClick={() => {
                // Prevent new chat if AI is responding
                if (isLoading || isTyping) return;
                createNewChat();
              }}
              disabled={isLoading || isTyping}
              className={`p-2 rounded-lg transition-colors ${
                isLoading || isTyping
                  ? 'text-gray-300 dark:text-gray-500 opacity-50 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={
                isLoading || isTyping
                  ? (isRTL ? "AI يستجيب..." : "AI is responding...")
                  : isRTL ? "بدء محادثة جديدة" : "Start New Chat"
              }
            >
              <Plus className="w-5 h-5" />
            </button>
            
            {/* Chat History Toggle */}
            <button
              onClick={() => {
                // Prevent toggle if AI is responding
                if (isLoading || isTyping) return;
                setShowChatHistory(!showChatHistory);
              }}
              disabled={isLoading || isTyping}
              className={`p-2 rounded-lg transition-colors ${
                isLoading || isTyping
                  ? 'text-gray-300 dark:text-gray-500 opacity-50 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={
                isLoading || isTyping
                  ? (isRTL ? "AI يستجيب..." : "AI is responding...")
                  : showChatHistory ? (isRTL ? 'إخفاء سجل المحادثات' : 'Hide Chat History') : (isRTL ? 'عرض سجل المحادثات' : 'Show Chat History')
              }
            >
              {showChatHistory ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            
            {/* Arabic Response Toggle */}
            <button
              onClick={() => {
                // Prevent toggle if AI is responding
                if (isLoading || isTyping) return;
                
                console.log('🌐 Translation button clicked!');
                console.log('  - Current forceArabicResponse:', forceArabicResponse);
                setForceArabicResponse(!forceArabicResponse);
                console.log('  - New forceArabicResponse will be:', !forceArabicResponse);
              }}
              disabled={isLoading || isTyping}
              className={`p-2 rounded-lg transition-colors ${
                isLoading || isTyping
                  ? 'text-gray-300 dark:text-gray-500 opacity-50 cursor-not-allowed'
                  : forceArabicResponse 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={
                isLoading || isTyping
                  ? (isRTL ? "AI يستجيب..." : "AI is responding...")
                  : forceArabicResponse ? t('student.sageAI.arabicResponses.disable', 'Disable Arabic Responses') : t('student.sageAI.arabicResponses.enable', 'Enable Arabic Responses')
              }
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
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-2xl mx-auto px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/40 dark:to-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse hover:animate-none hover:scale-110 transition-all duration-300 hover:shadow-xl">
                  <Bot className="w-12 h-12 text-green-600 dark:text-green-400 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {isRTL ? "كيف يمكنني مساعدتك اليوم؟" : "How can I help you today?"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  {isRTL ? "أنا هنا لمساعدتك في دراستك واحتياجاتك الأكاديمية." : "I'm here to assist with your studies and academic needs."}
                </p>
                
                {/* Arabic Response Indicator */}
                {forceArabicResponse && (
                  <div className="mb-8 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className={`text-sm font-medium text-blue-700 dark:text-blue-300 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {t('student.sageAI.arabicResponses.indicator', 'Responses will be in Arabic')}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availablePrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptClick(prompt.prompt)}
                      disabled={isLoading || isTyping}
                      className={`p-3 ${isRTL ? 'text-right' : 'text-left'} border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 group ${
                        isLoading || isTyping
                          ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                          : 'hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                        <prompt.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{prompt.title}</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{prompt.description}</p>
                        </div>
                        <ArrowRight className={`w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                      </div>
                    </button>
                  ))}
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
                      : 'bg-green-500'
                  }`}>
                    {message.type === 'user' ? (
                      <div className="w-5 h-5 text-white text-sm font-medium">U</div>
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                      {message.type === 'ai' ? (
                        <MarkdownRenderer 
                          content={message.content} 
                          isTyping={isTyping && message.id === currentChat.messages[currentChat.messages.length - 1]?.id}
                        />
                      ) : (
                        <div className={`whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
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
                disabled={isLoading || isTyping}
                className={`w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'pr-4 pl-24' : 'pr-24'} ${(isLoading || isTyping) ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
                rows={1}
                style={{ minHeight: '52px', maxHeight: '200px' }}
              />
              
              {/* Action Buttons */}
              <div className={`absolute bottom-2 flex items-center ${isRTL ? 'left-2 space-x-reverse space-x-1' : 'right-2 space-x-1'}`}>
                <button
                  onClick={handleFileAttachment}
                  disabled={isAnalyzingFile || isLoading || isTyping}
                  className={`p-2 rounded-lg transition-colors ${
                    isAnalyzingFile || isLoading || isTyping
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 animate-pulse opacity-50 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  title={
                    isAnalyzingFile 
                      ? t('student.sageAI.fileAnalysis.analyzingFile', 'Analyzing file...')
                      : isLoading || isTyping
                      ? (isRTL ? "AI يستجيب..." : "AI is responding...")
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
                  disabled={isLoading || isTyping}
                  className={`p-2 rounded-lg transition-colors ${
                    isLoading || isTyping
                      ? 'text-gray-300 dark:text-gray-500 opacity-50 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  title={
                    isLoading || isTyping
                      ? (isRTL ? "AI يستجيب..." : "AI is responding...")
                      : isRTL ? "إدخال صوتي" : "Voice input"
                  }
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:text-gray-300 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
                  currentChatId === chat.id ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                } ${isLoading || isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  // Prevent chat switching if AI is responding
                  if (isLoading || isTyping) return;
                  setCurrentChatId(chat.id);
                }}
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
                      // Prevent delete if AI is responding
                      if (isLoading || isTyping) return;
                      deleteChat(chat.id);
                    }}
                    disabled={isLoading || isTyping}
                    className={`p-1 rounded transition-colors ${
                      isLoading || isTyping
                        ? 'text-gray-300 dark:text-gray-500 opacity-50 cursor-not-allowed'
                        : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                    title={
                      isLoading || isTyping
                        ? (isRTL ? "AI يستجيب..." : "AI is responding...")
                        : isRTL ? "حذف المحادثة" : "Delete chat"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Pro Upgrade Prompt */}
            {!isProUser && (chats.length > 2 || hasUpgradeMessage) && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-2`}>
                    <Crown className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                    onClick={() => {
                      // Prevent upgrade if AI is responding
                      if (isLoading || isTyping) return;
                      handleUpgradeToPro();
                    }}
                    disabled={isLoading || isTyping}
                    className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
                      isLoading || isTyping
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                    }`}
                  >
                    {isLoading || isTyping ? (isRTL ? "AI يستجيب..." : "AI is responding...") : (isRTL ? "ترقية الآن" : "Upgrade Now")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Chat Button - Bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={createNewChat}
              className={`w-full flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200`}
            >
              <Plus className="w-5 h-5" />
              <span>{isRTL ? "محادثة جديدة" : "New Chat"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Exam Selection Modal */}
      {showExamSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className={`flex items-center ${isRTL ? 'justify-between' : 'justify-between'} mb-4`}>
              <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? "اختر الشهادة" : "Choose Certification"}
              </h3>
              <button
                onClick={() => setShowExamSelection(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isRTL ? "إغلاق النافذة" : "Close modal"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {certificationRoadmaps.map((certification) => (
                <div key={certification.id} className="relative">
                  <button
                    onClick={() => !certification.isPro && handleRoadmapClick(certification)}
                    disabled={certification.isPro}
                    className={`w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      certification.isPro 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={certification.isPro ? (isRTL ? 'متاح مع النسخة المميزة' : 'Available with PRO version') : (isRTL ? `اختر ${certification.title}` : `Select ${certification.title}`)}
                  >
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <certification.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{certification.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{certification.subtitle}</p>
                      </div>
                    </div>
                  </button>
                  {certification.isPro && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-gray-900/10 rounded-lg">
                      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg font-semibold text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        PRO
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}