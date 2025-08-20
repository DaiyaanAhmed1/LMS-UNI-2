// Video Analysis Service for AI-powered video summarization
import aiService from './aiService';

class VideoAnalysisService {
  constructor() {
    this.supportedFormats = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
    this.maxVideoDuration = 60 * 60; // 1 hour max
    this.maxFileSize = 500 * 1024 * 1024; // 500MB max
  }

  // Validate video file
  validateVideo(videoFile) {
    const errors = [];
    
    if (!videoFile) {
      errors.push('No video file provided');
      return { isValid: false, errors };
    }

    // Check file size
    if (videoFile.size > this.maxFileSize) {
      errors.push(`File size too large. Maximum allowed: ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file format
    const extension = videoFile.name.split('.').pop().toLowerCase();
    if (!this.supportedFormats.includes(extension)) {
      errors.push(`Unsupported format. Supported formats: ${this.supportedFormats.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      extension
    };
  }

  // Extract audio from video for transcript generation
  async extractAudioFromVideo(videoFile) {
    try {
      console.log('🎵 Extracting audio from video...');
      
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await videoFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      console.log('✅ Audio extracted successfully');
      return audioBuffer;
    } catch (error) {
      console.error('❌ Error extracting audio:', error);
      throw new Error('Failed to extract audio from video');
    }
  }

  // Generate transcript from video (simulated for now)
  async generateTranscript(videoFile, language = 'en') {
    try {
      // Simulate transcript generation
      // In a real implementation, this would use speech-to-text APIs
      const mockTranscript = this.generateMockTranscript(videoFile.name, language);
      
      return {
        transcript: mockTranscript,
        language,
        confidence: 0.95,
        duration: 300 // 5 minutes
      };
    } catch (error) {
      throw new Error('Failed to generate transcript');
    }
  }

  // Generate mock transcript for demonstration
  generateMockTranscript(videoName, language) {
    const transcripts = {
      en: {
        'lecture': `Welcome to today's lecture on advanced cybersecurity principles. Today we'll be covering several key topics that are essential for understanding modern security threats and defenses.

First, let's discuss the concept of zero-trust architecture. This security model operates on the principle that no entity should be trusted by default, regardless of whether it's inside or outside the network perimeter. This approach requires continuous verification of all users, devices, and applications.

Next, we'll explore endpoint detection and response, or EDR. This technology provides real-time monitoring and response capabilities for endpoint devices. EDR solutions collect and analyze data from endpoints to detect and respond to threats quickly.

We'll also cover threat hunting methodologies. This proactive approach involves actively searching for threats that may have evaded existing security measures. Threat hunters use various tools and techniques to identify suspicious activities and potential security breaches.

Finally, we'll discuss incident response procedures. When a security incident occurs, having a well-defined response plan is crucial. This includes preparation, identification, containment, eradication, recovery, and lessons learned phases.

Remember, cybersecurity is not just about technology; it's about people, processes, and technology working together to protect our digital assets.`,
        
        'tutorial': `In this tutorial, we'll walk through the process of setting up a secure network environment. Let's start with the basics of network configuration and security.

First, we need to configure our firewall rules. This involves setting up both inbound and outbound traffic rules. We'll create rules that allow necessary traffic while blocking potentially harmful connections.

Next, we'll set up intrusion detection systems. These systems monitor network traffic for suspicious activities and can alert us to potential threats. We'll configure the system to log events and generate alerts when suspicious activity is detected.

We'll also implement access control measures. This includes setting up user authentication, authorization, and accounting systems. We'll configure role-based access control to ensure users only have access to the resources they need.

Finally, we'll test our security measures. This involves running penetration tests and vulnerability assessments to identify any weaknesses in our security setup.`,
        
        'presentation': `Good morning everyone. Today I'm going to present our quarterly security assessment and discuss the key findings and recommendations for improving our security posture.

Let me start with an overview of our current security landscape. We've identified several areas where we can improve our defenses and better protect our organization's assets.

Our assessment revealed that while we have good basic security measures in place, there are opportunities to enhance our threat detection and response capabilities. We've also identified some gaps in our employee security training programs.

Based on our findings, I'll present a comprehensive plan for addressing these issues. This includes implementing new security technologies, enhancing our monitoring capabilities, and improving our incident response procedures.

I'll also discuss the budget implications and timeline for implementing these improvements. We believe these investments will significantly strengthen our security posture and reduce our risk exposure.`
      },
      ar: {
        'lecture': `مرحباً بكم في محاضرة اليوم حول مبادئ الأمن السيبراني المتقدمة. سنغطي اليوم عدة مواضيع أساسية مهمة لفهم التهديدات والدفاعات الأمنية الحديثة.

أولاً، دعونا نناقش مفهوم بنية الثقة الصفرية. يعمل هذا النموذج الأمني على مبدأ أنه لا يجب الوثوق بأي كيان افتراضياً، بغض النظر عما إذا كان داخل أو خارج محيط الشبكة. يتطلب هذا النهج التحقق المستمر من جميع المستخدمين والأجهزة والتطبيقات.

بعد ذلك، سنستكشف اكتشاف نقاط النهاية والاستجابة، أو EDR. توفر هذه التقنية قدرات المراقبة والاستجابة في الوقت الفعلي لأجهزة نقاط النهاية. تجمع حلول EDR وتحلل البيانات من نقاط النهاية للكشف عن التهديدات والاستجابة لها بسرعة.

سنغطي أيضاً منهجيات البحث عن التهديدات. يتضمن هذا النهج الاستباقي البحث النشط عن التهديدات التي قد تكون تجاوزت التدابير الأمنية الموجودة. يستخدم صيادو التهديدات أدوات وتقنيات مختلفة لتحديد الأنشطة المشبوهة والانتهاكات الأمنية المحتملة.

أخيراً، سنناقش إجراءات الاستجابة للحوادث. عندما يحدث حادث أمني، فإن وجود خطة استجابة محددة بوضوح أمر بالغ الأهمية. يتضمن ذلك مراحل التحضير والتحديد والاحتواء والاستئصال والتعافي والدروس المستفادة.

تذكروا أن الأمن السيبراني ليس مجرد تقنية؛ إنه يتعلق بالأشخاص والعمليات والتقنية التي تعمل معاً لحماية أصولنا الرقمية.`,
        
        'tutorial': `في هذا البرنامج التعليمي، سنتعرف على عملية إعداد بيئة شبكة آمنة. دعونا نبدأ بأساسيات تكوين الشبكة والأمان.

أولاً، نحتاج إلى تكوين قواعد جدار الحماية. يتضمن ذلك إعداد قواعد حركة المرور الواردة والصادرة. سننشئ قواعد تسمح بالحركة الضرورية مع حظر الاتصالات الضارة المحتملة.

بعد ذلك، سنقوم بإعداد أنظمة اكتشاف التسلل. تراقب هذه الأنظمة حركة مرور الشبكة للأنشطة المشبوهة ويمكن أن تنبهنا للتهديدات المحتملة. سنقوم بتكوين النظام لتسجيل الأحداث وإنشاء تنبيهات عند اكتشاف نشاط مشبوه.

سننفذ أيضاً تدابير التحكم في الوصول. يتضمن ذلك إعداد أنظمة المصادقة والتفويض والمحاسبة للمستخدمين. سنقوم بتكوين التحكم في الوصول القائم على الأدوار لضمان حصول المستخدمين على الوصول للموارد التي يحتاجونها فقط.

أخيراً، سنختبر تدابيرنا الأمنية. يتضمن ذلك تشغيل اختبارات الاختراق وتقييمات الثغرات لتحديد أي نقاط ضعف في إعدادنا الأمني.`,
        
        'presentation': `صباح الخير جميعاً. اليوم سأقدم تقييمنا الأمني للربع وأناقش النتائج الرئيسية والتوصيات لتحسين موقفنا الأمني.

دعني أبدأ بنظرة عامة على المشهد الأمني الحالي. حددنا عدة مجالات يمكننا فيها تحسين دفاعاتنا وحماية أصول مؤسستنا بشكل أفضل.

كشف تقييمنا أنه بينما لدينا تدابير أمنية أساسية جيدة، هناك فرص لتعزيز قدرات اكتشاف التهديدات والاستجابة. حددنا أيضاً بعض الفجوات في برامج التدريب الأمني للموظفين.

بناءً على النتائج، سأقدم خطة شاملة لمعالجة هذه المشاكل. يتضمن ذلك تنفيذ تقنيات أمنية جديدة وتعزيز قدرات المراقبة وتحسين إجراءات الاستجابة للحوادث.

سأناقش أيضاً الآثار المالية والجدول الزمني لتنفيذ هذه التحسينات. نعتقد أن هذه الاستثمارات ستقوي موقفنا الأمني بشكل كبير وتقلل من تعرضنا للمخاطر.`
      }
    };

    // Determine video type based on name
    let videoType = 'lecture';
    if (videoName.toLowerCase().includes('tutorial')) videoType = 'tutorial';
    else if (videoName.toLowerCase().includes('presentation')) videoType = 'presentation';

    return transcripts[language]?.[videoType] || transcripts.en.lecture;
  }

  // Generate AI summary from transcript
  async generateSummary(transcript, videoTitle, language = 'en') {
    try {
      const prompt = language === 'ar' 
        ? `قم بتحليل النص التالي وإنشاء ملخص شامل ومفصل للمحاضرة أو الفيديو التعليمي. يجب أن يتضمن الملخص:
        
        - النقاط الرئيسية والمواضيع المهمة
        - المفاهيم الأساسية والمصطلحات التقنية
        - الأمثلة والتطبيقات العملية
        - النصائح والاستراتيجيات المقدمة
        - الخلاصة والتوصيات
        
        النص: ${transcript}
        
        عنوان الفيديو: ${videoTitle}
        
        يرجى تقديم ملخص منظم ومنطقي باللغة العربية.`
        : `Please analyze the following text and create a comprehensive, detailed summary of the lecture or educational video. The summary should include:
        
        - Key points and important topics
        - Core concepts and technical terms
        - Examples and practical applications
        - Tips and strategies provided
        - Summary and recommendations
        
        Text: ${transcript}
        
        Video Title: ${videoTitle}
        
        Please provide a well-organized and logical summary.`;

      const summary = await aiService.getAIResponse(
        prompt,
        'video-analysis-user',
        'free',
        language,
        false // Not Sage AI
      );

      return summary;
    } catch (error) {
      throw new Error('Failed to generate AI summary');
    }
  }

  // Extract key points from transcript
  async extractKeyPoints(transcript, language = 'en') {
    try {
      const prompt = language === 'ar'
        ? `من النص التالي، استخرج النقاط الرئيسية والمفاهيم المهمة. قدم النتائج كقائمة منظمة:
        
        النص: ${transcript}
        
        يرجى تقديم:
        1. النقاط الرئيسية (3-5 نقاط)
        2. المفاهيم الأساسية (3-5 مفاهيم)
        3. المصطلحات التقنية المهمة
        4. النصائح العملية
        
        باللغة العربية.`
        : `From the following text, extract the key points and important concepts. Present the results as an organized list:
        
        Text: ${transcript}
        
        Please provide:
        1. Key points (3-5 points)
        2. Core concepts (3-5 concepts)
        3. Important technical terms
        4. Practical tips
        
        In English.`;

      const keyPoints = await aiService.getAIResponse(
        prompt,
        'video-analysis-user',
        'free',
        language,
        false
      );

      return keyPoints;
    } catch (error) {
      throw new Error('Failed to extract key points');
    }
  }

  // Complete video analysis
  async analyzeVideo(videoFile, videoTitle, language = 'en') {
    try {
      // Validate video if it's a file
      if (videoFile && videoFile.name) {
        const validation = this.validateVideo(videoFile);
        if (!validation.isValid) {
          throw new Error(`Video validation failed: ${validation.errors.join(', ')}`);
        }
      }

      // Generate transcript
      const transcriptData = await this.generateTranscript(videoFile, language);
      
      // Generate summary
      const summary = await this.generateSummary(transcriptData.transcript, videoTitle, language);
      
      // Extract key points
      const keyPoints = await this.extractKeyPoints(transcriptData.transcript, language);

      const analysis = {
        videoTitle,
        transcript: transcriptData.transcript,
        summary,
        keyPoints,
        language,
        duration: transcriptData.duration,
        confidence: transcriptData.confidence,
        timestamp: new Date().toISOString(),
        isAutoAnalyzed: true
      };

      return analysis;
    } catch (error) {
      throw error;
    }
  }

  // Get analysis progress (for UI feedback)
  getAnalysisProgress() {
    return {
      steps: [
        { id: 'validation', label: 'Validating video', completed: false },
        { id: 'transcript', label: 'Generating transcript', completed: false },
        { id: 'summary', label: 'Creating summary', completed: false },
        { id: 'keypoints', label: 'Extracting key points', completed: false }
      ]
    };
  }
}

// Export singleton instance
const videoAnalysisService = new VideoAnalysisService();
export default videoAnalysisService; 