import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/database.sqlite');
const dataDir = path.dirname(dbPath);

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: SqlJsDatabase;
let SQL: any;

// Initialize SQL.js
const initDb = async () => {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
};

// Save database to file
const saveDb = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Helper function to run queries
export const query = (sql: string, params: any[] = []) => {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  
  try {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const rows: any[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      saveDb(); // Save after each query
      return { rows };
    } else {
      db.run(sql, params);
      saveDb(); // Save after each query
      return {
        rows: [],
        rowCount: db.getRowsModified(),
        lastInsertRowid: null
      };
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Initialize database on module load
initDb().catch(console.error);

export default { query };
export { initDb, saveDb };
