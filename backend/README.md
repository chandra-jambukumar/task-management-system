# Task Management System - Backend

Backend API for the Task Management System built with Node.js, Express, and TypeScript.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up database and create demo user:
```bash
npm run setup
```

3. Start the server:
```bash
npm run dev
```

That's it! You can now login with:
- **Email:** demo@example.com
- **Password:** demo123

## Manual Setup

If you prefer to set up step by step:

1. Install dependencies: `npm install`
2. Create `.env` file: `cp .env.example .env`
3. Run migrations: `npm run migrate`
4. Create demo user: `npm run seed`
5. Start server: `npm run dev`

## Project Structure

```
src/
├── models/        # TypeScript interfaces and types
├── routes/        # Express route handlers
├── middleware/    # Express middleware (auth, validation, error handling)
├── services/      # Business logic layer
├── repositories/  # Database access layer
└── index.ts       # Application entry point
```

## Available Scripts

- `npm run setup` - Run migrations and create demo user (one command setup!)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations (creates SQLite database)
- `npm run seed` - Create demo user

## Database

This project uses SQLite for the database. The database file will be created at `data/database.sqlite` when you run migrations. No separate database server is required!

## API Endpoints

The API will be available at `http://localhost:3000` (or the port specified in `.env`).

Health check: `GET /health`
