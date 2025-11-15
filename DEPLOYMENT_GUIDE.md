# Deployment Guide - Task Management System

This guide will help you deploy your Task Management System to the cloud so it's accessible from anywhere!

## 🌐 Deployment Architecture

**Frontend:** Netlify (Free tier available)
**Backend:** Render, Railway, or Fly.io (Free tiers available)
**Database:** SQLite file (included with backend)

## 📦 Option 1: Netlify + Render (Recommended)

### Step 1: Deploy Backend to Render

1. **Create a Render account:** https://render.com
2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or upload code)
   - Configure:
     - **Name:** task-management-backend
     - **Root Directory:** `backend`
     - **Environment:** Node
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Plan:** Free

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-url.netlify.app
   DB_PATH=./data/database.sqlite
   ```

4. **After deployment, note your backend URL:**
   - Example: `https://task-management-backend.onrender.com`

### Step 2: Deploy Frontend to Netlify

1. **Create a Netlify account:** https://netlify.com
2. **Deploy via Netlify CLI or Dashboard:**

#### Option A: Netlify Dashboard (Easier)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git repository
4. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Click "Deploy site"

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --prod
```

3. **Configure Environment Variables in Netlify:**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

4. **Update Frontend API Configuration:**

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Update `frontend/src/services/api.ts`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

5. **Redeploy frontend** after updating the API URL

### Step 3: Update Backend CORS

Update your backend `.env` on Render:
```
CORS_ORIGIN=https://your-app-name.netlify.app
```

## 📦 Option 2: Netlify + Railway

### Deploy Backend to Railway

1. **Create Railway account:** https://railway.app
2. **Create new project:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Configure:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=https://your-app.netlify.app
   ```

5. **Get your Railway URL** and follow Netlify steps above

## 📦 Option 3: Full Netlify (Frontend + Backend)

Netlify can host both using Netlify Functions!

### Convert Backend to Netlify Functions

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Create `netlify.toml` in project root:**
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"
  functions = "../backend/netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Restructure backend as serverless functions** (requires code changes)

## 🔧 Pre-Deployment Checklist

### Backend Preparation

- [ ] Update `backend/package.json` to include build script:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "postinstall": "npm run migrate"
}
```

- [ ] Create production environment variables
- [ ] Test build locally: `npm run build`
- [ ] Ensure database migrations run on startup

### Frontend Preparation

- [ ] Update API base URL for production
- [ ] Build frontend: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Update CORS settings

## 🔐 Security for Production

1. **Change JWT Secret:**
   - Generate a strong secret: `openssl rand -base64 32`
   - Update in backend environment variables

2. **Enable HTTPS:**
   - Both Netlify and Render provide free SSL certificates

3. **Set Secure CORS:**
   - Only allow your frontend domain

4. **Environment Variables:**
   - Never commit `.env` files
   - Use platform environment variable settings

## 📊 Database Considerations

### SQLite in Production

**Pros:**
- Simple, no separate database server
- Included with your backend
- Perfect for small teams

**Cons:**
- File-based (can be lost if container restarts)
- Not ideal for high traffic

### Upgrading to PostgreSQL (Optional)

For production with multiple users, consider PostgreSQL:

1. **Add PostgreSQL on Render/Railway** (free tier available)
2. **Update database configuration** to use PostgreSQL
3. **Migrate data** from SQLite

## 🚀 Deployment Commands

### Quick Deploy Script

Create `deploy.sh`:
```bash
#!/bin/bash

# Build backend
cd backend
npm run build
cd ..

# Build frontend
cd frontend
npm run build
cd ..

echo "✓ Build complete! Ready to deploy."
```

## 📱 Post-Deployment

1. **Test your deployed app:**
   - Visit your Netlify URL
   - Try logging in
   - Create a board
   - Add tasks

2. **Monitor logs:**
   - Render: Check deployment logs
   - Netlify: Check function logs

3. **Set up custom domain (optional):**
   - Netlify: Site settings → Domain management
   - Add your custom domain

## 🆓 Free Tier Limits

**Netlify:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**Render:**
- Free tier spins down after 15 min of inactivity
- 750 hours/month
- Automatic SSL

**Railway:**
- $5 free credit/month
- No sleep/spin down
- Automatic SSL

## 🔄 Continuous Deployment

Both Netlify and Render support automatic deployments:

1. **Connect to GitHub**
2. **Every push to main branch** triggers deployment
3. **Automatic builds and deploys**

## 📝 Example Deployment URLs

After deployment, your app will be accessible at:
- **Frontend:** `https://task-manager-app.netlify.app`
- **Backend:** `https://task-management-api.onrender.com`

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables
- Verify build command completed
- Check logs for errors

### Frontend can't connect to backend
- Verify API URL is correct
- Check CORS settings
- Ensure backend is running

### Database not persisting
- Check if volume/disk is configured
- Consider upgrading to PostgreSQL

## 📚 Additional Resources

- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app

---

**Ready to deploy?** Start with Render for backend and Netlify for frontend - both have generous free tiers! 🚀
