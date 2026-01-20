# 🚀 Step-by-Step Deployment Guide

Follow these exact steps to deploy your application for free.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before starting, make sure you have:
- [ ] GitHub account (you already have this)
- [ ] Your code is pushed to GitHub (✅ Done)
- [ ] Database server accessible from internet (INBGL1WLX70974)
- [ ] Database credentials ready

---

## PART 1: DEPLOY BACKEND TO RENDER.COM

### Step 1: Sign Up for Render

1. **Open your browser** and go to: https://render.com
2. **Click "Get Started for Free"** or "Sign Up"
3. **Choose "Sign up with GitHub"**
   - This connects your GitHub account
   - Click "Authorize Render" when prompted
4. **Complete your profile** (if asked)

### Step 2: Create New Web Service

1. **In Render dashboard**, click the **"New +"** button (top right)
2. **Select "Web Service"** from the dropdown menu
3. **You'll see "Connect a repository"** - Click **"Connect account"** or **"Configure account"**
4. **Authorize Render** to access your GitHub repositories
5. **Select your repository**: `QARA_AI_Automation-Excel-to-BRD-`
   - If you don't see it, click "Configure" and make sure the repo is visible

### Step 3: Configure Backend Service

After selecting your repository, you'll see a configuration form. Fill it out:

#### Basic Settings:
- **Name**: `iqvia-docuflow-backend`
- **Region**: Choose closest to you (e.g., "Oregon (US West)")
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Type exactly "backend"**

#### Runtime Settings:
- **Runtime**: `Python 3` (should auto-detect)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Advanced Settings (click "Advanced" if needed):
- **Health Check Path**: `/health`
- **Plan**: Select **"Free"** (if not already selected)

### Step 4: Set Environment Variables

**⚠️ CRITICAL: Before clicking "Create Web Service", you MUST set environment variables!**

1. **Scroll down** to "Environment Variables" section
2. **Click "Add Environment Variable"** for each one below:

   **Variable 1:**
   - Key: `ENVIRONMENT`
   - Value: `production`
   - Click "Add"

   **Variable 2:**
   - Key: `DB_SERVER`
   - Value: `INBGL1WLX70974`
   - Click "Add"

   **Variable 3:**
   - Key: `DB_DATABASE`
   - Value: `IQVIA_DocuFlow`
   - Click "Add"

   **Variable 4:**
   - Key: `DB_USERNAME`
   - Value: `[Your SQL Server username]` (or leave empty if using Windows Auth)
   - Click "Add"

   **Variable 5:**
   - Key: `DB_PASSWORD`
   - Value: `[Your SQL Server password]` (or leave empty if using Windows Auth)
   - Click "Add"

   **Variable 6:**
   - Key: `DB_DRIVER`
   - Value: `ODBC Driver 17 for SQL Server`
   - Click "Add"

   **Variable 7:**
   - Key: `SECRET_KEY`
   - Value: `[Generate a random string - see below]`
   - Click "Add"
   - **To generate**: Use https://randomkeygen.com/ or run: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

   **Variable 8:**
   - Key: `ALLOWED_ORIGINS`
   - Value: `[Leave empty for now - we'll update after frontend deployment]`
   - Click "Add"

### Step 5: Deploy Backend

1. **Review all settings** one more time
2. **Click "Create Web Service"** button (bottom of page)
3. **Wait for deployment** (5-10 minutes)
   - You'll see build logs in real-time
   - Watch for any errors
4. **When deployment completes**, you'll see:
   - ✅ "Your service is live"
   - **Your backend URL**: `https://iqvia-docuflow-backend.onrender.com` (or similar)
   - **⚠️ IMPORTANT: Copy this URL!** You'll need it for frontend

### Step 6: Test Backend

1. **Click on your service name** in Render dashboard
2. **Go to "Logs" tab** - Check for any errors
3. **Test health endpoint**:
   - Open new browser tab
   - Go to: `https://your-backend-url.onrender.com/health`
   - Should see: `{"status":"ok"}`
4. **If you see errors**, check:
   - Environment variables are set correctly
   - Database is accessible from internet
   - Logs tab for specific error messages

---

## PART 2: DEPLOY FRONTEND TO VERCEL

### Step 7: Sign Up for Vercel

1. **Open new browser tab** and go to: https://vercel.com
2. **Click "Sign Up"**
3. **Choose "Continue with GitHub"**
   - Authorize Vercel to access your GitHub account
4. **Complete onboarding** (if any)

### Step 8: Import Project

1. **In Vercel dashboard**, click **"Add New..."** button
2. **Select "Project"**
3. **You'll see "Import Git Repository"**
4. **Search for**: `QARA_AI_Automation-Excel-to-BRD-`
5. **Click "Import"** next to your repository

### Step 9: Configure Frontend

After importing, you'll see configuration options:

#### Project Settings:
- **Project Name**: `iqvia-docuflow` (or leave default)
- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `frontend/BRD_Builder` ⚠️ **IMPORTANT: Click "Edit" and type this exactly**

