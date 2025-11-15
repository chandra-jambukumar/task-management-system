# Deployment Checklist ✅

Use this checklist to ensure a smooth deployment to production.

## 📋 Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Build commands work: `npm run build` in both folders

### Security
- [ ] Strong JWT_SECRET generated (use: `openssl rand -base64 32`)
- [ ] No secrets in code (all in .env files)
- [ ] .env files added to .gitignore
- [ ] CORS configured for production domain
- [ ] SQL injection prevention verified (using parameterized queries ✓)

### Configuration Files
- [ ] `netlify.toml` created ✓
- [ ] `render.yaml` created ✓
- [ ] `frontend/.env.production` created ✓
- [ ] `backend/.env.production` created ✓
- [ ] API URL configuration updated ✓

## 🚀 Backend Deployment (Render)

- [ ] Render account created
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Build settings configured:
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] JWT_SECRET=(generated)
  - [ ] CORS_ORIGIN=(your Netlify URL)
  - [ ] DB_PATH=./data/database.sqlite
- [ ] Disk storage configured for database
- [ ] Deployment successful
- [ ] Backend URL copied
- [ ] Health check passed: `https://your-backend.onrender.com/health`

## 🌐 Frontend Deployment (Netlify)

- [ ] Netlify account created
- [ ] New site created
- [ ] Repository connected or folder uploaded
- [ ] Build settings configured:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- [ ] Environment variable set:
  - [ ] VITE_API_URL=(your Render backend URL + /api)
- [ ] Deployment successful
- [ ] Frontend URL copied
- [ ] Site loads correctly

## 🔄 Post-Deployment

### Update CORS
- [ ] Backend CORS_ORIGIN updated with Netlify URL
- [ ] Backend redeployed
- [ ] CORS working (no console errors)

### Testing
- [ ] Can access frontend URL
- [ ] Can login with demo credentials
- [ ] Can create a board
- [ ] Can add lists
- [ ] Can create cards
- [ ] Can delete items
- [ ] Can register new user
- [ ] Can logout and login again
- [ ] Data persists after refresh

### Performance
- [ ] Frontend loads in < 3 seconds
- [ ] API responses in < 1 second
- [ ] No console errors
- [ ] Mobile responsive

## 📱 Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Netlify/Render)
- [ ] Google OAuth configured (if needed)
- [ ] Monitoring set up
- [ ] Backup strategy for database
- [ ] Error tracking (Sentry, etc.)

## 🔐 Security Checklist

- [ ] HTTPS enabled (automatic)
- [ ] Strong JWT secret
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Rate limiting considered
- [ ] Input validation working

## 📊 Monitoring

- [ ] Check Render logs for errors
- [ ] Check Netlify deploy logs
- [ ] Monitor free tier usage
- [ ] Set up uptime monitoring (optional)

## 🎉 Launch

- [ ] All tests passed
- [ ] Team members can access
- [ ] Login credentials shared
- [ ] Documentation updated
- [ ] Celebrate! 🎊

## 🆘 Rollback Plan

If something goes wrong:
1. Check logs in Render/Netlify dashboard
2. Verify environment variables
3. Test API endpoint directly
4. Redeploy previous version
5. Check CORS settings

## 📝 Post-Launch

- [ ] Monitor for 24 hours
- [ ] Collect user feedback
- [ ] Document any issues
- [ ] Plan next features

---

**Deployment URLs:**
- Frontend: `https://_____________________.netlify.app`
- Backend: `https://_____________________.onrender.com`
- Deployed on: ___________________
- Deployed by: ___________________

**Status:** 
- [ ] In Progress
- [ ] Deployed
- [ ] Verified
- [ ] Live! 🚀
