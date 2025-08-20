# OpenRouter DeepSeek Setup Guide

## 🚀 Quick Setup

### Step 1: Get OpenRouter API Key
1. Go to [OpenRouter Platform](https://openrouter.ai/)
2. Sign up/Login to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### Step 2: Configure Environment Variables
Create or update your `.env` file in the `marln-university-site` directory:

```env
# Enable DeepSeek via OpenRouter (set to 'true')
VITE_USE_DEEPSEEK=true
VITE_USE_GEMINI=false

# Add your OpenRouter API key
VITE_DEEPSEEK_API_KEY=your_actual_openrouter_api_key_here

# Other settings (optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🎯 DeepSeek Features

### ✅ What DeepSeek Offers:
- **High-quality responses** with advanced reasoning
- **Code generation** and analysis capabilities
- **Multilingual support** (English, Arabic, etc.)
- **Competitive pricing** compared to other AI services
- **Fast response times**

### 📊 Model Information:
- **Model**: `deepseek/deepseek-chat` (via OpenRouter)
- **Max Tokens**: 500 (configurable)
- **Temperature**: 0.7 (balanced creativity)
- **API Format**: OpenAI-compatible
- **Provider**: OpenRouter

## 🔧 Configuration Options

### Priority Order:
1. **DeepSeek** (if `VITE_USE_DEEPSEEK=true`)
2. **Gemini** (if `VITE_USE_GEMINI=true`)
3. **OpenAI** (default fallback)

### Rate Limits:
- **Free Tier**: 20 Sage AI chats
- **PRO Tier**: 1000 Sage AI chats
- **Overall**: 200 requests per hour (free)

## 🧪 Testing DeepSeek

### Test Connection:
1. Open browser console
2. Send a message in Sage AI
3. Look for: `Using AI service: DeepSeek`
4. Check for successful API responses

### Expected Console Logs:
```
🔍 Starting AI request...
Using AI service: DeepSeek
API Key length: 64
Making OpenRouter DeepSeek API request...
OpenRouter DeepSeek response status: 200
```

## 🆚 Comparison with Other AI Services

| Feature | OpenRouter DeepSeek | Gemini | OpenAI |
|---------|---------------------|--------|--------|
| **Code Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Reasoning** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Multilingual** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Pricing** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Speed** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Model Variety** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🚨 Troubleshooting

### Common Issues:

#### 1. "No valid API key found"
- Check if `VITE_DEEPSEEK_API_KEY` is set correctly
- Ensure `VITE_USE_DEEPSEEK=true`
- Restart the development server

#### 2. "API Error: 401"
- Invalid OpenRouter API key
- Check your OpenRouter account status
- Verify API key permissions

#### 3. "API Error: 429"
- Rate limit exceeded
- Check your OpenRouter usage limits
- Consider upgrading your OpenRouter plan

#### 4. "API Error: 400"
- Invalid model name
- Check if `deepseek/deepseek-chat` is available
- Try alternative models like `deepseek/deepseek-coder`

#### 5. "Unexpected DeepSeek response structure"
- API response format changed
- Check OpenRouter API documentation
- Contact OpenRouter support if persistent

## 📞 Support

- **OpenRouter Platform**: [https://openrouter.ai/](https://openrouter.ai/)
- **API Documentation**: [https://openrouter.ai/docs](https://openrouter.ai/docs)
- **Model Catalog**: [https://openrouter.ai/models](https://openrouter.ai/models)
- **Community**: OpenRouter Discord/Forum

## 💰 Pricing Information

### OpenRouter Pricing:
- **Pay-per-use** model
- **No monthly fees** (unless you choose a plan)
- **Competitive rates** for DeepSeek models
- **Usage tracking** in your OpenRouter dashboard

### Cost Optimization:
- Monitor usage in OpenRouter dashboard
- Set usage limits if needed
- Consider monthly plans for high usage

## 🎉 Success!

Once configured, OpenRouter DeepSeek will provide:
- **High-quality AI responses** for Sage AI
- **Excellent code generation** for programming questions
- **Advanced reasoning** for complex queries
- **Multilingual support** for Arabic and English
- **Flexible pricing** with pay-per-use model

**Enjoy your enhanced AI experience with OpenRouter DeepSeek!** 🚀✨ 