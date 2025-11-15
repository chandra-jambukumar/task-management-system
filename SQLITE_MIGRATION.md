# SQLite Migration Complete

The Task Management System has been successfully migrated from PostgreSQL to SQLite.

## What Changed

### Database
- **Before**: PostgreSQL with separate database server
- **After**: SQLite with file-based database (`data/database.sqlite`)

### Benefits
- ✅ No separate database server required
- ✅ Zero configuration - just run migrations
- ✅ Perfect for development and small deployments
- ✅ Database file is portable
- ✅ Simpler setup process

### Dependencies Updated

**Removed:**
- `pg` (PostgreSQL client)
- `@types/pg`
- `node-pg-migrate` (PostgreSQL migration tool)

**Added:**
- `better-sqlite3` (SQLite client)
- `@types/better-sqlite3`

### Files Changed

**New Files:**
- `backend/src/config/migrate.ts` - SQLite migration script
- `backend/data/database.sqlite` - SQLite database file (created on first run)

**Updated Files:**
- `backend/src/config/database.ts` - SQLite connection instead of PostgreSQL pool
- `backend/src/repositories/*.ts` - All repositories updated for SQLite syntax
- `backend/package.json` - Updated dependencies and scripts
- `backend/.env.example` - Simplified database configuration
- `backend/.gitignore` - Added data directory

**Removed Files:**
- `backend/migrations/*.js` - Old PostgreSQL migration files
- `backend/.node-pg-migraterc` - PostgreSQL migration config

## SQL Syntax Changes

### Parameter Placeholders
- **PostgreSQL**: `$1, $2, $3`
- **SQLite**: `?, ?, ?`

### UUID Generation
- **PostgreSQL**: `gen_random_uuid()` (built-in)
- **SQLite**: Custom JavaScript function using `randomblob(16)`

### String Matching
- **PostgreSQL**: `ILIKE` (case-insensitive)
- **SQLite**: `LIKE` (case-insensitive by default)

### JSON Aggregation
- **PostgreSQL**: `json_agg()` with complex queries
- **SQLite**: Multiple queries with JavaScript aggregation

## How to Use

### First Time Setup
```bash
cd backend
npm install
npm run migrate  # Creates database and tables
npm run dev
```

### Database Location
The SQLite database is stored at `backend/data/database.sqlite`

### Resetting the Database
To start fresh, simply delete the database file:
```bash
rm backend/data/database.sqlite
npm run migrate
```

### Viewing the Database
You can use any SQLite client to view the database:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (GUI)
- `sqlite3` command-line tool
- VS Code extensions like "SQLite Viewer"

## Schema

The database includes 7 tables:
1. **users** - User accounts with authentication
2. **boards** - Project boards
3. **board_members** - Board access control (join table)
4. **lists** - Columns within boards
5. **cards** - Individual tasks
6. **card_assignments** - User assignments to cards (join table)
7. **comments** - Comments on cards

All tables have proper foreign keys with CASCADE delete behavior.

## Production Considerations

SQLite is great for:
- Development
- Small teams (< 10 concurrent users)
- Single-server deployments
- Embedded applications

For larger deployments, consider:
- PostgreSQL (better concurrency)
- MySQL/MariaDB
- Cloud databases (AWS RDS, Google Cloud SQL)

The repository pattern makes it easy to swap databases later if needed.
