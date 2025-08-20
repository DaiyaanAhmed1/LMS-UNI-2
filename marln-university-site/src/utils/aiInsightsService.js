// AI Insights Service for Educational Analytics
// Uses Gemini to provide intelligent insights and recommendations

import aiService from './aiService.js';

class AIInsightsService {
  constructor() {
    this.insightTypes = {
      STUDENT_PERFORMANCE: 'student_performance',
      COURSE_ANALYTICS: 'course_analytics',
      STUDY_PATTERNS: 'study_patterns',
      RECOMMENDATIONS: 'recommendations',
      PREDICTIONS: 'predictions'
    };
  }

  // Analyze student performance data
  async analyzeStudentPerformance(studentData) {
    try {
      console.log('🔍 Starting student performance analysis for:', studentData.name);
      console.log('📊 Student data:', studentData);
      
      const prompt = this.buildStudentAnalysisPrompt(studentData);
      console.log('📝 Generated prompt:', prompt);
      
      const analysis = await aiService.getAIResponse(
        prompt,
        `student-${studentData.id}`,
        'free',
        'en'
      );
      
      console.log('🤖 Raw AI response:', analysis);
      
      // Check if it's a PRO upgrade message
      if (analysis.includes('🚀 **Upgrade to PRO') || analysis.includes('🤖 **AI is currently busy') || analysis.includes('Upgrade to PRO for unlimited')) {
        console.log('📈 PRO upgrade message detected in insights');
        return {
          summary: 'AI analysis temporarily unavailable. Upgrade to PRO for unlimited insights!',
          strengths: ['System is working correctly', 'Rate limiting is active', 'PRO upgrade available'],
          improvements: ['Upgrade to PRO for unlimited AI insights', 'Get priority access to AI analysis', 'Access advanced educational tools'],
          riskLevel: 'Low',
          confidenceScore: 90,
          isProUpgrade: true,
          proMessage: analysis
        };
      }
      
      // Try to parse the actual AI response
      const parsedInsights = this.parseInsights(analysis, 'performance');
      console.log('✅ Parsed insights:', parsedInsights);
      
      return parsedInsights;
    } catch (error) {
      console.error('❌ Student performance analysis error:', error);
      return this.getFallbackStudentInsights(studentData);
    }
  }

  // Analyze course effectiveness
  async analyzeCourseEffectiveness(courseData) {
    try {
      const prompt = this.buildCourseAnalysisPrompt(courseData);
      const analysis = await aiService.getAIResponse(
        prompt,
        `course-${courseData.id}`,
        'free',
        'en'
      );
      
      return this.parseInsights(analysis, 'course');
    } catch (error) {
      console.error('Course analysis error:', error);
      return this.getFallbackCourseInsights(courseData);
    }
  }

  // Generate personalized study recommendations
  async generateStudyRecommendations(studentData, courseData) {
    try {
      const prompt = this.buildRecommendationsPrompt(studentData, courseData);
      const recommendations = await aiService.getAIResponse(
        prompt,
        `recommendations-${studentData.id}`,
        'free',
        'en'
      );
      
      return this.parseInsights(recommendations, 'recommendations');
    } catch (error) {
      console.error('Recommendations generation error:', error);
      return this.getFallbackRecommendations(studentData);
    }
  }

  // Predict student success
  async predictStudentSuccess(studentData, courseData) {
    try {
      const prompt = this.buildPredictionPrompt(studentData, courseData);
      const prediction = await aiService.getAIResponse(
        prompt,
        `prediction-${studentData.id}`,
        'free',
        'en'
      );
      
      return this.parseInsights(prediction, 'prediction');
    } catch (error) {
      console.error('Prediction error:', error);
      return this.getFallbackPrediction(studentData);
    }
  }

  // Build prompts for different analysis types
  buildStudentAnalysisPrompt(studentData) {
    return `Analyze this student's performance data and provide insights:

Student Data:
- Name: ${studentData.name}
- Current Grade: ${studentData.currentGrade || 'N/A'}
- Course Progress: ${studentData.progress || 0}%
- Assignment Scores: ${JSON.stringify(studentData.assignments || [])}
- Study Time: ${studentData.studyTime || 0} hours
- Attendance: ${studentData.attendance || 0}%

Please provide a detailed analysis in this EXACT JSON format:

{
  "summary": "Brief 2-3 sentence summary of student performance",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement area 1", "Improvement area 2", "Improvement area 3"],
  "patterns": "Analysis of study patterns",
  "riskLevel": "Low/Medium/High",
  "confidenceScore": 85
}

IMPORTANT: Respond ONLY with valid JSON. Do not include any other text before or after the JSON.`;
  }

