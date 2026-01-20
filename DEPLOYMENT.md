# Deployment Guide

This guide explains how to deploy the IQVIA DocuFlow application from GitHub to free hosting platforms.

## 🚀 Quick Start

### Prerequisites
- GitHub repository: `https://github.com/ashuiqvia/QARA_AI_Automation-Excel-to-BRD-`
- Render.com account (free tier)
- Vercel account (free tier)

## 📦 Deployment Steps

### Step 1: Deploy Backend (Render.com)

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select repository: `QARA_AI_Automation-Excel-to-BRD-`

3. **Configure Backend Service**
   - **Name**: `iqvia-docuflow-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   ```
   ENVIRONMENT=production
   DB_SERVER=INBGL1WLX70974
   DB_DATABASE=IQVIA_DocuFlow
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DRIVER=ODBC Driver 17 for SQL Server
   SECRET_KEY=generate-a-strong-random-key-here
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-backend.onrender.com`

### Step 2: Deploy Frontend (Vercel)

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select repository: `QARA_AI_Automation-Excel-to-BRD-`

3. **Configure Frontend**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/BRD_Builder`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Note your frontend URL: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
3. Render will automatically redeploy

## 🔄 Auto-Deployment

Once set up, deployments happen automatically:

- **On Push to Main**: Both backend and frontend auto-deploy
- **On Pull Request**: Preview deployments are created
- **Manual Deploy**: You can trigger manual deployments from dashboards

## ✅ Verify Deployment

### Backend Health Check
```bash
curl https://your-backend.onrender.com/health
# Should return: {"status":"ok"}
```

### Frontend Check
- Visit: `https://your-app.vercel.app`
- Should load the login page
- Try registering a new user

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check Render logs
- Verify environment variables are set
- Check database connection

**Problem**: Database connection fails
- Verify SQL Server is accessible from internet
- Check firewall rules
- Verify credentials in environment variables

### Frontend Issues

**Problem**: Frontend can't connect to backend
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend
- Check browser console for errors

**Problem**: Build fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Vercel

## 🔐 Security Checklist

Before deploying to production:

- [ ] `SECRET_KEY` is a strong random string
- [ ] Database credentials are secure
- [ ] `.env` files are not committed
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Render/Vercel)
- [ ] Environment variables are set in hosting dashboard

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment history

### Vercel Dashboard
- View analytics
- Check build logs
- Monitor performance

## 🔄 Rollback

If something goes wrong:

1. **Via GitHub**: Revert the commit (see REVERT_GUIDE.md)
2. **Via Render**: Go to Deploys → Select previous deployment → "Rollback"
3. **Via Vercel**: Go to Deployments → Select previous → "Promote to Production"

## 💰 Cost

**Free Tier Limits:**
- **Render**: Free web service (spins down after 15min inactivity)
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Total**: $0/month for small applications

## 📝 Environment Variables Reference

### Backend (Render)
```
ENVIRONMENT=production
DB_SERVER=your_sql_server
DB_DATABASE=IQVIA_DocuFlow
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DRIVER=ODBC Driver 17 for SQL Server
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## 🆘 Support

If you encounter issues:
1. Check deployment logs
2. Review REVERT_GUIDE.md
3. Check GitHub Actions for CI/CD errors
4. Verify environment variables

---

**Happy Deploying! 🚀**

