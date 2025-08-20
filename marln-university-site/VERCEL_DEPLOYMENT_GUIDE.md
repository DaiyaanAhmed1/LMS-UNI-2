# 🚀 Vercel Deployment Guide for MarLn LMS with AI

This guide will help you deploy your MarLn LMS application with AI features to Vercel.

## 📋 Prerequisites

- [ ] GitHub/GitLab account with your project
- [ ] Vercel account (free at [vercel.com](https://vercel.com))
- [ ] Google AI Studio account for Gemini API key
- [ ] Your project code ready for deployment

## 🔑 Step 1: Get Your Gemini API Key

### 1.1 Go to Google AI Studio
- Visit: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Sign in with your Google account

### 1.2 Create API Key
- Click **"Create API Key"**
- Select **"Create API Key in new project"**
- Copy the generated key (format: `AIzaSyBfDZck5fNWPFadtk1vfGtbqybtK-IzWBs`)

### 1.3 Save Your API Key
- Keep this key safe - you'll need it for Vercel deployment
- **Never commit it to your repository**

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect Your Repository
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** to your account
3. **Click "New Project"**
4. **Import your Git repository** (GitHub/GitLab)
5. **Select your repository** (marln-university-site)

### 2.2 Configure Project Settings
- **Framework Preset:** Vite
- **Root Directory:** `marln-university-site` (if your project is in a subfolder)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2.3 Add Environment Variables
**This is the most important step!**

1. **In the deployment settings, click "Environment Variables"**
2. **Add these variables:**

#### Variable 1: Enable Gemini AI
```
Name: VITE_USE_GEMINI
Value: true
Environment: Production, Preview, Development
```

#### Variable 2: Your Gemini API Key
```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyBfDZck5fNWPFadtk1vfGtbqybtK-IzWBs (your actual key)
Environment: Production, Preview, Development
```

### 2.4 Deploy
- **Click "Deploy"**
- **Wait for build to complete** (usually 2-3 minutes)
- **Your site will be live!**

## 🔧 Step 3: Post-Deployment Configuration

### 3.1 Verify Environment Variables
1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Verify both variables are set correctly**

### 3.2 Test AI Features
1. **Visit your deployed URL**
2. **Test Sage AI chat:**
   - Send a message
   - Check if you get real AI responses
   - Verify message counter works (10 → 9 → 8...)

3. **Test AI Insights:**
   - Go to Instructor → Students Management
   - Click "AI Insight" button
   - Check if insights are generated

### 3.3 Check Console for Errors
1. **Open browser console** (F12)
2. **Look for any error messages**
3. **Common issues:**
   - API key not set
   - Rate limits exceeded
   - Network errors

## 🛠️ Troubleshooting

### Issue 1: AI Not Working
**Symptoms:** Getting fallback responses instead of real AI
**Solutions:**
- Check if `VITE_USE_GEMINI=true` is set
- Verify `VITE_GEMINI_API_KEY` is correct
- Redeploy after adding environment variables

### Issue 2: Rate Limits Hit
**Symptoms:** "Upgrade to PRO" messages appearing
**Solutions:**
- This is normal behavior
- Wait 1 hour for limits to reset
- Use the reset button for testing

### Issue 3: Build Errors
**Symptoms:** Deployment fails
**Solutions:**
- Check if all dependencies are installed
- Verify `package.json` is correct
- Check Vercel build logs

### Issue 4: Environment Variables Not Loading
**Symptoms:** Variables not available in the app
**Solutions:**
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check if variables are set for all environments

## 📊 Monitoring Your Deployment

### 3.1 Vercel Analytics
- **Go to your Vercel dashboard**
- **Check "Analytics" tab**
- **Monitor traffic and performance**

### 3.2 API Usage Monitoring
- **Visit [Google AI Studio](https://makersuite.google.com/)**
- **Check API usage and quotas**
- **Monitor rate limits**

### 3.3 Error Monitoring
- **Check Vercel logs** for build errors
- **Monitor browser console** for runtime errors
- **Set up error tracking** if needed

## 🔄 Updating Your Deployment

### 4.1 Automatic Deployments
- **Push to your main branch** = automatic deployment
- **Vercel will rebuild** and deploy automatically
- **Environment variables** are preserved

### 4.2 Manual Deployments
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd marln-university-site
vercel --prod
```

### 4.3 Updating Environment Variables
1. **Go to Vercel dashboard**
2. **Settings → Environment Variables**
3. **Edit existing variables** or add new ones
4. **Redeploy** to apply changes

## 🎯 Production Checklist

- [ ] **Environment variables set correctly**
- [ ] **AI features working** (Sage AI chat, insights)
- [ ] **Rate limiting working** (message counter)
- [ ] **PRO upgrade flow working**
- [ ] **No console errors**
- [ ] **Mobile responsiveness** tested
- [ ] **Performance optimized**

## 🔒 Security Considerations

### 4.1 API Key Security
- **Environment variables** are secure on Vercel
- **Client-side exposure** is normal for frontend apps
- **Rate limiting** prevents abuse

### 4.2 CORS and API Access
- **Gemini API** allows browser requests
- **No CORS configuration** needed
- **Direct API calls** work fine

## 📈 Scaling Considerations

### 5.1 Free Tier Limits
- **Vercel:** 100GB bandwidth/month
- **Gemini API:** 1,500 requests/day
- **Your app:** 10 messages/hour per user

### 5.2 Upgrade Path
- **Vercel Pro:** $20/month for more bandwidth
- **Gemini API:** Pay-as-you-go for more requests
- **Custom domain:** Free with Vercel

## 🎉 Success Indicators

Your deployment is successful when:

✅ **Site loads without errors**
✅ **Sage AI responds with real AI content**
✅ **Message counter works (10 → 9 → 8...)**
✅ **PRO upgrade appears when limit reached**
✅ **AI insights generate in instructor dashboard**
✅ **No console errors**
✅ **Mobile and desktop work properly**

## 🆘 Getting Help

### Vercel Support
- **Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

### Google AI Support
- **Gemini API Docs:** [ai.google.dev/docs](https://ai.google.dev/docs)
- **Google AI Studio:** [makersuite.google.com](https://makersuite.google.com)

### Project Support
- **Check this guide** for common issues
- **Review console logs** for error details
- **Test locally** before deploying

---

## 🚀 Quick Deploy Commands

```bash
# Deploy to Vercel
vercel --prod

# Deploy with environment variables
vercel env add VITE_USE_GEMINI
vercel env add VITE_GEMINI_API_KEY
vercel --prod

# Check deployment status
vercel ls
```

---

**🎯 Your MarLn LMS with AI is now ready for production!**

Happy deploying! 🚀✨ 