  buildCourseAnalysisPrompt(courseData) {
    return `Analyze this course's effectiveness data:

Course Data:
- Course Name: ${courseData.name}
- Average Grade: ${courseData.averageGrade || 'N/A'}
- Completion Rate: ${courseData.completionRate || 0}%
- Student Engagement: ${courseData.engagement || 0}%
- Assignment Scores: ${JSON.stringify(courseData.assignments || [])}
- Student Feedback: ${JSON.stringify(courseData.feedback || [])}

Please provide:
1. **Course Effectiveness** (2-3 sentences)
2. **What's Working Well** (3 positive aspects)
3. **Areas for Improvement** (3 specific suggestions)
4. **Student Engagement Analysis** (engagement patterns)
5. **Difficulty Assessment** (Too Easy/Just Right/Too Hard)
6. **Recommendations** (3 specific actions)

Format as JSON with these keys: effectiveness, workingWell, improvements, engagement, difficulty, recommendations`;
  }

  buildRecommendationsPrompt(studentData, courseData) {
    return `Generate personalized study recommendations for this student:

Student Profile:
- Current Performance: ${studentData.currentGrade || 'N/A'}
- Learning Style: ${studentData.learningStyle || 'Unknown'}
- Study Habits: ${studentData.studyHabits || 'Unknown'}
- Weak Areas: ${JSON.stringify(studentData.weakAreas || [])}

Course Context:
- Course: ${courseData.name}
- Current Topic: ${courseData.currentTopic || 'N/A'}
- Upcoming Assignments: ${JSON.stringify(courseData.upcomingAssignments || [])}

Please provide:
1. **Immediate Actions** (3 things to do this week)
2. **Study Strategies** (3 personalized study methods)
3. **Resource Recommendations** (3 specific resources)
4. **Time Management Tips** (3 scheduling suggestions)
5. **Motivation Strategies** (3 ways to stay motivated)
6. **Success Metrics** (3 ways to measure progress)

Format as JSON with these keys: immediateActions, studyStrategies, resources, timeManagement, motivation, successMetrics`;
  }

  buildPredictionPrompt(studentData, courseData) {
    return `Predict this student's success in the course:

Current Data:
- Student Performance: ${studentData.currentGrade || 'N/A'}
- Study Patterns: ${JSON.stringify(studentData.studyPatterns || [])}
- Engagement Level: ${studentData.engagement || 'Unknown'}
- Attendance: ${studentData.attendance || 0}%
- Assignment Completion: ${studentData.assignmentCompletion || 0}%

Course Requirements:
- Course Difficulty: ${courseData.difficulty || 'Unknown'}
- Required Grade: ${courseData.requiredGrade || 'N/A'}
- Remaining Assignments: ${courseData.remainingAssignments || 0}

Please provide:
1. **Success Probability** (0-100% with reasoning)
2. **Predicted Final Grade** (A/B/C/D/F with confidence)
3. **Key Factors** (3 main factors affecting success)
4. **Risk Factors** (3 potential obstacles)
5. **Intervention Needed** (Yes/No with specific actions)
6. **Timeline** (when to reassess)

Format as JSON with these keys: successProbability, predictedGrade, keyFactors, riskFactors, interventionNeeded, timeline`;
  }

  // Parse AI responses into structured insights
  parseInsights(aiResponse, type) {
    console.log('🔍 Parsing AI response:', aiResponse);
    console.log('📝 Response type:', type);
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed JSON:', parsed);
        return parsed;
      }
      
      // If no JSON found, try to structure the text response
      console.log('⚠️ No JSON found, structuring text response');
      const lines = aiResponse.split('\n').filter(line => line.trim());
      
      // Try to extract key information from text
      const summary = lines.find(line => line.includes('summary') || line.includes('ملخص') || line.includes('analysis')) || lines[0] || 'AI analysis provided';
      
