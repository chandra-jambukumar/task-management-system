# npm install Error Fixes

Common errors and solutions when running `npm install` in the backend.

## Common Error 1: Python or Build Tools Missing

**Error message:**
```
gyp ERR! find Python
gyp ERR! stack Error: Could not find any Python installation to use
```

**Solution:**
Install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

Or install Visual Studio Build Tools manually from:
https://visualstudio.microsoft.com/downloads/ (scroll down to "Build Tools")

## Common Error 2: better-sqlite3 Compilation Error

**Error message:**
```
error: MSB8036: The Windows SDK version X.X was not found
```

**Solution 1 - Use prebuilt binaries:**
```bash
npm install --build-from-source=false
```

**Solution 2 - Install specific version:**
```bash
npm install better-sqlite3@9.2.2 --build-from-source
```

## Common Error 3: bcrypt Compilation Error

**Error message:**
```
node-gyp rebuild
Error: Can't find Python executable
```

**Solution - Use bcryptjs instead:**

I'll create a fixed version that uses bcryptjs (pure JavaScript, no compilation needed).

## Common Error 4: Permission Denied

**Error message:**
```
EACCES: permission denied
```

**Solution:**
Run Command Prompt or PowerShell as Administrator:
1. Right-click on Command Prompt
2. Select "Run as administrator"
3. Navigate to backend folder
4. Run `npm install`

## Common Error 5: Network/Proxy Issues

**Error message:**
```
ETIMEDOUT or ECONNREFUSED
```

**Solution:**
```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install
```

## Quick Fix: Use Alternative Package.json

If you're still having issues, I can create a version that uses pure JavaScript packages (no native compilation needed).

## What to Share

Please copy and paste the error message you're seeing, including:
- The full error text
- Any "ERR!" lines
- The last few lines before the error

This will help me provide the exact fix you need!
