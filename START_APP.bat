@echo off
echo ========================================
echo Task Management System
echo ========================================
echo.
echo This will start both backend and frontend servers.
echo.
echo Make sure you have Node.js installed!
echo.
echo Press any key to continue...
pause >nul

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && INSTALL_AND_RUN.bat"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && INSTALL_AND_RUN.bat"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Login with:
echo   Email: demo@example.com
echo   Password: demo123
echo.
echo Two terminal windows will open.
echo Close this window or press any key to exit.
pause >nul