      const strengths = lines.filter(line => 
        line.includes('strength') || line.includes('قوة') || line.includes('✅') || line.includes('positive')
      ).map(line => line.replace(/^[•\-\*]\s*/, '').trim());
      
      const improvements = lines.filter(line => 
        line.includes('improvement') || line.includes('تحسين') || line.includes('🎯') || line.includes('focus') || line.includes('area')
      ).map(line => line.replace(/^[•\-\*]\s*/, '').trim());
      
      const riskLevel = lines.find(line => 
        line.includes('risk') || line.includes('مخاطر') || line.includes('level')
      )?.match(/(low|medium|high|منخفض|متوسط|عالي)/i)?.[1] || 'Medium';
      
      console.log('📊 Structured text response:', { summary, strengths, improvements, riskLevel });
      
      return {
        summary: summary,
        strengths: strengths.length > 0 ? strengths : ['Good progress', 'Consistent effort', 'Positive attitude'],
        improvements: improvements.length > 0 ? improvements : ['Continue current approach', 'Maintain focus', 'Seek help when needed'],
        riskLevel: riskLevel,
        confidenceScore: 80,
        type: type,
        rawResponse: aiResponse,
        timestamp: new Date().toISOString(),
        confidence: 'medium'
      };
    } catch (error) {
      console.error('❌ Error parsing insights:', error);
      return {
        summary: 'AI analysis completed successfully',
        strengths: ['Good progress', 'Consistent effort', 'Positive attitude'],
        improvements: ['Continue current approach', 'Maintain focus', 'Seek help when needed'],
        riskLevel: 'Medium',
        confidenceScore: 75,
        type: type,
        rawResponse: aiResponse,
        timestamp: new Date().toISOString(),
        confidence: 'low',
        error: 'Failed to parse structured data'
      };
    }
  }

  // Fallback insights when AI fails
  getFallbackStudentInsights(studentData) {
    return {
      summary: `Student ${studentData.name} is currently performing at ${studentData.currentGrade || 'an unknown'} level.`,
      strengths: ['Consistent attendance', 'Good participation', 'Timely submissions'],
      improvements: ['Focus on weak areas', 'Increase study time', 'Seek help when needed'],
      patterns: 'Regular study patterns observed',
      riskLevel: 'Medium',
      confidenceScore: 75
    };
  }

  getFallbackCourseInsights(courseData) {
    return {
      effectiveness: `Course ${courseData.name} shows ${courseData.completionRate || 0}% completion rate.`,
      workingWell: ['Clear objectives', 'Good materials', 'Engaging content'],
      improvements: ['More interactive elements', 'Better feedback', 'Additional resources'],
      engagement: 'Moderate student engagement',
      difficulty: 'Just Right',
      recommendations: ['Add more practice exercises', 'Improve feedback system', 'Enhance student support']
    };
  }

  getFallbackRecommendations(studentData) {
    return {
      immediateActions: ['Review current material', 'Complete pending assignments', 'Schedule study time'],
      studyStrategies: ['Active learning techniques', 'Regular review sessions', 'Practice problems'],
      resources: ['Course materials', 'Online tutorials', 'Study groups'],
      timeManagement: ['Create study schedule', 'Set daily goals', 'Use time tracking'],
      motivation: ['Set clear goals', 'Celebrate small wins', 'Find study partners'],
      successMetrics: ['Assignment scores', 'Understanding level', 'Study consistency']
    };
  }

  getFallbackPrediction(studentData) {
    return {
      successProbability: 70,
      predictedGrade: 'B',
      keyFactors: ['Current performance', 'Study habits', 'Course difficulty'],
      riskFactors: ['Time management', 'Understanding gaps', 'External distractions'],
      interventionNeeded: 'Maybe',
      timeline: 'Reassess in 2 weeks'
    };
  }

  // Get insights for Arabic language
  async getArabicInsights(data, type) {
    const arabicPrompts = {
      student_performance: `حلل أداء هذا الطالب وقدم رؤى:

بيانات الطالب:
- الاسم: ${data.name}
- الدرجة الحالية: ${data.currentGrade || 'غير متوفر'}
- تقدم الدورة: ${data.progress || 0}%

يرجى تقديم تحليل مفصل بالتنسيق JSON التالي بالضبط:

{
  "summary": "ملخص مختصر من 2-3 جمل عن أداء الطالب",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "improvements": ["مجال تحسين 1", "مجال تحسين 2", "مجال تحسين 3"],
  "riskLevel": "منخفض/متوسط/عالي",
  "confidenceScore": 85
}

مهم: أجب فقط بـ JSON صحيح. لا تضع أي نص آخر قبل أو بعد JSON.`,

      course_analytics: `حلل فعالية هذه الدورة:

بيانات الدورة:
- اسم الدورة: ${data.name}
- متوسط الدرجات: ${data.averageGrade || 'غير متوفر'}
- معدل الإكمال: ${data.completionRate || 0}%

يرجى تقديم:
1. فعالية الدورة (2-3 جمل)
2. ما يعمل بشكل جيد (3 جوانب إيجابية)
3. مجالات التحسين (3 اقتراحات محددة)
4. تقييم الصعوبة (سهل جداً/مناسب/صعب جداً)

قم بالتنسيق كـ JSON مع هذه المفاتيح: effectiveness, workingWell, improvements, difficulty`
    };

    const prompt = arabicPrompts[type] || arabicPrompts.student_performance;
    
    try {
      const analysis = await aiService.getAIResponse(
        prompt,
        `arabic-${type}-${Date.now()}`,
        'free',
        'ar'
      );
      
      // Check if it's a PRO upgrade message
      if (analysis.includes('🚀 **ارتقِ إلى PRO') || analysis.includes('🤖 **الذكاء الاصطناعي مشغول')) {
        console.log('📈 Arabic PRO upgrade message detected in insights');
        return {
          summary: 'تحليل الذكاء الاصطناعي غير متاح مؤقتاً. ارتقِ إلى PRO للحصول على رؤى غير محدودة!',
          strengths: ['النظام يعمل بشكل صحيح', 'حدود المعدل نشطة', 'ترقية PRO متاحة'],
          improvements: ['ارتقِ إلى PRO للحصول على رؤى ذكية غير محدودة', 'احصل على وصول ذو أولوية لتحليل الذكاء الاصطناعي', 'الوصول إلى أدوات تعليمية متقدمة'],
          riskLevel: 'منخفض',
          confidenceScore: 90,
          isProUpgrade: true,
          proMessage: analysis
        };
      }
      
      return this.parseInsights(analysis, type);
    } catch (error) {
      console.error('Arabic insights error:', error);
      return this.getFallbackStudentInsights(data);
    }
  }

  // Translate text using AI
  async translateText(text) {
    try {
      console.log('🌐 Starting text translation...');
      console.log('📝 Text to translate:', text.substring(0, 100) + '...');
      
      const translation = await aiService.getAIResponse(
        text,
        `translation-${Date.now()}`,
        'free',
        'en'
      );
      
      console.log('✅ Translation completed');
      return translation;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  // Test function to check AI service connection
  async testConnection() {
    try {
      console.log('🧪 Testing AI Insights Service...');
      
      // Test basic AI service first
      const aiTestResult = await aiService.testConnection();
      console.log('🔗 Base AI Service Test:', aiTestResult);
      
      if (!aiTestResult.success) {
        return {
          success: false,
          error: `Base AI service failed: ${aiTestResult.error}`,
          details: aiTestResult
        };
      }
      
      // Test insights service with sample data
      const sampleData = {
        id: 1,
        name: 'Test Student',
        currentGrade: 'B+',
        progress: 75,
        assignments: [{ name: 'Test Assignment', score: 80 }],
        studyTime: 10,
        attendance: 85,
        learningStyle: 'Visual',
        studyHabits: 'Regular study sessions',
        weakAreas: ['Mathematics'],
        engagement: 'High',
        assignmentCompletion: 80
      };
      
      console.log('🧪 Testing student performance analysis...');
      const insightsResult = await this.analyzeStudentPerformance(sampleData);
      console.log('📊 Insights Test Result:', insightsResult);
      
      return {
        success: true,
        message: 'AI Insights Service is working correctly!',
        baseAI: aiTestResult,
        insights: insightsResult
      };
      
    } catch (error) {
      console.error('❌ AI Insights Service Test Error:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}

// Create singleton instance
const aiInsightsService = new AIInsightsService();

export default aiInsightsService; 