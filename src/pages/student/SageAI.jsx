import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bot, Sparkles, BookOpen, Lightbulb, Target, Zap, Lock, X, Send, MessageCircle, Plus, Mic, ArrowRight, Trash2, Paperclip, ChevronLeft, ChevronRight, Crown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

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

  const renderMarkdown = (text) => {
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
          return `<h3 class="text-lg font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}">${line.replace(/\*\*/g, '')}</h3>`;
        }
        // Lists
        if (line.trim().startsWith('•')) {
          return `<li class="${isRTL ? 'mr-4' : 'ml-4'}">${line.trim().substring(1)}</li>`;
        }
        // Code blocks
        if (line.includes('```')) {
          return `<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto ${isRTL ? 'text-right' : 'text-left'}"><code>${line.replace(/```/g, '')}</code></pre>`;
        }
        // Regular paragraphs
        if (line.trim() === '') {
          return '<br>';
        }
        return `<p class="mb-2 ${isRTL ? 'text-right' : 'text-left'}">${line}</p>`;
      })
      .join('');
  };

  return (
    <div 
      className={`prose dark:prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedContent) }}
    />
  );
};

export default function SageAI() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
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
    if (prompt === 'exam-roadmapping') {
      setShowExamSelection(true);
    } else {
      setInputMessage(prompt);
    }
  };

  const handleRoadmapClick = (certification) => {
    const roadmapPrompt = `I want to prepare for the ${certification.title} (${certification.subtitle}) certification. Can you help me create a study roadmap covering these topics: ${certification.topics.join(', ')}? The certification typically takes ${certification.duration} to complete and is ${certification.difficulty} level.`;
    setInputMessage(roadmapPrompt);
    setShowExamSelection(false);
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

    try {
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: generateAIResponse(currentInput),
          timestamp: new Date().toLocaleTimeString()
        };

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
      }, 1000);
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
                
                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availablePrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptClick(prompt.prompt)}
                      className={`p-3 ${isRTL ? 'text-right' : 'text-left'} border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group`}
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
                className={`w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'pr-4 pl-24' : 'pr-24'}`}
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
                    onClick={handleUpgradeToPro}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
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