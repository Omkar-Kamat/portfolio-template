require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

function genId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Missing DATABASE_URL environment variable.");
    process.exit(1);
  }

  const sql = neon(url);

  console.log("Seeding database on Neon PostgreSQL...");

  await sql`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      type TEXT UNIQUE NOT NULL,
      title TEXT,
      enabled INTEGER NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL DEFAULT 0,
      content TEXT NOT NULL DEFAULT '{}',
      createdAt TEXT NOT NULL DEFAULT current_timestamp,
      updatedAt TEXT NOT NULL DEFAULT current_timestamp
    );
  `;

  await sql`
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
      createdAt TEXT NOT NULL DEFAULT current_timestamp,
      updatedAt TEXT NOT NULL DEFAULT current_timestamp
    );
  `;

  await sql`
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
      createdAt TEXT NOT NULL DEFAULT current_timestamp,
      updatedAt TEXT NOT NULL DEFAULT current_timestamp
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Tools',
      "order" INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT current_timestamp
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      siteName TEXT NOT NULL DEFAULT 'Portfolio',
      tagline TEXT NOT NULL DEFAULT '',
      heroName TEXT NOT NULL DEFAULT 'Your Name',
      heroRole TEXT NOT NULL DEFAULT 'Software Engineer',
      heroText TEXT NOT NULL DEFAULT 'Building things at the intersection of software, AI & product.',
      aboutText TEXT NOT NULL DEFAULT '',
      contactEmail TEXT NOT NULL DEFAULT '',
      resumeUrl TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 1,
      updatedAt TEXT NOT NULL DEFAULT current_timestamp
    );
  `;

  const settingsRow = await sql`SELECT id FROM settings WHERE id = 'singleton'`;
  if (settingsRow.length === 0) {
    await sql`INSERT INTO settings (id) VALUES ('singleton')`;
  }
  await sql`
    UPDATE settings SET siteName=${"Rohit Sharma"}, heroName=${"Rohit Sharma"}, heroRole=${"CSE Student / Builder"},
     heroText=${"I build software that solves actual problems — at the intersection of software, AI & product."},
     aboutText=${"I'm a Computer Science student who likes shipping full products, not just demos. Most of what I build starts as a personal itch — a tool I wished existed — and turns into something other people end up using too. Lately I've been deep in Next.js, TypeScript, and applied AI."},
     contactEmail=${"hello@example.com"}, resumeUrl=${""} WHERE id='singleton'
  `;

  const sectionCountRes = await sql`SELECT COUNT(*) as c FROM sections`;
  const sectionCount = Number(sectionCountRes[0].c);
  if (sectionCount === 0) {
    const defaults = [
      { type: "hero", title: "Hero", order: 1 },
      { type: "about", title: "About", order: 2 },
      { type: "projects", title: "Projects", order: 3 },
      { type: "experience", title: "Experience", order: 4 },
      { type: "skills", title: "Skills", order: 5 },
      { type: "contact", title: "Contact", order: 6 },
    ];
    for (const s of defaults) {
      await sql`INSERT INTO sections (id, type, title, enabled, "order") VALUES (${genId("sec")}, ${s.type}, ${s.title}, 1, ${s.order})`;
    }
  }

  // add dummy skills if empty
  const skillCountRes = await sql`SELECT COUNT(*) as c FROM skills`;
  if (Number(skillCountRes[0].c) === 0) {
    const skills = [
      ["Next.js", "Frontend"],
      ["React", "Frontend"],
      ["Tailwind CSS", "Frontend"],
      ["TypeScript", "Languages"],
      ["JavaScript", "Languages"],
      ["Python", "Languages"],
      ["Node.js", "Backend"],
      ["PostgreSQL", "Databases"],
      ["Docker", "DevOps"],
      ["Git", "Tools"],
    ];
    for (let i = 0; i < skills.length; i++) {
      await sql`INSERT INTO skills (id, name, category, "order") VALUES (${genId("skill")}, ${skills[i][0]}, ${skills[i][1]}, ${i})`;
    }
  }
  
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
