# Getting Started - Task Management System

Welcome! This guide will get you up and running in just a few minutes.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

That's it! No database server needed - we use SQLite.

## Installation

### 1. Backend Setup

```bash
cd backend
npm install
npm run setup
npm run dev
```

The `npm run setup` command will:
- Create the SQLite database
- Set up all tables
- Create a demo user for you

You should see:
```
✓ All tables created successfully
✓ Demo user created successfully!

Login credentials:
  Email: demo@example.com
  Password: demo123
```

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

## Access the Application

1. Open your browser to: **http://localhost:5173**
2. Click "Login"
3. Use the demo credentials:
   - **Email:** demo@example.com
   - **Password:** demo123
4. Start creating boards and managing tasks!

## What You Can Do

Once logged in, you can:

✅ **Create Boards** - Organize projects
✅ **Add Lists** - Create workflow columns (To Do, In Progress, Done)
✅ **Create Cards** - Add tasks to lists
✅ **Move Cards** - Drag between lists (or delete and recreate)
✅ **Set Priorities** - Mark cards as high, medium, or low priority
✅ **Assign Users** - Assign tasks to team members
✅ **Add Comments** - Discuss tasks (backend ready, UI not implemented)

## Creating More Users

You can register new users:
1. Click "Register" on the login page
2. Enter email, password, and name
3. Click "Register"

Or use the demo user to explore the app!

## Project Structure

```
task-management-system/
├── backend/              # Node.js + Express API
│   ├── data/            # SQLite database (auto-created)
│   ├── src/
│   │   ├── config/      # Database & migrations
│   │   ├── models/      # TypeScript types
│   │   ├── repositories/# Database access
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Auth & error handling
│   └── package.json
│
└── frontend/            # React + TypeScript
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── contexts/    # Auth context
    │   ├── pages/       # Page components
    │   ├── services/    # API client
    │   └── types/       # TypeScript types
    └── package.json
```

## Troubleshooting

### Backend won't start

- Make sure you ran `npm install` in the backend directory
- Check if port 3000 is available
- Try deleting `data/database.sqlite` and running `npm run setup` again

### Frontend won't start

- Make sure you ran `npm install` in the frontend directory
- Check if port 5173 is available
- Make sure the backend is running first

### Can't login

- Make sure you're using the correct credentials:
  - Email: demo@example.com
  - Password: demo123
- Check that the backend is running
- Check browser console for errors

### Database errors

Delete the database and recreate it:
```bash
cd backend
rm -rf data/
npm run setup
```

## Next Steps

- Explore the codebase
- Create your own boards and tasks
- Invite team members (register more users)
- Check out the API documentation in the code
- Customize the styling

## Need Help?

- Check the README files in backend/ and frontend/
- Look at the code - it's well-commented
- Review the design document in `.kiro/specs/`

## Features Not Yet Implemented

The following features are designed but not yet implemented:
- Drag-and-drop for cards (you can delete and recreate)
- Card detail modal
- Comments UI (backend is ready)
- Search and filter
- Real-time updates

These can be added as future enhancements!

Enjoy building with the Task Management System! 🚀
