# DripMate - Deployment Guide

This guide will help you deploy DripMate to **Vercel** (frontend) and **Render** (backend) for free.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **API Keys**:
   - Groq API Key (from [console.groq.com](https://console.groq.com))
   - Gemini API Key (from [aistudio.google.com](https://aistudio.google.com))

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name:** `dripmate-backend`
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave blank
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

   **Plan:**
   - Select **Free** tier

### Step 3: Add Environment Variables

In the Render dashboard, scroll to **"Environment Variables"** and add:

| Key | Value | Note |
|-----|-------|------|
| `SECRET_KEY` | (Generate random string) | Use a password generator (32+ chars) |
| `GEMINI_API_KEY` | Your Gemini API key | From Google AI Studio |
| `GROQ_API_KEY` | Your Groq API key | From Groq Console |
| `DEFAULT_LLM` | `groq` | Or `gemini` if preferred |
| `DRIPMATE_DB_URL` | `sqlite:///./dripmate.db` | SQLite for free tier |
| `ALLOWED_ORIGINS` | (leave for now) | Will update after frontend deploy |

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (~5-10 minutes)
3. Copy your backend URL (e.g., `https://dripmate-backend.onrender.com`)
4. Test it by visiting: `https://your-backend-url.onrender.com/`

**⚠️ Important:** Free tier backends spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository**
3. Select your DripMate repository
4. Configure project:

   **Framework Preset:** Vite
   
   **Root Directory:** `frontend`
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `dist`
   
   **Install Command:** `npm install`

### Step 2: Add Environment Variable

Before deploying, click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL (e.g., `https://dripmate-backend.onrender.com`) |

### Step 3: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (~2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

---

## 🔒 Part 3: Update CORS Settings

Now that your frontend is deployed, update the backend to allow requests from it:

1. Go back to your **Render dashboard**
2. Open your backend service
3. Go to **"Environment"** tab
4. Update/add the `ALLOWED_ORIGINS` variable:

   ```
   https://your-project.vercel.app,https://www.your-custom-domain.com
   ```
   
   (Add all domains separated by commas, no spaces)

5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## ✅ Testing Your Deployment

1. Visit your Vercel frontend URL
2. Try signing up for a new account
3. Test the AI chat functionality
4. Upload an image to test Gemini vision
5. Add items to wardrobe
6. Save favorites

**Common Issues:**

- **"Network Error"** → Check CORS settings and API URL
- **Slow first load** → Normal for free tier (backend waking up)
- **401 Unauthorized** → Check JWT SECRET_KEY is set
- **500 Error** → Check Render logs for missing API keys

---

## 🌐 Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Backend (Render):
1. Render free tier doesn't support custom domains
2. Upgrade to paid plan if needed

---

## 📊 Monitoring & Logs

**Render (Backend):**
- View logs in real-time from dashboard
- Check for errors during startup
- Monitor API requests

**Vercel (Frontend):**
- View deployment logs
- Check build errors
- Monitor function invocations

---

## 🔄 Making Updates

### Backend Updates:
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Manual deploy: Dashboard → Manual Deploy

### Frontend Updates:
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Previous deployments available for rollback

---

## 💰 Free Tier Limits

### Render:
- 750 hours/month (enough for one service)
- Spins down after 15 min inactivity
- 512 MB RAM
- Shared CPU

### Vercel:
- 100 GB bandwidth/month
- 6000 build minutes/month
- No cold starts
- Automatic SSL

---

## 🆘 Troubleshooting

### Backend won't start:
```bash
# Check Render logs for:
- Missing environment variables
- Python package installation errors
- Port binding issues
```

### Frontend can't connect:
```bash
# Verify:
1. VITE_API_URL is set correctly
2. ALLOWED_ORIGINS includes your frontend URL
3. Backend is running (visit the URL)
```

### Database issues:
```bash
# SQLite limitations on Render:
- Data persists but may be lost on service restart
- For production, consider PostgreSQL (Render offers free tier)
```

---

## 🎯 Next Steps

1. **Set up PostgreSQL** (optional) - Render offers free PostgreSQL
2. **Add monitoring** - Use Render metrics or external tools
3. **Optimize images** - Add image compression
4. **Rate limiting** - Protect your API endpoints
5. **Analytics** - Add usage tracking

---

## 📞 Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **FastAPI Docs:** [fastapi.tiangolo.com](https://fastapi.tiangolo.com)

---

**🎉 Congratulations!** Your DripMate app is now live and accessible worldwide!
