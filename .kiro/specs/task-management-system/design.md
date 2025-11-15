# Design Document

## Overview

The Task Management System is a web-based application that provides teams with a visual, board-based interface for organizing and tracking work. The system follows a three-tier architecture with a React-based frontend, RESTful API backend, and relational database for persistence. The design emphasizes real-time updates, intuitive drag-and-drop interactions, and scalable data models to support multiple teams and projects.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend Layer                       │
│  (React + TypeScript + Drag-and-Drop Library)           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST API
┌─────────────────────▼───────────────────────────────────┐
│                    Backend Layer                         │
│        (Node.js + Express + TypeScript)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Auth       │  │   Business   │  │   Data       │ │
│  │   Service    │  │   Logic      │  │   Access     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
┌─────────────────────▼───────────────────────────────────┐
│                  Database Layer                          │
│              (PostgreSQL)                                │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ with TypeScript for type-safe component development
- React DnD or react-beautiful-dnd for drag-and-drop functionality
- React Router for client-side routing
- Axios for API communication
- CSS Modules or Styled Components for styling

**Backend:**
- Node.js with Express framework
- TypeScript for type safety
- JWT for authentication
- Express middleware for validation and error handling

**Database:**
- PostgreSQL for relational data storage
- Migrations managed through a migration tool (e.g., node-pg-migrate or Knex)

## Components and Interfaces

### Frontend Components

#### Core Components

1. **BoardList Component**
   - Displays all boards accessible to the user
   - Handles board creation and deletion
   - Props: `boards: Board[]`, `onCreateBoard: () => void`, `onDeleteBoard: (id: string) => void`

2. **Board Component**
   - Renders a single board with all its lists
   - Manages drag-and-drop context for cards
   - Props: `board: Board`, `lists: List[]`, `onUpdateBoard: (board: Board) => void`

3. **List Component**
   - Displays a vertical column of cards
   - Handles card creation within the list
   - Props: `list: List`, `cards: Card[]`, `onCreateCard: () => void`, `onMoveCard: (cardId: string, targetListId: string, position: number) => void`

4. **Card Component**
   - Renders individual task card with title, priority indicator, and assigned users
   - Draggable element for repositioning
   - Props: `card: Card`, `onClick: () => void`

5. **CardDetail Modal**
   - Full card view with editable fields
   - Displays and manages comments
   - Handles user assignments and priority changes
   - Props: `card: Card`, `onUpdate: (card: Card) => void`, `onClose: () => void`

6. **SearchFilter Component**
   - Provides search input and filter controls
   - Props: `onSearch: (query: string) => void`, `onFilterChange: (filters: FilterCriteria) => void`

#### Supporting Components

- **UserAvatar**: Displays user profile picture or initials
- **PriorityBadge**: Visual indicator for card priority
- **CommentList**: Displays comments with author and timestamp
- **CommentForm**: Input form for adding new comments

### Backend API Endpoints

#### Board Endpoints

```
GET    /api/boards                    - List all boards for authenticated user
POST   /api/boards                    - Create a new board
GET    /api/boards/:id                - Get board details
PUT    /api/boards/:id                - Update board
DELETE /api/boards/:id                - Delete board
POST   /api/boards/:id/members        - Add user to board
DELETE /api/boards/:id/members/:userId - Remove user from board
```

#### List Endpoints

```
GET    /api/boards/:boardId/lists     - Get all lists for a board
POST   /api/boards/:boardId/lists     - Create a new list
PUT    /api/lists/:id                 - Update list (name, position)
DELETE /api/lists/:id                 - Delete list
```

#### Card Endpoints

```
GET    /api/lists/:listId/cards       - Get all cards in a list
POST   /api/lists/:listId/cards       - Create a new card
GET    /api/cards/:id                 - Get card details
PUT    /api/cards/:id                 - Update card
DELETE /api/cards/:id                 - Delete card
PUT    /api/cards/:id/move            - Move card to different list/position
POST   /api/cards/:id/assignments     - Assign user to card
DELETE /api/cards/:id/assignments/:userId - Remove user assignment
```

#### Comment Endpoints

```
GET    /api/cards/:cardId/comments    - Get all comments for a card
POST   /api/cards/:cardId/comments    - Add a comment
DELETE /api/comments/:id              - Delete a comment
```

#### Search Endpoints

```
GET    /api/search/cards?q=:query&assignee=:userId&priority=:level - Search and filter cards
```

