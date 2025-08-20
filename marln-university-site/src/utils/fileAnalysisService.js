// File Analysis Service for Sage AI Integration
import aiService from './aiService';

class FileAnalysisService {
  constructor() {
    this.supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    this.supportedDocumentFormats = ['pdf', 'txt', 'doc', 'docx', 'rtf'];
    this.supportedCodeFormats = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml', 'md'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB max
  }

  // Validate file
  validateFile(file) {
    const errors = [];
    
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size too large. Maximum allowed: ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Get file extension
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Check if file type is supported
    const isImage = this.supportedImageFormats.includes(extension);
    const isDocument = this.supportedDocumentFormats.includes(extension);
    const isCode = this.supportedCodeFormats.includes(extension);
    
    if (!isImage && !isDocument && !isCode) {
      errors.push(`Unsupported file type. Supported: Images (${this.supportedImageFormats.join(', ')}), Documents (${this.supportedDocumentFormats.join(', ')}), Code (${this.supportedCodeFormats.join(', ')})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      extension,
      type: isImage ? 'image' : isDocument ? 'document' : isCode ? 'code' : 'unknown'
    };
  }

  // Convert image to base64 for AI analysis
  async imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Extract text from document files
  async extractTextFromDocument(file) {
    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        return await file.text();
      }
      
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF, we'll use a simple text extraction
        // In a real implementation, you'd use a PDF parsing library
        return await this.extractTextFromPDF(file);
      }
      
      // For other document types, return a placeholder
      return `Document: ${file.name}\nType: ${file.type}\nSize: ${(file.size / 1024).toFixed(2)}KB\n\nContent analysis would be performed on this document.`;
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error('Failed to extract text from document');
    }
  }

  // Extract text from PDF (simplified implementation)
  async extractTextFromPDF(file) {
    try {
      // This is a simplified implementation
      // In production, you'd use a proper PDF parsing library like pdf.js
      return `PDF Document: ${file.name}\n\nThis is a PDF document. The content would be extracted and analyzed for:\n- Key topics and themes\n- Important information\n- Summary of content\n- Questions and answers\n\nFile size: ${(file.size / 1024).toFixed(2)}KB`;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  // Extract text from code files
  async extractTextFromCode(file) {
    try {
      const content = await file.text();
      return `Code File: ${file.name}\nLanguage: ${this.getLanguageFromExtension(file.name)}\n\n${content}`;
    } catch (error) {
      console.error('Error extracting text from code file:', error);
      throw new Error('Failed to extract text from code file');
    }
  }

  // Get programming language from file extension
  getLanguageFromExtension(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'tsx': 'React TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'xml': 'XML',
      'md': 'Markdown'
    };
    return languageMap[extension] || 'Unknown';
  }

  // Analyze image with AI
  async analyzeImage(imageBase64, language = 'en') {
    try {
      const prompt = language === 'ar' 
        ? `قم بتحليل هذه الصورة وقدم وصفاً مفصلاً لما تراه. يجب أن يتضمن التحليل:

## وصف عام للصورة
[وصف شامل للصورة]

## العناصر الرئيسية
- [العنصر الأول]
- [العنصر الثاني]
- [العنصر الثالث]

## الألوان والتصميم
- [وصف الألوان]
- [وصف التصميم]

## السياق أو الغرض
[وصف السياق المحتمل]

## النص والأرقام المرئية
[أي نص أو أرقام موجودة]

## الملاحظات المهمة
[ملاحظات إضافية مهمة]

الصورة: [IMAGE_DATA]

يرجى تقديم تحليل شامل ومفصل باللغة العربية مع استخدام التنسيق المناسب.`
        : `Please analyze this image and provide a detailed description of what you see. The analysis should include:

## General Description
[Comprehensive description of the image]

## Main Elements
- [First element]
- [Second element]
- [Third element]

## Colors and Design
- [Color description]
- [Design description]

## Context or Purpose
[Likely context or purpose]

## Visible Text and Numbers
[Any visible text or numbers]

## Important Observations
[Additional important notes]

Image: [IMAGE_DATA]

Please provide a comprehensive and detailed analysis with proper formatting.`;

      // For now, we'll use a text-based approach
      // In a real implementation, you'd send the base64 image to an AI service that supports image analysis
      const analysis = await aiService.getAIResponse(
        prompt.replace('[IMAGE_DATA]', `[Image: ${imageBase64.substring(0, 100)}...]`),
        'file-analysis-user',
        'free',
        language,
        false
      );

      return analysis;
    } catch (error) {
      throw new Error('Failed to analyze image');
    }
  }

  // Analyze document with AI
  async analyzeDocument(text, filename, language = 'en') {
    try {
      const prompt = language === 'ar' 
        ? `قم بتحليل هذا المستند وقدم ملخصاً شاملاً ومفصلاً. يجب أن يتضمن التحليل:

## الموضوع الرئيسي
[وصف الموضوع الرئيسي للمستند]

## النقاط الرئيسية
- [النقطة الأولى]
- [النقطة الثانية]
- [النقطة الثالثة]

## المفاهيم الأساسية
- [المفهوم الأول]
- [المفهوم الثاني]
- [المفهوم الثالث]

## الملخص التنفيذي
[ملخص شامل للمستند]

## الاستنتاجات والتوصيات
- [الاستنتاج الأول]
- [التوصية الأولى]

## الأسئلة المحتملة
1. [السؤال الأول]
2. [السؤال الثاني]
3. [السؤال الثالث]

اسم الملف: ${filename}
المحتوى: ${text.substring(0, 3000)}...

يرجى تقديم تحليل منظم ومفصل باللغة العربية مع استخدام التنسيق المناسب.`
        : `Please analyze this document and provide a comprehensive, detailed summary. The analysis should include:

## Main Topic
[Description of the main topic of the document]

## Key Points
- [First key point]
- [Second key point]
- [Third key point]

## Core Concepts
- [First concept]
- [Second concept]
- [Third concept]

## Executive Summary
[Comprehensive summary of the document]

## Conclusions and Recommendations
- [First conclusion]
- [First recommendation]

## Potential Questions
1. [First question]
2. [Second question]
3. [Third question]

Filename: ${filename}
Content: ${text.substring(0, 3000)}...

Please provide an organized and detailed analysis with proper formatting.`;

      const analysis = await aiService.getAIResponse(
        prompt,
        'file-analysis-user',
        'free',
        language,
        false
      );

      return analysis;
    } catch (error) {
      throw new Error('Failed to analyze document');
    }
  }

  // Analyze code with AI
  async analyzeCode(code, filename, language = 'en') {
    try {
      const programmingLanguage = this.getLanguageFromExtension(filename);
      
      const prompt = language === 'ar' 
        ? `قم بتحليل هذا الكود وقدم تقييماً شاملاً. يجب أن يتضمن التحليل:

## الغرض من الكود
[وصف الغرض الرئيسي من الكود]

## الوظائف والطرق
- [الوظيفة الأولى]
- [الوظيفة الثانية]
- [الوظيفة الثالثة]

## جودة الكود
- [تقييم الجودة]
- [أفضل الممارسات المستخدمة]

## المشاكل والتحسينات
- [المشكلة الأولى]
- [التحسين المقترح الأول]

## شرح المنطق
[شرح مفصل للمنطق والخطوات]

## اقتراحات التحسين
1. [الاقتراح الأول]
2. [الاقتراح الثاني]
3. [الاقتراح الثالث]

لغة البرمجة: ${programmingLanguage}
اسم الملف: ${filename}
الكود: ${code.substring(0, 2000)}...

يرجى تقديم تحليل مفصل ومفيد باللغة العربية مع استخدام التنسيق المناسب.`
        : `Please analyze this code and provide a comprehensive review. The analysis should include:

## Purpose
[Description of the main purpose of the code]

## Functions and Methods
- [First function]
- [Second function]
- [Third function]

## Code Quality
- [Quality assessment]
- [Best practices used]

## Issues and Improvements
- [First issue]
- [First improvement suggestion]

## Logic Explanation
[Detailed explanation of logic and steps]

## Enhancement Suggestions
1. [First suggestion]
2. [Second suggestion]
3. [Third suggestion]

Programming Language: ${programmingLanguage}
Filename: ${filename}
Code: ${code.substring(0, 2000)}...

Please provide a detailed and helpful analysis with proper formatting.`;

      const analysis = await aiService.getAIResponse(
        prompt,
        'file-analysis-user',
        'free',
        language,
        false
      );

      return analysis;
    } catch (error) {
      throw new Error('Failed to analyze code');
    }
  }

  // Main file analysis function
  async analyzeFile(file, language = 'en') {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(`File validation failed: ${validation.errors.join(', ')}`);
      }

      let analysis;
      
      if (validation.type === 'image') {
        // Analyze image
        const imageBase64 = await this.imageToBase64(file);
        analysis = await this.analyzeImage(imageBase64, language);
      } else if (validation.type === 'document') {
        // Analyze document
        const text = await this.extractTextFromDocument(file);
        analysis = await this.analyzeDocument(text, file.name, language);
      } else if (validation.type === 'code') {
        // Analyze code
        const code = await this.extractTextFromCode(file);
        analysis = await this.analyzeCode(code, file.name, language);
      } else {
        throw new Error('Unsupported file type');
      }

      const result = {
        filename: file.name,
        fileType: validation.type,
        fileSize: file.size,
        analysis,
        language,
        timestamp: new Date().toISOString()
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get supported file types for UI
  getSupportedFileTypes() {
    return {
      images: this.supportedImageFormats,
      documents: this.supportedDocumentFormats,
      code: this.supportedCodeFormats
    };
  }

  // Get file type icon
  getFileTypeIcon(fileType) {
    const icons = {
      image: '🖼️',
      document: '📄',
      code: '💻',
      unknown: '📁'
    };
    return icons[fileType] || icons.unknown;
  }
}

// Export singleton instance
const fileAnalysisService = new FileAnalysisService();
export default fileAnalysisService; 