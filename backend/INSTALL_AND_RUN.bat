@echo off
echo ========================================
echo Task Management System - Backend Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    echo Please make sure Node.js is installed and restart your terminal.
    pause
    exit /b 1
)
echo.

echo Step 2: Setting up database and creating demo user...
call npm run setup
if %errorlevel% neq 0 (
    echo ERROR: Database setup failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Demo Login Credentials:
echo   Email: demo@example.com
echo   Password: demo123
echo.
echo Starting backend server...
echo Server will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
