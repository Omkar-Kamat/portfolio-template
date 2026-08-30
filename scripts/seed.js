/**
 * Seed script — populates the SQLite database with sample content
 * so the portfolio isn't empty on first run.
 *
 * Usage: npm run seed
 */
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const dbPath = path.join(process.cwd(), "data", "portfolio.db");
const fs = require("fs");
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");

function genId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

// Make sure tables exist (mirrors lib/db.ts)
db.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY, type TEXT UNIQUE NOT NULL, title TEXT,
    enabled INTEGER NOT NULL DEFAULT 1, "order" INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL DEFAULT '{}',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')), updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '', shortDesc TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '', githubUrl TEXT NOT NULL DEFAULT '', liveUrl TEXT NOT NULL DEFAULT '',
    technologies TEXT NOT NULL DEFAULT '', featured INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')), updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS experiences (
    id TEXT PRIMARY KEY, company TEXT NOT NULL, role TEXT NOT NULL, location TEXT NOT NULL DEFAULT '',
    startDate TEXT NOT NULL DEFAULT '', endDate TEXT NOT NULL DEFAULT 'Present',
    description TEXT NOT NULL DEFAULT '', technologies TEXT NOT NULL DEFAULT '', "order" INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')), updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Tools',
    "order" INTEGER NOT NULL DEFAULT 0, createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS social_links (
    id TEXT PRIMARY KEY, platform TEXT NOT NULL, url TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton', siteName TEXT NOT NULL DEFAULT 'Portfolio',
    tagline TEXT NOT NULL DEFAULT '', heroName TEXT NOT NULL DEFAULT 'Your Name',
    heroRole TEXT NOT NULL DEFAULT 'Software Engineer',
    heroText TEXT NOT NULL DEFAULT 'Building things at the intersection of software, AI & product.',
    aboutText TEXT NOT NULL DEFAULT '', contactEmail TEXT NOT NULL DEFAULT '', resumeUrl TEXT NOT NULL DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1, updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Settings
const hasSettings = db.prepare(`SELECT id FROM settings WHERE id = 'singleton'`).get();
if (!hasSettings) db.prepare(`INSERT INTO settings (id) VALUES ('singleton')`).run();
db.prepare(
  `UPDATE settings SET siteName=?, heroName=?, heroRole=?, heroText=?, aboutText=?, contactEmail=?, resumeUrl=? WHERE id='singleton'`
).run(
  "devil.dev",
  "Devil",
  "CSE Student / Builder",
  "I build software that solves actual problems — at the intersection of software, AI & product.",
  "I'm a Computer Science student who likes shipping full products, not just demos. Most of what I build starts as a personal itch — a tool I wished existed — and turns into something other people end up using too. Lately I've been deep in Next.js, TypeScript, and applied AI.",
  "hello@example.com",
  ""
);

// Sections
const sectionCount = db.prepare(`SELECT COUNT(*) as c FROM sections`).get().c;
if (sectionCount === 0) {
  const defaults = [
    { type: "hero", title: "Hero", order: 1 },
    { type: "about", title: "About", order: 2 },
    { type: "projects", title: "Projects", order: 3 },
    { type: "experience", title: "Experience", order: 4 },
    { type: "skills", title: "Skills", order: 5 },
    { type: "contact", title: "Contact", order: 6 },
  ];
  const insert = db.prepare(`INSERT INTO sections (id, type, title, enabled, "order") VALUES (?, ?, ?, 1, ?)`);
  for (const s of defaults) insert.run(genId("sec"), s.type, s.title, s.order);
}

// Projects
const projectCount = db.prepare(`SELECT COUNT(*) as c FROM projects`).get().c;
if (projectCount === 0) {
  const projects = [
    {
      title: "AI Resume Analyzer",
      slug: "ai-resume-analyzer",
      shortDesc: "AI-powered resume analysis and feedback platform.",
      description:
        "Upload a resume and get structured, actionable feedback powered by an LLM — scoring, keyword gaps against a target job description, and rewrite suggestions.",
      technologies: "Next.js, TypeScript, AI, PostgreSQL",
      githubUrl: "",
      liveUrl: "",
      featured: 1,
      published: 1,
      order: 1,
    },
    {
      title: "Portfolio CMS",
      slug: "portfolio-cms",
      shortDesc: "This site — a configurable developer portfolio platform.",
      description:
        "A full-stack, CMS-driven developer portfolio built with Next.js. An authenticated admin studio manages sections, projects, experience, skills, and publishing state, which render dynamically on the public site.",
      technologies: "Next.js, TypeScript, Tailwind, SQLite",
      githubUrl: "",
      liveUrl: "",
      featured: 1,
      published: 1,
      order: 2,
    },
    {
      title: "Realtime Chat Application",
      slug: "realtime-chat-application",
      shortDesc: "A low-latency chat app with rooms and presence.",
      description:
        "A websocket-based chat application supporting rooms, typing indicators, and online presence, built to explore real-time architecture patterns.",
      technologies: "Node.js, WebSockets, Redis",
      githubUrl: "",
      liveUrl: "",
      featured: 0,
      published: 1,
      order: 3,
    },
  ];
  const insert = db.prepare(
    `INSERT INTO projects (id, title, slug, description, shortDesc, image, githubUrl, liveUrl, technologies, featured, published, "order")
     VALUES (@id, @title, @slug, @description, @shortDesc, '', @githubUrl, @liveUrl, @technologies, @featured, @published, @order)`
  );
  for (const p of projects) insert.run({ id: genId("proj"), ...p });
}

// Experience
const expCount = db.prepare(`SELECT COUNT(*) as c FROM experiences`).get().c;
if (expCount === 0) {
  const items = [
    {
      company: "Independent",
      role: "Full-Stack Developer",
      location: "Remote",
      startDate: "Jan 2025",
      endDate: "Present",
      description: "Building and shipping full-stack side projects, focused on developer tools and applied AI.",
      technologies: "Next.js, TypeScript, PostgreSQL",
      order: 1,
    },
    {
      company: "University CS Department",
      role: "Teaching Assistant",
      location: "On campus",
      startDate: "Aug 2024",
      endDate: "Dec 2024",
      description: "Ran lab sections and office hours for an intro data structures & algorithms course.",
      technologies: "Java, DSA",
      order: 2,
    },
  ];
  const insert = db.prepare(
    `INSERT INTO experiences (id, company, role, location, startDate, endDate, description, technologies, "order")
     VALUES (@id, @company, @role, @location, @startDate, @endDate, @description, @technologies, @order)`
  );
  for (const e of items) insert.run({ id: genId("exp"), ...e });
}

// Skills
const skillCount = db.prepare(`SELECT COUNT(*) as c FROM skills`).get().c;
if (skillCount === 0) {
  const skills = [
    ["Next.js", "Frontend"],
    ["React", "Frontend"],
    ["Tailwind CSS", "Frontend"],
    ["TypeScript", "Languages"],
    ["JavaScript", "Languages"],
    ["Python", "Languages"],
    ["Node.js", "Backend"],
    ["PostgreSQL", "Databases"],
    ["SQLite", "Databases"],
    ["Docker", "DevOps"],
    ["Git", "Tools"],
  ];
  const insert = db.prepare(`INSERT INTO skills (id, name, category, "order") VALUES (?, ?, ?, ?)`);
  skills.forEach(([name, category], i) => insert.run(genId("skill"), name, category, i));
}

// Social links
const socialCount = db.prepare(`SELECT COUNT(*) as c FROM social_links`).get().c;
if (socialCount === 0) {
  const links = [
    ["GitHub", "https://github.com/"],
    ["LinkedIn", "https://linkedin.com/in/"],
  ];
  const insert = db.prepare(`INSERT INTO social_links (id, platform, url, "order") VALUES (?, ?, ?, ?)`);
  links.forEach(([platform, url], i) => insert.run(genId("soc"), platform, url, i));
}

console.log("Seed complete.");
db.close();