#### Build Settings:
- **Build Command**: `npm run build` (should be pre-filled)
- **Output Directory**: `dist` (should be pre-filled)
- **Install Command**: `npm install` (should be pre-filled)

### Step 10: Set Frontend Environment Variables

**⚠️ BEFORE CLICKING "DEPLOY", set environment variable!**

1. **Click "Environment Variables"** section
2. **Click "Add"** button
3. **Add this variable:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (use the URL from Step 5)
   - **Environment**: Select all (Production, Preview, Development)
   - **Click "Save"**

### Step 11: Deploy Frontend

1. **Review settings** one more time
2. **Click "Deploy"** button
3. **Wait for deployment** (2-3 minutes)
   - Watch build logs
   - Check for any errors
4. **When complete**, you'll see:
   - ✅ "Congratulations! Your project has been deployed"
   - **Your frontend URL**: `https://iqvia-docuflow.vercel.app` (or similar)
   - **⚠️ IMPORTANT: Copy this URL!**

### Step 12: Test Frontend

1. **Click on your deployment** in Vercel dashboard
2. **Click "Visit"** or open the URL in browser
3. **You should see**: Login page
4. **Try registering** a new user
5. **If you see errors**, check:
   - Browser console (F12) for errors
   - `VITE_API_URL` environment variable is correct
   - Backend is running (check Render dashboard)

---

## PART 3: CONNECT FRONTEND TO BACKEND

### Step 13: Update Backend CORS

1. **Go back to Render dashboard**
2. **Click on your backend service** (`iqvia-docuflow-backend`)
3. **Go to "Environment" tab**
4. **Find `ALLOWED_ORIGINS` variable**
5. **Click "Edit"** (pencil icon)
6. **Update value** to: `https://your-frontend-url.vercel.app` (use URL from Step 11)
7. **Click "Save Changes"**
8. **Render will automatically redeploy** (wait 2-3 minutes)

### Step 14: Final Testing

1. **Go to your frontend URL**: `https://your-app.vercel.app`
2. **Test Registration:**
   - Click "Don't have an account? Register"
   - Fill in: Username, Email, Password
   - Click "Register"
   - Should redirect to main page
3. **Test Login:**
   - Logout (if logged in)
   - Login with your credentials
   - Should work
4. **Test Excel to BRD:**
   - Upload an Excel file
   - Generate BRD
   - Should download the document

---

## ✅ DEPLOYMENT COMPLETE!

### Your URLs:
- **Backend**: `https://your-backend.onrender.com`
- **Frontend**: `https://your-app.vercel.app`
- **API Docs**: `https://your-backend.onrender.com/docs`

### What Happens Next:

1. **Auto-Deployment**: Every time you push to `main` branch:
   - Render automatically redeploys backend
   - Vercel automatically redeploys frontend

2. **Monitoring**:
   - Check Render dashboard for backend logs
   - Check Vercel dashboard for frontend analytics

3. **Updates**:
   - Make changes locally
   - Push to GitHub
   - Auto-deploys in 5-10 minutes

---

## 🆘 TROUBLESHOOTING

### Backend Won't Start

**Check Render Logs:**
1. Go to Render dashboard → Your service → "Logs" tab
2. Look for error messages
3. Common issues:
   - Database connection failed → Check DB credentials
   - Missing environment variable → Add it
   - Port error → Should use `$PORT` variable

### Frontend Can't Connect to Backend

**Check:**
1. Browser console (F12) → Look for CORS errors
2. `VITE_API_URL` is set correctly in Vercel
3. `ALLOWED_ORIGINS` includes your frontend URL
4. Backend is running (check Render dashboard)

### Database Connection Fails

**Check:**
1. SQL Server is accessible from internet
2. Firewall allows connections from Render IPs
3. Credentials are correct in environment variables
4. Database name is correct: `IQVIA_DocuFlow`

### Build Fails

**Backend Build:**
- Check Render logs
- Verify `requirements.txt` exists
- Check Python version compatibility

**Frontend Build:**
- Check Vercel build logs
- Verify Node.js version (should be 18+)
- Check for syntax errors in code

---

## 📝 QUICK REFERENCE

### Environment Variables Summary

**Backend (Render):**
```
ENVIRONMENT=production
DB_SERVER=INBGL1WLX70974
DB_DATABASE=IQVIA_DocuFlow
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DRIVER=ODBC Driver 17 for SQL Server
SECRET_KEY=your-generated-secret-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend.onrender.com
```

### Important URLs to Save

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Your Backend: `https://your-backend.onrender.com`
- Your Frontend: `https://your-app.vercel.app`

---

## 🎉 CONGRATULATIONS!

Your application is now live and accessible from anywhere in the world!

**Next Steps:**
- Share your frontend URL with users
- Monitor usage in dashboards
- Make updates by pushing to GitHub
- Use REVERT_GUIDE.md if you need to rollback

---

**Need Help?** Check:
- `DEPLOYMENT.md` for detailed info
- `REVERT_GUIDE.md` for rollback instructions
- Render/Vercel documentation
- GitHub Actions for CI/CD status

