import { sql, genId } from "./db";

export type SectionRow = {
  id: string;
  type: string;
  title: string | null;
  enabled: number;
  order: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
  featured: number;
  published: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
  order: number;
};

export type SkillRow = {
  id: string;
  name: string;
  category: string;
  order: number;
};

export type SocialLinkRow = {
  id: string;
  platform: string;
  url: string;
  order: number;
};

export type SettingsRow = {
  id: string;
  siteName: string;
  tagline: string;
  heroName: string;
  heroRole: string;
  heroText: string;
  aboutText: string;
  contactEmail: string;
  resumeUrl: string;
  published: number;
  updatedAt: string;
};

// ---------- Sections ----------
export const Sections = {
  async all(): Promise<SectionRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM sections ORDER BY "order" ASC` as SectionRow[];
  },
  async enabled(): Promise<SectionRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM sections WHERE enabled = 1 ORDER BY "order" ASC` as SectionRow[];
  },
  async update(id: string, data: Partial<Pick<SectionRow, "enabled" | "order" | "title" | "content">>) {
    if (!process.env.DATABASE_URL) return null;
    const currentRows = (await sql`SELECT * FROM sections WHERE id = ${id}`) as any[];
    if (currentRows.length === 0) return null;
    const current = currentRows[0] as SectionRow;
    const next = { ...current, ...data };
    await sql`
      UPDATE sections SET enabled = ${next.enabled ? 1 : 0}, "order" = ${next.order}, title = ${next.title}, content = ${next.content}, updatedAt = current_timestamp WHERE id = ${id}
    `;
    const updated = (await sql`SELECT * FROM sections WHERE id = ${id}`) as any[];
    return updated[0] as SectionRow;
  },
  async reorder(order: string[]) {
    if (!process.env.DATABASE_URL) return;
    for (let i = 0; i < order.length; i++) {
      await sql`UPDATE sections SET "order" = ${i + 1} WHERE id = ${order[i]}`;
    }
  },
};

// ---------- Projects ----------
export const Projects = {
  async all(): Promise<ProjectRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM projects ORDER BY "order" ASC, createdAt DESC` as ProjectRow[];
  },
  async published(): Promise<ProjectRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM projects WHERE published = 1 ORDER BY "order" ASC, createdAt DESC` as ProjectRow[];
  },
  async get(id: string): Promise<ProjectRow | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const rows = (await sql`SELECT * FROM projects WHERE id = ${id}`) as any[];
    return rows[0] as ProjectRow | undefined;
  },
  async create(data: Omit<ProjectRow, "id" | "createdAt" | "updatedAt">) {
    if (!process.env.DATABASE_URL) return null;
    const id = genId("proj");
    await sql`
      INSERT INTO projects (id, title, slug, description, shortDesc, image, githubUrl, liveUrl, technologies, featured, published, "order")
      VALUES (${id}, ${data.title}, ${data.slug}, ${data.description}, ${data.shortDesc}, ${data.image}, ${data.githubUrl}, ${data.liveUrl}, ${data.technologies}, ${data.featured}, ${data.published}, ${data.order})
    `;
    return this.get(id);
  },
  async update(id: string, data: Partial<Omit<ProjectRow, "id" | "createdAt" | "updatedAt">>) {
    if (!process.env.DATABASE_URL) return null;
    const current = await this.get(id);
    if (!current) return null;
    const next = { ...current, ...data };
    await sql`
      UPDATE projects SET title=${next.title}, slug=${next.slug}, description=${next.description}, shortDesc=${next.shortDesc},
       image=${next.image}, githubUrl=${next.githubUrl}, liveUrl=${next.liveUrl}, technologies=${next.technologies},
       featured=${next.featured}, published=${next.published}, "order"=${next.order}, updatedAt=current_timestamp
       WHERE id=${id}
    `;
    return this.get(id);
  },
  async remove(id: string) {
    if (!process.env.DATABASE_URL) return;
    await sql`DELETE FROM projects WHERE id = ${id}`;
  },
};