#### Authentication Endpoints

```
POST   /api/auth/register             - Register new user
POST   /api/auth/login                - Login user
POST   /api/auth/logout               - Logout user
GET    /api/auth/me                   - Get current user info
```

## Data Models

### Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Boards Table

```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Board Members Table (Join Table)

```sql
CREATE TABLE board_members (
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (board_id, user_id)
);
```

#### Lists Table

```sql
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Cards Table

```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Card Assignments Table (Join Table)

```sql
CREATE TABLE card_assignments (
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (card_id, user_id)
);
```

#### Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Board {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  position: number;
  assignedUsers?: User[];
  commentCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  cardId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FilterCriteria {
  searchQuery?: string;
  assigneeId?: string;
  priority?: 'high' | 'medium' | 'low';
}
```

## Error Handling

### Frontend Error Handling

1. **API Error Interceptor**: Axios interceptor to catch and handle HTTP errors globally
2. **Error Boundary**: React error boundary component to catch rendering errors
3. **User Feedback**: Toast notifications or alert components for user-facing errors
4. **Validation**: Client-side form validation before API calls

### Backend Error Handling

1. **Global Error Middleware**: Express middleware to catch and format errors consistently

```typescript
interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: any;
}
```

2. **Error Types**:
   - `400 Bad Request`: Invalid input data
   - `401 Unauthorized`: Missing or invalid authentication
   - `403 Forbidden`: User lacks permission for resource
   - `404 Not Found`: Resource does not exist
   - `409 Conflict`: Operation conflicts with current state
   - `500 Internal Server Error`: Unexpected server errors

3. **Database Error Handling**: Catch and translate database errors into user-friendly messages

### Validation Strategy

- **Input Validation**: Use validation library (e.g., Joi or Zod) for request body validation
- **Authorization Checks**: Middleware to verify user has access to requested resources
- **Data Integrity**: Database constraints and application-level checks

## Testing Strategy

### Frontend Testing

1. **Unit Tests**: Test individual components and utility functions using Jest and React Testing Library
   - Component rendering with various props
   - User interaction handlers
   - State management logic

2. **Integration Tests**: Test component interactions and API integration
   - Drag-and-drop functionality
   - Form submissions and API calls
   - Navigation flows

3. **E2E Tests**: Test complete user workflows using Cypress or Playwright
   - Board creation and management
   - Card movement between lists
   - User assignment and commenting

### Backend Testing

1. **Unit Tests**: Test individual functions and services using Jest
   - Business logic functions
   - Data transformation utilities
   - Validation functions

2. **Integration Tests**: Test API endpoints with test database
   - CRUD operations for all resources
   - Authentication and authorization
   - Error handling scenarios

3. **Database Tests**: Test database queries and migrations
   - Schema validation
   - Migration rollback capability
   - Query performance

### Test Data Management

- Use factories or fixtures for generating test data
- Seed test database with consistent data for integration tests
- Clean up test data after each test run

## Security Considerations

1. **Authentication**: JWT-based authentication with secure token storage
2. **Password Security**: Bcrypt for password hashing with appropriate salt rounds
3. **Authorization**: Verify user permissions before allowing operations on boards/cards
4. **Input Sanitization**: Sanitize user input to prevent XSS attacks
5. **SQL Injection Prevention**: Use parameterized queries
6. **CORS Configuration**: Restrict API access to authorized origins
7. **Rate Limiting**: Implement rate limiting to prevent abuse
8. **HTTPS**: Enforce HTTPS in production

## Performance Considerations

1. **Database Indexing**: Add indexes on frequently queried columns (board_id, list_id, user_id)
2. **Pagination**: Implement pagination for large lists of boards or cards
3. **Caching**: Cache frequently accessed data (user info, board lists)
4. **Lazy Loading**: Load card details only when needed
5. **Optimistic Updates**: Update UI immediately while API call is in progress
6. **Debouncing**: Debounce search input to reduce API calls

## Deployment Architecture

1. **Frontend**: Static hosting (Vercel, Netlify, or S3 + CloudFront)
2. **Backend**: Container-based deployment (Docker + Kubernetes or AWS ECS)
3. **Database**: Managed PostgreSQL service (AWS RDS, Google Cloud SQL, or similar)
4. **Environment Configuration**: Environment variables for configuration management
5. **CI/CD**: Automated testing and deployment pipeline
