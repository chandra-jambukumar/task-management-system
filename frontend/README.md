# Task Management System - Frontend

Frontend application for the Task Management System built with React, TypeScript, and Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable React components
├── contexts/       # React context providers
├── pages/          # Page components
├── services/       # API service layer
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- User authentication (login/register)
- Board management
- List management within boards
- Card management with drag-and-drop
- User assignments
- Priority levels
- Comments

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api`. The Vite dev server is configured to proxy API requests.
