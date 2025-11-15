# Quick Fix for npm install Errors

If you're getting errors with `npm install`, try these solutions in order:

## Solution 1: Clean Install (Try This First)

```bash
cd backend
npm cache clean --force
npm install
```

## Solution 2: Use bcryptjs Instead of bcrypt

If you see errors about "bcrypt" or "node-gyp", replace bcrypt with bcryptjs:

1. Open `backend/package.json`
2. Find this line:
   ```json
   "bcrypt": "^5.1.1",
   ```
3. Replace it with:
   ```json
   "bcryptjs": "^2.4.3",
   ```
4. Also update the devDependencies - find:
   ```json
   "@types/bcrypt": "^5.0.2",
   ```
5. Replace with:
   ```json
   "@types/bcryptjs": "^2.4.6",
   ```
6. Save the file
7. Run `npm install` again

Then update the password utility file:

Open `backend/src/utils/password.ts` and change:
```typescript
import bcrypt from 'bcrypt';
```
To:
```typescript
import bcrypt from 'bcryptjs';
```

## Solution 3: Skip Optional Dependencies

```bash
npm install --no-optional
```

## Solution 4: Use Alternative Package.json

I've created a pre-fixed version. To use it:

```bash
cd backend
copy package.json.alternative package.json
npm install
```

## Solution 5: Install Build Tools (Windows)

If nothing else works, install Windows Build Tools:

```bash
npm install --global windows-build-tools
```

This takes 5-10 minutes but fixes most compilation issues.

## Solution 6: Use Node.js LTS Version

Make sure you're using Node.js LTS (v20.x):

```bash
node --version
```

If you see v18 or older, download the latest LTS from nodejs.org

## Still Having Issues?

Please share the error message and I'll provide a specific fix!

Common error patterns:
- "gyp ERR!" → Need build tools
- "EACCES" → Need administrator privileges  
- "better-sqlite3" → Compilation issue
- "bcrypt" → Use bcryptjs instead
- "ETIMEDOUT" → Network issue

---

**Quick Test:**
After fixing, verify with:
```bash
npm --version
node --version
npm install
```
