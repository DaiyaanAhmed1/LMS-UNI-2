// AI Service for Sage AI Integration
// Simple, deployment-friendly AI integration with rate limiting

class AIService {
  constructor() {
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    this.useGemini = import.meta.env.VITE_USE_GEMINI === 'true';
    this.useDeepSeek = import.meta.env.VITE_USE_DEEPSEEK === 'true';
    
    console.log('🔧 AI Service Configuration:');
    console.log('  - OpenAI Key length:', this.openaiKey.length);
    console.log('  - Gemini Key length:', this.geminiKey.length);
    console.log('  - DeepSeek Key length:', this.deepseekKey.length);
    console.log('  - Use Gemini:', this.useGemini);
    console.log('  - Use DeepSeek:', this.useDeepSeek);
    
    this.openaiURL = 'https://api.openai.com/v1/chat/completions';
    this.geminiURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    this.deepseekURL = 'https://openrouter.ai/api/v1/chat/completions';
    

    
    this.rateLimit = {
      free: { requests: 200, window: 3600000 }, // 200 requests per hour for testing
      pro: { requests: 1000, window: 3600000 } // 1000 requests per hour
    };
    
    // Sage AI specific limits
    this.sageAILimits = {
      free: 20, // 20 free Sage AI chats
      pro: 1000 // Unlimited for PRO
    };
    this.userRequests = new Map(); // Track user requests
    this.sageAIRequests = new Map(); // Track Sage AI specific requests
    
    // Initialize Sage AI requests from localStorage
    this.initializeSageAIFromStorage();
  }

  // Check if user has exceeded rate limit
  checkRateLimit(userId, userType = 'free') {
    const now = Date.now();
    const limit = this.rateLimit[userType];
    
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }
    
    const userRequests = this.userRequests.get(userId);
    const recentRequests = userRequests.filter(time => now - time < limit.window);
    
    if (recentRequests.length >= limit.requests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    this.userRequests.set(userId, recentRequests);
    return true;
  }



  // Get remaining messages for user (without consuming)
  getRemainingMessages(userId, userType = 'free') {
    const now = Date.now();
    const limit = this.rateLimit[userType];
    
    if (!this.userRequests.has(userId)) {
      return limit.requests;
    }
    
    const userRequests = this.userRequests.get(userId);
    const recentRequests = userRequests.filter(time => now - time < limit.window);
    
    return Math.max(0, limit.requests - recentRequests.length);
  }

  // Initialize Sage AI requests from localStorage
  initializeSageAIFromStorage() {
    try {
      const stored = localStorage.getItem('sageAIRequests');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.sageAIRequests = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('⚠️ Failed to load Sage AI requests from localStorage:', error);
    }
  }

