# Task Management System

A modern, full-stack task management application built with React, TypeScript, Node.js, and SQLite. Think Trello, but simpler and self-hosted!

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey)

## ✨ Features

- 📋 **Boards** - Organize projects and workflows
- 📝 **Lists** - Create columns for different stages
- 🎯 **Cards** - Manage individual tasks
- 👥 **User Management** - Register and login
- 🔐 **Authentication** - Secure JWT-based auth
- 🎨 **Priority Levels** - High, medium, low
- 💬 **Comments** - Discuss tasks (backend ready)
- 🔍 **Search & Filter** - Find tasks quickly (backend ready)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation

**Backend:**
```bash
cd backend
npm install
npm run setup    # Creates database + demo user
npm run dev      # Start server on port 3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev      # Start app on port 5173
```

### Demo Login
- **Email:** demo@example.com
- **Password:** demo123

Visit **http://localhost:5173** and start managing tasks!

## 📚 Documentation

- [Getting Started Guide](GETTING_STARTED.md) - Detailed setup instructions
- [Project Status](PROJECT_STATUS.md) - What's implemented
- [SQLite Migration](SQLITE_MIGRATION.md) - Database details
- [OAuth Setup](GOOGLE_OAUTH_SETUP.md) - Optional Google login

## 🏗️ Architecture

### Backend
- **Framework:** Express.js with TypeScript
- **Database:** SQLite (file-based, no server needed!)
- **Auth:** JWT tokens with bcrypt password hashing
- **API:** RESTful endpoints

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** CSS Modules
- **State:** React Context API
- **HTTP:** Axios

### Database Schema
- Users
- Boards
- Board Members (access control)
- Lists
- Cards
- Card Assignments
- Comments

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Database & migrations
│   │   ├── models/       # TypeScript interfaces
│   │   ├── repositories/ # Data access layer
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Auth & error handling
│   └── data/            # SQLite database (auto-created)
│
└── frontend/
    └── src/
        ├── components/   # Reusable UI components
        ├── contexts/     # React contexts
        ├── pages/        # Page components
        ├── services/     # API client
        └── types/        # TypeScript types
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth (optional)

### Boards
- `GET /api/boards` - List all boards
- `POST /api/boards` - Create board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Lists
- `GET /api/boards/:boardId/lists` - Get lists
- `POST /api/boards/:boardId/lists` - Create list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

### Cards
- `GET /api/lists/:listId/cards` - Get cards
- `POST /api/lists/:listId/cards` - Create card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `PUT /api/cards/:id/move` - Move card
- `POST /api/cards/:id/assignments` - Assign user

## 🛠️ Development

### Backend Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run migrate  # Run migrations
npm run seed     # Create demo user
npm run setup    # Migrate + seed
```

### Frontend Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- SQL injection prevention
- CORS configuration
- Input validation
- Authorization checks

## 🎯 Roadmap

Future enhancements:
- [ ] Drag-and-drop for cards
- [ ] Card detail modal
- [ ] Comments UI
- [ ] Real-time updates (WebSockets)
- [ ] File attachments
- [ ] Due dates
- [ ] Labels/tags
- [ ] Activity log
- [ ] Email notifications
- [ ] Dark mode

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

This is a learning project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 💡 Credits

Built as a demonstration of modern full-stack development with:
- React & TypeScript
- Node.js & Express
- SQLite database
- JWT authentication
- RESTful API design

---

**Happy Task Managing! 🎉**
