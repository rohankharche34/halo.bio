import Database from "better-sqlite3";
import path from "path";
import os from "os";

const dbDir = process.env.DB_PATH || path.join(os.homedir(), ".halo.bio");
if (!process.env.DB_PATH) {
  try {
    require("fs").mkdirSync(dbDir, { recursive: true });
  } catch {}
}

const dbPath = path.join(dbDir, "halo.sqlite");
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === "development" ? console.log : undefined });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    displayName TEXT NOT NULL,
    bioGoals TEXT,
    settings TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sleep_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    sleepTime TEXT,
    wakeTime TEXT,
    quality INTEGER,
    notes TEXT,
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS circadian_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    score INTEGER,
    lightExposure INTEGER,
    activityLevel INTEGER,
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS meal_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    mealName TEXT NOT NULL,
    calories INTEGER,
    glycemicIndex INTEGER,
    mealType TEXT,
    date TEXT NOT NULL,
    time TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

export default db;