  // Save Sage AI requests to localStorage
  saveSageAIToStorage() {
    try {
      const data = Object.fromEntries(this.sageAIRequests);
      localStorage.setItem('sageAIRequests', JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Failed to save Sage AI requests to localStorage:', error);
    }
  }

  // Check Sage AI specific limit
  checkSageAILimit(userId, userType = 'free') {
    const limit = this.sageAILimits[userType];
    
    if (!this.sageAIRequests.has(userId)) {
      this.sageAIRequests.set(userId, 0);
    }
    
    const usedRequests = this.sageAIRequests.get(userId);
    
    if (usedRequests >= limit) {
      return false;
    }
    
    // Increment usage
    this.sageAIRequests.set(userId, usedRequests + 1);
    
    // Save to localStorage after incrementing
    this.saveSageAIToStorage();
    return true;
  }

  // Get remaining Sage AI messages
  getRemainingSageAIMessages(userId, userType = 'free') {
    const limit = this.sageAILimits[userType];
    
    if (!this.sageAIRequests.has(userId)) {
      return limit;
    }
    
    const usedRequests = this.sageAIRequests.get(userId);
    return Math.max(0, limit - usedRequests);
  }



  // Get AI response with fallback
  async getAIResponse(message, userId, userType = 'free', language = 'en', isSageAI = false) {
    
    try {
      // Check Sage AI specific limit if this is a Sage AI request
      if (isSageAI && !this.checkSageAILimit(userId, userType)) {
        return this.getProUpgradeMessage(userType, language, 'sage_ai_limit');
      }
      
      // Check overall rate limit
      if (!this.checkRateLimit(userId, userType)) {
        return this.getProUpgradeMessage(userType, language);
      }

      // Check if API key is available
      let apiKey, serviceName;
      if (this.useDeepSeek) {
        apiKey = this.deepseekKey;
        serviceName = 'DeepSeek';
      } else if (this.useGemini) {
        apiKey = this.geminiKey;
        serviceName = 'Gemini';
      } else {
        apiKey = this.openaiKey;
        serviceName = 'OpenAI';
      }
      
      if (!apiKey || apiKey === 'your_deepseek_api_key_here' || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_openai_api_key_here') {
        return this.getFallbackResponse(message, language);
      }

      // Prepare prompt based on language
      const systemPrompt = this.getSystemPrompt(language);
      
      // Add Arabic instruction to user message if language is Arabic
      let userMessage = message;
      if (language === 'ar') {
        userMessage = `Please respond in Arabic language only: ${message}`;
      }
      
      let response;
      
      if (this.useDeepSeek) {
        // Use OpenRouter DeepSeek API
        const deepseekBody = {
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7
        };
        
        response = await fetch(this.deepseekURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://marln-university.com',
            'X-Title': 'MarLn University LMS'
          },
          body: JSON.stringify(deepseekBody)
        });
      } else if (this.useGemini) {
        // Use Gemini API
        const geminiBody = {
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${userMessage}`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
            topP: 0.8,
            topK: 40
          }
        };
        
        response = await fetch(`${this.geminiURL}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(geminiBody)
        });
      } else {
        // Use OpenAI API
        response = await fetch(this.openaiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('Response Status:', response.status);
        console.error('Response Headers:', response.headers);
        
        // Check if it's a rate limit error (429)
        if (response.status === 429) {
          console.log('🚨 API Rate limit hit, showing PRO upgrade message');
          return this.getProUpgradeMessage(userType, language, 'api_rate_limit');
        }
        
        // Check if it's an authentication error (401)
        if (response.status === 401) {
          console.log('🚨 API Authentication failed, trying fallback response');
          return this.getFallbackResponse(message, language);
        }
        
        // Try to parse error for better debugging
        try {
          const errorData = JSON.parse(errorText);
          console.error('Parsed Error:', errorData);
        } catch (e) {
          console.error('Raw Error Text:', errorText);
        }
        
        // For other errors, use fallback instead of throwing
        console.log('🚨 API Error, using fallback response');
        return this.getFallbackResponse(message, language);
      }

      const data = await response.json();
      
      // Extract response based on API
      let aiResponse;
      if (this.useDeepSeek) {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          aiResponse = data.choices[0].message.content;
        } else {
          console.error('Unexpected DeepSeek response structure:', data);
          throw new Error('Invalid DeepSeek response structure');
        }
      } else if (this.useGemini) {
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          aiResponse = data.candidates[0].content.parts[0].text;
        } else {
          console.error('Unexpected Gemini response structure:', data);
          throw new Error('Invalid Gemini response structure');
        }
      } else {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          aiResponse = data.choices[0].message.content;
        } else {
          console.error('Unexpected OpenAI response structure:', data);
          throw new Error('Invalid OpenAI response structure');
        }
      }

      return aiResponse;

    } catch (error) {
      console.error('AI Service Error Details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if it's a network or API error that might benefit from PRO upgrade
      if (error.message.includes('429') || error.message.includes('rate limit') || error.message.includes('too many requests')) {
        console.log('🚨 Rate limit error detected, showing PRO upgrade message');
        return this.getProUpgradeMessage(userType, language, 'api_rate_limit');
      }
      
      // For other errors, use fallback
      return this.getFallbackResponse(message, language);
    }
  }

  // Get system prompt based on language
  getSystemPrompt(language) {
    const prompts = {
      en: `You are Sage AI, an intelligent educational assistant for Marln University. 
      Help students with their studies, provide clear explanations, and offer helpful advice. 
      Keep responses concise and educational.`,
      
      ar: `أنت Sage AI، مساعد تعليمي ذكي لجامعة Marln. 
      ساعد الطلاب في دراستهم، وقدم شروحات واضحة، وقدم نصائح مفيدة. 
      اجعل الردود مختصرة وتعليمية.
      
      IMPORTANT: You MUST respond in Arabic language only. All your responses should be in Arabic, regardless of the user's input language. Use proper Arabic grammar, vocabulary, and cultural context appropriate for educational settings.`
    };
    
    return prompts[language] || prompts.en;
  }

  // PRO upgrade messages for rate limits and API errors
  getProUpgradeMessage(userType, language = 'en', reason = 'rate_limit') {
    const messages = {
      en: {
        sage_ai_limit: `🚀 **Sage AI Limit Reached! Upgrade to PRO for unlimited Sage AI chats!**\n\nYou've used all ${this.sageAILimits.free} free Sage AI chats. PRO users get:\n\n• **${this.sageAILimits.pro} Sage AI chats** (vs ${this.sageAILimits.free})\n• **Unlimited overall AI requests**\n• **Priority access** to all AI services\n• **Advanced features** not available in free tier\n\n💎 **PRO Sage AI Benefits:**\n• ${this.sageAILimits.pro} Sage AI chats\n• No Sage AI limits\n• Priority processing\n• Advanced educational tools\n\nUpgrade to PRO for unlimited Sage AI access!`,
        
        rate_limit: `🚀 **Upgrade to PRO for unlimited AI assistance!**\n\nYou've reached the free tier limit (${this.rateLimit.free.requests} messages per hour). Upgrade to PRO to continue chatting with unlimited messages and access advanced features like:\n\n• **Plagiarism Detection Patterns** - Spot common cheating techniques\n• **Code Feedback Suggestions** - AI-powered code review assistance\n• **Rubric Optimization** - Optimize grading criteria and weights\n• **Student Analytics** - Analyze performance patterns\n• **Extended Chat Sessions** - Unlimited conversations\n\n💎 **PRO Features:**\n• Unlimited AI conversations\n• Advanced educational tools\n• Priority support\n• Custom prompt templates\n• Student performance insights\n\nClick the PRO badge to upgrade now!`,
        
        api_rate_limit: `🤖 **AI is currently busy! Upgrade to PRO for priority access!**\n\nOur AI service is experiencing high demand. PRO users get:\n\n• **Priority access** to AI responses\n• **Unlimited requests** - no rate limits\n• **Faster response times**\n• **Advanced features** not available in free tier\n• **24/7 priority support**\n\n💎 **PRO Benefits:**\n• Skip the queue\n• Unlimited AI conversations\n• Advanced educational tools\n• Custom AI models\n• Student analytics\n\nUpgrade now to never wait for AI responses again!`,
        
        default: `🚀 **Upgrade to PRO for the best AI experience!**\n\nGet unlimited access to advanced AI features and never worry about limits again.\n\n💎 **PRO Features:**\n• Unlimited AI conversations\n• Advanced educational tools\n• Priority support\n• Custom prompt templates\n• Student performance insights`
      },
      ar: {
        rate_limit: `🚀 **ارتقِ إلى PRO للحصول على مساعدة ذكية غير محدودة!**\n\nلقد وصلت إلى حد الطبقة المجانية (${this.rateLimit.free.requests} رسالة في الساعة). ارتقِ إلى PRO للاستمرار في الدردشة مع رسائل غير محدودة والوصول إلى ميزات متقدمة مثل:\n\n• **أنماط اكتشاف الانتحال** - اكتشف تقنيات الغش الشائعة\n• **اقتراحات مراجعة الكود** - مساعدة مراجعة الكود بالذكاء الاصطناعي\n• **تحسين المعايير** - تحسين معايير التقييم والأوزان\n• **تحليلات الطلاب** - تحليل أنماط الأداء\n• **جلسات دردشة ممتدة** - محادثات غير محدودة\n\n💎 **ميزات PRO:**\n• محادثات ذكية غير محدودة\n• أدوات تعليمية متقدمة\n• دعم ذو أولوية\n• قوالب توجيه مخصصة\n• رؤى أداء الطلاب\n\nانقر على شارة PRO للترقية الآن!`,
        
        api_rate_limit: `🤖 **الذكاء الاصطناعي مشغول حالياً! ارتقِ إلى PRO للوصول ذو الأولوية!**\n\nخدمة الذكاء الاصطناعي لدينا تعاني من طلب مرتفع. مستخدمو PRO يحصلون على:\n\n• **وصول ذو أولوية** للردود الذكية\n• **طلبات غير محدودة** - بدون حدود معدل\n• **أوقات استجابة أسرع**\n• **ميزات متقدمة** غير متوفرة في الطبقة المجانية\n• **دعم ذو أولوية على مدار الساعة**\n\n💎 **فوائد PRO:**\n• تخطي الطابور\n• محادثات ذكية غير محدودة\n• أدوات تعليمية متقدمة\n• نماذج ذكية مخصصة\n• تحليلات الطلاب\n\nارتقِ الآن لعدم الانتظار لردود الذكاء الاصطناعي مرة أخرى!`,
        
        default: `🚀 **ارتقِ إلى PRO لأفضل تجربة ذكية!**\n\nاحصل على وصول غير محدود للميزات الذكية المتقدمة ولا تقلق بشأن الحدود مرة أخرى.\n\n💎 **ميزات PRO:**\n• محادثات ذكية غير محدودة\n• أدوات تعليمية متقدمة\n• دعم ذو أولوية\n• قوالب توجيه مخصصة\n• رؤى أداء الطلاب`
      }
    };

    const langMessages = messages[language] || messages.en;
    return langMessages[reason] || langMessages.default;
  }

  // Fallback responses when AI is not available
  getFallbackResponse(message, language = 'en') {
    const fallbackResponses = {
      en: [
        "I'm here to help with your studies! What specific topic would you like to discuss?",
        "That's an interesting question. Let me help you understand this better.",
        "I can assist you with course materials, study tips, and academic guidance.",
        "Feel free to ask me about any subject you're studying. I'm here to help!",
        "Great question! Let's explore this topic together.",
        "I'm currently in demo mode. I can help you with study strategies, course materials, and academic guidance. What would you like to know?",
        "Welcome to Sage AI! I'm here to support your learning journey. What topic are you working on today?",
        "I can help you with note-taking techniques, exam preparation, and understanding complex concepts. What do you need help with?"
      ],
      ar: [
        "أنا هنا لمساعدتك في دراستك! ما هو الموضوع المحدد الذي تريد مناقشته؟",
        "هذا سؤال مثير للاهتمام. دعني أساعدك في فهم هذا بشكل أفضل.",
        "يمكنني مساعدتك في المواد الدراسية ونصائح الدراسة والتوجيه الأكاديمي.",
        "لا تتردد في سؤالي عن أي مادة تدرسها. أنا هنا للمساعدة!",
        "سؤال رائع! دعنا نستكشف هذا الموضوع معاً.",
        "أنا حالياً في الوضع التجريبي. يمكنني مساعدتك في استراتيجيات الدراسة والمواد الدراسية والتوجيه الأكاديمي. ماذا تريد أن تعرف؟",
        "مرحباً بك في Sage AI! أنا هنا لدعم رحلة تعلمك. ما هو الموضوع الذي تعمل عليه اليوم؟",
        "يمكنني مساعدتك في تقنيات تدوين الملاحظات والتحضير للامتحانات وفهم المفاهيم المعقدة. فيم تحتاج المساعدة؟"
      ]
    };

    const responses = fallbackResponses[language] || fallbackResponses.en;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Get remaining requests for user
  getRemainingRequests(userId, userType = 'free') {
    const now = Date.now();
    const limit = this.rateLimit[userType];
    
    if (!this.userRequests.has(userId)) {
      return limit.requests;
    }
    
    const userRequests = this.userRequests.get(userId);
    const recentRequests = userRequests.filter(time => now - time < limit.window);
    
    return Math.max(0, limit.requests - recentRequests.length);
  }

  // Reset rate limit for testing
  resetRateLimit(userId) {
    this.userRequests.delete(userId);
    console.log(`Rate limit reset for user: ${userId}`);
  }

  // Reset all rate limits (for testing)
  resetAllRateLimits() {
    this.userRequests.clear();
    this.sageAIRequests.clear();
    // Also clear from localStorage
    try {
      localStorage.removeItem('sageAIRequests');
      console.log('🗑️ All rate limits reset and cleared from localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to clear Sage AI requests from localStorage:', error);
    }
  }

  // Reset Sage AI limits specifically
  resetSageAILimits() {
    this.sageAIRequests.clear();
    // Also clear from localStorage
    try {
      localStorage.removeItem('sageAIRequests');
    } catch (error) {
      console.warn('⚠️ Failed to clear Sage AI requests from localStorage:', error);
    }
  }

  // Debug function to test Sage AI response
  async testSageAIResponse(message = 'Hello, can you help me with my studies?') {
    try {
      const response = await this.getAIResponse(message, 'test-user', 'free', 'en', true);
      return response;
    } catch (error) {
      console.error('❌ Test failed:', error);
      return null;
    }
  }

  // Check API key status and provide guidance
  checkAPIKeyStatus() {
    const status = {
      openai: {
        hasKey: !!this.openaiKey && this.openaiKey.length > 0,
        keyLength: this.openaiKey.length,
        isDefault: this.openaiKey === 'your_openai_api_key_here'
      },
      gemini: {
        hasKey: !!this.geminiKey && this.geminiKey.length > 0,
        keyLength: this.geminiKey.length,
        isDefault: this.geminiKey === 'your_gemini_api_key_here'
      },
      deepseek: {
        hasKey: !!this.deepseekKey && this.deepseekKey.length > 0,
        keyLength: this.deepseekKey.length,
        isDefault: this.deepseekKey === 'your_deepseek_api_key_here'
      },
      currentService: this.useDeepSeek ? 'DeepSeek' : (this.useGemini ? 'Gemini' : 'OpenAI')
    };
    
    return status;
  }

  // Get current rate limit status
  getRateLimitStatus(userId, userType = 'free') {
    const remaining = this.getRemainingRequests(userId, userType);
    const limit = this.rateLimit[userType];
    return {
      remaining,
      total: limit.requests,
      window: limit.window,
      isLimited: remaining === 0
    };
  }

  // Test function to check API connection
  async testConnection() {
    try {
      let apiKey, serviceName;
      if (this.useDeepSeek) {
        apiKey = this.deepseekKey;
        serviceName = 'DeepSeek';
      } else if (this.useGemini) {
        apiKey = this.geminiKey;
        serviceName = 'Gemini';
      } else {
        apiKey = this.openaiKey;
        serviceName = 'OpenAI';
      }
      
      if (!apiKey || apiKey === 'your_deepseek_api_key_here' || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_openai_api_key_here') {
        return { success: false, error: 'No valid API key found' };
      }

      if (this.useDeepSeek) {
        // OpenRouter DeepSeek test
        const response = await fetch(this.deepseekURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://marln-university.com',
            'X-Title': 'MarLn University LMS'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-chat',
            messages: [
              { role: 'user', content: "Hello, this is a test message. Please respond with 'Test successful'." }
            ],
            max_tokens: 50
          })
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          const errorText = await response.text();
          return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }
      } else if (this.useGemini) {
        const testBody = {
          contents: [{
            parts: [{
              text: "Hello, this is a test message. Please respond with 'Test successful'."
            }]
          }],
          generationConfig: {
            maxOutputTokens: 50,
            temperature: 0.1
          }
        };

        const response = await fetch(`${this.geminiURL}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testBody)
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          const errorText = await response.text();
          return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }
      } else {
        // OpenAI test
        const response = await fetch(this.openaiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'user', content: "Hello, this is a test message. Please respond with 'Test successful'." }
            ],
            max_tokens: 50
          })
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          const errorText = await response.text();
          return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService; 