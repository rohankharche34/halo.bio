import Database from "better-sqlite3";
import path from "path";

// Connect to SQLite DB in the project root
const dbPath = path.join(process.cwd(), "halo.sqlite");
const db = new Database(dbPath, { verbose: console.log });

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    displayName TEXT NOT NULL,
    bioGoals TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
