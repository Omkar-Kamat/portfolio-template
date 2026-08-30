import { neon } from "@neondatabase/serverless";

// Create the neon SQL client
// We check if DATABASE_URL is set so the build doesn't crash if it's missing during Vercel build phase
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : (() => []) as unknown as ReturnType<typeof neon>;

export function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

export function mapRow<T>(row: any): T {
  if (!row) return row;
  const keyMap: Record<string, string> = {
    shortdesc: "shortDesc",
    githuburl: "githubUrl",
    liveurl: "liveUrl",
    startdate: "startDate",
    enddate: "endDate",
    sitename: "siteName",
    heroname: "heroName",
    herorole: "heroRole",
    herotext: "heroText",
    abouttext: "aboutText",
    contactemail: "contactEmail",
    resumeurl: "resumeUrl",
    createdat: "createdAt",
    updatedat: "updatedAt"
  };
  const mapped = { ...row };
  for (const [lower, camel] of Object.entries(keyMap)) {
    if (lower in mapped && lower !== camel) {
      mapped[camel] = mapped[lower];
      delete mapped[lower];
    }
  }
  return mapped as T;
}

export async function initDb() {
  if (!process.env.DATABASE_URL) return;

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

  const settingsRow = (await sql`SELECT id FROM settings WHERE id = 'singleton'`) as any[];
  if (settingsRow.length === 0) {
    await sql`INSERT INTO settings (id) VALUES ('singleton')`;
  }

  const sectionCountRes = (await sql`SELECT COUNT(*) as c FROM sections`) as any[];
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
}
