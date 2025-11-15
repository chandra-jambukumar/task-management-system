# Run Checklist ✅

Quick reference for running the Task Management System.

## Prerequisites
- [ ] Node.js installed (v16+)
- [ ] npm installed (comes with Node.js)
- [ ] Two terminal windows ready

## Backend Setup

Open Terminal 1:

```bash
cd backend
```

- [ ] Run: `npm install`
- [ ] Run: `npm run setup`
- [ ] Verify you see: "✓ Demo user created successfully!"
- [ ] Run: `npm run dev`
- [ ] Verify you see: "Server is running on port 3000"

## Frontend Setup

Open Terminal 2:

```bash
cd frontend
```

- [ ] Run: `npm install`
- [ ] Run: `npm run dev`
- [ ] Verify you see: "Local: http://localhost:5173"

## Access Application

- [ ] Open browser to: http://localhost:5173
- [ ] Click "Login"
- [ ] Enter email: `demo@example.com`
- [ ] Enter password: `demo123`
- [ ] Click "Login"
- [ ] Verify you see: "My Boards" page

## Test Features

- [ ] Click "Create New Board"
- [ ] Enter board name, click "Create Board"
- [ ] Click on the board to open it
- [ ] Click "Add List"
- [ ] Enter list name, click "Add List"
- [ ] Click "Add Card" in the list
- [ ] Enter card title, click "Add Card"
- [ ] Verify card appears in the list

## Success! 🎉

If all checkboxes are checked, your Task Management System is running perfectly!

## Troubleshooting

### Backend won't start
- Check if port 3000 is in use
- Delete `backend/data/` folder and run `npm run setup` again
- Check for error messages in terminal

### Frontend won't start
- Check if port 5173 is in use
- Make sure backend is running first
- Clear browser cache

### Can't login
- Verify backend is running
- Check credentials: demo@example.com / demo123
- Check browser console for errors

### Database errors
```bash
cd backend
rm -rf data/
npm run setup
```

## Quick Commands Reference

### Backend
```bash
npm run setup    # Setup database + demo user
npm run dev      # Start development server
npm run migrate  # Run migrations only
npm run seed     # Create demo user only
npm run build    # Build for production
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Demo Credentials

**Email:** demo@example.com  
**Password:** demo123

## URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

---

**Need help?** Check GETTING_STARTED.md for detailed instructions.