// ---------- Experiences ----------
export const Experiences = {
  async all(): Promise<ExperienceRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM experiences ORDER BY "order" ASC` as ExperienceRow[];
  },
  async get(id: string): Promise<ExperienceRow | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const rows = (await sql`SELECT * FROM experiences WHERE id = ${id}`) as any[];
    return rows[0] as ExperienceRow | undefined;
  },
  async create(data: Omit<ExperienceRow, "id">) {
    if (!process.env.DATABASE_URL) return null;
    const id = genId("exp");
    await sql`
      INSERT INTO experiences (id, company, role, location, startDate, endDate, description, technologies, "order")
      VALUES (${id}, ${data.company}, ${data.role}, ${data.location}, ${data.startDate}, ${data.endDate}, ${data.description}, ${data.technologies}, ${data.order})
    `;
    return this.get(id);
  },
  async update(id: string, data: Partial<Omit<ExperienceRow, "id">>) {
    if (!process.env.DATABASE_URL) return null;
    const current = await this.get(id);
    if (!current) return null;
    const next = { ...current, ...data };
    await sql`
      UPDATE experiences SET company=${next.company}, role=${next.role}, location=${next.location}, startDate=${next.startDate},
       endDate=${next.endDate}, description=${next.description}, technologies=${next.technologies}, "order"=${next.order},
       updatedAt=current_timestamp WHERE id=${id}
    `;
    return this.get(id);
  },
  async remove(id: string) {
    if (!process.env.DATABASE_URL) return;
    await sql`DELETE FROM experiences WHERE id = ${id}`;
  },
};

// ---------- Skills ----------
export const Skills = {
  async all(): Promise<SkillRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM skills ORDER BY category ASC, "order" ASC` as SkillRow[];
  },
  async create(data: Omit<SkillRow, "id">) {
    if (!process.env.DATABASE_URL) return null;
    const id = genId("skill");
    await sql`INSERT INTO skills (id, name, category, "order") VALUES (${id}, ${data.name}, ${data.category}, ${data.order})`;
    return id;
  },
  async remove(id: string) {
    if (!process.env.DATABASE_URL) return;
    await sql`DELETE FROM skills WHERE id = ${id}`;
  },
};

// ---------- Social Links ----------
export const SocialLinks = {
  async all(): Promise<SocialLinkRow[]> {
    if (!process.env.DATABASE_URL) return [];
    return await sql`SELECT * FROM social_links ORDER BY "order" ASC` as SocialLinkRow[];
  },
  async create(data: Omit<SocialLinkRow, "id">) {
    if (!process.env.DATABASE_URL) return null;
    const id = genId("soc");
    await sql`INSERT INTO social_links (id, platform, url, "order") VALUES (${id}, ${data.platform}, ${data.url}, ${data.order})`;
    return id;
  },
  async remove(id: string) {
    if (!process.env.DATABASE_URL) return;
    await sql`DELETE FROM social_links WHERE id = ${id}`;
  },
};

// ---------- Settings ----------
export const SettingsStore = {
  async get(): Promise<SettingsRow> {
    if (!process.env.DATABASE_URL) return {} as SettingsRow;
    const rows = (await sql`SELECT * FROM settings WHERE id = 'singleton'`) as any[];
    return rows[0] as SettingsRow;
  },
  async update(data: Partial<Omit<SettingsRow, "id" | "updatedAt">>) {
    if (!process.env.DATABASE_URL) return null;
    const current = await this.get();
    if (!current) return null;
    const next = { ...current, ...data };
    await sql`
      UPDATE settings SET siteName=${next.siteName}, tagline=${next.tagline}, heroName=${next.heroName}, heroRole=${next.heroRole},
       heroText=${next.heroText}, aboutText=${next.aboutText}, contactEmail=${next.contactEmail}, resumeUrl=${next.resumeUrl},
       published=${next.published}, updatedAt=current_timestamp WHERE id='singleton'
    `;
    return this.get();
  },
};
