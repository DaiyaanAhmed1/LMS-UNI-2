import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bot, Sparkles, BookOpen, Lightbulb, Target, Zap, Lock, X, Send, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  }
];

const proPrompts = [
  { id: 4, title: 'Advanced Analysis', description: 'Deep dive analysis of complex topics', icon: Sparkles },
  { id: 5, title: 'Code Review', description: 'Get detailed code reviews and suggestions', icon: Zap },
  { id: 6, title: 'Essay Writing', description: 'AI-powered essay writing assistance', icon: BookOpen },
  { id: 7, title: 'Research Assistant', description: 'Advanced research and citation help', icon: Lightbulb },
  { id: 8, title: 'Exam Prep', description: 'Comprehensive exam preparation tools', icon: Target },
  { id: 9, title: 'Project Guidance', description: 'Step-by-step project planning and guidance', icon: Zap }
];

export default function SageAI() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handlePromptClick = (prompt) => {
    setInputMessage(prompt);
    setShowChat(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (message) => {
    const responses = {
      'course summary': "Here's a comprehensive summary of your course topic:\n\n**Key Concepts:**\n• Fundamental principles and theories\n• Core methodologies and approaches\n• Essential frameworks and models\n\n**Main Points:**\n• Critical learning objectives\n• Important definitions and terminology\n• Key relationships between concepts\n\n**Important Details:**\n• Practical applications and examples\n• Common challenges and solutions\n• Best practices and recommendations\n\nThis summary covers the essential aspects of your course material. Would you like me to elaborate on any specific topic?",
      'study tips': 'Here are personalized study strategies for your subject:\n\n**Active Learning Techniques:**\n• Create mind maps and concept diagrams\n• Use the Feynman technique (explain to others)\n• Practice with flashcards and spaced repetition\n\n**Time Management:**\n• Use the Pomodoro technique (25-min focused sessions)\n• Schedule regular review sessions\n• Break complex topics into smaller chunks\n\n**Memory Enhancement:**\n• Connect new information to existing knowledge\n• Use mnemonic devices and acronyms\n• Practice retrieval through self-quizzing\n\n**Environment Optimization:**\n• Find a quiet, distraction-free study space\n• Use consistent study times\n• Take regular breaks to maintain focus',
      'practice questions': "Here are Python programming practice questions to test your understanding:\n\n**Multiple Choice Questions:**\n1. What is the output of `print(type([]))`?\n   A) <class 'list'>\n   B) <class 'array'>\n   C) <class 'sequence'>\n   D) <class 'collection'>\n\n2. Which method is used to add an element to the end of a list?\n   A) list.insert()\n   B) list.append()\n   C) list.add()\n   D) list.push()\n\n**Code Analysis Questions:**\n3. What will this code output?\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```\n\n4. Explain the difference between `==` and `is` in Python.\n\n**Problem-Solving Questions:**\n5. Write a function that finds the second largest number in a list.\n\n6. Create a program that counts the frequency of each character in a string.\n\n7. Implement a function to check if a string is a palindrome.\n\n**Debugging Questions:**\n8. Find and fix the bug in this code:\n```python\ndef calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)\n\nresult = calculate_average([1, 2, 3, 4, 5])\nprint(result)\n```\n\n**Concept Questions:**\n9. Explain the difference between a tuple and a list in Python.\n\n10. What are list comprehensions and provide an example?\n\n**Advanced Questions:**\n11. Write a decorator that measures the execution time of a function.\n\n12. Explain the concept of generators and create a simple generator function.\n\nWould you like me to provide the answers or create more specific questions for your Python topic?"
    };

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('summary')) return responses['course summary'];
    if (lowerMessage.includes('study') || lowerMessage.includes('tip')) return responses['study tips'];
    if (lowerMessage.includes('practice') || lowerMessage.includes('question')) return responses['practice questions'];
    
    return "I understand you're asking about your studies. I'm here to help with course summaries, study tips, practice questions, and general academic support. Could you please be more specific about what you need help with?";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4" id="sageai-header">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('student.sageAI.title')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t('student.sageAI.subtitle')}</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Available Prompts Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('student.sageAI.sections.availablePrompts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handlePromptClick(prompt.prompt)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <prompt.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{prompt.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{prompt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* PRO Prompts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('student.sageAI.sections.proFeatures')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proPrompts.map((prompt) => (
                  <div key={prompt.id} className="relative">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 blur-sm">
                      <div className="flex items-center space-x-3 mb-3">
                        <prompt.icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        <h3 className="font-semibold text-gray-400 dark:text-gray-500">{prompt.title}</h3>
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">{prompt.description}</p>
                    </div>
                    {/* PRO Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-gray-900/10 rounded-lg">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {t('student.sageAI.sections.proBadge')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => {
                setShowChat(false);
                setMessages([]);
                setInputMessage('');
              }}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">{t('student.sageAI.chat.back')}</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('student.sageAI.chat.chatTitle')}</span>
            </div>
            <div className="w-16"></div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('student.sageAI.chat.placeholder')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={2}
                />
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
