# Git Setup and GitHub Deployment Guide

## Step 1: Install Git

1. Download Git for Windows from: https://git-scm.com/download/win
2. Run the installer with default settings
3. **Important:** Restart your PowerShell/terminal after installation
4. Verify installation by opening a new terminal and running:
   ```bash
   git --version
   ```

## Step 2: Configure Git (First Time Only)

Open PowerShell and run these commands with your information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Create a GitHub Repository

1. Go to https://github.com and sign in (or create a free account)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name:** `task-management-system` (or your preferred name)
   - **Description:** "Full-stack task management system with React and Node.js"
   - **Visibility:** Select "Public"
   - **DO NOT** check "Initialize this repository with a README" (we already have one)
5. Click "Create repository"
6. **Keep this page open** - you'll need the repository URL

## Step 4: Initialize Git and Push to GitHub

After Git is installed and you've created your GitHub repository, run these commands in PowerShell from your project root directory:

```bash
# Navigate to your project root (if not already there)
cd C:\Users\chand\ChandraProject

# Initialize git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: Full-stack task management system with React, Node.js, and SQLite"

# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/task-management-system.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Verify Your Repository

1. Refresh your GitHub repository page
2. You should see all your project files
3. The README.md will be displayed on the repository homepage

## Important Notes

### What's Excluded from Git (via .gitignore)
- `node_modules/` - Dependencies (too large, can be reinstalled)
- `.env` files - Environment variables with secrets
- `*.db` files - Database files (contain user data)
- `dist/` and `build/` - Build outputs (can be regenerated)

### What's Included
- All source code (frontend and backend)
- Configuration files
- Documentation files
- `.env.example` files (templates without secrets)

## Troubleshooting

### "git is not recognized"
- Make sure you've installed Git
- Restart your terminal after installation
- Try opening a new PowerShell window

### Authentication Issues
If GitHub asks for authentication:
1. Use your GitHub username
2. For password, use a Personal Access Token (not your GitHub password)
3. Create a token at: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select "repo" scope
   - Copy the token and use it as your password

### Alternative: Use GitHub Desktop
If you prefer a GUI:
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Add your local repository
4. Publish to GitHub

## Next Steps After Pushing

Once your code is on GitHub, you can:
1. Deploy the backend to Render (see DEPLOYMENT_GUIDE.md)
2. Deploy the frontend to Netlify (see DEPLOYMENT_GUIDE.md)
3. Share your repository URL with others
4. Continue development and push updates with:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
