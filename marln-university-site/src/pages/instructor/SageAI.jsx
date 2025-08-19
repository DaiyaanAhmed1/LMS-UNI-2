import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bot, Sparkles, BookOpen, Lightbulb, Target, Zap, Lock, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const availablePrompts = [
  { id: 1, title: 'Generate Quiz', description: 'Create a 10-question quiz from given topics', icon: Target, prompt: 'Generate a 10-question mixed quiz (MCQ + short answer) for the following topics: ' },
  { id: 2, title: 'Lecture Outline', description: 'Draft a 45-minute lecture outline with timings', icon: BookOpen, prompt: 'Draft a 45-minute lecture outline with section timings for: ' },
  { id: 3, title: 'Assignment Idea', description: 'Propose a practical assignment with rubric', icon: Lightbulb, prompt: 'Propose a practical assignment (with rubric and learning outcomes) for: ' }
];

const proPrompts = [
  { id: 4, title: 'Detect Plagiarism Patterns', description: 'Guidance on spotting common plagiarism patterns', icon: Sparkles },
  { id: 5, title: 'Code Feedback', description: 'AI feedback suggestions for coding assignments', icon: Zap },
  { id: 6, title: 'Rubric Optimizer', description: 'Optimize rubric criteria and weights', icon: BookOpen }
];

export default function InstructorSageAI() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handlePromptClick = (prompt) => {
    setInputMessage(prompt);
    setShowChat(true);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMessage = { id: Date.now(), type: 'user', content: inputMessage, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse = { id: Date.now() + 1, type: 'ai', content: generateAIResponse(inputMessage), timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200);
  };

  const generateAIResponse = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes('quiz')) return 'Here is a 10-question quiz outline with suggested answers and point values...';
    if (lower.includes('lecture')) return 'Lecture outline (45 min): 1) Intro (5m) 2) Concept A (10m) 3) Concept B (10m) 4) Activity (15m) 5) Wrap-up (5m).';
    if (lower.includes('assignment')) return 'Assignment idea: Build a mini-project demonstrating X. Rubric: Functionality(40%), Code Quality(30%), Documentation(20%), Presentation(10%).';
    return "I can help generate quizzes, lecture outlines, and assignments. Please specify the topic or course context.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('instructor.sageAI.title')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t('instructor.sageAI.subtitle')}</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Available Prompts Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('instructor.sageAI.sections.availablePrompts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePrompts.map((prompt) => (
                  <button key={prompt.id} onClick={() => handlePromptClick(prompt.prompt)} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left group">
                    <div className="flex items-center space-x-3 mb-3">
                      <prompt.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{prompt.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{prompt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* PRO Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('instructor.sageAI.sections.proFeatures')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proPrompts.map((prompt) => (
                  <div key={prompt.id} className="relative">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 opacity-60">
                      <div className="flex items-center space-x-3 mb-3">
                        <prompt.icon className="w-6 h-6 text-gray-500 dark:text-gray-500" />
                        <h3 className="font-semibold text-gray-600 dark:text-gray-400">{prompt.title}</h3>
                      </div>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">{prompt.description}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-4 py-2 rounded-full shadow-md font-semibold text-sm flex items-center gap-2 border border-purple-600 text-purple-700 bg-white/95 dark:bg-purple-700 dark:text-white">
                        <Lock className="w-4 h-4" />
                        {t('instructor.sageAI.sections.proBadge')}
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
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <button onClick={() => { setShowChat(false); setMessages([]); setInputMessage(''); }} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">{t('instructor.sageAI.chat.back')}</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('instructor.sageAI.chat.chatTitle')}</span>
            </div>
            <div className="w-16"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{message.timestamp}</div>
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

          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder={t('instructor.sageAI.chat.placeholder')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" rows={2} />
              </div>
              <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors duration-200">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 