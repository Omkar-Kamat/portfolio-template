import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/*
 * On platforms with read-only filesystems (Vercel, AWS Lambda, etc.) the
 * bundled data/portfolio.db cannot be opened in WAL mode because the runtime
 * directory is read-only.  We copy the seed database to /tmp at cold-start so
 * SQLite can write its WAL and SHM files.  In development (or any writable
 * environment) we just open the file in-place.
 */

function resolveDbPath(): string {
  const srcDb = path.join(process.cwd(), "data", "portfolio.db");

  // In production on serverless (read-only fs), copy to /tmp
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    const tmpDb = "/tmp/portfolio.db";
    if (!fs.existsSync(tmpDb) && fs.existsSync(srcDb)) {
      fs.copyFileSync(srcDb, tmpDb);
    }
    return tmpDb;
  }

  // Development / writable environments — use in-place
  const dataDir = path.dirname(srcDb);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return srcDb;
}

const dbPath = resolveDbPath();

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function createDb() {
  const database = new Database(dbPath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  return database;
}

export const db = global.__db ?? createDb();
if (process.env.NODE_ENV !== "production") global.__db = db;

function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}
export { genId };

/**
 * Convert a null-prototype object (as returned by some SQLite drivers) into a
 * plain `{}` object so it can be serialized across the Server → Client
 * Component boundary in Next.js.
 */
export function plain<T>(row: T): T {
  if (row == null) return row;
  return JSON.parse(JSON.stringify(row));
}

/** Convert an array of rows to plain objects. */
export function plainAll<T>(rows: T[]): T[] {
  return rows.map(plain);
}

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      type TEXT UNIQUE NOT NULL,
      title TEXT,
      enabled INTEGER NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL DEFAULT 0,
      content TEXT NOT NULL DEFAULT '{}',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      shortDesc TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      githubUrl TEXT NOT NULL DEFAULT '',
      liveUrl TEXT NOT NULL DEFAULT '',
      technologies TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      startDate TEXT NOT NULL DEFAULT '',
      endDate TEXT NOT NULL DEFAULT 'Present',
      description TEXT NOT NULL DEFAULT '',
      technologies TEXT NOT NULL DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Tools',
      "order" INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT 'singleton',
      siteName TEXT NOT NULL DEFAULT 'Portfolio',
      tagline TEXT NOT NULL DEFAULT '',
      heroName TEXT NOT NULL DEFAULT 'Your Name',
      heroRole TEXT NOT NULL DEFAULT 'Software Engineer',
      heroText TEXT NOT NULL DEFAULT 'Building things at the intersection of software, AI & product.',
      aboutText TEXT NOT NULL DEFAULT '',
      contactEmail TEXT NOT NULL DEFAULT '',
      resumeUrl TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 1,
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const settingsRow = db.prepare(`SELECT id FROM settings WHERE id = 'singleton'`).get();
  if (!settingsRow) {
    db.prepare(`INSERT INTO settings (id) VALUES ('singleton')`).run();
  }

  const sectionCount = db.prepare(`SELECT COUNT(*) as c FROM sections`).get() as { c: number };
  if (sectionCount.c === 0) {
    const defaults = [
      { type: "hero", title: "Hero", order: 1 },
      { type: "about", title: "About", order: 2 },
      { type: "projects", title: "Projects", order: 3 },
      { type: "experience", title: "Experience", order: 4 },
      { type: "skills", title: "Skills", order: 5 },
      { type: "contact", title: "Contact", order: 6 },
    ];
    const insert = db.prepare(
      `INSERT INTO sections (id, type, title, enabled, "order") VALUES (?, ?, ?, 1, ?)`
    );
    for (const s of defaults) {
      insert.run(genId("sec"), s.type, s.title, s.order);
    }
  }
}

initDb();
