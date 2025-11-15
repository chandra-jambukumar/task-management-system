# Node.js Installation Guide for Windows

This guide will help you install Node.js and npm on your Windows system.

## Step 1: Download Node.js

1. Go to the official Node.js website: **https://nodejs.org/**
2. You'll see two download options:
   - **LTS (Long Term Support)** - Recommended for most users
   - **Current** - Latest features

   **Choose LTS** (currently v20.x.x)

3. Click the "Windows Installer (.msi)" button
4. The download should start automatically (about 30MB)

## Step 2: Install Node.js

1. **Run the installer** (node-v20.x.x-x64.msi)
2. Click **"Next"** on the welcome screen
3. **Accept the license agreement** and click "Next"
4. **Choose installation location** (default is fine: `C:\Program Files\nodejs\`)
5. **Custom Setup** - Keep all default options:
   - ✅ Node.js runtime
   - ✅ npm package manager
   - ✅ Online documentation shortcuts
   - ✅ Add to PATH
6. **Tools for Native Modules** - Check this box (installs Python and Visual Studio Build Tools)
7. Click **"Next"** then **"Install"**
8. Wait for installation to complete (2-3 minutes)
9. Click **"Finish"**

## Step 3: Verify Installation

1. **Open a NEW Command Prompt or PowerShell** (important - must be new!)
   - Press `Win + R`
   - Type `cmd` or `powershell`
   - Press Enter

2. **Check Node.js version:**
   ```bash
   node --version
   ```
   You should see: `v20.x.x` or similar

3. **Check npm version:**
   ```bash
   npm --version
   ```
   You should see: `10.x.x` or similar

If both commands work, **you're ready to go!** 🎉

## Step 4: Run the Task Management System

Now you can run the application:

### Backend Setup
```bash
cd C:\Users\chand\ChandraProject\backend
npm install
npm run setup
npm run dev
```

### Frontend Setup (New Terminal)
```bash
cd C:\Users\chand\ChandraProject\frontend
npm install
npm run dev
```

## Troubleshooting

### "node is not recognized"

If you get this error after installation:

1. **Restart your computer** (simplest solution)
2. Or manually add to PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Add: `C:\Program Files\nodejs\`
   - Click OK on all dialogs
   - Restart terminal

### Installation Fails

- Make sure you have administrator privileges
- Disable antivirus temporarily
- Download the installer again (might be corrupted)
- Try the .zip version instead of .msi

### npm install is slow

- This is normal! First install downloads ~50MB of dependencies
- Can take 2-5 minutes depending on internet speed
- Subsequent installs are faster (npm caches packages)

### Port Already in Use

If you see "Port 3000 is already in use":
```bash
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

## Alternative: Using Node Version Manager (nvm)

For advanced users who want to manage multiple Node.js versions:

1. Download nvm-windows: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-setup.exe
3. Open new terminal and run:
   ```bash
   nvm install 20
   nvm use 20
   ```

## What Gets Installed

- **Node.js** - JavaScript runtime (~50MB)
- **npm** - Package manager (included with Node.js)
- **npx** - Package runner (included with npm)
- **Build tools** - For native modules (optional, ~3GB)

## After Installation

You can now:
- ✅ Run JavaScript on your computer
- ✅ Install packages with npm
- ✅ Run the Task Management System
- ✅ Develop Node.js applications
- ✅ Use modern JavaScript tools

## Quick Test

Create a test file to verify everything works:

1. Create `test.js`:
   ```javascript
   console.log('Node.js is working!');
   console.log('Version:', process.version);
   ```

2. Run it:
   ```bash
   node test.js
   ```

3. You should see:
   ```
   Node.js is working!
   Version: v20.x.x
   ```

## Next Steps

Once Node.js is installed:

1. Open a **NEW** terminal (important!)
2. Navigate to the backend folder
3. Run the setup commands
4. Start building! 🚀

## Need More Help?

- Official Node.js docs: https://nodejs.org/docs/
- npm documentation: https://docs.npmjs.com/
- Node.js tutorial: https://nodejs.dev/learn

---

**Ready to install?** Download from: **https://nodejs.org/**

After installation, come back and run the Task Management System! 🎉
