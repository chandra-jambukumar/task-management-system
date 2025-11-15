# Quick Deploy Guide

The fastest way to deploy your Task Management System to the cloud!

## 🚀 5-Minute Deployment

### Step 1: Deploy Backend (2 minutes)

1. Go to **https://render.com** and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo or upload code
4. Settings:
   - **Name:** task-management-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variable:
   - **JWT_SECRET:** (click "Generate" for random value)
6. Click **"Create Web Service"**
7. **Copy your backend URL** (e.g., `https://task-management-backend.onrender.com`)

### Step 2: Deploy Frontend (3 minutes)

1. Go to **https://netlify.com** and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub or drag & drop your `frontend` folder
4. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Before deploying, add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
6. Click **"Deploy site"**
7. **Copy your frontend URL** (e.g., `https://amazing-app-123.netlify.app`)

### Step 3: Update CORS (1 minute)

1. Go back to **Render dashboard**
2. Open your backend service
3. Go to **Environment** tab
4. Add new variable:
   - **Key:** `CORS_ORIGIN`
   - **Value:** Your Netlify URL (e.g., `https://amazing-app-123.netlify.app`)
5. Service will automatically redeploy

### Step 4: Test! 🎉

1. Visit your Netlify URL
2. Login with: demo@example.com / demo123
3. Start managing tasks online!

## 📱 Share Your App

Your app is now live! Share the Netlify URL with your team:
- `https://your-app-name.netlify.app`

## 🔄 Auto-Deploy Updates

Every time you push to GitHub:
- Netlify automatically rebuilds frontend
- Render automatically rebuilds backend

## 💰 Cost

**FREE!** Both services have generous free tiers:
- Netlify: 100GB bandwidth/month
- Render: 750 hours/month (spins down after 15min idle)

## ⚡ Pro Tips

1. **Custom Domain:** Add your own domain in Netlify settings
2. **Faster Backend:** Upgrade Render to paid plan ($7/mo) for no spin-down
3. **Environment Variables:** Never commit secrets to Git!

## 🆘 Need Help?

Check **DEPLOYMENT_GUIDE.md** for detailed instructions and troubleshooting.

---

**That's it! Your app is live in 5 minutes!** 🚀
