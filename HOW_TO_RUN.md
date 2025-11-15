# How to Run the Task Management System

## Super Easy Method (Recommended)

1. **Double-click** `START_APP.bat` in the project root folder
2. Two terminal windows will open (backend and frontend)
3. Wait 1-2 minutes for installation and setup
4. Your browser will show the app at http://localhost:5173
5. Login with:
   - **Email:** demo@example.com
   - **Password:** demo123

That's it! 🎉

## Manual Method

If you prefer to run commands manually:

### Terminal 1 - Backend
```bash
cd C:\Users\chand\ChandraProject\backend
npm install
npm run setup
npm run dev
```

### Terminal 2 - Frontend
```bash
cd C:\Users\chand\ChandraProject\frontend
npm install
npm run dev
```

## What the Scripts Do

**START_APP.bat** - Starts both servers automatically

**backend/INSTALL_AND_RUN.bat:**
1. Installs backend dependencies
2. Creates SQLite database
3. Creates demo user
4. Starts backend server on port 3000

**frontend/INSTALL_AND_RUN.bat:**
1. Installs frontend dependencies
2. Starts frontend dev server on port 5173

## First Time Setup

The first time you run the scripts:
- Backend installation: ~2-3 minutes
- Frontend installation: ~1-2 minutes
- Database setup: ~5 seconds

After the first time, starting the servers takes only ~10 seconds!

## Accessing the Application

Once both servers are running:

1. Open your browser
2. Go to: **http://localhost:5173**
3. Click "Login"
4. Enter credentials:
   - Email: demo@example.com
   - Password: demo123
5. Start creating boards and tasks!

## Stopping the Servers

- Press `Ctrl + C` in each terminal window
- Or just close the terminal windows

## Troubleshooting

### "npm is not recognized"
- Make sure Node.js is installed
- Restart your computer
- Open a fresh terminal window

### Port already in use
- Close any other applications using ports 3000 or 5173
- Or restart your computer

### Installation fails
- Check your internet connection
- Try running as Administrator
- See QUICK_FIX.md for solutions

## What You Can Do

Once logged in:
- ✅ Create boards for projects
- ✅ Add lists (To Do, In Progress, Done)
- ✅ Create cards (tasks)
- ✅ Set priorities (High, Medium, Low)
- ✅ Assign users to cards
- ✅ Delete cards and lists
- ✅ Edit board names
- ✅ Register new users

## Demo Credentials

**Email:** demo@example.com  
**Password:** demo123

You can also register new users from the Register page!

---

**Need help?** Check the other documentation files:
- QUICK_FIX.md - Common error solutions
- NODEJS_INSTALLATION.md - Installing Node.js
- GETTING_STARTED.md - Detailed guide
- README.md - Project overview
